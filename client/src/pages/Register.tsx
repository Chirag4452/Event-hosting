import React, { useState } from 'react';

// Type definitions based on user schemas
interface UserRegistrationData {
  name: string;
  email: string;
  parent_name: string;
  parent_phone: string;
  grade: string;
}

interface PaymentData {
  amount: number;
  currency: string;
  order_id: string;
}

const Register: React.FC = () => {
  // Form state management
  const [formData, setFormData] = useState<UserRegistrationData>({
    name: '',
    email: '',
    parent_name: '',
    parent_phone: '',
    grade: ''
  });

  const [paymentData, setPaymentData] = useState<PaymentData>({
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Simulate API call - replace with actual endpoint
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: formData,
          payment: paymentData
        }),
      });

      if (response.ok) {
        setSubmitMessage('Registration successful! You will receive a confirmation email shortly.');
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          parent_name: '',
          parent_phone: '',
          grade: ''
        });
        setPaymentData({
          amount: 0,
          currency: 'INR',
          order_id: ''
        });
      } else {
        setSubmitMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('An error occurred. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Event Registration
          </h1>
          <p className="text-lg text-gray-600">
            Join us for an amazing event experience
          </p>
        </div>

        {/* Main Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Student Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Student Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter student's full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="student@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Parent Information Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="parent_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Parent/Guardian Name *
                </label>
                <input
                  type="text"
                  id="parent_name"
                  name="parent_name"
                  value={formData.parent_name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.parent_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter parent's full name"
                />
                {errors.parent_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.parent_name}</p>
                )}
              </div>

              <div>
                <label htmlFor="parent_phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Phone Number *
                </label>
                <input
                  type="tel"
                  id="parent_phone"
                  name="parent_phone"
                  value={formData.parent_phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.parent_phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="10-digit phone number"
                  maxLength={10}
                />
                {errors.parent_phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.parent_phone}</p>
                )}
              </div>
            </div>

            {/* Grade Selection */}
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                Grade/Class *
              </label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.grade ? 'border-red-500' : 'border-gray-300'
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
                <p className="mt-1 text-sm text-red-600">{errors.grade}</p>
              )}
            </div>


            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
              >
                {isSubmitting ? 'Processing...' : 'Complete Registration'}
              </button>
            </div>

            {/* Submission Message */}
            {submitMessage && (
              <div className={`mt-4 p-4 rounded-lg text-center ${
                submitMessage.includes('successful') 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
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
