import { pool } from '../config/db.js';

// Get notifications for the current user
export const getUserNotifications = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        
        // Get the most recent 20 notifications for this user
        const [notifications] = await pool.execute(
            `SELECT * FROM notifications 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT 20`,
            [userId]
        );
        
        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

// Mark a notification as read
export const markNotificationRead = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        
        // Update notification
        const [result] = await pool.execute(
            'UPDATE notifications SET read_at = NOW() WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Notification not found or not owned by user' });
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ error: 'Failed to update notification' });
    }
};

// Mark all notifications as read
export const markAllNotificationsRead = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        
        // Update all unread notifications
        await pool.execute(
            'UPDATE notifications SET read_at = NOW() WHERE user_id = ? AND read_at IS NULL',
            [userId]
        );
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ error: 'Failed to update notifications' });
    }
};
