import { pool } from '../config/db.js';

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
    
    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};