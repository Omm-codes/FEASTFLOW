import { pool } from '../config/db.js';

export const getAllUsers = async (req, res) => {
    try {
        const [users] = await pool.execute(
            'SELECT id, name, email, role, created_at FROM users'
        );
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

// Get all orders for admin with optional status filter
export const getAllOrders = async (req, res) => {
    try {
        // Get status filter if provided
        const { status } = req.query;
        
        let query = `
            SELECT o.*, 
                   u.name as customer_name, 
                   u.email as customer_email 
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
        `;
        
        const queryParams = [];
        
        // Add status filter if provided
        if (status) {
            query += ` WHERE o.status = ?`;
            queryParams.push(status);
        }
        
        // Add order by newest first
        query += ` ORDER BY o.created_at DESC`;
        
        const [orders] = await pool.execute(query, queryParams);
        
        res.json(orders);
    } catch (error) {
        console.error('Error fetching admin orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

export const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, available } = req.body;
        
        await pool.execute(
            'UPDATE menu_items SET name = ?, description = ?, price = ?, category = ?, available = ? WHERE id = ?',
            [name, description, price, category, available, id]
        );
        
        res.json({ message: 'Menu item updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.execute('DELETE FROM menu_items WHERE id = ?', [id]);
        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, image_url } = req.body;
        
        const [result] = await pool.execute(
            'INSERT INTO menu_items (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)',
            [name, description, price, category, image_url]
        );
        
        res.status(201).json({
            message: 'Menu item added successfully',
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};