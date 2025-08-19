// Payment configuration for the application
import config from './config.js';

// Payment constants
export const PAYMENT_CONFIG = {
  currency: 'INR',
  // Registration fees by category (in paise - 1 INR = 100 paise)
  registrationFees: {
    'Level 1': 500, // ₹5 (for testing)
    'Level 2': 500, // ₹5 (for testing)
    'Level 3': 500, // ₹5 (for testing)
  },
  // Payment options
  options: {
    name: 'LG 87 Skating Championship',
    description: 'Event Registration Fee',
    theme: {
      color: '#2563eb', // Blue theme matching your UI
    },
    prefill: {
      contact: '',
      email: '',
    },
    notes: {
      event: 'LG 87 1st Skating Championship',
      date: 'September 7, 2025',
    },
    retry: {
      enabled: true,
      max_count: 3,
    },
  },
};

/**
 * Get registration fee based on category
 * @param {string} category - User's skill level category
 * @returns {number} Fee amount in paise
 */
export const getRegistrationFee = (category) => {
  return PAYMENT_CONFIG.registrationFees[category] || PAYMENT_CONFIG.registrationFees['Level 1'];
};

/**
 * Convert paise to rupees for display
 * @param {number} amountInPaise - Amount in paise
 * @returns {number} Amount in rupees
 */
export const paiseToRupees = (amountInPaise) => {
  return amountInPaise / 100;
};

/**
 * Convert rupees to paise
 * @param {number} amountInRupees - Amount in rupees
 * @returns {number} Amount in paise
 */
export const rupeesToPaise = (amountInRupees) => {
  return Math.round(amountInRupees * 100);
};

// Export default as empty object since we no longer have Razorpay
export default {};
