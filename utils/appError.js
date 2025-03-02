/**
 * Custom error class for handling operational errors
 * Extends the built-in Error class
 */
class AppError extends Error {
    /**
     * Create a new AppError
     * @param {string} message - Error message
     * @param {number} statusCode - HTTP status code
     */
    constructor(message, statusCode) {
      super(message);
      
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      
      // All errors created with this class are considered operational errors
      // (i.e., errors we can anticipate and handle properly)
      this.isOperational = true;
      
      // Capture the stack trace, excluding the constructor call from the trace
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = AppError;