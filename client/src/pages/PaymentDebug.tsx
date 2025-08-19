import React, { useState, useEffect } from 'react';

const PaymentDebug: React.FC = () => {
  const [urlParams, setUrlParams] = useState<Record<string, string>>({});
  const [sessionData, setSessionData] = useState<string>('');
  const [localStorageData, setLocalStorageData] = useState<string>('');

  useEffect(() => {
    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const paramsObj: Record<string, string> = {};
    params.forEach((value, key) => {
      paramsObj[key] = value;
    });
    setUrlParams(paramsObj);

    // Get session storage data
    const pendingReg = sessionStorage.getItem('pendingRegistration');
    setSessionData(pendingReg || 'No data found');

    // Get local storage data
    const localData = localStorage.getItem('pendingRegistration');
    setLocalStorageData(localData || 'No data found');
  }, []);

  const clearSessionData = () => {
    sessionStorage.removeItem('pendingRegistration');
    setSessionData('No data found');
  };

  const clearLocalData = () => {
    localStorage.removeItem('pendingRegistration');
    setLocalStorageData('No data found');
  };

  const simulatePaymentSuccess = () => {
    // Simulate successful payment return
    // Note: mockPaymentData is not used in this simulation
    
    // Store mock data
    sessionStorage.setItem('pendingRegistration', JSON.stringify({
      name: 'Test User',
      email: 'test@example.com',
      parent_name: 'Test Parent',
      parent_phone: '1234567890',
      grade: '5',
      category: 'Level 1'
    }));

    // Redirect with success parameters
    window.location.href = `${window.location.origin}/register?payment_status=success&txnid=TEST_PAYMENT_123`;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Payment Flow Debug</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* URL Parameters */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">URL Parameters</h2>
            {Object.keys(urlParams).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(urlParams).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{key}:</span>
                    <span className="font-mono text-sm bg-blue-100 px-2 py-1 rounded">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No URL parameters found</p>
            )}
          </div>

          {/* Session Storage */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Session Storage</h2>
            <div className="mb-4">
              <button
                onClick={clearSessionData}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Clear Session Data
              </button>
            </div>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
              {sessionData}
            </pre>
          </div>

          {/* Local Storage */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Local Storage</h2>
            <div className="mb-4">
              <button
                onClick={clearLocalData}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Clear Local Data
              </button>
            </div>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
              {localStorageData}
            </pre>
          </div>

          {/* Test Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
            <div className="space-y-3">
              <button
                onClick={simulatePaymentSuccess}
                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Simulate Payment Success Return
              </button>
              <button
                onClick={() => window.location.href = '/register'}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Go to Registration Page
              </button>
            </div>
          </div>
        </div>

        {/* Current URL */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Current URL</h2>
          <p className="font-mono text-sm bg-gray-100 p-3 rounded break-all">
            {window.location.href}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentDebug;
