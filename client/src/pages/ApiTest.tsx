import React, { useState } from 'react';
import { registerUser, getAllRegistrations, checkServerHealth } from '../services/api';
import type { UserRegistrationData, PaymentData, RegistrationRequest } from '../services/api';
import ServerStatus from '../components/ServerStatus';

const ApiTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string): void => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearResults = (): void => {
    setTestResults([]);
  };

  const runAllTests = async (): Promise<void> => {
    setIsRunning(true);
    clearResults();
    
    try {
      // Test 1: Health Check
      addResult('🧪 Testing server health...');
      try {
        const healthResponse = await checkServerHealth();
        addResult(`✅ Health check passed: ${healthResponse.data.status} - ${healthResponse.data.message}`);
      } catch (error) {
        addResult(`❌ Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Test 2: Get All Registrations
      addResult('🧪 Testing get all registrations...');
      try {
        const registrationsResponse = await getAllRegistrations();
        addResult(`✅ Get registrations passed: Found ${registrationsResponse.data.data?.length || 0} registrations`);
      } catch (error) {
        addResult(`❌ Get registrations failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Test 3: Register User
      addResult('🧪 Testing user registration...');
      try {
        const testUser: UserRegistrationData = {
          name: 'Test User',
          email: 'test@example.com',
          parent_name: 'Test Parent',
          parent_phone: '1234567890',
          grade: '10'
        };

        const testPayment: PaymentData = {
          amount: 100,
          currency: 'INR',
          order_id: 'TEST_' + Date.now()
        };

        const registrationData: RegistrationRequest = {
          user: testUser,
          payment: testPayment
        };

        const registerResponse = await registerUser(registrationData);
        addResult(`✅ User registration passed: ${registerResponse.data.message}`);
      } catch (error) {
        addResult(`❌ User registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      addResult('🎉 All tests completed!');
    } catch (error) {
      addResult(`💥 Test suite error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const runHealthCheck = async (): Promise<void> => {
    addResult('🧪 Running health check...');
    try {
      const response = await checkServerHealth();
      addResult(`✅ Health check: ${response.data.status} - ${response.data.message}`);
    } catch (error) {
      addResult(`❌ Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            API Connection Test
          </h1>
          <p className="text-lg text-gray-600">
            Test the connection between frontend and backend
          </p>
        </div>

        {/* Server Status */}
        <div className="text-center mb-6">
          <ServerStatus showDetails={true} />
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Controls</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={runHealthCheck}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Health Check
            </button>
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </button>
            <button
              onClick={clearResults}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Clear Results
            </button>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Results</h2>
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500 text-center">No test results yet. Run a test to see results here.</p>
            ) : (
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* API Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">API Endpoints</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <div className="font-semibold text-green-600">GET /api/health</div>
              <div className="text-sm text-gray-600">Server health check</div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="font-semibold text-blue-600">POST /api/register</div>
              <div className="text-sm text-gray-600">User registration</div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="font-semibold text-purple-600">GET /api/registrations</div>
              <div className="text-sm text-gray-600">Get all registrations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTest;
