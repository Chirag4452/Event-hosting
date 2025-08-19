import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  // For production - use render URL
  baseURL: 'https://event-hosting-88a0.onrender.com/api',
  // For local development - uncomment the line below and comment the line above
  // baseURL: 'http://localhost:5000/api',
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
  gender: string;
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
