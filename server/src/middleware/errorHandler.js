/**
 * Global error handler middleware
 * Handles different types of errors and sends appropriate responses
 */
export const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Handle Zod validation errors
  if (err.name === 'ZodError') {
    const validationErrors = err.errors.map(error => ({
      field: error.path.join('.'),
      message: error.message,
      code: error.code
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: validationErrors,
      error: 'VALIDATION_ERROR'
    });
  }

  // Handle MongoDB duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
      error: 'DUPLICATE_KEY',
      field: field
    });
  }

  // Handle MongoDB validation errors
  if (err.name === 'ValidationError') {
    const validationErrors = Object.values(err.errors).map(error => ({
      field: error.path,
      message: error.message
    }));

    return res.status(400).json({
      success: false,
      message: 'Database validation failed',
      errors: validationErrors,
      error: 'DB_VALIDATION_ERROR'
    });
  }

  // Handle MongoDB cast errors (invalid ObjectId, etc.)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid data format',
      error: 'CAST_ERROR',
      field: err.path
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: 'INVALID_TOKEN'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
      error: 'TOKEN_EXPIRED'
    });
  }

  // Handle general errors
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message: message,
    error: 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
