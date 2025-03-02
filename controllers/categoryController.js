const Category = require('../models/Category');
const Product = require('../models/Product');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

// Get all categories
exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  
  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: { categories }
  });
});

// Get category by ID
exports.getCategoryById = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  
  if (!category) {
    return next(new AppError('Category not found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: { category }
  });
});

// Create new category
exports.createCategory = asyncHandler(async (req, res) => {
  const newCategory = await Category.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: { category: newCategory }
  });
});

// Update category
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!category) {
    return next(new AppError('Category not found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: { category }
  });
});

// Delete category
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  
  if (!category) {
    return next(new AppError('Category not found', 404));
  }
  
  // Check if category is in use
  const productsWithCategory = await Product.countDocuments({ category: req.params.id });
  if (productsWithCategory > 0) {
    return next(new AppError(`Cannot delete category that is used by ${productsWithCategory} products`, 400));
  }
  
  await Category.findByIdAndDelete(req.params.id);
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get products by category
exports.getProductsByCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  
  if (!category) {
    return next(new AppError('Category not found', 404));
  }
  
  const products = await Product.find({ category: req.params.id });
  
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: { products }
  });
});