import { pool } from '../config/db.js';

export const getAllMenuItems = async (req, res) => {
    try {
        // Modified query to either not filter by available status or default new items to available
        const [items] = await pool.execute('SELECT * FROM menu_items WHERE available IS NULL OR available = true');
        res.json(items);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ error: 'Failed to fetch menu items' });
    }
};

export const getMenuItemById = async (req, res) => {
    try {
        const [item] = await pool.execute(
            'SELECT * FROM menu_items WHERE id = ?',
            [req.params.id]
        );
        if (item.length === 0) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.json(item[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch menu item' });
    }
};

export const addMenuItem = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO menu_items (name, description, price, category) VALUES (?, ?, ?, ?)',
            [name, description, price, category]
        );
        res.status(201).json({ id: result.insertId, message: 'Menu item added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};