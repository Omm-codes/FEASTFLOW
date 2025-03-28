import express from 'express';
import MenuController from '../controllers/menuController.js';

const router = express.Router();
const menuController = new MenuController();

// Route to get all menu items
router.get('/', menuController.getAllMenuItems);

// Route to get a single menu item by ID
router.get('/:id', menuController.getMenuItemById);

// Route to create a new menu item
router.post('/', menuController.createMenuItem);

// Route to update an existing menu item by ID
router.put('/:id', menuController.updateMenuItem);

// Route to delete a menu item by ID
router.delete('/:id', menuController.deleteMenuItem);

export default router;