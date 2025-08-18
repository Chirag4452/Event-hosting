// Configuration file with dynamic values that read from environment at runtime
const config = {
  // Server configuration
  get port() {
    return process.env.PORT || 5000;
  },
  
  // MongoDB configuration
  mongodb: {
    get uri() {
      return process.env.MONGODB_URI || 'mongodb+srv://Christopher:Z38UZkon7oC3Ckv9@cluster0.4bebqgh.mongodb.net/Event-registration';
    },
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  },
  
  // Environment
  get env() {
    return process.env.NODE_ENV || 'development';
  },
  
  // CORS configuration
  cors: {
    get origin() {
      // Allow multiple origins for development and production
      const allowedOrigins = [
        // Production URLs - PRIORITY FOR PRODUCTION
        'https://lg87playarena.netlify.app',  // Current Production Netlify
        process.env.FRONTEND_URL,  // Custom domain from environment
        // Development URLs - COMMENT OUT FOR PRODUCTION
        // 'http://localhost:5173',  // Development - React dev server
        // 'http://localhost:3000',  // Alternative React dev server port
      ].filter(Boolean); // Remove undefined values
      
      return allowedOrigins;
    },
    credentials: true
  }
};

export default config;
