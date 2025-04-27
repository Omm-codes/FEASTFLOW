import { pool } from '../config/db.js';
import Order from '../models/Order.js'; // Add this import at the top if not present

export const createOrder = async (req, res) => {
  let connection;
  try {
    // Get connection from pool
    connection = await pool.getConnection();
    
    // Start transaction
    await connection.beginTransaction();
    
    // Extract order data with default values for undefined fields
    const { 
      customer = {}, 
      items = [], 
      total_amount = 0, 
      payment_method = 'cash', 
      status = 'pending' 
    } = req.body;

    // Log received order details with more info
    console.log('Received order:', JSON.stringify({
      customer,
      itemsCount: items.length,
      itemsDetail: items,
      total_amount,
      payment_method,
      user: req.user
    }, null, 2));
    
    // Handle guest checkout or authenticated user
    const userId = req.user?.userId || 1; // Default to user ID 1 for guest orders
    
    // Improved validation with better error responses
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'Failed to create order',
        details: 'Order must contain at least one item'
      });
    }
    
    // Parse total amount and check if valid - be more lenient here
    const parsedAmount = parseFloat(total_amount);
    if (isNaN(parsedAmount)) {
      // If total_amount isn't valid, calculate it from items
      const calculatedAmount = items.reduce((total, item) => {
        return total + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1);
      }, 0);
      
      if (calculatedAmount <= 0) {
        return res.status(400).json({
          error: 'Failed to create order',
          details: `Invalid order amount: ${total_amount} and couldn't calculate from items`
        });
      }
      
      // Use the calculated amount
      total_amount = calculatedAmount;
      console.log(`Using calculated total amount: ${calculatedAmount}`);
    }
    
    try {
      console.log('About to execute SQL query with values:', {
        userId,
        total_amount: parsedAmount || 0,
        payment_method,
        status,
        address: customer?.address || 'Not provided',
        phone: customer?.phone || 'Not provided',
        name: customer?.name || 'Guest',
        email: customer?.email || 'guest@example.com'
      });
      
      // Insert order into orders table with non-null values for required fields
      const [orderResult] = await connection.execute(
        'INSERT INTO orders (user_id, total_amount, payment_method, status, delivery_address, contact_number, customer_name, customer_email, customer_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          userId, 
          parsedAmount || 0,
          payment_method || 'cash',
          status || 'pending',
          customer?.address || 'Not provided', // Non-null default
          customer?.phone || 'Not provided',   // Non-null default
          customer?.name || 'Guest',           // Optional field in DB
          customer?.email || 'guest@example.com', // Optional field in DB
          customer?.phone || 'Not provided'    // Optional field in DB
        ]
      );
      
      const orderId = orderResult.insertId;
      console.log(`Created order with ID: ${orderId}`);
      
      // Insert order items
      for (const item of items) {
        // Use item.id instead of item.menu_item_id (which is undefined)
        const menuItemId = item.id || item.menu_item_id; 
        
        // Verify we have a valid ID before inserting
        if (!menuItemId) {
          console.error('Invalid item without ID:', item);
          throw new Error('All items must have an ID');
        }
        
        const quantity = item.quantity || 1;
        const price = parseFloat(item.price) || 0;
        
        console.log('Inserting item:', {
          orderId,
          menu_item_id: menuItemId,
          quantity,
          price
        });
        
        await connection.execute(
          'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, menuItemId, quantity, price]
        );
      }
      
      // Commit transaction
      await connection.commit();
      console.log('Transaction committed successfully');
      
      res.status(201).json({
        id: orderId,
        message: 'Order created successfully'
      });
    } catch (sqlError) {
      console.error('SQL Error Details:', {
        code: sqlError.code,
        errno: sqlError.errno,
        sqlState: sqlError.sqlState,
        message: sqlError.message,
        sql: sqlError.sql // This will show the actual SQL query that failed
      });
      throw sqlError;
    }
  } catch (error) {
    // Rollback transaction on error
    if (connection) {
      await connection.rollback();
      console.log('Transaction rolled back due to error');
    }
    
    console.error('Error creating order:', error);
    res.status(500).json({ 
      error: 'Failed to create order',
      details: error.message
    });
  } finally {
    if (connection) {
      connection.release();
      console.log('Database connection released');
    }
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in token' });
    }
    
    console.log(`Fetching orders for user ID: ${userId}`);
    
    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    
    console.log(`Found ${orders.length} orders`);
    
    // Ensure we're sending valid JSON
    res.setHeader('Content-Type', 'application/json');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const updateOrderPayment = async (req, res) => {
  let connection;
  try {
    const { orderId } = req.params;
    const { paymentStatus, paymentReference } = req.body;
    
    connection = await pool.getConnection();
    
    // Update order payment status
    await connection.execute(
      'UPDATE orders SET payment_status = ?, payment_reference = ?, updated_at = NOW() WHERE id = ?',
      [paymentStatus, paymentReference, orderId]
    );
    
    res.status(200).json({
      success: true,
      message: 'Order payment status updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating order payment:', error);
    res.status(500).json({ 
      error: 'Failed to update order payment',
      details: error.message 
    });
  } finally {
    if (connection) connection.release();
  }
};

export const getOrderById = async (req, res) => {
  const orderId = req.params.id;
  try {
    console.log(`Attempting to fetch order with ID: ${orderId}`);
    
    if (!orderId || isNaN(parseInt(orderId))) {
      return res.status(400).json({ 
        message: 'Invalid order ID',
        details: 'Order ID must be a valid number'
      });
    }
    
    const order = await Order.getOrderWithItems(orderId);
    
    if (!order) {
      console.log(`Order not found with ID: ${orderId}`);
      return res.status(404).json({ message: 'Order not found' });
    }
    
    console.log(`Successfully fetched order ${orderId} with ${order.items?.length || 0} items`);
    res.json(order);
  } catch (err) {
    console.error('Error fetching order by ID:', err);
    res.status(500).json({ 
      message: 'Server error', 
      details: err.message 
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  // Convert status from const to let to allow modification
  let { status, paymentReference } = req.body;
  let connection;

  try {
    // Validate required parameters
    if (!id || !status) {
      return res.status(400).json({ 
        error: 'Missing required parameters',
        details: 'Both order ID and status are required'
      });
    }

    // Get connection from pool
    connection = await pool.getConnection();
    
    // Log update attempt
    console.log(`Updating order ${id} status to ${status}`);
    
    // Check if order exists
    const [orderCheck] = await connection.execute(
      'SELECT id, user_id FROM orders WHERE id = ?',
      [id]
    );
    
    if (orderCheck.length === 0) {
      return res.status(404).json({
        error: 'Order not found'
      });
    }
    
    // Define allowed status values - check database schema for actual allowed values
    // Note: Modified to match database ENUM constraints
    const allowedStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    
    // Map 'paid' status to 'processing' since 'paid' isn't in the ENUM 
    if (status === 'paid') {
      console.log("Status 'paid' received, mapping to 'processing' to match database schema");
      status = 'processing'; // Convert to a valid status that's in the database ENUM
    }
    
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status value',
        details: `Status must be one of: ${allowedStatuses.join(', ')}, or 'paid' (which will be converted to 'processing')`
      });
    }
    
    // Update order status (and payment reference if provided)
    if (paymentReference) {
      await connection.execute(
        'UPDATE orders SET status = ?, payment_reference = ?, updated_at = NOW() WHERE id = ?',
        [status, paymentReference, id]
      );
    } else {
      await connection.execute(
        'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
        [status, id]
      );
    }
    
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ 
      error: 'Failed to update order status',
      details: error.message
    });
  } finally {
    if (connection) connection.release();
    console.log('Database connection released after status update');
  }
};