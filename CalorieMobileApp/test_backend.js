// Simple test script to check backend connectivity
// Run this with: node test_backend.js

const axios = require('axios');

const API_URL = 'http://192.168.100.48:5000';

console.log('Testing backend connectivity...');
console.log('API URL:', API_URL);
console.log('-'.repeat(50));

// Test 1: Health check
axios.get(`${API_URL}/api/health`)
  .then(response => {
    console.log('\n✓ Health check successful!');
    console.log('Response:', response.data);
  })
  .catch(error => {
    console.log('\n✗ Health check failed!');
    console.log('Error:', error.message);
  });

// Test 2: Auth test endpoint
axios.get(`${API_URL}/api/auth/test`)
  .then(response => {
    console.log('\n✓ Auth test successful!');
    console.log('Response:', response.data);
  })
  .catch(error => {
    console.log('\n✗ Auth test failed!');
    console.log('Error:', error.message);
  });

// Test 3: Login attempt
setTimeout(() => {
  console.log('\n' + '-'.repeat(50));
  console.log('Testing login endpoint...');
  
  axios.post(`${API_URL}/api/auth/login`, {
    email: 'test@test.com',
    password: 'Test123!'
  })
  .then(response => {
    console.log('\n✓ Login successful!');
    console.log('Response:', response.data);
  })
  .catch(error => {
    console.log('\n✗ Login failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  });
}, 1000);
