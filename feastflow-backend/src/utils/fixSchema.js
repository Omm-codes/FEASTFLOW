// Script to fix database schema issues
import { fixOrdersTableSchema } from './dbDebug.js';
import { pool } from '../config/db.js';

async function runFixes() {
  try {
    console.log('🔧 Starting database schema fixes...');
    
    // Run the orders table schema fix
    await fixOrdersTableSchema();
    
    console.log('✅ Database schema fixes completed successfully');
    
    // Exit successfully
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing database schema:', error);
    
    // Exit with error code
    process.exit(1);
  } finally {
    // Make sure to close the pool
    try {
      pool.end();
      console.log('Database connection pool closed');
    } catch (err) {
      console.error('Error closing database pool:', err);
    }
  }
}

// Run the function
runFixes();