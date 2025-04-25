import express from 'express';
import { register, login, registerAdmin, createInitialAdmin } from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';
import { getOrderById } from '../controllers/orderController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/register-admin', registerAdmin);
router.post('/create-admin', createInitialAdmin);
router.get('/api/orders/:id', authenticate, getOrderById);

export default router;