import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { testConnection, pool } from './config/db.js';
import { verifyJwtSetup } from './config/jwt.js';
import { startConnectionMonitor } from './utils/connectionMonitor.js';
import { checkTableStructure } from './utils/dbDebug.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 5001;

// Verify JWT setup
verifyJwtSetup();

// Add or update your CORS configuration:
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5002'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Update your static file configuration
const publicPath = path.join(__dirname, '../public');
const imagesPath = path.join(publicPath, 'images');

// Ensure paths exist
if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
}
if (!fs.existsSync(imagesPath)) {
    fs.mkdirSync(imagesPath, { recursive: true });
}

// Log where we're looking for images
console.log('Serving static files from:', publicPath);
console.log('Serving images from:', imagesPath);

// Serve static files
app.use(express.static(publicPath));
app.use('/images', express.static(imagesPath));

// Simple health check route that doesn't require DB connection
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Service is running' });
});

// Add this after initializing your app but before your routes:

// Debug routes
app._router?.stack.forEach((middleware) => {
  if (middleware.route) {
    // routes registered directly on the app
    console.log(`Route: ${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
  } else if (middleware.name === 'router') {
    // router middleware
    middleware.handle.stack.forEach((handler) => {
      if (handler.route) {
        const path = handler.route.path;
        const methods = Object.keys(handler.route.methods);
        console.log(`Router Route: ${methods.join(',')} ${path}`);
      }
    });
  }
});

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`REQUEST: ${req.method} ${req.url}`);
  next();
});

// Add this before your routes:

// Request logger middleware
app.use((req, res, next) => {
  console.log(`----- API Request: ${req.method} ${req.url} -----`);
  console.log('Headers:', req.headers);
  console.log('Query:', req.query);
  console.log('Body:', req.body);
  console.log('---------------------------------');
  next();
});

// Routes that require database connection
const setupRoutes = () => {
    app.use('/api/menu', menuRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/admin', adminRoutes);
};

// Root route
app.get('/', (req, res) => {
    res.send('FeastFlow API is running on Railway!');
});

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is running on Railway' });
});

// Database route to check connection
app.get('/api/db-status', async (req, res) => {
    try {
        const connected = await testConnection();
        res.json({
            status: connected ? 'connected' : 'disconnected',
            message: connected ? 'Successfully connected to database' : 'Failed to connect to database'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Add this route to your server.js
app.get('/api/debug/images', async (req, res) => {
    try {
        // Get image info from database
        const connection = await pool.getConnection();
        const [menuItems] = await connection.query('SELECT id, name, image_url FROM menu_items');
        connection.release();
        
        // Check if files exist
        const imageStatus = await Promise.all(menuItems.map(async (item) => {
            const relativePath = item.image_url.startsWith('/') 
                ? item.image_url.substring(1) 
                : item.image_url;
                
            const absolutePath = path.join(publicPath, relativePath);
            let exists = false;
            
            try {
                exists = fs.existsSync(absolutePath);
            } catch (err) {
                console.error(`Error checking file ${absolutePath}:`, err);
            }
            
            return {
                id: item.id,
                name: item.name,
                relativePath,
                absolutePath,
                exists,
                url: `http://localhost:${PORT}${item.image_url}`
            };
        }));
        
        res.json({
            baseDir: publicPath,
            imagesDir: imagesPath,
            images: imageStatus
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add this debug endpoint for testing API access
app.get('/api/debug/connection', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API is accessible',
    timestamp: new Date().toISOString(),
    headers: req.headers
  });
});

// Add after your other debug endpoints
app.get('/api/debug/schema', async (req, res) => {
  try {
    // Check critical tables
    const ordersTable = await checkTableStructure('orders');
    const orderItemsTable = await checkTableStructure('order_items');
    const menuItemsTable = await checkTableStructure('menu_items');
    const usersTable = await checkTableStructure('users');
    
    res.json({
      orders: ordersTable?.columns || 'Error fetching schema',
      orderItems: orderItemsTable?.columns || 'Error fetching schema',
      menuItems: menuItemsTable?.columns || 'Error fetching schema',
      users: usersTable?.columns || 'Error fetching schema'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error checking database schema',
      details: error.message
    });
  }
});

// Test this endpoint in your browser: http://localhost:5001/api/debug/connection

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Start server and attempt database connection
const startServer = async () => {
    // Add this to check table structures on startup
    try {
        await checkTableStructure('orders');
        await checkTableStructure('order_items');
    } catch (err) {
        console.error('Error checking table structures:', err);
    }

    // Start the server regardless of DB connection
    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT} for Railway deployment`);
    });
    
    try {
        // Now try to connect to the database
        console.log('Testing database connection...');
        const connected = await testConnection();
        
        if (connected) {
            console.log('Database connected successfully to Railway');
            // Set up routes that require database connection
            setupRoutes();
            
            // Start connection monitor
            const stopMonitor = startConnectionMonitor();
            
            // Graceful shutdown
            process.on('SIGTERM', () => {
                console.log('SIGTERM signal received: closing HTTP server');
                stopMonitor();
                server.close(() => {
                    console.log('HTTP server closed');
                });
            });
        } else {
            console.error('Database connection failed. API routes requiring database will not work.');
            // We'll still have the health check and basic routes available
        }
    } catch (error) {
        console.error('Error during startup:', error);
    }
};

startServer();