import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'https://event-hosting-88a0.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Type definitions for API responses
export interface UserRegistrationData {
  name: string;
  email: string;
  parent_name: string;
  parent_phone: string;
  grade: string;
  category: string;
}

export interface PaymentData {
  amount: number;
  currency: string;
  order_id: string;
}

export interface PaymentOrderRequest {
  category: string;
  user_email: string;
  user_name: string;
}

export interface PaymentOrderResponse {
  order_id: string;
  amount: number;
  amount_display: string;
  currency: string;
  category: string;
  key_id: string;
  options: RazorpayOptions;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact?: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
  handler: (response: RazorpayResponse) => void;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface PaymentVerificationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  user_data: UserRegistrationData;
}

export interface PaymentVerificationResponse {
  payment_id: string;
  order_id: string;
  amount_paid: number;
  amount_display: string;
  currency: string;
  status: string;
  method: string;
  verified_at: string;
}

export interface RegistrationRequest {
  user: UserRegistrationData;
  payment: {
    payment_id?: string;
    order_id?: string;
    amount_paid?: number;
    currency?: string;
    payment_status?: string;
    payment_method?: string;
    verified_at?: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

// API functions with simplified return types
export const registerUser = (registrationData: RegistrationRequest) => {
  return api.post('/register', registrationData);
};

export const getAllRegistrations = () => {
  return api.get('/registrations');
};

// Payment API functions
export const createPaymentOrder = (orderRequest: PaymentOrderRequest) => {
  return api.post('/payment/create-order', orderRequest);
};

export const verifyPayment = (verificationRequest: PaymentVerificationRequest) => {
  return api.post('/payment/verify', verificationRequest);
};

export const getPaymentInfo = (category: string) => {
  return api.get(`/payment/info?category=${category}`);
};

// Health check endpoint
export const checkServerHealth = () => {
  return api.get('/health');
};

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;
