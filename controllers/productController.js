const asyncHandler = require('../utils/asyncHandler');
const Product = require('../models/Product')
const AppError = require('../utils/appError')
exports.getAllProducts = asyncHandler(async (req, res) => {
    // FILTERING
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);
  
    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
    
    let query = Product.find(JSON.parse(queryStr)).populate('category');
  
    // SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt'); // Default sort
    }
  
    // FIELD LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v'); // Exclude __v field by default
    }
  
    // PAGINATION
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
  
    // Execute query
    const products = await query;
    
    // Send response
    res.status(200).json({
      status: 'success',
      results: products.length,
      data: { products }
    });
  });
  
  // GET - Get a single product by ID
  exports.getProductById = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('category');
    
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: { product }
    });
  });
  
  // POST - Create a new product
  exports.createProduct = asyncHandler(async (req, res) => {
    const newProduct = await Product.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: { product: newProduct }
    });
  });
  
  // PUT - Update a product (complete replacement)
  exports.updateProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: { product }
    });
  });
  
  // PATCH - Update a product (partial update)
  exports.patchProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: { product }
    });
  });
  
  // DELETE - Delete a product
  exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  });
  
  // HEAD - Check if product exists (similar to GET but without response body)
  exports.headProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.exists({ _id: req.params.id });
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
    res.status(200).end();
  });
  
  // OPTIONS - Get available methods for product resource
  exports.optionsProduct = (req, res) => {
    res.setHeader('Allow', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');
    res.status(200).end();
  };
  