const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Authentication routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.use(protect);

// Current user routes
router.get('/me', userController.getMe);
router.patch('/updateMe', userController.updateMe);

// Admin routes
router.use(restrictTo('admin'));
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;