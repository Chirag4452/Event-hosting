import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Policies: React.FC = () => {
  const location = useLocation();

  // Auto-scroll to the specific section when the page loads with a hash
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        // Add a small delay to ensure the page is fully rendered
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center px-4 py-2 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
            <div></div> {/* Spacer for centering */}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Legal & Privacy Policies</h1>
          <p className="text-gray-600">LG 87 Skating Championship - Event Policies and Information</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-wrap justify-center border-b border-gray-200">
            <a href="#privacy-policy" className="px-6 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-b-2 border-transparent hover:border-blue-500 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms-of-service" className="px-6 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-b-2 border-transparent hover:border-blue-500 transition-colors">
              Terms and Conditions
            </a>
            <a href="#refund-policy" className="px-6 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-b-2 border-transparent hover:border-blue-500 transition-colors">
              Refund & Cancellation
            </a>
          </div>
        </div>

        {/* Privacy Policy Section */}
        <div id="privacy-policy" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy Policy</h2>
          <div className="space-y-4 text-gray-700">
            <p className="leading-relaxed">
              At LG 87 Play Arena and Flying Skaters Academy, we are committed to protecting your privacy and ensuring the security of your personal information.
            </p>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Information We Collect</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Personal identification information (name, email address, phone number)</li>
                <li>Student information (age, grade level, skating experience)</li>
                <li>Payment information for event registration</li>
                <li>Emergency contact information</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How We Use Your Information</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Process event registrations and payments</li>
                <li>Communicate important event updates and information</li>
                <li>Ensure participant safety and emergency contact</li>
                <li>Improve our services and event organization</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Security</h3>
              <p className="text-sm">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Us</h3>
              <p className="text-sm">
                If you have any questions about this Privacy Policy, please contact us at udith.gowda.12@gmail.com or call us at +91 93433 47465
              </p>
            </div>
          </div>
        </div>

        {/* Terms and Conditions Section */}
        <div id="terms-of-service" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Terms and Conditions</h2>
          <div className="space-y-4 text-gray-700">
            <p className="leading-relaxed">
              Upon completing a Transaction, you are entering into a legally binding and enforceable agreement with us to purchase the product and/or service. After this point the User may cancel the Transaction unless it has been specifically provided for on the Platform. In which case, the cancellation will be subject to the terms mentioned on the Platform.
            </p>

            <p className="leading-relaxed">
              We shall retain the discretion in approving any cancellation requests and we may ask for additional details before approving any requests. Once you have received the product and/or service, the only event where you can request for a replacement or a return and a refund is if the product and/or service does not match the description as mentioned on the Platform.
            </p>

            <p className="leading-relaxed">
              Any request for refund must be submitted within three days from the date of the Transaction or such number of days prescribed on the Platform, which shall in no event be less than three days. A User may submit a claim for a refund for a purchase made, by raising a ticket here or contacting us on seller+1bdba875f16847aa97fa2cf01ab4ad49@instamojo.com and providing a clear and specific reason for the refund request, including the exact terms that have been violated, along with any proof, if required.
            </p>

            <p className="leading-relaxed">
              Whether a refund will be provided will be determined by us, and we may ask for additional details before approving any requests.
            </p>
          </div>
        </div>

        {/* Refund & Cancellation Policy Section */}
        <div id="refund-policy" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Refund & Cancellation Policy</h2>
          <div className="space-y-4 text-gray-700">
            <p className="leading-relaxed">
              Upon completing a Transaction, you are entering into a legally binding and enforceable agreement with us to purchase the product and/or service. After this point the User may cancel the Transaction unless it has been specifically provided for on the Platform. In which case, the cancellation will be subject to the terms mentioned on the Platform.
            </p>

            <p className="leading-relaxed">
              We shall retain the discretion in approving any cancellation requests and we may ask for additional details before approving any requests. Once you have received the product and/or service, the only event where you can request for a replacement or a return and a refund is if the product and/or service does not match the description as mentioned on the Platform.
            </p>

            <p className="leading-relaxed">
              Any request for refund must be submitted within three days from the date of the Transaction or such number of days prescribed on the Platform, which shall in no event be less than three days. A User may submit a claim for a refund for a purchase made, by raising a ticket here or contacting us on seller+1bdba875f16847aa97fa2cf01ab4ad49@instamojo.com and providing a clear and specific reason for the refund request, including the exact terms that have been violated, along with any proof, if required.
            </p>

            <p className="leading-relaxed">
              Whether a refund will be provided will be determined by us, and we may ask for additional details before approving any requests.
            </p>
          </div>
        </div>

        {/* Back to Top Button */}
        <div className="text-center">
          <a 
            href="#top" 
            className="inline-flex items-center px-6 py-3 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Back to Top
          </a>
        </div>
      </div>
    </div>
  );
};

export default Policies;
