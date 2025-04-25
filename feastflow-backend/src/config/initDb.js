import { pool } from './db.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initializeDatabase = async () => {
  try {
    console.log('Checking database connection...');
    const connection = await pool.getConnection();
    
    // Test if we can access railway database
    try {
      console.log('Checking if tables exist...');
      const [tables] = await connection.query('SHOW TABLES');
      console.log('Existing tables:', tables.map(t => Object.values(t)[0]));
      
      // Check if users table exists and has data
      const [userCount] = await connection.query('SELECT COUNT(*) as count FROM users');
      console.log(`User count: ${userCount[0].count}`);
      
      if (userCount[0].count > 0) {
        console.log('Database already initialized with data');
      } else {
        console.log('Database tables exist but no data found. Consider importing data.');
      }
    } catch (error) {
      // If there's an error, tables might not exist
      console.log('Error checking tables, may need to create schema:', error.message);
      
      // Read SQL file and execute initialization if needed
      try {
        const sqlPath = path.join(__dirname, '../..', 'feastflow.sql');
        console.log(`Reading SQL file from: ${sqlPath}`);
        
        const sql = await fs.readFile(sqlPath, 'utf8');
        
        // Split SQL script into separate statements
        const statements = sql
          .split(';')
          .filter(stmt => stmt.trim())
          .map(stmt => stmt.trim());
        
        console.log(`Found ${statements.length} SQL statements to execute`);
        
        // Execute statements one by one
        for (const statement of statements) {
          try {
            if (statement.includes('USE