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
import { updateOrderStatus, getOrderById } from '../controllers/orderController.js'; // Import order controller functions

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
router.get('/orders/:id', getOrderById); // Add endpoint to get a specific order
router.put('/orders/:id/status', updateOrderStatus); // Add endpoint for updating order status

export default router;