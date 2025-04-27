import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { 
    getAllUsers, 
    updateMenuItem, 
    deleteMenuItem, 
    addMenuItem,
    getAllOrders
} from '../controllers/adminController.js';

const router = express.Router();

// Apply authentication middleware to all admin routes
router.use(authenticateToken);
router.use(adminAuth);

// User management routes
router.get('/users', getAllUsers);

// Menu management routes
router.post('/menu', addMenuItem);
router.put('/menu/:id', updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);

// Order management routes
router.get('/orders', getAllOrders);

export default router;