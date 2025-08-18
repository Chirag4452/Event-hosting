# 🔑 Live PayU Keys - Localhost Setup Guide

## 📋 What You Need

Before proceeding, make sure you have:
- ✅ Live PayU Merchant Key
- ✅ Live PayU Salt (32-bit)
- ✅ Live PayU Salt (256-bit) 
- ✅ Live PayU Payment URL
- ✅ Access to your PayU dashboard

## 🚀 Step-by-Step Setup

### 1. **Rename Environment Files**
```bash
# Client
cd client
mv env.live .env

# Server
cd server
mv env.live .env
```

### 2. **Update Client .env with Live Credentials**

Edit `client/.env` and replace the placeholders:

```bash
# PayU Configuration - LIVE CREDENTIALS
VITE_PAYU_MERCHANT_KEY=YOUR_ACTUAL_LIVE_MERCHANT_KEY
VITE_PAYU_SALT=YOUR_ACTUAL_LIVE_SALT
VITE_PAYU_SALT_256BIT=YOUR_ACTUAL_LIVE_256BIT_SALT
VITE_PAYU_PAYMENT_URL=https://secure.payu.in/YOUR_ACTUAL_LIVE_PAYMENT_URL

# API Configuration - Local Development
VITE_API_BASE_URL=http://localhost:5000/api

# Environment
VITE_NODE_ENV=development
```

### 3. **Update Server .env**

Edit `server/.env`:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://Christopher:Z38UZkon7oC3Ckv9@cluster0.4bebqgh.mongodb.net/Event-registration

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

## 🧪 Testing with Live Keys

### **Start Your Application:**
```bash
# Terminal 1 - Server
cd server
npm install
npm run dev

# Terminal 2 - Client  
cd client
npm install
npm run dev
```

### **Test PayU Integration:**
1. Open `http://localhost:5173`
2. Fill out registration form
3. Submit form
4. Verify redirect to live PayU gateway
5. Test payment flow

## ⚠️ **IMPORTANT WARNINGS**

### **Real Transactions:**
- 🚨 **LIVE CREDENTIALS = REAL MONEY**
- Test with minimal amounts (₹1 if possible)
- Check if PayU has test mode for live credentials
- Verify test transactions don't charge real money

### **Test Cards (if available):**
Some PayU accounts provide test card numbers:
- Check your PayU dashboard
- Look for "Test Mode" or "Sandbox" options
- Use test card numbers provided by PayU
- Verify test transactions are clearly marked

## 🔍 **Verification Steps**

### **1. Check Environment Variables:**
```bash
# Client console should show:
console.log(import.meta.env.VITE_PAYU_MERCHANT_KEY) // Should show your live key
console.log(import.meta.env.VITE_PAYU_PAYMENT_URL) // Should show live PayU URL
```

### **2. Verify PayU Redirect:**
- Form submission should redirect to live PayU domain
- URL should NOT contain test/sandbox keywords
- Should see your live merchant details

### **3. Check Server Logs:**
- Server should start without errors
- CORS should allow localhost:5173
- MongoDB connection should be successful

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **Environment Variables Not Loading:**
   ```bash
   # Restart both client and server
   # Check file names (.env not env.live)
   # Verify no spaces around = signs
   ```

2. **CORS Errors:**
   - Ensure server is running on port 5000
   - Check FRONTEND_URL in server .env
   - Restart server after .env changes

3. **PayU Redirect Issues:**
   - Verify payment URL is correct
   - Check merchant key and salt
   - Ensure no typos in credentials

## 🔄 **Next Steps After Testing**

Once localhost testing is successful:

1. **Deploy to Production:**
   - Keep same live PayU credentials
   - Change API base URL to production
   - Update CORS origins to production domains

2. **Monitor Transactions:**
   - Check PayU dashboard for test transactions
   - Verify data is stored in MongoDB
   - Test complete registration flow

## 📞 **Support**

If you encounter issues:
- Check PayU dashboard for transaction status
- Verify credentials in PayU merchant panel
- Check server and client console logs
- Ensure all environment variables are set correctly

Happy testing with your live PayU integration! 🎉
