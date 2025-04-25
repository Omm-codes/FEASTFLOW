import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Get proper file paths when using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Make sure we load the .env from the project root
dotenv.config({ path: path.join(__dirname, '../.env') });

const testDirectConnection = async () => {
  console.log('Testing direct connection to Railway MySQL...');
  console.log(`Host: ${process.env.DB_HOST}`);
  console.log(`Port: ${process.env.DB_PORT}`);
  console.log(`User: ${process.env.DB_USER}`);
  console.log(`Database: ${process.env.DB_NAME}`);
  
  // Verify we have credentials before trying to connect
  if (!process.env.DB_HOST || !process.env.DB_USER) {
    console.error('Missing required environment variables. Check your .env file.');
    return false;
  }
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
      connectTimeout: 30000, // 30 seconds timeout
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    console.log('Connection established successfully!');
    
    // Run test query
    const [rows] = await connection.query('SELECT 1 + 1 AS result');
    console.log('Query result:', rows);
    
    await connection.end();
    console.log('Connection closed.');
    return true;
  } catch (error) {
    console.error('Connection failed:', error);
    // Provide more detailed error information based on error type
    if (error.code === 'ENOTFOUND') {
      console.error('Host not found. Check your DB_HOST value.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. Make sure the database server is running and the port is correct.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Access denied. Check your username and password.');
    }
    return false;
  }
};

testDirectConnection()
  .then(success => {
    console.log('Test complete, success:', success);
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Test failed with exception:', err);
    process.exit(1);
  });