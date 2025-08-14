// Environment configuration for the application
export const environment = {
  // API configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 10000,
  },
  
  // App configuration
  app: {
    title: import.meta.env.VITE_APP_TITLE || 'Event Hosting',
    version: '1.0.0',
  },
  
  // Development flags
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

export default environment;
