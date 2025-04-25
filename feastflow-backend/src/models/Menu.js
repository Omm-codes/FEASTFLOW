import { pool } from '../config/db.js';

const Menu = {
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM menu_items');
    return rows;
  },
  
  getById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM menu_items WHERE id = ?', [id]);
    return rows[0];
  },
  
  create: async (menuData) => {
    const { name, description, price, category, image } = menuData;
    const [result] = await pool.query(
      'INSERT INTO menu_items (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, category, image]
    );
    return result.insertId;
  },
  
  update: async (id, menuData) => {
    const { name, description, price, category, image, available } = menuData;
    const [result] = await pool.query(
      'UPDATE menu_items SET name = ?, description = ?, price = ?, category = ?, image = ?, available = ? WHERE id = ?',
      [name, description, price, category, image, available, id]
    );
    return result.affectedRows > 0;
  },
  
  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM menu_items WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

export default Menu;