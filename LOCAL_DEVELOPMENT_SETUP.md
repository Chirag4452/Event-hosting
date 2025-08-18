# Local Development Setup Guide

This guide will help you set up the Event Hosting application for local development and testing.

## 🚀 Quick Start

### 1. Server Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Create `.env` file:**
   ```bash
   # Copy the example file
   cp env.example .env
   
   # Or create manually with these values:
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://Christopher:Z38UZkon7oC3Ckv9@cluster0.4bebqgh.mongodb.net/Event-registration
   FRONTEND_URL=http://localhost:5173
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```
   
   The server will run on `http://localhost:5000`

### 2. Client Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Create `.env` file:**
   ```bash
   # Copy the example file
   cp env.example .env
   
   # Or create manually with these values:
   VITE_PAYU_MERCHANT_KEY=your_merchant_key_here
   VITE_PAYU_SALT=your_salt_here
   VITE_PAYU_PAYMENT_URL=https://u.payu.in/HIVMYbY1Ko3O
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_NODE_ENV=development
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the client:**
   ```bash
   npm run dev
   ```
   
   The client will run on `http://localhost:5173`

## 🔧 Configuration Changes Made

### Server Configuration (`server/src/config/config.js`)
- ✅ CORS origins updated to prioritize localhost
- ✅ Production URLs commented out for local development
- ✅ Added support for multiple localhost ports (3000, 5173)

### Client Configuration (`client/src/services/api.ts`)
- ✅ API base URL changed to `http://localhost:5000/api`
- ✅ Production URL commented out with clear instructions
- ✅ Added development vs production toggle comments

### Environment Files
- ✅ Created `server/env.example` for server configuration
- ✅ Created `client/env.example` for client configuration
- ✅ Both files show localhost vs production configurations

## 🌐 URLs for Local Development

- **Server API:** `http://localhost:5000/api`
- **Client App:** `http://localhost:5173`
- **Server Health Check:** `http://localhost:5000/api/health`
- **Server Root:** `http://localhost:5000/`

## 🔄 Switching to Production

When you're ready to deploy to production:

### Server
1. Update `server/.env`:
   ```bash
   FRONTEND_URL=https://lg87playarena.netlify.app
   ```

2. Uncomment production URLs in `server/src/config/config.js`

### Client
1. Update `client/.env`:
   ```bash
   VITE_API_BASE_URL=https://event-hosting-88a0.onrender.com/api
   ```

2. Update `client/src/services/api.ts`:
   ```typescript
   baseURL: 'https://event-hosting-88a0.onrender.com/api',
   // baseURL: 'http://localhost:5000/api', // Comment out for production
   ```

## 🧪 Testing Local Setup

1. **Test Server:**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Test Client-Server Communication:**
   - Open `http://localhost:5173` in your browser
   - Check browser console for any CORS errors
   - Try submitting the registration form

3. **Check CORS:**
   - Ensure no CORS errors in browser console
   - Verify API calls are going to localhost:5000

## 🚨 Troubleshooting

### Common Issues:

1. **Port already in use:**
   ```bash
   # Kill process on port 5000
   npx kill-port 5000
   ```

2. **CORS errors:**
   - Verify server is running on port 5000
   - Check that `http://localhost:5173` is in CORS origins
   - Restart both server and client

3. **Environment variables not loading:**
   - Ensure `.env` files are in correct directories
   - Restart the development servers
   - Check file paths in server startup logs

### Logs to Check:
- Server console: Look for CORS origins and environment variables
- Client console: Check API base URL and any network errors
- Browser Network tab: Verify API calls are going to localhost

## 📝 Notes

- The application now uses **PayU only** (Razorpay removed)
- MongoDB connection remains the same (cloud database)
- All payment processing happens client-side via PayU redirects
- Server handles user registration and data storage only

Happy coding! 🎉
