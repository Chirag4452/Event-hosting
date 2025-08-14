# MongoDB Setup for Windows

## Option 1: MongoDB Community Server (Recommended)

### 1. Download MongoDB
- Go to [MongoDB Download Center](https://www.mongodb.com/try/download/community)
- Select "MongoDB Community Server"
- Choose Windows x64
- Download the MSI installer

### 2. Install MongoDB
1. Run the downloaded MSI file
2. Choose "Complete" installation
3. Install MongoDB Compass (GUI tool) if prompted
4. Complete the installation

### 3. Start MongoDB Service
1. Open Command Prompt as Administrator
2. Run these commands:
   ```cmd
   net start MongoDB
   ```

### 4. Verify Installation
1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. You should see the connection successful

## Option 2: MongoDB via Docker (Alternative)

### 1. Install Docker Desktop
- Download from [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Install and restart your computer

### 2. Run MongoDB Container
```cmd
docker run -d --name mongodb -p 27017:27017 mongo:latest
```

### 3. Verify Container
```cmd
docker ps
```

## Option 3: MongoDB Atlas (Cloud - No Local Installation)

### 1. Create Account
- Go to [MongoDB Atlas](https://cloud.mongodb.com)
- Sign up for free account

### 2. Create Cluster
1. Click "Build a Database"
2. Choose "FREE" tier
3. Select cloud provider and region
4. Click "Create"

### 3. Get Connection String
1. Click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password

### 4. Update Backend
Create `.env` file in server directory:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event-hosting
```

## Testing the Connection

### 1. Start Your Backend
```bash
cd server
npm run dev
```

### 2. Check Console Output
You should see:
```
✅ MongoDB connected successfully: localhost
📊 Database: event-hosting
🔗 Connection URI: mongodb://localhost:27017/event-hosting
```

### 3. Test API
Open browser to: `http://localhost:5000/api/health`

## Troubleshooting

### Common Issues

1. **"MongoDB service not found"**
   - Reinstall MongoDB
   - Check if service exists: `sc query MongoDB`

2. **"Connection refused"**
   - Make sure MongoDB service is running
   - Check if port 27017 is free

3. **"Authentication failed"**
   - Check username/password in connection string
   - Verify database user permissions

### Port Conflicts
If port 27017 is in use:
1. Find what's using it: `netstat -ano | findstr 27017`
2. Kill the process or change MongoDB port

### Firewall Issues
1. Allow MongoDB through Windows Firewall
2. Add exception for port 27017

## Next Steps

Once MongoDB is running:
1. Your backend will automatically connect
2. Test the API endpoints
3. Use the frontend to register users
4. Check MongoDB Compass to see your data

## Helpful Commands

```cmd
# Check MongoDB service status
sc query MongoDB

# Start MongoDB service
net start MongoDB

# Stop MongoDB service
net stop MongoDB

# Check if MongoDB is listening
netstat -an | findstr 27017
```
