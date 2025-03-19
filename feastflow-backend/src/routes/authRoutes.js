import express from 'express';
import AuthController from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();
const authController = new AuthController();

// Register a new user
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Get user profile (protected route)
router.get('/profile', auth, authController.getProfile);

export default router;