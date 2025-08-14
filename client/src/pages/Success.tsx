import React from 'react';

const Success: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Registration Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for registering. You will receive a confirmation email shortly.
        </p>
        <a
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Registration
        </a>
      </div>
    </div>
  );
};

export default Success;
