// Payment utility functions for Razorpay integration
import type { 
  PaymentOrderRequest, 
  PaymentVerificationRequest, 
  RazorpayResponse, 
  UserRegistrationData,
  PaymentOrderResponse,
  PaymentVerificationResponse 
} from '../services/api';
import { createPaymentOrder, verifyPayment } from '../services/api';

// Declare Razorpay on window object
declare global {
  interface Window {
    Razorpay: unknown;
  }
}

/**
 * Load Razorpay script dynamically
 * @returns {Promise<boolean>} Promise that resolves when script is loaded
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Create payment order and initiate Razorpay checkout
 * @param {UserRegistrationData} userData - User registration data
 * @param {Function} onSuccess - Success callback function
 * @param {Function} onError - Error callback function
 */
export const initiatePayment = async (
  userData: UserRegistrationData,
  onSuccess: (paymentData: PaymentVerificationResponse) => void,
  onError: (error: string) => void
): Promise<void> => {
  try {
    // Load Razorpay script
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      onError('Failed to load payment gateway. Please try again.');
      return;
    }

    // Create payment order
    const orderRequest: PaymentOrderRequest = {
      category: userData.category,
      user_email: userData.email,
      user_name: userData.name,
    };

    console.log('🚀 Creating payment order:', orderRequest);

    const orderResponse = await createPaymentOrder(orderRequest);
    const orderData: PaymentOrderResponse = orderResponse.data.data;

    console.log('✅ Payment order created:', orderData);

    // Configure Razorpay options
    const razorpayOptions = {
      key: orderData.key_id,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'LG 87 Skating Championship',
      description: `Registration fee for ${userData.category} category`,
      order_id: orderData.order_id,
      prefill: {
        name: userData.name,
        email: userData.email,
        contact: userData.parent_phone,
      },
      theme: {
        color: '#2563eb', // Blue theme matching your UI
      },
      notes: {
        category: userData.category,
        student_name: userData.name,
        parent_name: userData.parent_name,
      },
      modal: {
        ondismiss: () => {
          console.log('💳 Payment modal dismissed by user');
          onError('Payment cancelled by user');
        },
      },
      handler: async (response: RazorpayResponse) => {
        console.log('💳 Payment successful:', response);
        await handlePaymentSuccess(response, userData, onSuccess, onError);
      },
    };

    // Open Razorpay checkout with explicit type assertion for window.Razorpay
    // Razorpay is loaded via script, so we need to assert its type for TypeScript
    const RazorpayConstructor = (window as unknown as { Razorpay: new (options: object) => { open: () => void } }).Razorpay;
    if (typeof RazorpayConstructor !== 'function') {
      throw new Error('Razorpay SDK not loaded');
    }
    const razorpay = new RazorpayConstructor(razorpayOptions);
    razorpay.open();

  } catch (error) {
    // Handle payment initiation errors with explicit typing
    let error_message = 'Failed to initiate payment';
    if (error instanceof Error) {
      // If error is an Error object, try to extract message
      error_message = error.message || error_message;
    }
    // If error is an AxiosError-like object with response data
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as { response?: { data?: { message?: string } } }).response === 'object'
    ) {
      const response = (error as { response?: { data?: { message?: string } } }).response;
      if (
        response &&
        typeof response === 'object' &&
        'data' in response &&
        response.data &&
        typeof response.data === 'object' &&
        'message' in response.data &&
        typeof response.data.message === 'string'
      ) {
        error_message = response.data.message;
      }
    }
    console.error('❌ Payment initiation error:', error);
    onError(error_message);
  }
};

/**
 * Handle successful payment response from Razorpay
 * @param {RazorpayResponse} response - Razorpay payment response
 * @param {UserRegistrationData} userData - User registration data
 * @param {Function} onSuccess - Success callback function
 * @param {Function} onError - Error callback function
 */
const handlePaymentSuccess = async (
  response: RazorpayResponse,
  userData: UserRegistrationData,
  onSuccess: (paymentData: PaymentVerificationResponse) => void,
  onError: (error: string) => void
): Promise<void> => {
  try {
    console.log('🔐 Verifying payment:', response);

    // Prepare verification request
    const verificationRequest: PaymentVerificationRequest = {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      user_data: userData,
    };

    // Verify payment with backend
    const verificationResponse = await verifyPayment(verificationRequest);
    const verificationData: PaymentVerificationResponse = verificationResponse.data.data;

    console.log('✅ Payment verified successfully:', verificationData);

    // Call success callback with payment data
    onSuccess(verificationData);

  } catch (error) {
    // Handle payment verification errors with explicit typing
    let error_message = 'Payment verification failed';
    if (error instanceof Error) {
      // If error is an Error object, try to extract message
      error_message = error.message || error_message;
    }
    // If error is an AxiosError-like object with response data
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as { response?: { data?: { message?: string } } }).response === 'object'
    ) {
      const response = (error as { response?: { data?: { message?: string } } }).response;
      if (response && response.data && typeof response.data.message === 'string') {
        error_message = response.data.message;
      }
    }
    console.error('❌ Payment verification error:', error);
    onError(error_message);
  }
};

/**
 * Get registration fee display for a category
 * @param {string} category - Category name
 * @returns {string} Fee display string
 */
export const getRegistrationFeeDisplay = (category: string): string => {
  const fees: Record<string, string> = {
    'Beginner': '₹5',
    'Intermediate': '₹5',
  };
  return fees[category] || '₹5';
};

/**
 * Format amount for display
 * @param {number} amountInPaise - Amount in paise
 * @returns {string} Formatted amount string
 */
export const formatAmount = (amountInPaise: number): string => {
  return `₹${(amountInPaise / 100).toFixed(0)}`;
};
