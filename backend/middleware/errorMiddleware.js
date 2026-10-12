/**
 * Centralized error handling middleware for CareerSense Backend
 * Ensures all API errors return consistent JSON responses instead of default HTML error pages.
 * Handles standard HTTP errors, Mongoose ValidationErrors, CastErrors, and Duplicate Key errors.
 */

// Handle requests targeting non-existent API routes (404 Not Found)
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global error handler for uncaught runtime exceptions and custom errors
export const errorHandler = (err, req, res, _next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose CastError (e.g. invalid MongoDB ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found or invalid ID format: '${err.value}' for field '${err.path}'`;
  }

  // Handle Mongoose ValidationError (e.g. schema requirement or enum validation failure)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const validationErrors = Object.values(err.errors).map((val) => val.message);
    message = `Validation Error: ${validationErrors.join(', ')}`;
  }

  // Handle MongoDB Duplicate Key Error (E11000)
  if (err.code === 11000) {
    statusCode = 400;
    const duplicatedField = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value entered for ${duplicatedField}. Must be unique.`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Include stack trace only in development mode for viva/debugging
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
