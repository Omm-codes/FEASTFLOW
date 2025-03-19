// filepath: feastflow-backend/src/config/index.js
import dotenv from 'dotenv';
import { pool, connectToDatabase, testConnection } from './database';

dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 27017,
    name: process.env.DB_NAME || 'feastflow',
  },
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
};

export default config;

export {
    pool,
    connectToDatabase,
    testConnection
};