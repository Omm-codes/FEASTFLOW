import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { testConnection } from './config/index.js';
import { fixOrdersTableSchema } from './utils/dbDebug.js';

const app = express();

// Run database schema fixes during app startup
(async () => {
  try {
    console.log('Running database schema checks...');
    await fixOrdersTableSchema();
    console.log('Database schema checks completed');
  } catch (error) {
    console.error('Error during database schema checks:', error);
  }
})();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// Error handling middleware
app.use(errorHandler);

// Test database connection
testConnection()
  .then(connected => {
    if (connected) {
      console.log('Database connection successful');
    } else {
      console.error('Database connection failed');
    }
  });

export default app;