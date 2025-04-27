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
    const userId = req.user?.userId || null; // Use null for guest orders to avoid FK constraint issues
    
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
      // Extract pickup information from customer data
      const pickupNotes = customer.pickupTime ? `Pickup Time: ${customer.pickupTime}` : '';
      const customerNotes = customer.notes ? `Notes: ${customer.notes}` : '';
      const specialInstructions = [pickupNotes, customerNotes].filter(Boolean).join(' | ');
      
      // Check database to see if columns exist
      const [columns] = await connection.execute(`
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = 'orders'
        AND COLUMN_NAME IN ('delivery_address', 'pickup_address', 'customer_phone')
      `);
      
      const columnNames = columns.map(col => col.COLUMN_NAME.toLowerCase());
      const hasDeliveryAddressColumn = columnNames.includes('delivery_address');
      const hasPickupAddressColumn = columnNames.includes('pickup_address');
      const hasCustomerPhoneColumn = columnNames.includes('customer_phone');
      
      // Get pickup type from request (restaurant or home)
      const pickupType = req.body.pickup_type || 'restaurant';
      const pickupAddress = req.body.pickup_address || 'Restaurant Pickup';
      
      console.log('Order type:', pickupType);
      console.log('Has delivery_address column:', hasDeliveryAddressColumn);
      console.log('Has pickup_address column:', hasPickupAddressColumn);
      console.log('Has customer_phone column:', hasCustomerPhoneColumn);
      
      let orderResult;
      
      // First try to get the contact information
      const contactNumber = customer?.phone || 'Not provided';
      const customerName = customer?.name || 'Guest';
      const customerEmail = customer?.email || 'guest@example.com';
      
      // Build up the SQL query and parameters based on what columns exist
      let sqlFields = 'user_id, total_amount, payment_method, status, contact_number, customer_name, customer_email, special_instructions';
      let sqlPlaceholders = '?, ?, ?, ?, ?, ?, ?, ?';
      const sqlParams = [
        userId, 
        parsedAmount || 0,
        payment_method || 'cash',
        status || 'pending',
        contactNumber,
        customerName,
        customerEmail,
        specialInstructions || ''
      ];
      
      // Add delivery_address if that column exists
      if (hasDeliveryAddressColumn) {
        sqlFields += ', delivery_address';
        sqlPlaceholders += ', ?';
        sqlParams.push(req.body.delivery_address || customer?.address || 'Not provided');
      }
      
      // Add pickup_address if that column exists
      if (hasPickupAddressColumn) {
        sqlFields += ', pickup_address';
        sqlPlaceholders += ', ?';
        sqlParams.push(pickupAddress);
      }
      
      // Add customer_phone if that column exists
      if (hasCustomerPhoneColumn) {
        sqlFields += ', customer_phone';
        sqlPlaceholders += ', ?';
        sqlParams.push(contactNumber);
      }
      
      // Add pickup_type if that parameter is provided
      if (pickupType) {
        sqlFields += ', pickup_type';
        sqlPlaceholders += ', ?';
        sqlParams.push(pickupType);
      }
      
      const sqlQuery = `INSERT INTO orders (${sqlFields}) VALUES (${sqlPlaceholders})`;
      console.log('Executing SQL:', sqlQuery);
      console.log('With parameters:', sqlParams);
      
      [orderResult] = await connection.execute(sqlQuery, sqlParams);
      
      const orderId = orderResult.insertId;
      console.log(`Created order with ID: ${orderId}`);
      
      // Insert order items - Handle both id and menu_item_id from frontend
      for (const item of items) {
        // Support both item.id and item.menu_item_id formats from different frontends
        const menuItemId = item.id || item.menu_item_id; 
        
        // Verify we have a valid ID before inserting
        if (!menuItemId) {
          console.error('Invalid item without ID:', item);
          throw new Error('All items must have an ID');
        }
        
        const quantity = parseInt(item.quantity) || 1;
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
    
    // Use the enhanced Order model method instead of direct query
    const orders = await Order.getByUserId(userId);
    
    // Ensure correct status display by using display_status
    const processedOrders = orders.map(order => ({
      ...order,
      status: order.display_status || order.status
    }));
    
    console.log(`Found ${processedOrders.length} orders for user ${userId}`);
    
    // Ensure we're sending valid JSON
    res.setHeader('Content-Type', 'application/json');
    res.json(processedOrders);
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
  let { status, paymentReference, payment_method, notify } = req.body;
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
    
    // Check if original_status column exists
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'orders'
      AND COLUMN_NAME = 'original_status'
    `);
    
    const hasOriginalStatus = columns.length > 0;
    
    // Log update attempt
    console.log(`Updating order ${id} status to ${status}. Notify: ${notify}`);
    
    // Check if order exists and get related user information
    let selectQuery = `
      SELECT o.id, o.user_id, o.status AS current_status, o.customer_email, u.email, u.name
      ${hasOriginalStatus ? ', o.original_status' : ''}
      FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE o.id = ?
    `;
    
    const [orderCheck] = await connection.execute(selectQuery, [id]);
    
    if (orderCheck.length === 0) {
      return res.status(404).json({
        error: 'Order not found'
      });
    }
    
    const order = orderCheck[0];
    console.log('Current order status:', order.current_status);
    console.log('New status to apply:', status);
    
    // Define status mappings that works with your database
    // This ensures consistent status representation between frontend and backend
    const statusMappings = {
      'pending': 'pending',
      'paid': 'processing',      // Map 'paid' to 'processing'
      'preparing': 'processing', // Map 'preparing' to 'processing'  
      'processing': 'processing',
      'ready': 'completed',      // Map 'ready' to 'completed'
      'completed': 'completed',
      'delivered': 'completed',  // Map 'delivered' to 'completed'
      'cancelled': 'cancelled'
    };
    
    // Use mapped status for database but keep original status for frontend
    const dbStatus = statusMappings[status.toLowerCase()] || order.current_status;
    console.log(`Using mapped database status: ${dbStatus}`);
    
    // Build an array of SQL updates and parameters
    let updateSql = '';
    const updateParams = [];
    
    // Start building the SQL update statement
    updateSql = 'UPDATE orders SET ';
    
    // Always update status
    updateSql += 'status = ?';
    updateParams.push(dbStatus);
    
    // Add original_status if it exists
    if (hasOriginalStatus) {
      updateSql += ', original_status = ?';
      updateParams.push(status);
    }
    
    // Update payment_method if provided
    if (payment_method) {
      console.log(`Updating payment method to: ${payment_method}`);
      updateSql += ', payment_method = ?';
      updateParams.push(payment_method);
    }
    
    // Update payment reference if provided
    if (paymentReference) {
      console.log(`Setting payment reference: ${paymentReference}`);
      updateSql += ', payment_reference = ?';
      updateParams.push(paymentReference);
    }
    
    // Add updated_at timestamp
    updateSql += ', updated_at = NOW()';
    
    // Add WHERE clause
    updateSql += ' WHERE id = ?';
    updateParams.push(id);
    
    // Execute the update
    console.log('Executing SQL:', updateSql);
    console.log('With parameters:', updateParams);
    
    await connection.execute(updateSql, updateParams);
    
    // Try to create original_status column if it doesn't exist and we need it
    if (!hasOriginalStatus) {
      try {
        console.log("Attempting to add original_status column to orders table");
        await connection.execute(`
          ALTER TABLE orders 
          ADD COLUMN original_status VARCHAR(50) DEFAULT NULL
          AFTER status
        `);
        console.log("Successfully added original_status column");
        
        // Set the original status
        await connection.execute(
          'UPDATE orders SET original_status = ? WHERE id = ?',
          [status, id]
        );
      } catch (alterError) {
        // If column already exists or other error, just log it
        console.error("Error adding original_status column:", alterError);
      }
    }
    
    // If notify flag is set and we have a user email, send notification
    if (notify && order.user_id) {
      const userEmail = order.email || order.customer_email;
      const userName = order.name || 'Customer';
      
      console.log(`📧 Sending notification to ${userName} (${userEmail}) about order #${order.id} status: ${status}`);
      
      // In a real implementation, you would call your notification service here
    }
    
    // Fetch the updated order to return in response
    const [updatedOrder] = await connection.execute(
      'SELECT id, status, payment_method, original_status, payment_reference FROM orders WHERE id = ?',
      [id]
    );
    
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      status: status,
      dbStatus: dbStatus,
      orderId: id,
      order: updatedOrder[0]
    });
    
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ 
      error: 'Failed to update order status',
      details: error.message
    });
  } finally {
    if (connection) connection.release();
  }
};