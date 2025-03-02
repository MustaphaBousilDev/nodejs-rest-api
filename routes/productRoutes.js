const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// GET all products
router.get('/', productController.getAllProducts);

// GET a single product
router.get('/:id', productController.getProductById);

// POST create a new product (protected, admin only)
router.post('/', protect, restrictTo('admin'), productController.createProduct);

// PUT update a product (complete replacement)
router.put('/:id', protect, restrictTo('admin'), productController.updateProduct);

// PATCH update a product (partial update)
router.patch('/:id', protect, restrictTo('admin'), productController.patchProduct);

// DELETE a product
router.delete('/:id', protect, restrictTo('admin'), productController.deleteProduct);

// HEAD check if product exists
router.head('/:id', productController.headProduct);

// OPTIONS get available methods
router.options('/', productController.optionsProduct);
router.options('/:id', productController.optionsProduct);

module.exports = router;