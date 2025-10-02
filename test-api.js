#!/usr/bin/env node

/**
 * Test script to verify API endpoints
 * Run this after deploying your Cloudflare Worker
 */

const https = require('https');
const http = require('http');

// Configuration
const WORKER_URL = process.env.WORKER_URL || 'https://your-worker-domain.workers.dev';
const IS_LOCAL = WORKER_URL.includes('localhost');

console.log('🧪 Testing API endpoints...\n');

// Helper function to make HTTP requests
function makeRequest(url, options, data) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') && !IS_LOCAL ? https : http;
    
    const req = client.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, data: jsonBody });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, data: body });
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test 1: GET request to main page
async function testMainPage() {
  console.log('📄 Testing main page...');
  try {
    const response = await makeRequest(WORKER_URL, {
      method: 'GET',
      headers: {
        'User-Agent': 'API-Test-Script'
      }
    });
    
    if (response.status === 200 && response.data.includes('AI Chat Interface')) {
      console.log('✅ Main page loads correctly');
    } else {
      console.log('❌ Main page failed to load');
    }
  } catch (error) {
    console.log('❌ Main page error:', error.message);
  }
}

// Test 2: POST to /api/chat
async function testChatAPI() {
  console.log('💬 Testing chat API...');
  try {
    const response = await makeRequest(`${WORKER_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      message: 'Hello, this is a test message',
      model: 'gpt-5-nano'
    });
    
    if (response.status === 200 && response.data.message) {
      console.log('✅ Chat API working correctly');
      console.log(`   Response: ${response.data.message.substring(0, 100)}...`);
    } else {
      console.log('❌ Chat API failed');
      console.log('   Status:', response.status);
      console.log('   Data:', response.data);
    }
  } catch (error) {
    console.log('❌ Chat API error:', error.message);
  }
}

// Test 3: POST to /api/webhook
async function testWebhookAPI() {
  console.log('🔗 Testing webhook API...');
  try {
    const response = await makeRequest(`${WORKER_URL}/api/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      message: 'Test webhook from n8n',
      source: 'test-script',
      timestamp: new Date().toISOString()
    });
    
    if (response.status === 200 && response.data.status === 'received') {
      console.log('✅ Webhook API working correctly');
    } else {
      console.log('❌ Webhook API failed');
      console.log('   Status:', response.status);
      console.log('   Data:', response.data);
    }
  } catch (error) {
    console.log('❌ Webhook API error:', error.message);
  }
}

// Test 4: Error handling - missing message
async function testErrorHandling() {
  console.log('⚠️  Testing error handling...');
  try {
    const response = await makeRequest(`${WORKER_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      model: 'gpt-5-nano'
      // Missing message field
    });
    
    if (response.status === 400 && response.data.error) {
      console.log('✅ Error handling working correctly');
      console.log(`   Error: ${response.data.error}`);
    } else {
      console.log('❌ Error handling failed');
      console.log('   Status:', response.status);
      console.log('   Data:', response.data);
    }
  } catch (error) {
    console.log('❌ Error handling test failed:', error.message);
  }
}

// Test 5: CORS headers
async function testCORS() {
  console.log('🌐 Testing CORS headers...');
  try {
    const response = await makeRequest(`${WORKER_URL}/api/chat`, {
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
  } catch (error) {
    console.log('❌ CORS test failed:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log(`Testing worker at: ${WORKER_URL}\n`);
  
  await testMainPage();
  await testChatAPI();
  await testWebhookAPI();
  await testErrorHandling();
  await testCORS();
  
  console.log('\n' + '='.repeat(50));
  console.log('🎉 API testing completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Update your n8n workflow with the correct worker URL');
  console.log('2. Test the n8n webhook integration');
  console.log('3. Deploy to production if all tests pass');
  
  console.log('\n🔗 Example cURL commands:');
  console.log(`curl -X POST ${WORKER_URL}/api/chat \\`);
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"message": "Hello AI!", "model": "gpt-5-nano"}\'');
}

// Check if worker URL is provided
if (WORKER_URL === 'https://your-worker-domain.workers.dev') {
  console.log('⚠️  Please set your actual worker URL:');
  console.log('   WORKER_URL=https://your-worker.workers.dev node test-api.js');
  console.log('   or');
  console.log('   node test-api.js (for local testing with wrangler dev)');
  process.exit(1);
}

// Run tests
runAllTests().catch(console.error);
