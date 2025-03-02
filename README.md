# RESTful API Mastery

A comprehensive Node.js RESTful API implementation demonstrating best practices and full HTTP method support.

![API Banner](https://via.placeholder.com/1200x300?text=RESTful+API+Mastery)

## Features

- ✅ Complete implementation of all HTTP methods (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS)
- ✅ JWT Authentication & Authorization
- ✅ Advanced filtering, sorting, field selection, and pagination
- ✅ Comprehensive error handling with custom AppError class
- ✅ MongoDB integration with Mongoose
- ✅ Model relationships and referencing
- ✅ Security best practices
- ✅ Middleware architecture
- ✅ Environment-based configuration

## Table of Contents

- [RESTful API Mastery](#restful-api-mastery)
  - [Features](#features)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [API Documentation](#api-documentation)
    - [Base URL](#base-url)
    - [Authentication](#authentication)
      - [Example Register Request:](#example-register-request)
      - [Example Login Request:](#example-login-request)
      - [Authentication Response:](#authentication-response)
    - [Products](#products)
      - [Example Product Object:](#example-product-object)
    - [Categories](#categories)
      - [Example Category Object:](#example-category-object)
    - [Users](#users)
  - [HTTP Methods](#http-methods)
  - [Query Parameters](#query-parameters)
    - [Filtering](#filtering)
    - [Sorting](#sorting)
    - [Field Selection](#field-selection)
    - [Pagination](#pagination)
  - [Response Formats](#response-formats)
    - [Success Response](#success-response)
    - [Error Response](#error-response)
  - [Error Handling](#error-handling)
  - [Testing](#testing)
  - [Deployment](#deployment)
    - [Prerequisites](#prerequisites)
    - [Deployment Steps](#deployment-steps)
    - [Docker Deployment](#docker-deployment)
  - [Contributing](#contributing)
  - [License](#license)

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/restful-api-mastery.git
cd restful-api-mastery

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the server
npm start

# For development with auto-restart
npm run dev
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/restful-api-mastery
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_should_be_at_least_32_chars_long
JWT_EXPIRES_IN=90d
```

## API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/users/register` | POST | Register a new user |
| `/users/login` | POST | Login and get JWT token |

#### Example Register Request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Example Login Request:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Authentication Response:

```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "60a1b2c3d4e5f6a7b8c9d0e1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2023-05-15T10:30:45.123Z"
    }
  }
}
```

### Products

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| `/products` | GET | Get all products | No |
| `/products/:id` | GET | Get a specific product | No |
| `/products` | POST | Create a product | Yes (Admin) |
| `/products/:id` | PUT | Replace a product | Yes (Admin) |
| `/products/:id` | PATCH | Update a product | Yes (Admin) |
| `/products/:id` | DELETE | Delete a product | Yes (Admin) |
| `/products/:id` | HEAD | Check if product exists | No |
| `/products` | OPTIONS | Get available methods | No |

#### Example Product Object:

```json
{
  "_id": "60a1b2c3d4e5f6a7b8c9d0e1",
  "name": "Smartphone",
  "description": "Latest model with advanced features",
  "price": 999.99,
  "category": "60a1b2c3d4e5f6a7b8c9d0e2",
  "inStock": true,
  "quantity": 50,
  "imageUrl": "smartphone.jpg",
  "createdAt": "2023-05-15T10:30:45.123Z",
  "updatedAt": "2023-05-15T10:30:45.123Z",
  "isLowStock": false
}
```

### Categories

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| `/categories` | GET | Get all categories | No |
| `/categories/:id` | GET | Get a specific category | No |
| `/categories` | POST | Create a category | Yes (Admin) |
| `/categories/:id` | PUT | Update a category | Yes (Admin) |
| `/categories/:id` | DELETE | Delete a category | Yes (Admin) |
| `/categories/:id/products` | GET | Get products in a category | No |

#### Example Category Object:

```json
{
  "_id": "60a1b2c3d4e5f6a7b8c9d0e2",
  "name": "Electronics",
  "description": "Electronic devices and gadgets",
  "createdAt": "2023-05-15T10:30:45.123Z"
}
```

### Users

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| `/users/me` | GET | Get current user | Yes |
| `/users/updateMe` | PATCH | Update current user | Yes |
| `/users` | GET | Get all users | Yes (Admin) |
| `/users/:id` | GET | Get a specific user | Yes (Admin) |
| `/users/:id` | PATCH | Update a user | Yes (Admin) |
| `/users/:id` | DELETE | Delete a user | Yes (Admin) |

## HTTP Methods

This API implements all standard HTTP methods:

- **GET**: Retrieve resources
- **POST**: Create new resources
- **PUT**: Replace resources completely
- **PATCH**: Update resources partially
- **DELETE**: Remove resources
- **HEAD**: Check if resources exist (similar to GET but without response body)
- **OPTIONS**: Get available methods for resources

## Query Parameters

The API supports advanced query parameters:

### Filtering

```
/api/products?price[gte]=100&category=60a1b2c3d4e5f6a7b8c9d0e2
```

Operators: 
- `[eq]`: Equal to
- `[gt]`: Greater than
- `[gte]`: Greater than or equal to
- `[lt]`: Less than
- `[lte]`: Less than or equal to
- `[ne]`: Not equal to

### Sorting

```
/api/products?sort=price,-createdAt
```

- Use comma-separated fields
- Prefix with `-` for descending order

### Field Selection

```
/api/products?fields=name,price,category
```

- Use comma-separated fields to include only specific fields

### Pagination

```
/api/products?page=2&limit=10
```

- `page`: Page number (default: 1)
- `limit`: Number of items per page (default: 100)

## Response Formats

All API responses follow a consistent format:

### Success Response

```json
{
  "status": "success",
  "results": 10,  // Only for array results
  "data": {
    "products": [
      // Array of products
    ]
  }
}
```

### Error Response

```json
{
  "status": "fail",
  "message": "Product not found"
}
```

## Error Handling

The API uses a centralized error handling mechanism:

- **400**: Bad Request - Invalid input
- **401**: Unauthorized - Authentication required
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource doesn't exist
- **500**: Internal Server Error - Server issue

## Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --grep="Product API"
```

## Deployment

### Prerequisites

- Node.js (v14+)
- MongoDB (v4+)

### Deployment Steps

1. Clone the repository
2. Install dependencies: `npm install --production`
3. Set up environment variables
4. Start the server: `npm start`

### Docker Deployment

```bash
# Build Docker image
docker build -t restful-api-mastery .

# Run Docker container
docker run -p 5000:5000 --env-file .env restful-api-mastery
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Your Name](https://github.com/yourusername)