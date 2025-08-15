import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const getActiveClasses = (path: string): string => {
    return isActive(path)
      ? 'bg-blue-600 text-white'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900';
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex space-x-8">
          <Link
            to="/"
            className={`px-3 py-4 text-sm font-medium rounded-md transition-colors ${getActiveClasses('/')}`}
          >
            Registration
          </Link>
          <Link
            to="/success"
            className={`px-3 py-4 text-sm font-medium rounded-md transition-colors ${getActiveClasses('/success')}`}
          >
            Success
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
