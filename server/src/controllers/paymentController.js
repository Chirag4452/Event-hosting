// Import required modules
import { getRazorpay, getRegistrationFee, paiseToRupees, PAYMENT_CONFIG } from '../config/payment.js';
import crypto from 'crypto';
import config from '../config/config.js';

/**
 * Create a Razorpay order for registration payment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createPaymentOrder = async (req, res) => {
  try {
    const { category, user_email, user_name } = req.body;

    // Validate required fields
    if (!category || !user_email || !user_name) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: category, user_email, user_name',
        error: 'MISSING_FIELDS'
      });
    }

    // Get registration fee based on category
    const amountInPaise = getRegistrationFee(category);
    const amountInRupees = paiseToRupees(amountInPaise);

    // Create order options
    const orderOptions = {
      amount: amountInPaise, // Amount in paise
      currency: PAYMENT_CONFIG.currency,
      receipt: `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      notes: {
        ...PAYMENT_CONFIG.options.notes,
        category: category,
        user_email: user_email,
        user_name: user_name,
      },
    };

    console.log('🚀 Creating Razorpay order:', orderOptions);

    // Get Razorpay instance when needed
    const razorpay = getRazorpay();
    // Create order with Razorpay
    const order = await razorpay.orders.create(orderOptions);

    console.log('✅ Razorpay order created:', order);

    // Prepare response data
    const responseData = {
      order_id: order.id,
      amount: amountInPaise,
      amount_display: `₹${amountInRupees}`,
      currency: order.currency,
      category: category,
      key_id: config.razorpay.keyId,
      // Include payment options for frontend
      options: {
        ...PAYMENT_CONFIG.options,
        order_id: order.id,
        amount: amountInPaise,
        prefill: {
          email: user_email,
          name: user_name,
        },
      },
    };

    res.status(201).json({
      success: true,
      message: 'Payment order created successfully',
      data: responseData
    });

  } catch (error) {
    console.error('❌ Create payment order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: 'PAYMENT_ORDER_FAILED',
      details: error.message
    });
  }
};

/**
 * Verify Razorpay payment signature
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      user_data 
    } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification data',
        error: 'MISSING_PAYMENT_DATA'
      });
    }

    // Create signature verification string
    const signatureString = `${razorpay_order_id}|${razorpay_payment_id}`;
    
    // Generate expected signature
    const expectedSignature = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(signatureString)
      .digest('hex');

    console.log('🔐 Verifying payment signature:');
    console.log('Expected:', expectedSignature);
    console.log('Received:', razorpay_signature);

    // Verify signature
    if (expectedSignature !== razorpay_signature) {
      console.error('❌ Payment signature verification failed');
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed - invalid signature',
        error: 'SIGNATURE_VERIFICATION_FAILED'
      });
    }

    // Fetch payment details from Razorpay for additional verification
    let paymentDetails;
    try {
      // Get Razorpay instance when needed
      const razorpay = getRazorpay();
      paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
      console.log('💳 Payment details fetched:', paymentDetails);
    } catch (fetchError) {
      console.error('❌ Failed to fetch payment details:', fetchError);
      return res.status(500).json({
        success: false,
        message: 'Failed to verify payment with Razorpay',
        error: 'PAYMENT_FETCH_FAILED'
      });
    }

    // Additional verification checks
    if (paymentDetails.status !== 'captured') {
      return res.status(400).json({
        success: false,
        message: 'Payment not captured successfully',
        error: 'PAYMENT_NOT_CAPTURED'
      });
    }

    if (paymentDetails.order_id !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: 'Order ID mismatch',
        error: 'ORDER_ID_MISMATCH'
      });
    }

    console.log('✅ Payment verification successful');

    // Return payment verification success with payment details
    const verificationData = {
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      amount_paid: paymentDetails.amount,
      amount_display: `₹${paiseToRupees(paymentDetails.amount)}`,
      currency: paymentDetails.currency,
      status: paymentDetails.status,
      method: paymentDetails.method,
      verified_at: new Date().toISOString(),
      payment_details: {
        fee: paymentDetails.fee,
        tax: paymentDetails.tax,
        created_at: new Date(paymentDetails.created_at * 1000).toISOString(),
      }
    };

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: verificationData
    });

  } catch (error) {
    console.error('❌ Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: 'VERIFICATION_ERROR',
      details: error.message
    });
  }
};

/**
 * Get payment fee information for a category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getPaymentInfo = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required',
        error: 'MISSING_CATEGORY'
      });
    }

    const amountInPaise = getRegistrationFee(category);
    const amountInRupees = paiseToRupees(amountInPaise);

    const paymentInfo = {
      category: category,
      amount: amountInPaise,
      amount_display: `₹${amountInRupees}`,
      currency: PAYMENT_CONFIG.currency,
      description: `Registration fee for ${category} category`,
    };

    res.status(200).json({
      success: true,
      message: 'Payment information retrieved successfully',
      data: paymentInfo
    });

  } catch (error) {
    console.error('❌ Get payment info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment information',
      error: 'PAYMENT_INFO_ERROR'
    });
  }
};
