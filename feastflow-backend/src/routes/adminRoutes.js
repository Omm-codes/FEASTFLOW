import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { isAdmin } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadPath = path.join(__dirname, '../../public/images');
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Protect all admin routes
router.use(authenticateToken);
router.use(isAdmin);

// Update menu item with image upload
router.put('/menu/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;
    const image_url = req.file ? `/images/${req.file.filename}` : undefined;

    let query = 'UPDATE menu_items SET name = ?, description = ?, price = ?, category = ?';
    let params = [name, description, price, category];

    if (image_url) {
      query += ', image_url = ?';
      params.push(image_url);
    }

    query += ' WHERE id = ?';
    params.push(id);

    const [result] = await pool.execute(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ message: 'Menu item updated successfully' });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

// Add menu item
router.post('/menu', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO menu_items (name, description, price, category) VALUES (?, ?, ?, ?)',
      [name, description, price, category]
    );

    res.json({ message: 'Menu item added successfully', id: result.insertId });
  } catch (error) {
    console.error('Add error:', error);
    res.status(500).json({ error: 'Failed to add menu item' });
  }
});

// Delete menu item
router.delete('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM menu_items WHERE id = ?', [id]);
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

export default router;