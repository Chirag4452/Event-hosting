import React, { useState, useEffect } from 'react';
import { checkServerHealth } from '../services/api';

interface ServerStatusProps {
  showDetails?: boolean;
  className?: string;
}

const ServerStatus: React.FC<ServerStatusProps> = ({ showDetails = false, className = '' }) => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkServer = async (): Promise<void> => {
    try {
      const response = await checkServerHealth();
      console.log(response);
      setStatus('online');
      setLastCheck(new Date());
    } catch (error) {
      console.error('Server health check failed:', error);
      setStatus('offline');
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkServer();
    
    // Check server status every 30 seconds
    const interval = setInterval(checkServer, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (): string => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'offline':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'checking':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (): React.ReactNode => {
    switch (status) {
      case 'online':
        return <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>;
      case 'offline':
        return <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>;
      case 'checking':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-600 rounded-full mr-2"></div>;
    }
  };

  const getStatusText = (): string => {
    switch (status) {
      case 'online':
        return 'Server Online';
      case 'offline':
        return 'Server Offline';
      case 'checking':
        return 'Checking Connection...';
      default:
        return 'Unknown Status';
    }
  };

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()} ${className}`}>
      {getStatusIcon()}
      <span>{getStatusText()}</span>
      
      {showDetails && lastCheck && (
        <span className="ml-2 text-xs opacity-75">
          Last check: {lastCheck.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};

export default ServerStatus;
