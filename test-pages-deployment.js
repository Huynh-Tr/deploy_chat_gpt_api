#!/usr/bin/env node

/**
 * Test script for Cloudflare Pages deployment
 * Tests the deployed site: https://chat-gpt-api.pages.dev
 */

const https = require('https');

const SITE_URL = 'https://chat-gpt-api.pages.dev';

console.log('🧪 Testing Cloudflare Pages deployment...\n');
console.log(`Site URL: ${SITE_URL}\n`);

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'API-Test-Script',
        ...options.headers
      }
    };
    
    if (options.body) {
      requestOptions.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(options.body));
    }
    
    const req = https.request(requestOptions, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ 
            status: res.statusCode, 
            headers: res.headers, 
            data: jsonBody 
          });
        } catch (e) {
          resolve({ 
            status: res.statusCode, 
            headers: res.headers, 
            data: body 
          });
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

// Test 1: Main page loads
async function testMainPage() {
  console.log('📄 Test 1: Main page loads...');
  try {
    const response = await makeRequest(SITE_URL);
    
    if (response.status === 200 && response.data.includes('AI Chat Interface')) {
      console.log('✅ Main page loads correctly');
      console.log(`   Status: ${response.status}`);
    } else {
      console.log('❌ Main page failed to load');
      console.log(`   Status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Main page error:', error.message);
  }
  console.log('');
}

// Test 2: API endpoint responds correctly
async function testAPIEndpoint() {
  console.log('🔌 Test 2: API endpoint /api/chat...');
  try {
    const response = await makeRequest(`${SITE_URL}/api/chat`, {
      method: 'POST',
      body: {
        message: 'Hello, this is a test message',
        model: 'gpt-5-nano'
      }
    });
    
    console.log(`   Status: ${response.status}`);
    if (response.status === 200 && response.data.message) {
      console.log('✅ API endpoint working correctly');
      console.log(`   Response: ${response.data.message.substring(0, 100)}...`);
    } else if (response.status === 200 && typeof response.data === 'string') {
      console.log('⚠️  API endpoint returns HTML instead of JSON');
      console.log('   This indicates the _worker.js file is not deployed or not working');
      console.log('   Response preview:', response.data.substring(0, 100) + '...');
    } else {
      console.log('❌ API endpoint failed');
      console.log('   Response:', response.data);
    }
  } catch (error) {
    console.log('❌ API endpoint error:', error.message);
  }
  console.log('');
}

// Test 3: Webhook endpoint
async function testWebhookEndpoint() {
  console.log('🔗 Test 3: Webhook endpoint /api/webhook...');
  try {
    const response = await makeRequest(`${SITE_URL}/api/webhook`, {
      method: 'POST',
      body: {
        message: 'Test webhook',
        source: 'test-script'
      }
    });
    
    console.log(`   Status: ${response.status}`);
    if (response.status === 200 && response.data.status === 'received') {
      console.log('✅ Webhook endpoint working correctly');
    } else if (response.status === 200 && typeof response.data === 'string') {
      console.log('⚠️  Webhook endpoint returns HTML instead of JSON');
    } else {
      console.log('❌ Webhook endpoint failed');
      console.log('   Response:', response.data);
    }
  } catch (error) {
    console.log('❌ Webhook endpoint error:', error.message);
  }
  console.log('');
}

// Test 4: CORS headers
async function testCORS() {
  console.log('🌐 Test 4: CORS headers...');
  try {
    const response = await makeRequest(`${SITE_URL}/api/chat`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://example.com',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    if (response.headers['access-control-allow-origin'] === '*') {
      console.log('✅ CORS headers present');
    } else {
      console.log('❌ CORS headers missing');
    }
    console.log(`   Status: ${response.status}`);
  } catch (error) {
    console.log('❌ CORS test failed:', error.message);
  }
  console.log('');
}

// Test 5: Error handling
async function testErrorHandling() {
  console.log('⚠️  Test 5: Error handling...');
  try {
    const response = await makeRequest(`${SITE_URL}/api/chat`, {
      method: 'POST',
      body: {
        model: 'gpt-5-nano'
        // Missing message field
      }
    });
    
    console.log(`   Status: ${response.status}`);
    if (response.status === 400 && response.data.error) {
      console.log('✅ Error handling working correctly');
      console.log(`   Error: ${response.data.error}`);
    } else if (response.status === 200 && typeof response.data === 'string') {
      console.log('⚠️  Error handling returns HTML instead of JSON');
    } else {
      console.log('❌ Error handling failed');
      console.log('   Response:', response.data);
    }
  } catch (error) {
    console.log('❌ Error handling test failed:', error.message);
  }
  console.log('');
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Cloudflare Pages deployment tests...\n');
  
  await testMainPage();
  await testAPIEndpoint();
  await testWebhookEndpoint();
  await testCORS();
  await testErrorHandling();
  
  console.log('='.repeat(60));
  console.log('🎉 All tests completed!');
  
  console.log('\n📋 Analysis:');
  console.log('If API endpoints return HTML instead of JSON, you need to:');
  console.log('1. Ensure _worker.js is in the root directory of your deployment');
  console.log('2. Redeploy to Cloudflare Pages');
  console.log('3. Check that Cloudflare Pages is configured to use Functions/Workers');
  
  console.log('\n🔗 Manual test commands:');
  console.log(`curl -X POST ${SITE_URL}/api/chat \\`);
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"message": "Hello!", "model": "gpt-5-nano"}\'');
  
  console.log('\n📊 Expected behavior:');
  console.log('- GET / → HTML page');
  console.log('- POST /api/chat → JSON response');
  console.log('- POST /api/webhook → JSON response');
  console.log('- OPTIONS /api/chat → CORS headers');
}

// Run tests
runAllTests().catch(console.error);
