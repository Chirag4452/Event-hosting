import mongoose from "mongoose";

// Database connection function
const connectDB = async () => {
  try {
    // Get MongoDB URI from environment variables
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    // Connect to MongoDB
    const conn = await mongoose.connect(mongoURI, {
      // MongoDB connection options for better performance and reliability
      maxPoolSize: 10, // Maximum number of connections in the pool
      serverSelectionTimeoutMS: 5000, // Timeout for server selection
      socketTimeoutMS: 45000, // Socket timeout
    });

    console.log(`✅ MongoDB connected successfully: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
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

