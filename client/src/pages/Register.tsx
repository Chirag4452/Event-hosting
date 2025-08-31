import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import type { 
  UserRegistrationData, 
  RegistrationRequest,
  PaymentVerificationResponse 
} from '../services/api';
import { handlePayUPayment, getRegistrationFeeDisplay, checkPaymentCompletion } from '../utils/payment';
import axios from 'axios';

import lgArenaLogo from '../assets/LG-arena-logo.jpg';
import fsLogo from '../assets/Flying-skater-logo.jpg';
import bg from '../assets/beginner.jpg';
import inter from '../assets/L2.jpg';
import l3 from '../assets/L3.jpg';

import { termsAndConditions } from '../data/termsAndConditions';

const Register: React.FC = () => {
  const navigate = useNavigate();
  
  // Form state management
  const [formData, setFormData] = useState<UserRegistrationData>({
    name: '',
    email: '',
    parent_name: '',
    parent_phone: '',
    grade: '',
    category: '',
    gender: ''
  });

  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [showFullTerms, setShowFullTerms] = useState<boolean>(false);

  
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  const [errors, setErrors] = useState<Partial<UserRegistrationData>>({});
  const [termsError, setTermsError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string>('');

  // Check for payment completion when component mounts
  React.useEffect(() => {
    // First, try to restore form data if it exists
    const storedData = sessionStorage.getItem('pendingRegistration');
    if (storedData) {
      try {
        const restoredData = JSON.parse(storedData);
        console.log('📦 Restoring form data from session storage:', restoredData);
        setFormData(restoredData);
      } catch (error) {
        console.error('❌ Error restoring form data:', error);
        // Check payment completion even if restoration fails
        checkPaymentCompletion(handlePaymentSuccess, handlePaymentError);
      }
    } else {
      // No stored data, just check payment completion
      console.log('📭 No stored form data found, checking payment completion...');
      checkPaymentCompletion(handlePaymentSuccess, handlePaymentError);
    }
  }, []);

  // Check payment completion AFTER form data is restored
  React.useEffect(() => {
    // Only check payment completion if we have form data (meaning restoration was successful)
    if (formData.name && formData.email && formData.parent_name && formData.parent_phone && formData.grade && formData.category && formData.gender) {
      console.log('🔍 Form data is ready, checking payment completion...');
      console.log('📊 Current form data:', formData);
      checkPaymentCompletion(handlePaymentSuccess, handlePaymentError);
    }
  }, [formData]); // This will trigger whenever formData changes

  // Grade options for the dropdown
  const gradeOptions = [
    'Mont','L-KG','U-KG','1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
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

    // Grade validation: must be from the allowed options
    if (!gradeOptions.includes(formData.grade)) {
      newErrors.grade = 'Please select a valid grade';
    }

    // Category validation: must be selected
    if (!formData.category) {
      newErrors.category = 'Please select a skill level';
    }

    // Gender validation: must be selected
    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }

    // Terms validation: must be accepted
    if (!termsAccepted) {
      setTermsError('Please accept the terms and conditions to continue.');
      return false;
    } else {
      setTermsError('');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle payment success and complete registration
  const handlePaymentSuccess = async (paymentVerificationData: PaymentVerificationResponse): Promise<void> => {
    try {
      console.log('💳 Payment successful, completing registration...');
      console.log('📊 Payment data:', paymentVerificationData);
      console.log('👤 Current form data:', formData);
      console.log('🔍 Form data validation:');
      console.log('  - name:', formData.name, 'length:', formData.name?.length);
      console.log('  - email:', formData.email);
      console.log('  - parent_name:', formData.parent_name, 'length:', formData.parent_name?.length);
      console.log('  - parent_phone:', formData.parent_phone, 'length:', formData.parent_phone?.length);
      console.log('  - grade:', formData.grade);
      console.log('  - category:', formData.category);
      console.log('  - gender:', formData.gender);
      
      // Prepare registration data with payment information
      const registrationData: RegistrationRequest = {
        user: formData,
        payment: {
          payment_id: paymentVerificationData.payment_id,
          order_id: paymentVerificationData.order_id,
          amount_paid: paymentVerificationData.amount_paid,
          currency: paymentVerificationData.currency,
          payment_status: 'completed',
          payment_method: paymentVerificationData.method,
          verified_at: paymentVerificationData.verified_at,
        }
      };
      
      console.log('📝 Registration data prepared:', registrationData);

      // Register user with payment information
      console.log('🚀 Sending registration request to server...');
      const response = await registerUser(registrationData);
      console.log('📡 Server response:', response);

      if (response.data.success) {
        console.log('✅ Registration completed successfully');
        setSubmitMessage('Registration and payment completed successfully!');
        
        // Navigate to success page after a short delay
        setTimeout(() => {
          console.log('🎯 Navigating to success page...');
          navigate('/success');
        }, 1500);
      } else {
        console.log('❌ Registration failed:', response.data);
        setSubmitMessage(response.data.message || 'Registration failed after payment. Please contact support.');
      }
    } catch (error: unknown) {
      console.error('❌ Registration error after payment:', error);
      let errorMessage = 'Registration failed after payment. Please contact support with your payment ID.';
      
      if (axios.isAxiosError(error)) {
        console.error('📡 Axios error details:', error.response?.data);
        
        // Log validation error details if available
        if (error.response?.data?.error === 'VALIDATION_ERROR' && error.response?.data?.details) {
          console.error('🔍 Validation Error Details:');
          error.response.data.details.forEach((detail: { field: string; message: string }, index: number) => {
            console.error(`  ${index + 1}. Field: ${detail.field}, Error: ${detail.message}`);
          });
        }
        
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setSubmitMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
      setIsProcessingPayment(false);
    }
  };

  // Handle payment error
  const handlePaymentError = (error: string): void => {
    console.error('❌ Payment error:', error);
    setSubmitMessage(`Payment failed: ${error}`);
    setIsSubmitting(false);
    setIsProcessingPayment(false);
  };

  // Handle form submission - initiate payment flow
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setIsProcessingPayment(true);
    setSubmitMessage('Initializing payment...');

    try {
      // Store form data in sessionStorage before redirecting
      sessionStorage.setItem('pendingRegistration', JSON.stringify(formData));
      console.log('💾 Stored form data in session storage before PayU redirect');
      
      // Initiate PayU payment process
      handlePayUPayment(
        formData,
        handlePaymentSuccess,
        handlePaymentError
      );
    } catch (error: unknown) {
      console.error('❌ Payment initiation error:', error);
      let errorMessage = 'Failed to initiate payment. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      handlePaymentError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Professional Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <img src={lgArenaLogo} alt="LG 87 Play Arena" className="w-12 h-12" />
              <div>
                <h3 className="text-lg font-bold text-slate-800">LG 87 PLAY ARENA</h3>
                <p className="text-sm text-slate-600">SPORTS CLUB</p>
              </div>
            </div>
            <nav className="flex space-x-6">
              <a href="#event-info" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Event Info
              </a>
              <a href="#registration" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Registration
              </a>
              <a href="#contact" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Contact
              </a>
            </nav>
          </div>
        </div>

        {/* Event Information Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-8" id="event-info">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 mb-1 sm:mb-2 tracking-wider" style={{ fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", "Arial Black", sans-serif' }}>
              LG 87 1ST SKATING
            </h1>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-700 mb-2 sm:mb-4 tracking-widest" style={{ fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", "Arial Black", sans-serif' }}>
              CHAMPIONSHIP 2025
            </h2>
            <div className="flex items-center justify-center space-x-2 mb-6">
             <span className="text-slate-600 font-semibold tracking-wide text-sm uppercase">ORGANIZED BY</span>
             <div className="flex items-center space-x-6">
                <div className="text-center">
                  <img src={lgArenaLogo} alt="LG 87 Play Arena" className="w-34 h-34" />  
                </div>
               
                               <div className="text-center">
                  <img src={fsLogo} alt="Flying Skaters Academy" className="w-24 h-24" />  
                </div>
             </div>
           </div>
          </div>

          {/* Challenge Banner */}
          <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700 text-white py-4 px-8 rounded-2xl mb-8 text-center shadow-xl transform -skew-x-12 border border-slate-600">
            <span className="text-2xl font-black tracking-widest transform skew-x-12 block" style={{ fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", "Arial Black", sans-serif' }}>
              CHALLENGE YOURSELF
            </span>
          </div>

          {/* Event Description */}
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-slate-700 text-base sm:text-lg md:text-xl leading-tight sm:leading-relaxed max-w-4xl mx-auto font-medium tracking-wide" style={{ fontFamily: 'Russo One, sans-serif' }}>
              Join us for an electrifying skating race and show off your speed! From first-timers to seasoned skaters, everyone is welcome on the track!
            </p>
          </div>

          {/* Event Details */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg sm:rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-slate-900 font-bold text-base sm:text-lg tracking-wide">SUNDAY 7 SEPTEMBER, 2025</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg sm:rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-slate-900 font-bold text-base sm:text-lg tracking-wide">LG 87 PLAY ARENA</p>
                <p className="text-slate-600 font-semibold text-sm sm:text-base">INDOOR SKATING RINK</p>
                <p className="text-slate-700 font-medium text-sm sm:text-base">Tippasandara</p>
                <a 
                  href="https://maps.app.goo.gl/d4BJju25yaCgJkw4A?g_st=ipc" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center space-x-2 hover:text-blue-600 transition-colors mt-1"
                >
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-slate-600 underline text-xs">View on map</span>
                </a>
              </div>
            </div>
          </div>













          {/* Register Now Banner */}
          <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700 text-white py-4 px-8 rounded-2xl text-center shadow-xl transform -skew-x-12 border border-slate-600">
            <span className="text-2xl font-black tracking-widest transform skew-x-12 block" style={{ fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", "Arial Black", sans-serif' }}>
              REGISTER BELOW
            </span>
          </div>
        </div>



        {/* Main Registration Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8" id="registration">
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

            {/* Gender Selection */}
            <div className="max-w-xs sm:max-w-sm mx-auto">
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender *
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`w-full px-2 py-1.5 text-xs border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.gender ? 'border-red-300 ring-red-200' : 'border-gray-300'
                }`}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-xs text-red-600">{errors.gender}</p>
              )}
            </div>

            {/* Category Selection */}
            <div className="max-w-xs sm:max-w-sm mx-auto">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Skill Level *
              </label>
              
              {/* Skill Level Images - Clickable Selection */}
              <div className="mb-3">
                <div className="flex flex-col items-center space-y-4">
                  <div 
                    className={`text-center cursor-pointer transition-all duration-200 ${
                      formData.category === 'Level 1' 
                        ? 'scale-105' 
                        : 'hover:scale-105'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, category: 'Level 1' }))}
                  >
                    <img 
                      src={bg} 
                      alt="Beginner Level" 
                      className={`w-46 h-20 object-cover rounded-lg border-2 transition-all duration-200 ${
                        formData.category === 'Level 1' 
                          ? 'border-blue-500 shadow-lg' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    />
                    <p className={`text-xs mt-1 font-medium ${
                      formData.category === 'Level 1' 
                        ? 'text-blue-600' 
                        : 'text-gray-600'
                    }`}>
                      Level 1
                    </p>
                  </div>
                  <div 
                    className={`text-center cursor-pointer transition-all duration-200 ${
                      formData.category === 'Level 2' 
                        ? 'scale-105' 
                        : 'hover:scale-105'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, category: 'Level 2' }))}
                  >
                    <img 
                      src={inter} 
                      alt="Intermediate Level" 
                      className={`w-42 h-20 object-cover rounded-lg border-2 transition-all duration-200 ${
                        formData.category === 'Level 2' 
                          ? 'border-blue-500 shadow-lg' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    />
                    <p className={`text-xs mt-1 font-medium ${
                      formData.category === 'Level 2' 
                        ? 'text-blue-600' 
                        : 'text-gray-600'
                    }`}>
                      Level 2
                    </p>
                  </div>
                  <div 
                    className={`text-center cursor-pointer transition-all duration-200 ${
                      formData.category === 'Level 3' 
                        ? 'scale-105' 
                        : 'hover:scale-105'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, category: 'Level 3' }))}
                  >
                    <img 
                      src={l3} 
                      alt="Advanced Level" 
                      className={`w-42 h-20 object-cover rounded-lg border-2 transition-all duration-200 ${
                        formData.category === 'Level 3' 
                          ? 'border-blue-500 shadow-lg' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    />
                    <p className={`text-xs mt-1 font-medium ${
                      formData.category === 'Level 3' 
                        ? 'text-blue-600' 
                        : 'text-gray-600'
                    }`}>
                      Level 3
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Registration Fee Display */}
              {formData.category && (
                <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Registration Fee:</span>
                    <span className="text-lg font-bold text-green-600">
                      {getRegistrationFeeDisplay(formData.category)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Payment will be processed securely via PayU
                  </p>
                </div>
              )}
              
              {/* Hidden input for form validation */}
              <input
                type="hidden"
                name="category"
                value={formData.category}
              />
              
              {errors.category && (
                <p className="mt-1 text-xs text-red-600">{errors.category}</p>
              )}
            </div>

            {/* Terms and Conditions Heading */}
            <div className="max-w-xs sm:max-w-sm mx-auto">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Terms and Conditions</h3>
              
              {/* Terms Preview */}
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="text-xs text-gray-600 space-y-2">
                  {showFullTerms ? (
                    // Show all sections when expanded
                    termsAndConditions.sections.map((section, index) => (
                      <div key={index}>
                        <p className="font-medium text-gray-700">{section.heading}</p>
                        <div className="space-y-1">
                          {section.content.map((content, contentIndex) => (
                            <p key={contentIndex} className="text-gray-600">
                              {content}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    // Show only first 2 sections when collapsed
                    termsAndConditions.sections.slice(0, 2).map((section, index) => (
                      <div key={index}>
                        <p className="font-medium text-gray-700">{section.heading}</p>
                        <p className="text-gray-600">{section.content[0]}</p>
                      </div>
                    ))
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowFullTerms(!showFullTerms)}
                  className="text-xs text-blue-600 hover:text-blue-800 underline mt-2"
                >
                  {showFullTerms ? 'Show less' : 'Read more...'}
                </button>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="text-xs text-gray-700 leading-relaxed">
                  I agree to the Terms and Conditions and Privacy Policy. I understand that my information will be used for event registration purposes only.
                </label>
              </div>
              {termsError && (
                <p className="mt-1 text-xs text-red-600">{termsError}</p>
              )}
            </div>

            {/* Payment Instructions */}
            <div className="pt-4 max-w-xs sm:max-w-sm mx-auto">
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">Important Payment Instructions:</p>
                    <p>Please wait until you see the "Registration Successful" page after completing your payment. Do not close this browser tab or navigate away during the payment process.</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-md font-medium text-white text-sm transition-all duration-200 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md active:transform active:scale-95'
                }`}
              >
                {isProcessingPayment 
                  ? 'Processing Payment...' 
                  : isSubmitting 
                    ? 'Completing Registration...' 
                    : `Pay ${formData.category ? getRegistrationFeeDisplay(formData.category) : '₹500'} & Register`
                }
              </button>
              
              {/* Payment Security Info */}
              <div className="mt-3 flex items-center justify-center space-x-2 text-xs text-gray-500">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Secure payment via PayU</span>
              </div>
            </div>

            {/* Submission Message */}
            {submitMessage && (
              <div className={`mt-4 p-3 rounded-lg text-center text-sm ${
                submitMessage.includes('successful') || submitMessage.includes('completed')
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : submitMessage.includes('Processing') || submitMessage.includes('Initializing')
                    ? 'bg-blue-50 text-blue-800 border border-blue-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {submitMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
