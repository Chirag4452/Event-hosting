# PayU Integration Setup

## Environment Variables

Create a `.env` file in the client directory with the following variables:

```bash
# PayU Configuration - Test Credentials
VITE_PAYU_MERCHANT_KEY=zwHzBn
VITE_PAYU_SALT=BvBR2TUDIl9U4SoIECboDSKiqm40aZkY
VITE_PAYU_SALT_256BIT=MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCejCQ6VyFIzsQIAvsL0tXcyXmzuJxyahq5m0ykLDi6fP2PVldVxGb3BbgyHfZsQ8fpUZidpBUgTTO9yTdk6orIKAi/D0SfbrjUpZHL8ukU7EMeyeiA3FX7rl1AmJ+PRGn4/Y3AYLARFpIv5NfP3sulSvaVVTrH0QRRZBtdD3HpQwiEi7tcMz5xXBVgBVjCDpueFRzAdPWXXmllKsUjzKMjCQwkzHTfJesaAZwoLphdo+ktLDDpn9+40uoT7Q+3TswpVqLJPjxUmz138MvR7pJI+TJ231TbaNeIf5uGteEpHOtZ6k5Y2F2xXrhhV7kxBatVk04jAqO8OV+Lc6aYIkNbAgMBAAECggEAA08fJcfnbhrBVP4kRDkTH/JlOQmLhl3Nj1Mnny48bt6ooiMQsT28p7+K+nd39bGCd3hYVu3znO16PNCkIys8A0pxSEo8H0G9135Z09JkPVINt+j0kn/xcXklrBv4tJJJI0UTfiY7y9eB7JWk+ssxH+g3y6JwQXcM1TAMMX3e3ZnxTxj4JzEiZw1osZ2yDJAX/XNau8EzPqKRSQHbizdsfsVRv/G8nbCwZlSzfmsRTanplRWg6u6JT3JJIZav/C3uTfVoKhW7jVUzd6kLLUyjT1o8O9xOBAuV4Ipt2AHK6qCSDBqbfXabaIacP+aA0MymoqGdw5HYZB+gVZ1RaYaDqQKBgQC++pqLSh7BorzW8YHrzGU4AeWjiR5JkHGOJWZVulIYbPQAUvPOvfRU7s9SBZFIa2rhCImSLZqvODf23rXWbwBLMAY6bg37F0T9M2IwlXJYmSlmWV+xdgNbB18/cneIcimF35qXnA9r8EWucNvzQSqGbdG+u9Qv4l6QZpcH6/FRwwKBgQDUht1FYFn/sE6Adl0PBUs1N83+E9KCAofuYzT4NcxSNzlpySVfRem7iLmbHuwYYSqrEGn5LrmgTQaFDuHlvdtvrrk5UaGtf3McVA7O88cxTDRQ2q0cBA5BHue0LgO33jGf7onO/gWzb+4wzb/rn6pW6sQTQHNdbdyYUv+s9QJWiQKBgHL09HvttM/H/rW/j/34/eCVu74Rtop/iOsQdiYaTnpncwSS6jFDRESvr1nnAgm+pwooEm9MRjU8uOtAKeKW1G1tzgHz5zSCUEO9X1hxTPAp2bLDD4gJyoFL0bimVW9rkLUF4M9r4BiP+9HCG5O0YT2j80JFW7crItL2/eiFzK/zAoGAEgLD6cc6mVKltHlTdZxrPT1XdbrUUjRItMkvigF1KVqIwRBM3IAeSMhTgnPiakaByTGA6Z8uGAmvDcOvHTszx4k1JUhnvT5Z0QLGpn8+WE0u+dMubHtjgd1OoZRsuD5aUkVy5FnevdA0jWpCY4OKegc3SrJhlH9k/Hu8MzooUpECgYEAlpFAcQv0/gJ5xXaYSOrTvkIvS7L13bWqRW7yxldlV1XeOMYItHeDH+PL1c7utZfMvEFWE2294MybGwfGJdvsmX5/H/zXziQzfRpbrzkV1E+0QWiR9tBxswZWBnHzg0F4U/eMLv6TMEsyjTHPwjDCon+z9dghEF0Da7caNEZOYL0=`
VITE_PAYU_PAYMENT_URL=https://u.payu.in/HIVMYbY1Ko3O

# API Configuration
# For local development
VITE_API_BASE_URL=http://localhost:5000/api
# For production - uncomment the line below and comment the line above
# VITE_API_BASE_URL=https://event-hosting-88a0.onrender.com/api

