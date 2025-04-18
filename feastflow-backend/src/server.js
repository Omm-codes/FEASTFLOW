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
import { testConnection } from './config/db.js';
import { verifyJwtSetup } from './config/jwt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 5001;

// Verify JWT setup
verifyJwtSetup();

// Middlewares
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure static file serving with absolute paths
const publicPath = path.join(__dirname, '../public');
const imagesPath = path.join(__dirname, '../public/images');

// Ensure paths exist
if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
}
if (!fs.existsSync(imagesPath)) {
    fs.mkdirSync(imagesPath, { recursive: true });
}

app.use(express.static(publicPath));
app.use('/images', express.static(imagesPath));

// Add a route to check image paths
app.get('/api/check-image/:imageName', (req, res) => {
    const imagePath = path.join(imagesPath, req.params.imageName);
    if (fs.existsSync(imagePath)) {
        res.json({ exists: true });
    } else {
        res.json({ exists: false });
    }
});

// Add a test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is running' });
});

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('FeastFlow API is running!');
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Test database connection
testConnection()
    .then(connected => {
        if (connected) {
            console.log('Database connected successfully');
        } else {
            console.error('Database connection failed');
        }
    });

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});