import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
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
}

export interface PaymentData {
  amount: number;
  currency: string;
  order_id: string;
}

export interface RegistrationRequest {
  user: UserRegistrationData;
  payment: PaymentData;
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
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log('📤 Request Data:', config.data);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    console.log('📥 Response Data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;
