# Backend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB on your system
2. Start MongoDB service
3. The server will automatically connect to `mongodb://localhost:27017/event-hosting`

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a cluster
3. Get your connection string
4. Create `.env` file in server directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event-hosting
   ```

#### Option C: Use Default (Development)
- The server will use the default local MongoDB URI
- No additional setup required

### 3. Start the Server
```bash
npm run dev
```

## Environment Variables (Optional)

Create a `.env` file in the server directory for custom configuration:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/event-hosting

# Frontend
FRONTEND_URL=http://localhost:5173
```

## Default Configuration

If no `.env` file is provided, the server uses these defaults:

- **Port**: 5000
- **MongoDB**: `mongodb://localhost:27017/event-hosting`
- **Environment**: development
- **Frontend URL**: `http://localhost:5173`

## Troubleshooting

### MongoDB Connection Issues

1. **Connection Refused**
   - Make sure MongoDB is running
   - Check if MongoDB is installed

2. **Authentication Failed**
   - Verify username/password in connection string
   - Check MongoDB user permissions

3. **Network Issues**
   - Check firewall settings
   - Verify network connectivity

### Server Issues

1. **Port Already in Use**
   - Change PORT in config or .env
   - Kill process using the port

2. **CORS Errors**
   - Verify frontend URL in config
   - Check browser console for details

## API Endpoints

- `GET /` - Server info
- `GET /api/health` - Health check
- `POST /api/register` - User registration
- `GET /api/registrations` - Get all registrations

## Development

The server will automatically restart when you make changes to files (nodemon).
Check the console for connection status and any error messages.