# Environment
VITE_NODE_ENV=development
```

## Test Credentials

**⚠️ IMPORTANT:** These are **TEST CREDENTIALS** provided by PayU for development purposes only.

- **Merchant Key:** `zwHzBn`
- **Salt (32-bit):** `BvBR2TUDIl9U4SoIECboDSKiqm40aZkY`
- **Salt (256-bit):** `MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCejCQ6VyFIzsQIAvsL0tXcyXmzuJxyahq5m0ykLDi6fP2PVldVxGb3BbgyHfZsQ8fpUZidpBUgTTO9yTdk6orIKAi/D0SfbrjUpZHL8ukU7EMeyeiA3FX7rl1AmJ+PRGn4/Y3AYLARFpIv5NfP3sulSvaVVTrH0QRRZBtdD3HpQwiEi7tcMz5xXBVgBVjCDpueFRzAdPWXXmllKsUjzKMjCQwkzHTfJesaAZwoLphdo+ktLDDpn9+40uoT7Q+3TswpVqLJPjxUmz138MvR7pJI+TJ231TbaNeIf5uGteEpHOtZ6k5Y2F2xXrhhV7kxBatVk04jAqO8OV+Lc6aYIkNbAgMBAAECggEAA08fJcfnbhrBVP4kRDkTH/JlOQmLhl3Nj1Mnny48bt6ooiMQsT28p7+K+nd39bGCd3hYVu3znO16PNCkIys8A0pxSEo8H0G9135Z09JkPVINt+j0kn/xcXklrBv4tJJJI0UTfiY7y9eB7JWk+ssxH+g3y6JwQXcM1TAMMX3e3ZnxTxj4JzEiZw1osZ2yDJAX/XNau8EzPqKRSQHbizdsfsVRv/G8nbCwZlSzfmsRTanplRWg6u6JT3JJIZav/C3uTfVoKhW7jVUzd6kLLUyjT1o8O9xOBAuV4Ipt2AHK6qCSDBqbfXabaIacP+aA0MymoqGdw5HYZB+gVZ1RaYaDqQKBgQC++pqLSh7BorzW8YHrzGU4AeWjiR5JkHGOJWZVulIYbPQAUvPOvfRU7s9SBZFIa2rhCImSLZqvODf23rXWbwBLMAY6bg37F0T9M2IwlXJYmSlmWV+xdgNbB18/cneIcimF35qXnA9r8EWucNvzQSqGbdG+u9Qv4l6QZpcH6/FRwwKBgQDUht1FYFn/sE6Adl0PBUs1N83+E9KCAofuYzT4NcxSNzlpySVfRem7iLmbHuwYYSqrEGn5LrmgTQaFDuHlvdtvrrk5UaGtf3McVA7O88cxTDRQ2q0cBA5BHue0LgO33jGf7onO/gWzb+4wzb/rn6pW6sQTQHNdbdyYUv+s9QJWiQKBgHL09HvttM/H/rW/j/34/eCVu74Rtop/iOsQdiYaTnpncwSS6jFDRESvr1nnAgm+pwooEm9MRjU8uOtAKeKW1G1tzgHz5zSCUEO9X1hxTPAp2bLDD4gJyoFL0bimVW9rkLUF4M9r4BiP+9HCG5O0YT2j80JFW7crItL2/eiFzK/zAoGAEgLD6cc6mVKltHlTdZxrPT1XdbrUUjRItMkvigF1KVqIwRBM3IAeSMhTgnPiakaByTGA6Z8uGAmvDcOvHTszx4k1JUhnvT5Z0QLGpn8+WE0u+dMubHtjgd1OoZRsuD5aUkVy5FnevdA0jWpCY4OKegc3SrJhlH9k/Hu8MzooUpECgYEAlpFAcQv0/gJ5xXaYSOrTvkIvS7L13bWqRW7yxldlV1XeOMYItHeDH+PL1c7utZfMvEFWE2294MybGwfGJdvsmX5/H/zXziQzfRpbrzkV1E+0QWiR9tBxswZWBnHzg0F4U/eMLv6TMEsyjTHPwjDCon+z9dghEF0Da7caNEZOYL0=`

**🔒 For Production:** Replace these with your actual PayU production credentials.

## PayU Button Code

The PayU payment button has been integrated with the following code:

```html
<div>
  <a style="width: 200px; background-color: #1065b7; text-align: center; font-weight: 800; padding: 11px 0px; color: white; font-size: 12px; display: inline-block; text-decoration: none; border-radius:3.229px;" 
     href='https://u.payu.in/HIVMYbY1Ko3O'>
    Pay Now
  </a>
</div>
```

## How It Works

1. **User fills registration form** and clicks submit
2. **Form data is stored** in sessionStorage temporarily
3. **User is redirected** to PayU payment page
4. **After payment completion**, user returns to the registration page
5. **Payment status is checked** from URL parameters
6. **Registration is completed** if payment was successful

## Payment Flow

1. Form validation
2. Store registration data in sessionStorage
3. Redirect to PayU payment gateway
4. User completes payment on PayU
5. PayU redirects back with payment status
6. Check payment status and complete registration
7. Navigate to success page

## Notes

- The current implementation uses a simple redirect approach
- Payment verification is handled client-side for simplicity
- Consider implementing server-side payment verification for production
- Update the PayU URL in the code if you get a different one from PayU
