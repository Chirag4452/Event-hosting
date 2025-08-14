import axios from 'axios';
import type { AxiosResponse } from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  // Use relative URL for development (will be proxied by Vite)
  // In production, you can set this to your actual backend URL
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Type definitions for API responses
export interface UserRegistrationData {
  name: string;
  email: string;
  phone: string;
  event_type: string;
  participant_type: string;
  emergency_contact: string;
  age: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

// API functions with proper TypeScript return types
export const registerUser = async (userData: UserRegistrationData): Promise<AxiosResponse<ApiResponse<UserRegistrationData>>> => {
  return api.post('/register', userData);
};

export const getAllRegistrations = async (): Promise<AxiosResponse<ApiResponse<UserRegistrationData[]>>> => {
  return api.get('/registrations');
};

// Health check function
export const checkServerHealth = async (): Promise<AxiosResponse<{ status: string; message: string; timestamp: string }>> => {
  return api.get('/health');
};

export default api;
