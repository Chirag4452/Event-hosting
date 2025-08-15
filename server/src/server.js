// Import required modules
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/databses.js';
import config from './config/config.js';
import registrationRoutes from './routes/registrationRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { generalRateLimit } from './middleware/rateLimiter.js';

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

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.env,
    port: PORT
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Event Hosting Server',
    version: '1.0.0',
    environment: config.env,
    endpoints: {
      health: '/api/health',
      register: '/api/register',
      registrations: '/api/registrations'
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
