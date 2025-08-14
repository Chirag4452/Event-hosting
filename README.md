# Event Hosting Platform

A full-stack event registration platform with React frontend and Node.js backend, connected via Axios.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or cloud instance)

### Backend Setup
```bash
cd server
npm install
npm run dev
```

The backend will start on `http://localhost:5000`

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🔗 API Connection

The frontend and backend are connected using **Axios** with the following features:

### API Service (`client/src/services/api.ts`)
- **Base URL**: `http://localhost:5000/api`
- **Timeout**: 10 seconds
- **Interceptors**: Request/response logging and error handling
- **TypeScript**: Fully typed API responses and requests

### Available Endpoints
- `GET /api/health` - Server health check
- `POST /api/register` - User registration
- `GET /api/registrations` - Get all registrations

### Error Handling
- Network errors (no response)
- Server errors (4xx, 5xx responses)
- Validation errors
- Timeout handling

## 🧪 Testing the Connection

### 1. API Test Page
Navigate to `/api-test` to test all API endpoints:
- Health check
- Get registrations
- User registration

### 2. Server Status Indicator
The `ServerStatus` component shows real-time connection status:
- 🟢 Online - Server responding
- 🔴 Offline - Server unreachable
- 🟡 Checking - Verifying connection

### 3. Console Logging
Check browser console for detailed API request/response logs:
```
🚀 API Request: POST /api/register
✅ API Response: 200 /api/register
```

## 📁 Project Structure

```
Event-hosting/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   └── schemas/       # Validation schemas
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   └── middleware/    # Express middleware
│   └── package.json
└── README.md
```

## 🔧 Configuration

### Backend Environment Variables
Create `.env` file in `server/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-hosting
```

### Frontend API Configuration
Update `client/src/services/api.ts` to change:
- Base URL
- Timeout settings
- Headers

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS middleware is enabled
   - Check frontend URL matches backend CORS settings

2. **Connection Refused**
   - Verify backend is running on port 5000
   - Check MongoDB connection

3. **TypeScript Errors**
   - Run `npm run build` in client directory
   - Check type definitions in API service

### Debug Mode
Enable detailed logging by checking browser console for:
- API request details
- Response data
- Error information

## 📚 Dependencies

### Frontend
- React 19
- TypeScript
- Axios (HTTP client)
- React Router (navigation)
- Tailwind CSS (styling)
- Zod (validation)

### Backend
- Express.js
- MongoDB (Mongoose)
- CORS
- Helmet (security)
- Rate limiting

## 🎯 Next Steps

1. **Authentication**: Add JWT-based user authentication
2. **Database**: Implement proper data persistence
3. **Validation**: Add comprehensive form validation
4. **Testing**: Add unit and integration tests
5. **Deployment**: Deploy to production environment

## 📞 Support

For issues or questions:
1. Check console logs for error details
2. Verify server status indicator
3. Test API endpoints individually
4. Check network tab for failed requests
