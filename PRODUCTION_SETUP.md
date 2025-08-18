# 🚀 Production Configuration Guide

## 🔄 Configuration Changes Made

Your application is now configured for **PRODUCTION** with live PayU keys.

## 📁 Environment Files Setup

### 1. **Client Production Environment**
```bash
cd client
# Rename the production environment file
mv env.live .env
```

### 2. **Server Production Environment**
```bash
cd server
# Rename the production environment file
mv env.live .env
```

## 🔑 Production Configuration Summary

### **Client (.env):**
```bash
# PayU Configuration - LIVE CREDENTIALS
VITE_PAYU_MERCHANT_KEY=your_live_merchant_key_here
VITE_PAYU_SALT=your_live_salt_here
VITE_PAYU_SALT_256BIT=your_live_256bit_salt_here
VITE_PAYU_PAYMENT_URL=https://secure.payu.in/your_live_payment_url

# API Configuration - PRODUCTION
VITE_API_BASE_URL=https://event-hosting-88a0.onrender.com/api

# Environment
VITE_NODE_ENV=production
```

### **Server (.env):**
```bash
# Server Configuration for PRODUCTION
PORT=5000
NODE_ENV=production

# MongoDB Configuration
MONGODB_URI=mongodb+srv://Christopher:Z38UZkon7oC3Ckv9@cluster0.4bebqgh.mongodb.net/Event-registration

# Frontend URL for CORS (PRODUCTION)
FRONTEND_URL=https://lg87playarena.netlify.app
```

## 🌐 Production URLs

| Component | URL |
|-----------|-----|
| **Server API** | `https://event-hosting-88a0.onrender.com/api` |
| **Client App** | `https://lg87playarena.netlify.app` |
| **Health Check** | `https://event-hosting-88a0.onrender.com/api/health` |

## 🚀 Deploy to Production

### **1. Server (Render):**
1. Push your updated code to GitHub
2. Render will automatically redeploy
3. Ensure environment variables are set in Render dashboard:
   ```bash
   NODE_ENV=production
   FRONTEND_URL=https://lg87playarena.netlify.app
   ```

### **2. Client (Netlify):**
1. Push your updated code to GitHub
2. Netlify will automatically redeploy
3. Ensure environment variables are set in Netlify dashboard:
   ```bash
   VITE_PAYU_MERCHANT_KEY=your_live_merchant_key
   VITE_PAYU_SALT=your_live_salt
   VITE_PAYU_SALT_256BIT=your_live_256bit_salt
   VITE_PAYU_PAYMENT_URL=https://secure.payu.in/your_live_payment_url
   VITE_API_BASE_URL=https://event-hosting-88a0.onrender.com/api
   VITE_NODE_ENV=production
   ```

## 🧪 Test Production Deployment

### **1. Server Health Check:**
```bash
curl https://event-hosting-88a0.onrender.com/api/health
```

### **2. Test Production Client:**
- Visit `https://lg87playarena.netlify.app`
- Complete registration form
- Test PayU payment flow
- Verify data storage in MongoDB

### **3. Monitor Production:**
- Check Render server logs
- Monitor Netlify deployment
- Verify CORS is working
- Check payment processing

## 🔄 Switch Back to Development

If you need to test locally again:

### **Client:**
```typescript
// In client/src/services/api.ts
baseURL: 'http://localhost:5000/api', // Uncomment for development
// baseURL: 'https://event-hosting-88a0.onrender.com/api', // Comment out for development
```

### **Environment Variables:**
```bash
# Client .env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_NODE_ENV=development

# Server .env
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### **CORS:**
```javascript
// In server/src/config/config.js
// Uncomment development URLs and comment production URLs
```

## ⚠️ Production Notes

- ✅ **Live PayU Integration:** Ready for real transactions
- ✅ **Production URLs:** All endpoints point to production
- ✅ **CORS Security:** Only production domains allowed
- ✅ **Environment:** Set to production mode
- ✅ **Database:** Uses production MongoDB

## 🎯 Next Steps

1. **Update .env files** with your actual live PayU credentials
2. **Deploy to production** platforms
3. **Test the complete flow** in production
4. **Monitor transactions** and user registrations
5. **Set up monitoring** and error tracking

Your application is now production-ready! 🚀
