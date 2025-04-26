import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Get proper file paths when using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Make sure we load the .env from the project root
const envPath = path.join(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  console.log(`Loading environment variables from ${envPath}`);
  dotenv.config({ path: envPath });
} else {
  console.warn(`Warning: .env file not found at ${envPath}`);
  dotenv.config();
}

// Log database connection parameters (without sensitive data)
console.log('Database connection parameters:');
console.log(`Host: ${process.env.DB_HOST}`);
console.log(`Database: ${process.env.DB_NAME}`);
console.log(`Port: ${process.env.DB_PORT}`);

// Create a pool for connection handling with settings matching the successful test
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 5, // Reduced from 10 to avoid overwhelming the connection
  queueLimit: 0,
  connectTimeout: 30000, // Reduced to match the successful test
  acquireTimeout: 30000, // Add explicit acquire timeout
  timeout: 30000, // Add query timeout
  enableKeepAlive: false, // Changed to false as Railway may not support it
  ssl: {
    rejectUnauthorized: false
  },
  multipleStatements: true
});

// Test database connection with retry mechanism
const testConnection = async (retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const connection = await pool.getConnection();
      console.log(`Successfully connected to Railway MySQL database on attempt ${attempt}`);
      
      // Test query to verify the connection is working
      const [rows] = await connection.query('SELECT 1 + 1 AS result');
      console.log('Connection verified with test query:', rows[0].result);
      
      connection.release();
      return true;
    } catch (error) {
      console.error(`Error connecting to Railway MySQL database (attempt ${attempt}/${retries}):`, error);
      
      if (attempt === retries) {
        console.error('All connection attempts failed');
        return false;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Reduced max delay
      console.log(`Retrying in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return false;
};

// Export using ES Modules syntax
export { pool, testConnection };
export default pool;
