import express from 'express';
import { authenticateToken, optionalAuthToken } from '../middleware/auth.js';
import { createOrder, getOrdersByUser } from '../controllers/orderController.js';

const router = express.Router();

// Allow both guest checkout and authenticated users
router.post('/', optionalAuthToken, createOrder);

// These routes require authentication
router.get('/me', authenticateToken, getOrdersByUser);
router.get('/user', authenticateToken, getOrdersByUser);

export default router;