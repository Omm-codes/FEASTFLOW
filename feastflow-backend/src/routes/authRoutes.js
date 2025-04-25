import express from 'express';
import { register, login, registerAdmin, createInitialAdmin } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/register-admin', registerAdmin);
router.post('/create-admin', createInitialAdmin);

export default router;