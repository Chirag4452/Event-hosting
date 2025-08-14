import mongoose from "mongoose";
import config from "./config.js";

// Database connection function
const connectDB = async () => {
  try {
    // Get MongoDB URI from config (with fallback to environment variable)
    const mongoURI = config.mongodb.uri;
    
    if (!mongoURI) {
      throw new Error('MongoDB URI is not configured');
    }

    // Connect to MongoDB using config options
    const conn = await mongoose.connect(mongoURI, config.mongodb.options);

    console.log(`✅ MongoDB connected successfully: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Connection URI: ${mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    
    // Provide helpful error messages
    if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Make sure MongoDB is running on your system');
      console.error('💡 Or install MongoDB: https://docs.mongodb.com/manual/installation/');
    } else if (error.message.includes('authentication failed')) {
      console.error('💡 Check your MongoDB username and password');
    }
    
    // Exit process with failure code
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('🔄 MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during MongoDB connection closure:', err);
    process.exit(1);
  }
});

export default connectDB;

