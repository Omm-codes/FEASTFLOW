import { pool } from '../config/db.js';

export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, address, phone, notes } = req.body;
    const userId = req.user.id; // From auth middleware

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Insert order
      const [orderResult] = await connection.execute(
        'INSERT INTO orders (user_id, total_amount, delivery_address, phone, notes, status) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, totalAmount, address, phone, notes, 'pending']
      );

      const orderId = orderResult.insertId;

      // Insert order items
      for (const item of items) {
        await connection.execute(
          'INSERT INTO order_items (order_id, item_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.id, item.quantity || 1, item.price]
        );
      }

      await connection.commit();
      res.status(201).json({ 
        message: 'Order placed successfully',
        orderId 
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const getOrders = async (req, res) => {
    try {
        const userId = req.user.userId;
        const [orders] = await pool.execute(
            'SELECT * FROM orders WHERE user_id = ?',
            [userId]
        );
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};