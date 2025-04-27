import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getMenuItemById } from '../controllers/menuController.js';
import { pool } from '../config/db.js'; // Updated import path

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM menu_items');
    console.log('Menu items fetched:', rows); // Debug log
    res.json(rows);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

router.get('/:id', getMenuItemById);

export default router;