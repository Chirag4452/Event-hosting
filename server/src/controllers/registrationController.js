// Import required modules
import User from '../models/User.js';

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const registerUser = async (req, res) => {
  try {
    console.log('🔍 Registration request received:', {
      body: req.body,
      bodyType: typeof req.body,
      bodyKeys: req.body ? Object.keys(req.body) : 'undefined'
    });

    // Simple validation - check if we have the required data
    if (!req.body || !req.body.user) {
      console.log('❌ Missing user data in request');
      return res.status(400).json({
        success: false,
        message: 'Missing user data',
        error: 'MISSING_DATA'
      });
    }

    const userData = req.body.user;
    console.log('🔍 User data extracted:', userData);

    // Check if user with same email already exists
    console.log('🔍 Checking for existing user with email:', userData.email);
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      console.log('❌ User already exists:', existingUser.email);
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
        error: 'EMAIL_ALREADY_EXISTS'
      });
    }

    // Create new user document
    console.log('🔍 Creating new user document...');
    const newUser = new User(userData);
    console.log('✅ User document created:', newUser);
    
    // Save user to database
    console.log('🔍 Saving user to database...');
    const savedUser = await newUser.save();
    console.log('✅ User saved successfully:', savedUser);
    
    // Return success response
    const userResponse = {
      id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      parent_name: savedUser.parent_name,
      parent_phone: savedUser.parent_phone,
      grade: savedUser.grade,
      createdAt: savedUser.createdAt
    };

    console.log('✅ Registration successful, sending response');
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: userResponse
    });

  } catch (error) {
    console.error('💥 Registration error occurred:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    // Handle database errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
        error: 'DUPLICATE_EMAIL'
      });
    }

    // Handle other errors
    console.error('❌ Unexpected registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'INTERNAL_ERROR',
      details: error.message
    });
  }
};

/**
 * Get all user registrations (for admin purposes)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllRegistrations = async (req, res) => {
  try {
    console.log('🔍 Getting all registrations...');
    
    // Fetch all users from database
    const users = await User.find({}).sort({ createdAt: -1 });
    console.log(`✅ Found ${users.length} users`);
    
    // Map users to exclude sensitive info if needed
    const userList = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      parent_name: user.parent_name,
      parent_phone: user.parent_phone,
      grade: user.grade,
      createdAt: user.createdAt
    }));

    res.status(200).json({
      success: true,
      message: 'Registrations retrieved successfully',
      count: userList.length,
      data: userList
    });

  } catch (error) {
    console.error('❌ Get all registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve registrations',
      error: 'INTERNAL_ERROR'
    });
  }
};
