# 🚀 Quick Setup Guide

## 📁 Environment Files Setup

I've created environment files for you. You need to rename them to `.env` files:

### 1. Client Setup
```bash
cd client
# Rename the environment file
mv env.live .env
```

### 2. Server Setup
```bash
cd server
# Rename the environment file
mv env.live .env
```

## 🔑 Live PayU Keys Setup

**⚠️ IMPORTANT:** Replace the placeholder values in your `.env` files with your actual live PayU credentials:

### Client `.env` file:
```bash
# Replace these with your actual live credentials:
VITE_PAYU_MERCHANT_KEY=your_actual_live_merchant_key
VITE_PAYU_SALT=your_actual_live_salt
VITE_PAYU_SALT_256BIT=your_actual_live_256bit_salt
VITE_PAYU_PAYMENT_URL=https://secure.payu.in/your_actual_live_payment_url
```

## 🚀 Start Development with Live Keys

### 1. Start Server
```bash
cd server
npm install
npm run dev
```
Server will run on `http://localhost:5000`

### 2. Start Client
```bash
cd client
npm install
npm run dev
```
Client will run on `http://localhost:5173`

## 🧪 Test Your Live Setup

1. **Server Health Check:**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Open Client:**
   - Visit `http://localhost:5173`
   - Check browser console for any errors
   - Verify API calls go to localhost:5000

3. **Test Live PayU Integration:**
   - Fill out registration form
   - Click submit to test PayU redirect
   - Verify you're redirected to live PayU gateway
   - Test payment flow (use test card numbers if available)

## ⚠️ Important Notes

- **Live Credentials:** You're now using real PayU credentials
- **Test Mode:** PayU may have a test mode for live credentials
- **Real Transactions:** Be careful - these may create real transactions
- **CORS:** Server is configured to allow localhost:5173
- **Database:** Still uses cloud MongoDB (no local setup needed)

## 🔄 Switch to Production

When ready to deploy:
1. Update `.env` files with production URLs
2. Keep the same live PayU credentials
3. Change API base URL to production

## 🧪 PayU Test Cards (if available)

Some PayU accounts provide test card numbers for live credentials:
- Check your PayU dashboard for test card details
- Use test amounts (₹1 or minimal amounts)
- Verify test transactions don't charge real money

Happy testing with live keys! 🎉
