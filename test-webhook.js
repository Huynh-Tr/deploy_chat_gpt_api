#!/usr/bin/env node

/**
 * Test script for your specific n8n webhook
 * Tests the webhook endpoint: https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a
 */

const https = require('https');

const WEBHOOK_URL = 'https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a';

console.log('🧪 Testing your n8n webhook...\n');
console.log(`Webhook URL: ${WEBHOOK_URL}\n`);

// Helper function to make HTTP requests
function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(data))
      }
    };
    
    const req = https.request(options, (res) => {
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
    req.write(JSON.stringify(data));
    req.end();
  });
}

// Test 1: Basic message
async function testBasicMessage() {
  console.log('📝 Test 1: Basic message...');
  try {
    const response = await makeRequest(WEBHOOK_URL, {
      message: 'Hello, this is a test message',
      model: 'gpt-5-nano'
    });
    
    console.log(`Status: ${response.status}`);
    if (response.data) {
      console.log('Response:', JSON.stringify(response.data, null, 2));
    }
    console.log('✅ Test 1 completed\n');
  } catch (error) {
    console.log('❌ Test 1 failed:', error.message, '\n');
  }
}

// Test 2: Different model
async function testDifferentModel() {
  console.log('🤖 Test 2: Different model (GPT-4o)...');
  try {
    const response = await makeRequest(WEBHOOK_URL, {
      message: 'Write a haiku about programming',
      model: 'gpt-4o'
    });
    
    console.log(`Status: ${response.status}`);
    if (response.data) {
      console.log('Response:', JSON.stringify(response.data, null, 2));
    }
    console.log('✅ Test 2 completed\n');
  } catch (error) {
    console.log('❌ Test 2 failed:', error.message, '\n');
  }
}

// Test 3: Advanced model
async function testAdvancedModel() {
  console.log('🧠 Test 3: Advanced model (GPT-5)...');
  try {
    const response = await makeRequest(WEBHOOK_URL, {
      message: 'Explain the concept of recursion in programming',
      model: 'gpt-5'
    });
    
    console.log(`Status: ${response.status}`);
    if (response.data) {
      console.log('Response:', JSON.stringify(response.data, null, 2));
    }
    console.log('✅ Test 3 completed\n');
  } catch (error) {
    console.log('❌ Test 3 failed:', error.message, '\n');
  }
}

// Test 4: Error handling
async function testErrorHandling() {
  console.log('⚠️  Test 4: Error handling (missing message)...');
  try {
    const response = await makeRequest(WEBHOOK_URL, {
      model: 'gpt-5-nano'
      // Missing message field
    });
    
    console.log(`Status: ${response.status}`);
    if (response.data) {
      console.log('Response:', JSON.stringify(response.data, null, 2));
    }
    console.log('✅ Test 4 completed\n');
  } catch (error) {
    console.log('❌ Test 4 failed:', error.message, '\n');
  }
}

// Test 5: Custom payload
async function testCustomPayload() {
  console.log('🔧 Test 5: Custom payload with additional fields...');
  try {
    const response = await makeRequest(WEBHOOK_URL, {
      message: 'What is the capital of Vietnam?',
      model: 'gpt-5-nano',
      source: 'test-script',
      timestamp: new Date().toISOString(),
      user_id: 'test-user-123'
    });
    
    console.log(`Status: ${response.status}`);
    if (response.data) {
      console.log('Response:', JSON.stringify(response.data, null, 2));
    }
    console.log('✅ Test 5 completed\n');
  } catch (error) {
    console.log('❌ Test 5 failed:', error.message, '\n');
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting webhook tests...\n');
  
  await testBasicMessage();
  await testDifferentModel();
  await testAdvancedModel();
  await testErrorHandling();
  await testCustomPayload();
  
  console.log('='.repeat(60));
  console.log('🎉 All webhook tests completed!');
  
  console.log('\n📋 Next steps:');
  console.log('1. Check your n8n workflow is active');
  console.log('2. Verify the HTTP Request node points to your Cloudflare Worker');
  console.log('3. Test the complete flow from webhook to AI response');
  
  console.log('\n🔗 Manual test command:');
  console.log(`curl -X POST ${WEBHOOK_URL} \\`);
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"message": "Hello from curl!", "model": "gpt-5-nano"}\'');
  
  console.log('\n📊 Expected workflow flow:');
  console.log('1. Webhook receives your message');
  console.log('2. HTTP Request sends to Cloudflare Worker API');
  console.log('3. Worker calls Puter API for AI response');
  console.log('4. Response flows back through n8n to webhook');
}

// Run tests
runAllTests().catch(console.error);
