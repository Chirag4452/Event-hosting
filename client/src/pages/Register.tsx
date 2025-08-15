import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import type { UserRegistrationData, PaymentData, RegistrationRequest } from '../services/api';
import ServerStatus from '../components/ServerStatus';
import axios from 'axios';

const Register: React.FC = () => {
  const navigate = useNavigate();
  
  // Form state management
  const [formData, setFormData] = useState<UserRegistrationData>({
    name: '',
    email: '',
    parent_name: '',
    parent_phone: '',
    grade: ''
  });

  const [paymentData] = useState<PaymentData>({
    amount: 0,
    currency: 'INR',
    order_id: ''
  });

  const [errors, setErrors] = useState<Partial<UserRegistrationData>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string>('');

  // Grade options for the dropdown
  const gradeOptions = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
  ];

  // Handle input changes for user registration form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof UserRegistrationData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Form validation based on user schemas
  const validateForm = (): boolean => {
    const newErrors: Partial<UserRegistrationData> = {};

    // Name validation: min 3, max 50 characters
    if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Name cannot exceed 50 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Parent name validation: min 3, max 50 characters
    if (formData.parent_name.length < 3) {
      newErrors.parent_name = 'Parent name must be at least 3 characters long';
    } else if (formData.parent_name.length > 50) {
      newErrors.parent_name = 'Parent name cannot exceed 50 characters';
    }

    // Parent phone validation: exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.parent_phone)) {
      newErrors.parent_phone = 'Phone number must be exactly 10 digits';
    }

    // Grade validation: 1-2 characters
    if (formData.grade.length < 1 || formData.grade.length > 2) {
      newErrors.grade = 'Please select a valid grade';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission using axios
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Prepare registration data
      const registrationData: RegistrationRequest = {
        user: formData,
        payment: paymentData
      };

      // Use axios service to register user
      const response = await registerUser(registrationData);

      if (response.data.success) {
        // Navigate to success page after successful registration
        navigate('/success');
      } else {
        setSubmitMessage(response.data.message || 'Registration failed. Please try again.');
      }
    } catch (error: unknown) {
      // Handle different types of errors
      if (axios.isAxiosError(error)) {
        // Server responded with error status
        const errorMessage = error.response?.data?.message || 'Server error occurred';
        setSubmitMessage(`Registration failed: ${errorMessage}`);
      } else if (error instanceof Error) {
        // Something else happened
        setSubmitMessage(`An error occurred: ${error.message}`);
      } else {
        setSubmitMessage('An unexpected error occurred. Please try again.');
      }
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Event Registration
          </h1>
          <p className="text-gray-600 text-sm">
            Join us for an amazing event experience
          </p>
        </div>

        {/* Server Status Indicator */}
        <div className="text-center mb-6">
          <ServerStatus />
        </div>

        {/* Main Registration Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Student Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Student Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.name ? 'border-red-300 ring-red-200' : 'border-gray-300'
                }`}
                placeholder="Enter student's full name"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.email ? 'border-red-300 ring-red-200' : 'border-gray-300'
                }`}
                placeholder="student@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Parent Name */}
            <div>
              <label htmlFor="parent_name" className="block text-sm font-medium text-gray-700 mb-1">
                Parent/Guardian Name *
              </label>
              <input
                type="text"
                id="parent_name"
                name="parent_name"
                value={formData.parent_name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.parent_name ? 'border-red-300 ring-red-200' : 'border-gray-300'
                }`}
                placeholder="Enter parent's full name"
              />
              {errors.parent_name && (
                <p className="mt-1 text-xs text-red-600">{errors.parent_name}</p>
              )}
            </div>

            {/* Parent Phone */}
            <div>
              <label htmlFor="parent_phone" className="block text-sm font-medium text-gray-700 mb-1">
                Parent Phone Number *
              </label>
              <input
                type="tel"
                id="parent_phone"
                name="parent_phone"
                value={formData.parent_phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.parent_phone ? 'border-red-300 ring-red-200' : 'border-gray-300'
                }`}
                placeholder="10-digit phone number"
                maxLength={10}
              />
              {errors.parent_phone && (
                <p className="mt-1 text-xs text-red-600">{errors.parent_phone}</p>
              )}
            </div>

            {/* Grade Selection */}
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                Grade/Class *
              </label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.grade ? 'border-red-300 ring-red-200' : 'border-gray-300'
                }`}
              >
                <option value="">Select Grade</option>
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade}>
                    Grade {grade}
                  </option>
                ))}
              </select>
              {errors.grade && (
                <p className="mt-1 text-xs text-red-600">{errors.grade}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white text-sm transition-all duration-200 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md active:transform active:scale-95'
                }`}
              >
                {isSubmitting ? 'Processing...' : 'Complete Registration'}
              </button>
            </div>

            {/* Submission Message */}
            {submitMessage && (
              <div className={`mt-4 p-3 rounded-lg text-center text-sm ${
                submitMessage.includes('successful') 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {submitMessage}
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            By registering, you agree to our terms and conditions
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
