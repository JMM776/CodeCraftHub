const ApiResponse = require('../utils/apiResponse');

// Centralized error handler
const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return ApiResponse.error(res, 'Validation error', 400, messages);
  }

  // Handle duplicate key error
  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return ApiResponse.error(res, `${field} already exists`, 400);
  }

  // Default to 500 server error
  ApiResponse.error(res, err.message || 'Internal Server Error', 500);
};

module.exports = errorMiddleware;