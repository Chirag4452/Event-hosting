/**
 * Validation middleware using Zod schemas
 * @param {Object} schema - Zod schema for validation
 * @returns {Function} Express middleware function
 */
export const validateSchema = (schema) => {
  return (req, res, next) => {
    try {
      // Validate request body against the provided schema
      const validatedData = schema.parse(req.body);
      
      // Replace req.body with validated data
      req.body = validatedData;
      
      // Continue to next middleware/route handler
      next();
      
    } catch (error) {
      // Handle Zod validation errors
      if (error.name === 'ZodError') {
        const validationErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors,
          error: 'VALIDATION_ERROR'
        });
      }
      
      // Handle unexpected errors
      console.error('Validation middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal validation error',
        error: 'INTERNAL_ERROR'
      });
    }
  };
};
