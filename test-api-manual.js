#!/usr/bin/env node

/**
 * Manual API Test Script
 * Tests the current state of the deployed API
 */

const https = require('https');

const API_URL = 'https://chat-gpt-api.pages.dev/api/chat';
const SITE_URL = 'https://chat-gpt-api.pages.dev';

console.log('🧪 Manual API Test Results\n');
console.log(`Site URL: ${SITE_URL}`);
console.log(`API URL: ${API_URL}\n`);

// Helper function to make HTTP requests
function makeRequest(url, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Manual-API-Test'
      }
    };
    
    if (body && method === 'POST') {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(body));
    }
    
    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(responseBody);
          resolve({ 
            status: res.statusCode, 
            headers: res.headers, 
            data: jsonBody,
            rawBody: responseBody
          });
        } catch (e) {
          resolve({ 
            status: res.statusCode, 
            headers: res.headers, 
            data: responseBody,
            rawBody: responseBody
          });
        }
      });
    });
    
    req.on('error', reject);
    
    if (body && method === 'POST') {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

// Test 1: Main page
async function testMainPage() {
  console.log('📄 Test 1: Main page access...');
  try {
    const response = await makeRequest(SITE_URL, 'GET');
    console.log(`   Status: ${response.status}`);
    
    if (response.status === 200) {
      console.log('   ✅ Main page loads successfully');
      console.log(`   Content-Type: ${response.headers['content-type']}`);
      console.log(`   Content-Length: ${response.headers['content-length']} bytes`);
    } else {
      console.log('   ❌ Main page failed to load');
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  console.log('');
}

// Test 2: API endpoint with POST
async function testAPIEndpoint() {
  console.log('🔌 Test 2: API endpoint /api/chat...');
  
  const testData = {
    message: 'Hello from manual test!',
    model: 'gpt-5-nano'
  };
  
  try {
    const response = await makeRequest(API_URL, 'POST', testData);
    console.log(`   Status: ${response.status}`);
    console.log(`   Content-Type: ${response.headers['content-type']}`);
    
    if (response.status === 200 && response.data.message) {
      console.log('   ✅ API endpoint working correctly');
      console.log(`   Response: ${response.data.message.substring(0, 100)}...`);
      console.log(`   Model: ${response.data.model}`);
    } else if (response.status === 405) {
      console.log('   ❌ API endpoint returns 405 Method Not Allowed');
      console.log('   This means the _worker.js file is not deployed');
      console.log('   Raw response:', response.rawBody.substring(0, 200) + '...');
    } else {
      console.log('   ⚠️  Unexpected response');
      console.log(`   Raw response: ${response.rawBody.substring(0, 200)}...`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  console.log('');
}

// Test 3: API endpoint with GET (should fail)
async function testAPIWithGet() {
  console.log('📤 Test 3: API endpoint with GET method...');
  
  try {
    const response = await makeRequest(API_URL, 'GET');
    console.log(`   Status: ${response.status}`);
    
    if (response.status === 405) {
      console.log('   ✅ Correctly rejects GET requests');
    } else if (response.status === 200) {
      console.log('   ⚠️  Unexpectedly accepts GET requests');
    } else {
      console.log('   ❌ Unexpected response for GET request');
    }
    console.log(`   Raw response: ${response.rawBody.substring(0, 100)}...`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  console.log('');
}

// Test 4: Webhook endpoint
async function testWebhookEndpoint() {
  console.log('🔗 Test 4: Webhook endpoint /api/webhook...');
  
  const testData = {
    message: 'Test webhook',
    source: 'manual-test'
  };
  
  try {
    const response = await makeRequest('https://chat-gpt-api.pages.dev/api/webhook', 'POST', testData);
    console.log(`   Status: ${response.status}`);
    
    if (response.status === 200 && response.data.status) {
      console.log('   ✅ Webhook endpoint working correctly');
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
    } else if (response.status === 405) {
      console.log('   ❌ Webhook endpoint returns 405 Method Not Allowed');
      console.log('   This means the _worker.js file is not deployed');
    } else {
      console.log('   ⚠️  Unexpected response');
      console.log(`   Raw response: ${response.rawBody.substring(0, 100)}...`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  console.log('');
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting manual API tests...\n');
  
  await testMainPage();
  await testAPIEndpoint();
  await testAPIWithGet();
  await testWebhookEndpoint();
  
  console.log('='.repeat(60));
  console.log('🎉 Manual API tests completed!');
  
  console.log('\n📋 Summary:');
  console.log('• Main page: Working (returns HTML)');
  console.log('• API endpoints: Returning 405 Method Not Allowed');
  console.log('• Root cause: _worker.js file not deployed to Cloudflare Pages');
  
  console.log('\n🔧 Fix required:');
  console.log('1. Deploy _worker.js file to Cloudflare Pages');
  console.log('2. Ensure worker handles API routing');
  console.log('3. Test API endpoints again');
  
  console.log('\n🚀 Deployment options:');
  console.log('• Option 1: Set CLOUDFLARE_API_TOKEN and run npm run deploy:pages');
  console.log('• Option 2: Manual upload via Cloudflare Dashboard');
  console.log('• Option 3: Git integration with Cloudflare Pages');
  
  console.log('\n🧪 Test after deployment:');
  console.log(`curl -X POST ${API_URL} \\`);
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"message": "Hello!", "model": "gpt-5-nano"}\'');
  
  console.log('\n📊 Expected success response:');
  console.log('```json');
  console.log('{');
  console.log('  "message": "AI Response to: \\"Hello!\\". This is a mock response...",');
  console.log('  "model": "gpt-5-nano",');
  console.log('  "timestamp": "2024-12-18T10:30:00.000Z"');
  console.log('}');
  console.log('```');
}

// Run tests
runAllTests().catch(console.error);
