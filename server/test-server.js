// Simple test script to verify server endpoints
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

async function testEndpoints() {
  console.log('🧪 Testing server endpoints...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health check...');
    const healthResponse = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    console.log('');

    // Test 2: Test registration endpoint
    console.log('2️⃣ Testing test registration endpoint...');
    const testData = {
      user: {
        name: 'Test User',
        email: 'test@example.com',
        parent_name: 'Test Parent',
        parent_phone: '1234567890',
        grade: '5',
        category: 'Level 1'
      },
      payment: {
        payment_id: 'TEST_123',
        order_id: 'TEST_ORDER_456',
        amount_paid: 500,
        currency: 'INR',
        payment_status: 'completed',
        payment_method: 'PayU',
        verified_at: new Date().toISOString()
      }
    };

    const testResponse = await fetch(`${BASE_URL}/api/test-registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    const testResult = await testResponse.json();
    console.log('✅ Test registration:', testResult);
    console.log('');

    // Test 3: Test actual registration endpoint
    console.log('3️⃣ Testing actual registration endpoint...');
    const regResponse = await fetch(`${BASE_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    const regResult = await regResponse.json();
    console.log('✅ Registration result:', regResult);
    console.log('');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testEndpoints();
