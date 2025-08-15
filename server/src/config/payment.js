// Razorpay configuration
import Razorpay from 'razorpay';
import config from './config.js';

// Don't create instance immediately - create it lazily
let razorpayInstance = null;

/**
 * Initialize Razorpay instance with API keys (lazy initialization)
 * @returns {Razorpay} Razorpay instance
 */
const createRazorpayInstance = () => {
  if (razorpayInstance) {
    return razorpayInstance; // Return existing instance
  }

  try {
    razorpayInstance = new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret,
    });
    
    console.log('✅ Razorpay instance created successfully');
    console.log(`🔑 Using key_id: ${config.razorpay.keyId ? config.razorpay.keyId.substring(0, 8) + '...' : 'NOT SET'}`);
    return razorpayInstance;
  } catch (error) {
    console.error('❌ Failed to create Razorpay instance:', error);
    console.error('🔍 Debug info:', {
      keyId: config.razorpay.keyId || 'NOT SET',
      keySecret: config.razorpay.keySecret ? 'SET' : 'NOT SET'
    });
    throw error;
  }
};

// Export ONLY the getter function - don't create instance during import
export const getRazorpay = () => createRazorpayInstance();

// Payment constants
export const PAYMENT_CONFIG = {
  currency: 'INR',
  // Registration fees by category (in paise - 1 INR = 100 paise)
  registrationFees: {
    'Beginner': 50000, // ₹500
    'Intermediate': 75000, // ₹750
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
  return PAYMENT_CONFIG.registrationFees[category] || PAYMENT_CONFIG.registrationFees['Beginner'];
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
 * Convert rupees to paise for Razorpay
 * @param {number} amountInRupees - Amount in rupees
 * @returns {number} Amount in paise
 */
export const rupeesToPaise = (amountInRupees) => {
  return Math.round(amountInRupees * 100);
};

export default getRazorpay; // Export the function, not an instance
