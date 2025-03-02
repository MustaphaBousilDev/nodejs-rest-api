const User = require('../models/User');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

// Helper function to create JWT
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Register new user
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already in use', 400));
  }
  
  // Create new user
  const newUser = await User.create({
    name,
    email,
    password
  });
  
  // Create JWT token
  const token = signToken(newUser._id);
  
  // Remove password from output
  newUser.password = undefined;
  
  res.status(201).json({
    status: 'success',
    token,
    data: { user: newUser }
  });
});
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    
    // Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }
    
    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }
    
    // If everything is OK, send token to client
    const token = signToken(user._id);
    user.password = undefined;
    
    res.status(200).json({
      status: 'success',
      token,
      data: { user }
    });
  });
  exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users }
    });
  });
  
  // Get user by ID
  exports.getUserById = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  });

  exports.updateUser = asyncHandler(async (req, res, next) => {
    // Prevent password updates through this route
    if (req.body.password) {
      return next(new AppError('This route is not for password updates', 400));
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  });

  exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  });

  exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  });

  exports.updateMe = asyncHandler(async (req, res, next) => {
    // Prevent password updates through this route
    if (req.body.password) {
      return next(new AppError('This route is not for password updates', 400));
    }
    
    // Filter unwanted fields that shouldn't be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      status: 'success',
      data: { user: updatedUser }
    });
  });
  
  const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
  };
  