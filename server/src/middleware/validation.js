/**
 * Validation middleware using Zod schemas
 * @param {Object} schema - Zod schema for validation
 * @returns {Function} Express middleware function
 */
export const validateSchema = (schema) => {
  return (req, res, next) => {
    try {
      console.log('🔍 Validation middleware - Request body:', {
        body: req.body,
        bodyType: typeof req.body,
        bodyKeys: req.body ? Object.keys(req.body) : 'undefined',
        schemaType: typeof schema,
        schemaName: schema.constructor.name
      });

      // Validate request body against the provided schema
      console.log('🔍 Attempting to validate with schema...');
      const validatedData = schema.parse(req.body);
      console.log('✅ Validation successful:', validatedData);
      
      // Replace req.body with validated data
      req.body = validatedData;
      console.log('✅ Request body updated with validated data');
      
      // Continue to next middleware/route handler
      next();
      
    } catch (error) {
      console.error('💥 Validation middleware error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });

      // Handle Zod validation errors
      if (error.name === 'ZodError') {
        console.log('🔍 Zod validation error details:', error.errors);
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
      console.error('❌ Unexpected validation error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal validation error',
        error: 'INTERNAL_ERROR',
        details: error.message
      });
    }
  };
};
