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
        
        // Check if original_status column exists
        const [columns] = await pool.execute(`
            SELECT COLUMN_NAME
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = 'orders'
            AND COLUMN_NAME = 'original_status'
        `);
        
        const hasOriginalStatus = columns.length > 0;
        
        // Build the query based on whether original_status exists
        let query = `
            SELECT o.*, 
                   u.name as customer_name, 
                   u.email as customer_email,
                   ${hasOriginalStatus ? 
                     'COALESCE(o.original_status, o.status) as display_status' : 
                     'o.status as display_status'}
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
        `;
        
        const queryParams = [];
        
        // Add status filter if provided
        if (status) {
            if (hasOriginalStatus && ['paid', 'preparing', 'ready', 'delivered'].includes(status)) {
                query += ` WHERE o.original_status = ?`;
            } else {
                query += ` WHERE o.status = ?`;
            }
            queryParams.push(status);
            console.log(`Filtering admin orders by status: ${status}`);
        }
        
        // Add order by newest first
        query += ` ORDER BY o.created_at DESC`;
        
        console.log('Executing admin orders query:', query);
        const [orders] = await pool.execute(query, queryParams);
        
        // Replace 'status' with 'display_status' for consistent frontend display
        const processedOrders = orders.map(order => ({
            ...order,
            status: order.display_status || order.status
        }));
        
        console.log(`Found ${processedOrders.length} orders for admin`);
        
        res.json(processedOrders);
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