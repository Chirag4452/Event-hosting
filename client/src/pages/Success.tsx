import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-6 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
        {/* Success Icon */}
        <div className="text-6xl mb-4">🎉</div>
        
        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
        <h2 className="text-xl font-semibold text-green-600 mb-4">Registration Confirmed</h2>
        
        {/* Details */}
        <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
          <p className="text-gray-700 mb-2">
            <strong>Thank you for registering for the</strong>
          </p>
          <p className="text-blue-800 font-bold text-lg mb-2">
            LG 87 1st Skating Championship
          </p>
          <p className="text-gray-600 text-sm">
            Sunday, September 7, 2025 • LG 87 Play Arena
          </p>
        </div>
        
        {/* Confirmation Info */}
        <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">What's Next?</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Please arrive 30 minutes before the event</li>
            <li>• Bring safety gear (helmets, knee pads)</li>
          </ul>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Register Another Participant
          </button>
          
          <button
            onClick={() => window.print()}
            className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-300"
          >
            Print Confirmation
          </button>
        </div>
        
        {/* Contact Info */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Questions? Contact us at{' '}
            <a href="mailto:support@lg87arena.com" className="text-blue-600 hover:underline">
              support@lg87arena.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success;
