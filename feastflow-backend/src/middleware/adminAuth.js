import { pool } from '../config/db.js';

export const isAdmin = async (req, res, next) => {
    try {
        const [users] = await pool.execute(
            'SELECT role FROM users WHERE id = ?',
            [req.user.userId]
        );

        if (users.length === 0 || users[0].role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};