import { pool } from '../config/db.js';

const Order = {
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    return rows;
  },
  
  getById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    return rows[0];
  },
  
  getByUserId: async (userId) => {
    const [rows] = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
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
      
      // First get the order
      const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
      
      if (orders.length === 0) {
        console.log(`No order found with ID: ${orderId}`);
        return null;
      }
      
      const order = orders[0];
      console.log(`Found order: ${order.id}`);
      
      // Then get the order items with menu item details
      const [items] = await pool.query(
        `SELECT oi.*, mi.name, mi.description, mi.category, mi.image_url as image 
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
  
  updateStatus: async (id, status) => {
    const [result] = await pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows > 0;
  }
};

export default Order;