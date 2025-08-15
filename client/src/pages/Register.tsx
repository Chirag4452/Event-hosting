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
    'Mont','Pre-KG','U-KG','1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
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
      <div className="max-w-4xl mx-auto">
        {/* Event Information Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-black text-blue-900 mb-2 tracking-wider" style={{ fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", "Arial Black", sans-serif' }}>
              LG 87 1ST SKATING
            </h1>
            <h2 className="text-5xl font-black text-red-600 mb-4 tracking-widest" style={{ fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", "Arial Black", sans-serif' }}>
              CHAMPIONSHIP
            </h2>
                      <div className="flex items-center justify-center space-x-2 mb-6">
            <span className="text-gray-700 font-semibold tracking-wide text-sm uppercase">ORGANIZED BY</span>
            <div className="flex items-center space-x-6">
              <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                <span className="font-bold tracking-wide">LG 87 PLAY ARENA</span>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 via-blue-500 to-white rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg border-4 border-white">
                  <span className="text-lg font-black text-gray-800 tracking-wider">FS</span>
                </div>
                <span className="text-sm font-semibold text-gray-700 tracking-wide">FLYING SKATERS ACADEMY</span>
              </div>
            </div>
          </div>
          </div>

          {/* Challenge Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-4 px-8 rounded-2xl mb-8 text-center shadow-xl transform -skew-x-12 border border-blue-700">
            <span className="text-2xl font-black tracking-widest transform skew-x-12 block" style={{ fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", "Arial Black", sans-serif' }}>
              CHALLENGE YOURSELF
            </span>
          </div>

          {/* Event Description */}
          <div className="text-center mb-8">
            <p className="text-red-600 text-xl leading-relaxed max-w-4xl mx-auto font-medium tracking-wide">
              Join us for an electrifying skating race and show off your speed! From first-timers to seasoned skaters, everyone is welcome on the track!
            </p>
          </div>

          {/* Event Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-900 font-bold text-lg tracking-wide">SUNDAY 7 SEPTEMBER, 2025</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-900 font-bold text-lg tracking-wide">LG 87 PLAY ARENA</p>
                <p className="text-red-600 font-semibold text-base">INDOOR SKATING RINK</p>
                <p className="text-gray-700 font-medium">Tippasandara</p>
              </div>
            </div>
          </div>

          {/* Register Now Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-4 px-8 rounded-2xl text-center shadow-xl transform -skew-x-12 border border-blue-700">
            <span className="text-2xl font-black tracking-widest transform skew-x-12 block" style={{ fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", "Arial Black", sans-serif' }}>
              REGISTER NOW
            </span>
          </div>
        </div>



        {/* Main Registration Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Student Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="max-w-xs sm:max-w-sm mx-auto">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Student Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-2 py-1.5 text-xs border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.name ? 'border-red-300 ring-red-200' : 'border-gray-300'
                }`}
                placeholder="Enter student's full name"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="max-w-xs sm:max-w-sm mx-auto">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-2 py-1.5 text-xs border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.email ? 'border-red-300 ring-red-200' : 'border-gray-300'
                }`}
                placeholder="student@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Parent Name */}
            <div className="max-w-xs sm:max-w-sm mx-auto">
              <label htmlFor="parent_name" className="block text-sm font-medium text-gray-700 mb-1">
                Parent/Guardian Name *
              </label>
              <input
                type="text"
                id="parent_name"
                name="parent_name"
                value={formData.parent_name}
                onChange={handleInputChange}
                className={`w-full px-2 py-1.5 text-xs border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.parent_name ? 'border-red-300 ring-red-200' : 'border-gray-300'
                }`}
                placeholder="Enter parent's full name"
              />
              {errors.parent_name && (
                <p className="mt-1 text-xs text-red-600">{errors.parent_name}</p>
              )}
            </div>

            {/* Parent Phone */}
            <div className="max-w-xs sm:max-w-sm mx-auto">
              <label htmlFor="parent_phone" className="block text-sm font-medium text-gray-700 mb-1">
                Parent Phone Number *
              </label>
              <input
                type="tel"
                id="parent_phone"
                name="parent_phone"
                value={formData.parent_phone}
                onChange={handleInputChange}
                className={`w-full px-2 py-1.5 text-xs border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
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
            <div className="max-w-xs sm:max-w-sm mx-auto">
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                Grade/Class *
              </label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className={`w-full px-2 py-1.5 text-xs border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
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
            <div className="pt-4 max-w-xs sm:max-w-sm mx-auto">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded-md font-medium text-white text-xs transition-all duration-200 ${
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

        {/* Server Status Indicator */}
        <div className="text-center mt-6">
          <ServerStatus />
        </div>
      </div>
    </div>
  );
};

export default Register;
