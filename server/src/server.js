// Load environment variables FIRST, before any other imports
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file IMMEDIATELY, before importing any other modules
import dotenv from 'dotenv';
const envPath = join(__dirname, '../.env');
console.log('🔍 Looking for .env file at:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('❌ Error loading .env file:', result.error.message);
} else {
  console.log('✅ .env file loaded successfully');
  console.log('🔑 Environment variables loaded:');
  console.log('  - PORT:', process.env.PORT || 'NOT SET');
  console.log('  - NODE_ENV:', process.env.NODE_ENV || 'NOT SET');
}

// NOW import other modules (config.js will see the environment variables)
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

// Test registration endpoint for debugging
app.post('/api/test-registration', (req, res) => {
  console.log('🧪 Test registration endpoint hit:', req.body);
  res.status(200).json({
    success: true,
    message: 'Test endpoint working',
    receivedData: req.body,
    timestamp: new Date().toISOString()
  });
});

// PayU payment confirmation handler function
const handlePayUConfirmation = (req, res) => {
  console.log('💳 PayU payment confirmation received:', req.body);
  console.log('📍 Request URL:', req.originalUrl);
  console.log('🌐 Environment FRONTEND_URL:', process.env.FRONTEND_URL);
  
  try {
    const { status, txnid, amount, productinfo, firstname, email, phone } = req.body;
    
    // Always use production URL for PayU redirects (never localhost)
    const productionUrl = 'https://lg87playarena.netlify.app';
    
    if (status === 'success') {
      // Payment successful - redirect to frontend with success parameters
      const redirectUrl = `${productionUrl}/register?payment_status=success&txnid=${txnid}&amount=${amount}`;
      console.log('✅ Payment successful, redirecting to:', redirectUrl);
      return res.redirect(redirectUrl);
    } else {
      // Payment failed - redirect to frontend with failure parameters
      const redirectUrl = `${productionUrl}/register?payment_status=failed&txnid=${txnid}`;
      console.log('❌ Payment failed, redirecting to:', redirectUrl);
      return res.redirect(redirectUrl);
    }
  } catch (error) {
    console.error('❌ Error processing PayU confirmation:', error);
    const redirectUrl = `${productionUrl}/register?payment_status=error`;
    return res.redirect(redirectUrl);
  }
};

// PayU webhook endpoint for handling payment confirmations
app.post('/api/payu-webhook', express.urlencoded({ extended: true }), handlePayUConfirmation);

// PayU redirect endpoint (alternative URL that PayU might use)
app.post('/api/payu-redirect', express.urlencoded({ extended: true }), handlePayUConfirmation);

// Also handle GET requests (in case PayU sends GET instead of POST)
app.get('/api/payu-webhook', handlePayUConfirmation);
app.get('/api/payu-redirect', handlePayUConfirmation);

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
