import { pool } from '../config/db.js';

// Function to periodically check database connection
export const startConnectionMonitor = () => {
    const interval = 60000; // Check every minute
    
    // Function to check connection
    const checkConnection = async () => {
        try {
            const connection = await pool.getConnection();
            await connection.query('SELECT 1');
            connection.release();
            console.log('Connection monitor: Database connection is healthy');
        } catch (error) {
            console.error('Connection monitor: Database connection error:', error);
        }
    };
    
    // Run immediately then schedule
    checkConnection();
    
    // Schedule regular checks
    const timer = setInterval(checkConnection, interval);
    
    // Return function to stop monitoring
    return () => clearInterval(timer);
};