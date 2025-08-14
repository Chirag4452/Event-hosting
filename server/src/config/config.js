// Configuration file with default values for development
const config = {
  // Server configuration
  port: process.env.PORT || 5000,
  
  // MongoDB configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb+srv://Christopher:Z38UZkon7oC3Ckv9@cluster0.4bebqgh.mongodb.net/Event-registration',
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  },
  
  // Environment
  env: process.env.NODE_ENV || 'development',
  
  // CORS configuration
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }
};

export default config;
