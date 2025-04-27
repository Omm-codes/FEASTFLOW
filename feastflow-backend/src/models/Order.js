import { pool } from '../config/db.js';

const Order = {
  getAll: async () => {
    // Improved query to correctly handle original_status
    const [rows] = await pool.query(`
      SELECT 
        *,
        COALESCE(original_status, status) AS display_status
      FROM orders 
      ORDER BY created_at DESC
    `);
    return rows;
  },
  
  getById: async (id) => {
    // Improved query to correctly handle original_status 
    const [rows] = await pool.query(`
      SELECT 
        *,
        COALESCE(original_status, status) AS display_status  
      FROM orders 
      WHERE id = ?
    `, [id]);
    return rows[0];
  },
  
  getByUserId: async (userId) => {
    // Improved query to correctly handle original_status
    const [rows] = await pool.query(`
      SELECT 
        *,
        COALESCE(original_status, status) AS display_status
      FROM orders 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `, [userId]);
    return rows;
  },
  
  create: async (orderData) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      const { user_id, total_amount, delivery_address, contact_number, payment_method, items } = orderData;
      
      // Insert order
      const [orderResult] = await connection.query(
        'INSERT INTO orders (user_id, total_amount, delivery_address, contact_number, payment_method) VALUES (?, ?, ?, ?, ?)',
        [user_id, total_amount, delivery_address, contact_number, payment_method]
      );
      
      const orderId = orderResult.insertId;
      
      // Insert order items
      for (const item of items) {
        await connection.query(
          'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.menu_item_id, item.quantity, item.price]
        );
      }
      
      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
  
  getOrderWithItems: async (orderId) => {
    try {
      console.log(`Fetching order details for order ID: ${orderId}`);
      
      // First get the order with display_status, but don't rely on original_status
      const [orders] = await pool.query(`
        SELECT 
          *,
          COALESCE(original_status, status) AS display_status
        FROM orders 
        WHERE id = ?
      `, [orderId]);
      
      if (orders.length === 0) {
        console.log(`No order found with ID: ${orderId}`);
        return null;
      }
      
      const order = orders[0];
      
      // Use display_status for the frontend
      console.log(`Found order: ${order.id} with status: ${order.display_status}`);
      
      // Then get the order items with menu item details
      const [items] = await pool.query(
        `SELECT oi.*, mi.name, mi.description, mi.category, mi.image_url 
         FROM order_items oi 
         JOIN menu_items mi ON oi.menu_item_id = mi.id 
         WHERE oi.order_id = ?`,
        [orderId]
      );
      
      console.log(`Found ${items.length} items for order ${orderId}`);
      
      return { ...order, items };
    } catch (error) {
      console.error('Error in getOrderWithItems:', error);
      throw error;
    }
  },
  
  updateStatus: async (id, status, originalStatus) => {
    try {
      // Check if original_status column exists before using it
      const [columns] = await pool.query(`
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = 'orders'
        AND COLUMN_NAME = 'original_status'
      `);
      
      const hasOriginalStatus = columns.length > 0;
      
      // Simple function to map external status values to database ENUM values
      const mapStatusToDbValue = (externalStatus) => {
        // Customize this mapping based on your database schema
        const statusMap = {
          'paid': 'processing',      // Map 'paid' to 'processing'
          'preparing': 'processing', // Map 'preparing' to 'processing'  
          'ready': 'completed',      // Map 'ready' to 'completed'
          'delivered': 'completed',  // Map 'delivered' to 'completed'
          // Keep these as-is
          'pending': 'pending',
          'processing': 'processing',
          'completed': 'completed',
          'cancelled': 'cancelled'
        };
        
        return statusMap[externalStatus.toLowerCase()] || 'pending';
      };

      // Map the external status to a valid database value
      const dbStatus = mapStatusToDbValue(status);
      
      console.log(`Updating order ${id} status from "${status}" to database value "${dbStatus}"`);
      
      // Use different SQL based on whether original_status column exists
      let result;
      if (hasOriginalStatus) {
        // Store both the original status and the mapped database status
        [result] = await pool.query(
          'UPDATE orders SET status = ?, original_status = ? WHERE id = ?',
          [dbStatus, originalStatus || status, id]
        );
      } else {
        // Just update the status field if original_status doesn't exist
        [result] = await pool.query(
          'UPDATE orders SET status = ? WHERE id = ?',
          [dbStatus, id]
        );
      }
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error in updateStatus for order ${id}:`, error);
      throw error;
    }
  }
};

export default Order;