import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import type { 
  UserRegistrationData, 
  RegistrationRequest,
  PaymentVerificationResponse 
} from '../services/api';
import { initiatePayment, getRegistrationFeeDisplay } from '../utils/payment';
import axios from 'axios';

import lgArenaLogo from '../assets/LG-arena-logo.jpg';
import fsLogo from '../assets/Flying-skater-logo.jpg';
import bg from '../assets/beginner.jpg';
import inter from '../assets/intermediate.jpg';

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
    category: ''
  });

  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [showFullTerms, setShowFullTerms] = useState<boolean>(false);

  
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  const [errors, setErrors] = useState<Partial<UserRegistrationData>>({});
  const [termsError, setTermsError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string>('');

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

      // Register user with payment information
      const response = await registerUser(registrationData);

      if (response.data.success) {
        console.log('✅ Registration completed successfully');
        setSubmitMessage('Registration and payment completed successfully!');
        
        // Navigate to success page after a short delay
        setTimeout(() => {
          navigate('/success');
        }, 1500);
      } else {
        setSubmitMessage(response.data.message || 'Registration failed after payment. Please contact support.');
      }
    } catch (error: unknown) {
      console.error('❌ Registration error after payment:', error);
      let errorMessage = 'Registration failed after payment. Please contact support with your payment ID.';
      
      if (axios.isAxiosError(error)) {
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
      // Initiate payment process
      await initiatePayment(
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
        {/* Event Information Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-8">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-blue-900 mb-1 sm:mb-2 tracking-wider" style={{ fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", "Arial Black", sans-serif' }}>
              LG 87 1ST SKATING
            </h1>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-red-600 mb-2 sm:mb-4 tracking-widest" style={{ fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", "Arial Black", sans-serif' }}>
              CHAMPIONSHIP
            </h2>
            <div className="flex items-center justify-center space-x-2 mb-6">
             <span className="text-gray-700 font-semibold tracking-wide text-sm uppercase">ORGANIZED BY</span>
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
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-4 px-8 rounded-2xl mb-8 text-center shadow-xl transform -skew-x-12 border border-blue-700">
            <span className="text-2xl font-black tracking-widest transform skew-x-12 block" style={{ fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", "Arial Black", sans-serif' }}>
              CHALLENGE YOURSELF
            </span>
          </div>

          {/* Event Description */}
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-red-600 text-base sm:text-lg md:text-xl leading-tight sm:leading-relaxed max-w-4xl mx-auto font-medium tracking-wide" style={{ fontFamily: 'Russo One, sans-serif' }}>
              Join us for an electrifying skating race and show off your speed! From first-timers to seasoned skaters, everyone is welcome on the track!
            </p>
          </div>

          {/* Event Details */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border border-blue-200 shadow-sm">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-900 font-bold text-base sm:text-lg tracking-wide">SUNDAY 7 SEPTEMBER, 2025</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border border-blue-200 shadow-sm">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-900 font-bold text-base sm:text-lg tracking-wide">LG 87 PLAY ARENA</p>
                <p className="text-red-600 font-semibold text-sm sm:text-base">INDOOR SKATING RINK</p>
                <p className="text-gray-700 font-medium text-sm sm:text-base">Tippasandara</p>
              </div>
            </div>
          </div>

          {/* Register Now Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-4 px-8 rounded-2xl text-center shadow-xl transform -skew-x-12 border border-blue-700">
            <span className="text-2xl font-black tracking-widest transform skew-x-12 block" style={{ fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", "Arial Black", sans-serif' }}>
              REGISTER BELOW
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

            {/* Category Selection */}
            <div className="max-w-xs sm:max-w-sm mx-auto">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Skill Level *
              </label>
              
              {/* Skill Level Images - Clickable Selection */}
              <div className="mb-3">
                <div className="flex justify-center space-x-4">
                  <div 
                    className={`text-center cursor-pointer transition-all duration-200 ${
                      formData.category === 'Beginner' 
                        ? 'scale-105' 
                        : 'hover:scale-105'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, category: 'Beginner' }))}
                  >
                    <img 
                      src={bg} 
                      alt="Beginner Level" 
                      className={`w-46 h-20 object-cover rounded-lg border-2 transition-all duration-200 ${
                        formData.category === 'Beginner' 
                          ? 'border-blue-500 shadow-lg' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    />
                    <p className={`text-xs mt-1 font-medium ${
                      formData.category === 'Beginner' 
                        ? 'text-blue-600' 
                        : 'text-gray-600'
                    }`}>
                      Beginner
                    </p>
                  </div>
                  <div 
                    className={`text-center cursor-pointer transition-all duration-200 ${
                      formData.category === 'Intermediate' 
                        ? 'scale-105' 
                        : 'hover:scale-105'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, category: 'Intermediate' }))}
                  >
                    <img 
                      src={inter} 
                      alt="Intermediate Level" 
                      className={`w-42 h-20 object-cover rounded-lg border-2 transition-all duration-200 ${
                        formData.category === 'Intermediate' 
                          ? 'border-blue-500 shadow-lg' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    />
                    <p className={`text-xs mt-1 font-medium ${
                      formData.category === 'Intermediate' 
                        ? 'text-blue-600' 
                        : 'text-gray-600'
                    }`}>
                      Intermediate
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
                    Payment will be processed securely via Razorpay
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

            {/* Submit Button */}
            <div className="pt-4 max-w-xs sm:max-w-sm mx-auto">
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
                <span>Secure payment via Razorpay</span>
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

        {/* Remove both Footer and Server Status sections */}
      </div>
    </div>
  );
};

export default Register;
