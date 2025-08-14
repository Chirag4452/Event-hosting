// Import required modules
import User from '../models/User.js';
import { userSchema } from '../schemas/userSchemas.js';

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const registerUser = async (req, res) => {
  try {
    // Validate incoming request body using Zod schema
    const validatedData = userSchema.parse(req.body);
    
    // Check if user with same email already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
        error: 'EMAIL_ALREADY_EXISTS'
      });
    }

    // Create new user document with validated data
    const newUser = new User(validatedData);
    
    // Save user to database
    const savedUser = await newUser.save();
    
    // Return success response with user data (exclude sensitive info)
    const userResponse = {
      id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      parentName: savedUser.parentName,
      parentPhone: savedUser.parentPhone,
      grade: savedUser.grade,
      createdAt: savedUser.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: userResponse
    });

  } catch (error) {
    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      const validationErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
        error: 'VALIDATION_ERROR'
      });
    }

    // Handle database errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
        error: 'DUPLICATE_EMAIL'
      });
    }

    // Handle other errors
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'INTERNAL_ERROR'
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
      parentName: user.parentName,
      parentPhone: user.parentPhone,
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
    console.error('Get all registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve registrations',
      error: 'INTERNAL_ERROR'
    });
  }
};
