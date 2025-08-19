// Import required modules
import User from '../models/User.js';

/**
 * Register a new user with payment information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const registerUser = async (req, res) => {
  try {
    console.log('📝 Registration request received:', {
      body: req.body,
      hasUser: !!req.body?.user,
      hasPayment: !!req.body?.payment
    });

    // Validate request body structure
    if (!req.body || !req.body.user || !req.body.payment) {
      console.log('❌ Missing data in request:', {
        body: req.body,
        user: req.body?.user,
        payment: req.body?.payment
      });
      return res.status(400).json({
        success: false,
        message: 'Missing user data or payment information',
        error: 'MISSING_DATA'
      });
    }

    const { user: userData, payment: paymentData } = req.body;
    console.log('👤 User data:', userData);
    console.log('💳 Payment data:', paymentData);

    // Allow duplicate emails - users can register multiple times with same email

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

    console.log('📋 Prepared user data with payment:', userDataWithPayment);

    // Create new user document
    const newUser = new User(userDataWithPayment);
    console.log('🆕 Created user document:', newUser);
    
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
    console.error('❌ Registration error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name
    });

    // Handle database errors
    if (error.code === 11000) {
      // Handle other unique constraint violations (not email since we allow duplicate emails)
      console.error('❌ Database unique constraint violation:', error);
      return res.status(400).json({
        success: false,
        message: 'A database constraint violation occurred',
        error: 'CONSTRAINT_VIOLATION'
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      console.error('❌ Validation error:', error.errors);
      return res.status(400).json({
        success: false,
        message: 'Data validation failed',
        error: 'VALIDATION_ERROR',
        details: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
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
