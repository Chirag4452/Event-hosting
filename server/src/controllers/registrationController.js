// Import required modules
import User from '../models/User.js';

/**
 * Register a new user with payment information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const registerUser = async (req, res) => {
  try {
    // Validate request body structure
    if (!req.body || !req.body.user || !req.body.payment) {
      return res.status(400).json({
        success: false,
        message: 'Missing user data or payment information',
        error: 'MISSING_DATA'
      });
    }

    const { user: userData, payment: paymentData } = req.body;

    // Check if user with same email already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
        error: 'EMAIL_ALREADY_EXISTS'
      });
    }

    // Prepare user data with payment information
    const userDataWithPayment = {
      ...userData,
      payment_details: {
        payment_id: paymentData.payment_id,
        order_id: paymentData.order_id,
        amount_paid: paymentData.amount_paid,
        currency: paymentData.currency || 'INR',
        payment_status: paymentData.payment_status || 'completed',
        payment_method: paymentData.payment_method,
        verified_at: paymentData.verified_at ? new Date(paymentData.verified_at) : new Date(),
      },
      registration_status: 'confirmed', // Set to confirmed after successful payment
    };

    // Create new user document
    const newUser = new User(userDataWithPayment);
    
    // Save user to database
    const savedUser = await newUser.save();
    
    console.log('✅ User registered successfully with payment:', savedUser._id);
    
    // Return success response
    const userResponse = {
      id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      parent_name: savedUser.parent_name,
      parent_phone: savedUser.parent_phone,
      grade: savedUser.grade,
      category: savedUser.category,
      payment_details: {
        payment_id: savedUser.payment_details.payment_id,
        amount_paid: savedUser.payment_details.amount_paid,
        payment_status: savedUser.payment_details.payment_status,
      },
      registration_status: savedUser.registration_status,
      createdAt: savedUser.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully with payment confirmation',
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
