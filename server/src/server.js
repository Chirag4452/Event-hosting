// Import required modules
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/databses.js';
import config from './config/config.js';
import dotenv from 'dotenv';
import registrationRoutes from './routes/registrationRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { generalRateLimit } from './middleware/rateLimiter.js';
import { registrationSchema } from './schemas/userSchemas.js';
import User from './models/User.js';

// Load environment variables
dotenv.config();

// Create Express app instance
const app = express();

// Get port from config
const PORT = config.port;

// Add middleware
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet());
app.use(express.json());

// Apply general rate limiting to all routes
app.use(generalRateLimit);

// Use routes
app.use('/api', registrationRoutes);

// Basic test route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.env,
    port: PORT
  });
});

// Test registration endpoint (for debugging)
app.post('/api/test-register', (req, res) => {
  console.log('Test registration request body:', req.body);
  res.status(200).json({
    success: true,
    message: 'Test endpoint working',
    receivedData: req.body
  });
});

// Test schema validation endpoint
app.post('/api/test-schema', (req, res) => {
  try {
    console.log('Testing schema validation with:', req.body);
    const validated = registrationSchema.parse(req.body);
    res.status(200).json({
      success: true,
      message: 'Schema validation passed',
      validatedData: validated
    });
  } catch (error) {
    console.error('Schema validation failed:', error);
    res.status(400).json({
      success: false,
      message: 'Schema validation failed',
      error: error.message,
      details: error.errors || 'No detailed errors'
    });
  }
});

// Test User model endpoint
app.post('/api/test-model', async (req, res) => {
  try {
    console.log('Testing User model with:', req.body);
    
    // Test creating a user document
    const testUser = new User(req.body.user || req.body);
    console.log('User document created:', testUser);
    
    // Test validation without saving
    const validationResult = testUser.validateSync();
    if (validationResult) {
      console.log('Validation errors:', validationResult);
      return res.status(400).json({
        success: false,
        message: 'Model validation failed',
        errors: validationResult.errors
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User model test passed',
      userDocument: {
        name: testUser.name,
        email: testUser.email,
        parent_name: testUser.parent_name,
        parent_phone: testUser.parent_phone,
        grade: testUser.grade
      }
    });
  } catch (error) {
    console.error('User model test failed:', error);
    res.status(500).json({
      success: false,
      message: 'User model test failed',
      error: error.message
    });
  }
});

// Root route for basic testing
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Event Hosting Server',
    version: '1.0.0',
    environment: config.env,
    endpoints: {
      health: '/api/health',
      register: '/api/register',
      registrations: '/api/registrations',
      testRegister: '/api/test-register',
      testSchema: '/api/test-schema',
      testModel: '/api/test-model'
    }
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handling middleware (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📍 Base URL: http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${config.env}`);
      console.log(`🔗 Frontend URL: ${config.cors.origin}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
