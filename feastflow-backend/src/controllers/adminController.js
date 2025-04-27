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
        const { name, description, price, category, available, image_url } = req.body;
        
        await pool.execute(
            'UPDATE menu_items SET name = ?, description = ?, price = ?, category = ?, available = ?, image_url = ? WHERE id = ?',
            [name, description, price, category, available, image_url, id]
        );
        
        res.json({ 
            message: 'Menu item updated successfully',
            updatedFields: { name, description, price, category, available, image_url }
        });
    } catch (error) {
        console.error('Error updating menu item:', error);
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
        
        // Validate the required fields
        if (!name || !price) {
            return res.status(400).json({ error: 'Name and price are required' });
        }
        
        // Handle different image URL formats
        let finalImageUrl = image_url;
        
        // Note: We'll allow external URLs to be saved directly to the database
        // This will let you use images from external sources
        
        console.log('Adding menu item with image URL:', finalImageUrl);
        
        // Add the available=true by default
        const [result] = await pool.execute(
            'INSERT INTO menu_items (name, description, price, category, image_url, available) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, price, category, finalImageUrl, true]
        );
        
        res.status(201).json({
            message: 'Menu item added successfully',
            id: result.insertId,
            item: {
                id: result.insertId,
                name,
                description,
                price,
                category,
                image_url: finalImageUrl,
                available: true
            }
        });
    } catch (error) {
        console.error('Error adding menu item:', error);
        res.status(500).json({ error: error.message });
    }
};