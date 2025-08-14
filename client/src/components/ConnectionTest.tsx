import React, { useState, useEffect } from 'react';
import { checkServerHealth } from '../services/api';

interface ConnectionStatus {
  isConnected: boolean;
  message: string;
  timestamp?: string;
  error?: string;
}

const ConnectionTest: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    message: 'Checking connection...',
  });

  const testConnection = async (): Promise<void> => {
    try {
      setStatus({
        isConnected: false,
        message: 'Testing connection...',
      });

      const response = await checkServerHealth();
      setStatus({
        isConnected: true,
        message: response.data.message,
        timestamp: response.data.timestamp,
      });
    } catch (error) {
      setStatus({
        isConnected: false,
        message: 'Connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Backend Connection Status</h3>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              status.isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="font-medium">
            {status.isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        
        <p className="text-sm text-gray-600">{status.message}</p>
        
        {status.timestamp && (
          <p className="text-xs text-gray-500">
            Last check: {new Date(status.timestamp).toLocaleString()}
          </p>
        )}
        
        {status.error && (
          <p className="text-sm text-red-600">Error: {status.error}</p>
        )}
      </div>
      
      <button
        onClick={testConnection}
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Test Connection
      </button>
    </div>
  );
};

export default ConnectionTest;
