import db from '../config/db.js';
const pool = db.pool || db; // This handles both cases where db might export pool as a property or be the pool itself

class OrderController {
  // Create a new order
  async createOrder(req, res) {
    // Start a database transaction
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      const { userId, items, total, address, contactNumber, paymentMethod } = req.body;
      
      // Validate required fields
      if (!userId || !items || !total || !address || !contactNumber || !paymentMethod) {
        return res.status(400).json({ message: 'Missing required order information' });
      }
      
      // Validate items array
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Order must contain at least one item' });
      }
      
      // Create the order
      const [orderResult] = await connection.query(
        'INSERT INTO orders (user_id, total_amount, delivery_address, contact_number, payment_method, status) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, total, address, contactNumber, paymentMethod, 'pending']
      );
      
      const orderId = orderResult.insertId;
      
      // Add order items
      if (items && items.length > 0) {
        // Validate each item has the required properties
        for (const item of items) {
          if (!item.menuItemId || !item.quantity || !item.price) {
            await connection.rollback();
            return res.status(400).json({ 
              message: 'Invalid item data: each item must have menuItemId, quantity, and price' 
            });
          }
        }
        
        const orderItems = items.map(item => [
          orderId,
          item.menuItemId,
          item.quantity,
          item.price
        ]);
        
        await connection.query(
          'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES ?',
          [orderItems]
        );
      }
      
      await connection.commit();
      
      res.status(201).json({ 
        message: 'Order created successfully', 
        orderId 
      });
    } catch (error) {
      await connection.rollback();
      console.error('Error creating order:', error);
      res.status(500).json({ message: 'Failed to create order', error: error.message });
    } finally {
      connection.release();
    }
  }

  // Get orders for a user
  async getUserOrders(req, res) {
    try {
      const { userId } = req.params;
      
      const [orders] = await pool.query(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
      
      // Get details for each order
      const ordersWithItems = await Promise.all(orders.map(async (order) => {
        const [items] = await pool.query(
          `SELECT oi.*, mi.name, mi.image 
           FROM order_items oi 
           JOIN menu_items mi ON oi.menu_item_id = mi.id 
           WHERE oi.order_id = ?`,
          [order.id]
        );
        
        return { ...order, items };
      }));
      
      res.status(200).json(ordersWithItems);
    } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({ message: 'Failed to retrieve orders', error: error.message });
    }
  }

  // Get all orders (admin)
  async getAllOrders(req, res) {
    try {
      const [orders] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching all orders:', error);
      res.status(500).json({ message: 'Failed to retrieve orders', error: error.message });
    }
  }

  // Update order status
  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status || !['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided' });
      }
      
      const [result] = await pool.query(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      res.status(200).json({ 
        message: 'Order status updated successfully',
        orderId: id,
        status 
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Failed to update order status', error: error.message });
    }
  }
  
  // Get a single order by ID
  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      
      const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
      
      if (orders.length === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      const order = orders[0];
      
      // Get user info
      const [userRows] = await pool.query(
        'SELECT id, name, email, phone FROM users WHERE id = ?',
        [order.user_id]
      );
      
      // Get order items
      const [items] = await pool.query(
        `SELECT oi.*, mi.name, mi.category, mi.image 
         FROM order_items oi 
         JOIN menu_items mi ON oi.menu_item_id = mi.id 
         WHERE oi.order_id = ?`,
        [id]
      );
      
      const orderDetails = {
        ...order,
        user: userRows[0] || null,
        items
      };
      
      res.status(200).json(orderDetails);
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ message: 'Failed to retrieve order', error: error.message });
    }
  }
}

export default OrderController;