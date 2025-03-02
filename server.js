const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connection established'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');


// Use routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
// Documentation route
app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to RESTful API Mastery',
      endpoints: {
        products: '/api/products',
        categories: '/api/categories',
        users: '/api/users'
      },
      documentation: 'https://github.com/yourusername/rest-api-example/docs'
    });
  });
// 404 Route
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

// Basic root route
app.get('/', (req, res) => {
  res.send('Welcome to the REST API');
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      status: 'error',
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
