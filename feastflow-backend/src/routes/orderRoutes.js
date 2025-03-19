import express from 'express';
import OrderController from '../controllers/orderController.js';

const router = express.Router();
const orderController = new OrderController();

// Route to create a new order
router.post('/', orderController.createOrder);

// Route to get orders for a specific user
router.get('/user/:userId', orderController.getUserOrders);

// Route to get all orders (admin route)
router.get('/all', orderController.getAllOrders);

// Route to update order status
router.patch('/:id/status', orderController.updateOrderStatus);

export default router;