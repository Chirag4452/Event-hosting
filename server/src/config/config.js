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
      return process.env.FRONTEND_URL || 'http://localhost:5173';
    },
    credentials: true
  },
  
  // Razorpay configuration - DYNAMIC GETTERS
  razorpay: {
    get keyId() {
      const value = process.env.RAZORPAY_KEY_ID || '';
      console.log('🔑 Getting Razorpay keyId:', value ? 'SET' : 'NOT SET');
      return value;
    },
    get keySecret() {
      const value = process.env.RAZORPAY_KEY_SECRET || '';
      console.log('🔑 Getting Razorpay keySecret:', value ? 'SET' : 'NOT SET');
      return value;
    }
  }
};

export default config;
