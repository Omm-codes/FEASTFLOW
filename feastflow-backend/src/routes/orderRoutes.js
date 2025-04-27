import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authenticateToken } from '../middleware/auth.js';
import { 
  createOrder, 
  getOrdersByUser, 
  getOrderById, 
  updateOrderStatus 
} from '../controllers/orderController.js';

const router = express.Router();

// Create new order
router.post('/', authenticateToken, createOrder);

// Get user's orders
router.get('/me', authenticateToken, getOrdersByUser);

// Get order by ID
router.get('/:id', authenticateToken, getOrderById);

// Update order status (used for payment status updates)
router.put('/:id/status', authenticateToken, updateOrderStatus);

// Test endpoint - no auth required
router.get('/test', (req, res) => {
  res.json({ message: 'Order API is working', timestamp: new Date() });
});

export default router;