// Import required modules
import User from '../models/User.js';

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const registerUser = async (req, res) => {
  try {
    // Simple validation - check if we have the required data
    if (!req.body || !req.body.user) {
      return res.status(400).json({
        success: false,
        message: 'Missing user data',
        error: 'MISSING_DATA'
      });
    }

    const userData = req.body.user;

    // Check if user with same email already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
        error: 'EMAIL_ALREADY_EXISTS'
      });
    }

    // Create new user document
    const newUser = new User(userData);
    
    // Save user to database
    const savedUser = await newUser.save();
    
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

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: userResponse
    });

  } catch (error) {
    // Handle database errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
        error: 'DUPLICATE_EMAIL'
      });
    }

    // Handle other errors
    console.error('❌ Registration error:', error);
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
    // Fetch all users from database
    const users = await User.find({}).sort({ createdAt: -1 });
    
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
