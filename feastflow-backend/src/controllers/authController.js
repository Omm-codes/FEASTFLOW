import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthController {
  // Register a new user
  async register(req, res) {
    try {
      const { name, email, password, phone } = req.body;
      
      // Check if user already exists
      const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, phone]
      );
      
      // Generate token
      const token = jwt.sign(
        { userId: result.insertId, email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.status(201).json({
        message: 'User registered successfully',
        token,
        userId: result.insertId,
        name
      });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Failed to register user', error: error.message });
    }
  }

  // User login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Get user
      const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (users.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      const user = users[0];
      
      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      // Generate token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.status(200).json({
        message: 'Login successful',
        token,
        userId: user.id,
        name: user.name,
        isAdmin: user.is_admin === 1
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Login failed', error: error.message });
    }
  }

  // User logout
  async logout(req, res) {
    // Logic for user logout
  }

  // Get current user profile
  async getProfile(req, res) {
    try {
      const { userId } = req.user;
      
      const [users] = await pool.query(
        'SELECT id, name, email, phone, created_at FROM users WHERE id = ?',
        [userId]
      );
      
      if (users.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json(users[0]);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Failed to retrieve user profile', error: error.message });
    }
  }
}

export default AuthController;