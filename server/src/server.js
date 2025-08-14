// Import required modules
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/databses.js';
import dotenv from 'dotenv';
import registrationRoutes from './routes/registrationRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { generalRateLimit } from './middleware/rateLimiter.js';

// Load environment variables
dotenv.config();

// Create Express app instance
const app = express();

// Get port from environment variables with fallback
const PORT = process.env.PORT || 5000;

// Add middleware
app.use(cors());
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
    timestamp: new Date().toISOString()
  });
});

// Root route for basic testing
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Event Hosting Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health'
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
