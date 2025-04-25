import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authenticateToken } from '../middleware/auth.js';
import { createOrder, getOrdersByUser, getOrderById } from '../controllers/orderController.js';

const router = express.Router();

// Create new order
router.post('/', authenticateToken, createOrder);

// Get user's orders - ENSURE THIS ROUTE EXISTS
router.get('/me', authenticateToken, getOrdersByUser);

// Get order by ID
router.get('/api/orders/:id', authenticate, getOrderById);

// Test endpoint - no auth required
router.get('/test', (req, res) => {
  res.json({ message: 'Order API is working', timestamp: new Date() });
});

export default router;