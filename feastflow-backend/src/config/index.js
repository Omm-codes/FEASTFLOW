
import dotenv from 'dotenv';
import { pool, testConnection } from './db.js';

dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'SwapDhiv',
    database: process.env.DB_NAME || 'feastflow',
  },
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
};

export default config;

export {
    pool,
    testConnection
};