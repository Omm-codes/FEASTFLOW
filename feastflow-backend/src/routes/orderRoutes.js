import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { createOrder } from '../controllers/orderController.js';

const router = express.Router();

router.use(authenticateToken);
router.post('/', createOrder);

export default router;