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
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (orders.length === 0) return null;
    
    const order = orders[0];
    
    const [items] = await pool.query(
      `SELECT oi.*, mi.name, mi.description, mi.category, mi.image 
       FROM order_items oi 
       JOIN menu_items mi ON oi.menu_item_id = mi.id 
       WHERE oi.order_id = ?`,
      [orderId]
    );
    
    return { ...order, items };
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