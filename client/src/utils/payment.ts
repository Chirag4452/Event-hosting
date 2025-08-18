// Payment utility functions for PayU integration
import type { 
  UserRegistrationData,
  PaymentVerificationResponse 
} from '../services/api';

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

/**
 * Handle PayU payment redirect
 * @param {UserRegistrationData} userData - User registration data
 * @param {Function} onSuccess - Success callback function
 * @param {Function} onError - Error callback function
 */
export const handlePayUPayment = (
  userData: UserRegistrationData,
  onSuccess: (paymentData: PaymentVerificationResponse) => void,
  onError: (error: string) => void
): void => {
  try {
    // Store user data in sessionStorage for retrieval after payment
    sessionStorage.setItem('pendingRegistration', JSON.stringify(userData));
    
    // Redirect to PayU payment page
    const payuUrl = import.meta.env.VITE_PAYU_PAYMENT_URL || 'https://u.payu.in/HIVMYbY1Ko3O';
    window.location.href = payuUrl;
    
  } catch (error) {
    console.error('❌ PayU payment error:', error);
    onError('Failed to redirect to payment gateway. Please try again.');
  }
};

/**
 * Check for payment completion and handle success
 * This function should be called when the page loads to check if user returned from PayU
 * @param {Function} onSuccess - Success callback function
 * @param {Function} onError - Error callback function
 */
export const checkPaymentCompletion = (
  onSuccess: (paymentData: PaymentVerificationResponse) => void,
  onError: (error: string) => void
): void => {
  try {
    // Check if user returned from payment
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment_status') || urlParams.get('status');
    const transactionId = urlParams.get('txnid') || urlParams.get('transaction_id') || urlParams.get('payment_id');
    
    if ((paymentStatus === 'success' || paymentStatus === 'completed') && transactionId) {
      // Get stored registration data
      const storedData = sessionStorage.getItem('pendingRegistration');
      if (storedData) {
        const userData: UserRegistrationData = JSON.parse(storedData);
        
        // Create mock payment verification response for PayU
        const paymentData: PaymentVerificationResponse = {
          payment_id: transactionId,
          order_id: `PAYU_${Date.now()}`,
          amount_paid: 500, // ₹5 in paise
          amount_display: '₹5',
          currency: 'INR',
          status: 'completed',
          method: 'PayU',
          verified_at: new Date().toISOString(),
        };
        
        // Clear stored data
        sessionStorage.removeItem('pendingRegistration');
        
        // Call success callback
        onSuccess(paymentData);
      } else {
        onError('Registration data not found. Please try registering again.');
      }
    } else if (paymentStatus === 'failure' || paymentStatus === 'failed' || paymentStatus === 'cancelled') {
      onError('Payment was unsuccessful. Please try again.');
      // Clear stored data on failure
      sessionStorage.removeItem('pendingRegistration');
    }
  } catch (error) {
    console.error('❌ Payment completion check error:', error);
    onError('Failed to verify payment completion. Please contact support.');
  }
};
