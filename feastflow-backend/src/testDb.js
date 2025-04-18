import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully!');
    // Test query to verify connection
    const [result] = await connection.query('SELECT 1');
    console.log('Test query successful:', result);
    connection.release();
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

// Run test immediately
testConnection()
  .then(() => console.log('Connection test completed'))
  .catch(err => {
    console.error('Connection test failed:', err);
    process.exit(1);
  });

export { pool, testConnection };