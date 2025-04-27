import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { 
    getUserNotifications,
    markNotificationRead,
    markAllNotificationsRead
} from '../controllers/notificationController.js';

const router = express.Router();

// Protected routes - require authentication
router.use(authenticateToken);

// Get user's notifications
router.get('/user', getUserNotifications);

// Mark a notification as read
router.put('/:id/read', markNotificationRead);

// Mark all notifications as read
router.put('/read-all', markAllNotificationsRead);

export default router;
