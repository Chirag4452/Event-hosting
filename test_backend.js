// Simple test script to verify backend endpoints
const testData = {
  user: {
    name: "Test User",
    email: "test@example.com",
    parent_name: "Test Parent",
    parent_phone: "1234567890",
    grade: "10"
  },
  payment: {
    amount: 100,
    currency: "INR",
    order_id: "TEST_123"
  }
};

// Test the schema validation endpoint
async function testSchemaValidation() {
  try {
    console.log('🧪 Testing schema validation endpoint...');
    const response = await fetch('http://localhost:5000/api/test-schema', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    console.log('✅ Schema test result:', result);
    return result.success;
  } catch (error) {
    console.error('❌ Schema test failed:', error);
    return false;
  }
}

// Test the registration endpoint
async function testRegistration() {
  try {
    console.log('🧪 Testing registration endpoint...');
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    console.log('✅ Registration test result:', result);
    return result.success;
  } catch (error) {
    console.error('❌ Registration test failed:', error);
    return false;
  }
}

// Test the health endpoint
async function testHealth() {
  try {
    console.log('🧪 Testing health endpoint...');
    const response = await fetch('http://localhost:5000/api/health');
    const result = await response.json();
    console.log('✅ Health test result:', result);
    return result.status === 'OK';
  } catch (error) {
    console.error('❌ Health test failed:', error);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting backend tests...\n');
  
  const healthOk = await testHealth();
  if (!healthOk) {
    console.log('❌ Backend is not responding. Make sure it\'s running on port 5000.');
    return;
  }
  
  console.log('\n');
  const schemaOk = await testSchemaValidation();
  
  console.log('\n');
  const registrationOk = await testRegistration();
  
  console.log('\n📊 Test Results:');
  console.log(`Health Check: ${healthOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Schema Validation: ${schemaOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Registration: ${registrationOk ? '✅ PASS' : '❌ FAIL'}`);
  
  if (healthOk && schemaOk && registrationOk) {
    console.log('\n🎉 All tests passed! Backend is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the backend console for errors.');
  }
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  runTests().catch(console.error);
} else {
  // Browser environment
  window.testBackend = runTests;
  console.log('Backend test functions available. Run testBackend() to test.');
}
