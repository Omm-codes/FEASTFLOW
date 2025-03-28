import { pool } from '../config/db.js';

const User = {
  findByEmail: async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },
  
  create: async (userData) => {
    const { name, email, password, phone } = userData;
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
      [name, email, password, phone]
    );
    return result.insertId;
  },
  
  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }
};

export default User;