import { pool } from '../config/db.js';

class MenuController {
  // Get all menu items
  async getAllMenuItems(req, res) {
    try {
      const [rows] = await pool.query('SELECT * FROM menu_items');
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      res.status(500).json({ message: 'Failed to retrieve menu items', error: error.message });
    }
  }

  // Get a menu item by ID
  async getMenuItemById(req, res) {
    try {
      const { id } = req.params;
      const [rows] = await pool.query('SELECT * FROM menu_items WHERE id = ?', [id]);
      
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      
      res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Error fetching menu item:', error);
      res.status(500).json({ message: 'Failed to retrieve menu item', error: error.message });
    }
  }

  // Create a new menu item
  async createMenuItem(req, res) {
    try {
      const { name, description, price, category, image } = req.body;
      
      const [result] = await pool.query(
        'INSERT INTO menu_items (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)',
        [name, description, price, category, image]
      );
      
      res.status(201).json({ 
        message: 'Menu item created successfully', 
        id: result.insertId 
      });
    } catch (error) {
      console.error('Error creating menu item:', error);
      res.status(500).json({ message: 'Failed to create menu item', error: error.message });
    }
  }

  // Update a menu item
  async updateMenuItem(req, res) {
    try {
      const { id } = req.params;
      const { name, description, price, category, image } = req.body;
      
      const [result] = await pool.query(
        'UPDATE menu_items SET name = ?, description = ?, price = ?, category = ?, image = ? WHERE id = ?',
        [name, description, price, category, image, id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      
      res.status(200).json({ message: 'Menu item updated successfully' });
    } catch (error) {
      console.error('Error updating menu item:', error);
      res.status(500).json({ message: 'Failed to update menu item', error: error.message });
    }
  }

  // Delete a menu item
  async deleteMenuItem(req, res) {
    try {
      const { id } = req.params;
      
      const [result] = await pool.query('DELETE FROM menu_items WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      
      res.status(200).json({ message: 'Menu item deleted successfully' });
    } catch (error) {
      console.error('Error deleting menu item:', error);
      res.status(500).json({ message: 'Failed to delete menu item', error: error.message });
    }
  }
}

export default MenuController;