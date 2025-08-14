# Event Hosting Application

A full-stack event hosting application with React frontend and Node.js backend.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or cloud instance)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Set up environment variables:**
   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/event-hosting
   PORT=5000
   NODE_ENV=development
   ```

3. **Start both frontend and backend:**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend dev server on `http://localhost:5173`

## 🔧 Development

### Backend (Server)
- **Port:** 5000
- **API Base:** `/api`
- **Health Check:** `/api/health`
- **Registration:** `/api/register`

### Frontend (Client)
- **Port:** 5173
- **API Proxy:** Configured to forward `/api` requests to backend
- **Build Tool:** Vite

### Available Scripts

- `npm run dev` - Start both frontend and backend
- `npm run dev:server` - Start only backend
- `npm run dev:client` - Start only frontend
- `npm run build` - Build frontend for production
- `npm run start` - Start production backend

## 🌐 API Endpoints

### Health Check
- `GET /api/health` - Server status

### User Registration
- `POST /api/register` - Register new user
- `GET /api/registrations` - Get all registrations

## 🔗 Frontend-Backend Connection

The frontend and backend are connected through:

1. **Vite Proxy Configuration** - Forwards `/api` requests to backend during development
2. **Axios Instance** - Configured with relative URLs and proper error handling
3. **CORS** - Backend configured to accept requests from frontend
4. **Connection Test Component** - Shows real-time backend connection status

## 📁 Project Structure

```
Event-hosting/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   ├── config/        # Configuration files
│   │   └── pages/         # Page components
│   └── vite.config.ts     # Vite configuration with proxy
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   └── server.js      # Main server file
│   └── package.json
└── package.json           # Root package.json with dev scripts
```

## 🛠️ Troubleshooting

### Common Issues

1. **Backend not starting:**
   - Check MongoDB connection
   - Verify port 5000 is available
   - Check environment variables

2. **Frontend can't connect to backend:**
   - Ensure backend is running on port 5000
   - Check Vite proxy configuration
   - Verify CORS settings

3. **API requests failing:**
   - Check browser console for errors
   - Verify API endpoints in backend
   - Check network tab for request/response

### Connection Test

The application includes a `ConnectionTest` component that shows:
- Real-time backend connection status
- Last successful connection timestamp
- Error messages if connection fails
- Manual connection test button

## 🚀 Production Deployment

1. **Build frontend:**
   ```bash
   npm run build
   ```

2. **Start production backend:**
   ```bash
   npm run start
   ```

3. **Update environment variables** for production settings

## 📝 License

ISC
