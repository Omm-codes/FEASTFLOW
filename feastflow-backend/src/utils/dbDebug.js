import { pool } from '../config/db.js';

/**
 * Utility to check database table structure
 */
export const checkTableStructure = async (tableName) => {
  try {
    const connection = await pool.getConnection();
    try {
      console.log(`Checking structure of table: ${tableName}`);
      
      // Get table columns
      const [columns] = await connection.query(`DESCRIBE ${tableName}`);
      console.log(`Table ${tableName} structure:`, columns);
      
      // Get some sample data
      const [rows] = await connection.query(`SELECT * FROM ${tableName} LIMIT 5`);
      console.log(`Sample data from ${tableName}:`, rows);
      
      return {
        columns: columns,
        sampleData: rows
      };
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(`Error checking table structure for ${tableName}:`, error);
    return null;
  }
};

/**
 * Utility to check if a column exists in a table
 */
export const ensureColumn = async (tableName, columnName, definition) => {
  try {
    const connection = await pool.getConnection();
    try {
      // Check if column exists
      const [columns] = await connection.query(`SHOW COLUMNS FROM ${tableName} LIKE ?`, [columnName]);
      
      if (columns.length === 0) {
        console.log(`Adding missing column ${columnName} to ${tableName}`);
        await connection.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
        return true;
      }
      
      return false;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(`Error ensuring column ${columnName} in ${tableName}:`, error);
    return false;
  }
};

/**
 * Function to fix common database schema issues
 */
export const fixOrdersTableSchema = async () => {
  try {
    console.log('Checking orders table schema for required columns...');
    
    // Define required columns for orders table
    const requiredColumns = [
      { name: 'customer_name', definition: 'VARCHAR(100) NULL' },
      { name: 'customer_email', definition: 'VARCHAR(100) NULL' },
      { name: 'customer_phone', definition: 'VARCHAR(20) NULL' },
      { name: 'delivery_address', definition: 'TEXT NULL' },
      { name: 'pickup_address', definition: 'TEXT NULL' },
      { name: 'pickup_type', definition: 'VARCHAR(50) DEFAULT "restaurant"' },
      { name: 'payment_method', definition: 'VARCHAR(50) DEFAULT "cash"' },
      { name: 'contact_number', definition: 'VARCHAR(20) NULL' }
    ];
    
    // Check and add missing columns
    for (const col of requiredColumns) {
      await ensureColumn('orders', col.name, col.definition);
    }
    
    console.log('Orders table schema check completed');
  } catch (error) {
    console.error('Error fixing orders table schema:', error);
  }
};