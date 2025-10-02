#!/usr/bin/env node

/**
 * Test script for the complete n8n workflow
 * Tests: Webhook → n8n → Cloudflare API → Response
 */

const https = require('https');

const WEBHOOK_URL = 'https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a';
const API_URL = 'https://chat-gpt-api.pages.dev/api/chat';

console.log('🧪 Testing Complete n8n Workflow...\n');
console.log(`Webhook URL: ${WEBHOOK_URL}`);
console.log(`API URL: ${API_URL}\n`);

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname,
      method: options.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'n8n-Workflow-Test',
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
            data: jsonBody,
            rawBody: body
          });
        } catch (e) {
          resolve({ 
            status: res.statusCode, 
            headers: res.headers, 
            data: body,
            rawBody: body
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

// Test 1: Direct API call (bypass n8n)
async function testDirectAPI() {
  console.log('🔌 Test 1: Direct API call (bypassing n8n)...');
  try {
    const response = await makeRequest(API_URL, {
      body: {
        message: 'Hello from direct API test',
        model: 'gpt-5-nano'
      }
    });
    
    console.log(`   Status: ${response.status}`);
    if (response.status === 200 && response.data.message) {
      console.log('✅ Direct API call successful');
      console.log(`   Response: ${response.data.message.substring(0, 100)}...`);
    } else {
      console.log('❌ Direct API call failed');
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
    }
  } catch (error) {
    console.log('❌ Direct API call error:', error.message);
  }
  console.log('');
}

// Test 2: Complete n8n workflow
async function testN8nWorkflow() {
  console.log('🔄 Test 2: Complete n8n workflow...');
  try {
    const response = await makeRequest(WEBHOOK_URL, {
      body: {
        message: 'Hello from n8n workflow test',
        model: 'gpt-5-nano'
      }
    });
    
    console.log(`   Status: ${response.status}`);
    if (response.status === 200 && response.data.success) {
      console.log('✅ n8n workflow successful');
      console.log(`   Original message: ${response.data.original_message}`);
      console.log(`   AI response: ${response.data.ai_response.substring(0, 100)}...`);
      console.log(`   Model used: ${response.data.model_used}`);
      console.log(`   Timestamp: ${response.data.timestamp}`);
    } else {
      console.log('❌ n8n workflow failed');
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
    }
  } catch (error) {
    console.log('❌ n8n workflow error:', error.message);
  }
  console.log('');
}

// Test 3: Different models via n8n
async function testDifferentModels() {
  const models = ['gpt-5-nano', 'gpt-5-mini', 'gpt-4o'];
  
  for (const model of models) {
    console.log(`🤖 Test 3.${models.indexOf(model) + 1}: Testing model ${model}...`);
    try {
      const response = await makeRequest(WEBHOOK_URL, {
        body: {
          message: `Test message for ${model} model`,
          model: model
        }
      });
      
      console.log(`   Status: ${response.status}`);
      if (response.status === 200 && response.data.success) {
        console.log(`   ✅ ${model} model working`);
        console.log(`   Model used: ${response.data.model_used}`);
      } else {
        console.log(`   ❌ ${model} model failed`);
        console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
      }
    } catch (error) {
      console.log(`   ❌ ${model} model error:`, error.message);
    }
    console.log('');
  }
}

// Test 4: Error handling
async function testErrorHandling() {
  console.log('⚠️  Test 4: Error handling (missing message)...');
  try {
    const response = await makeRequest(WEBHOOK_URL, {
      body: {
        model: 'gpt-5-nano'
        // Missing message field
      }
    });
    
    console.log(`   Status: ${response.status}`);
    if (response.status === 400 || (response.data && !response.data.success)) {
      console.log('✅ Error handling working correctly');
      console.log(`   Error response: ${JSON.stringify(response.data, null, 2)}`);
    } else {
      console.log('⚠️  Unexpected response for error case');
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
    }
  } catch (error) {
    console.log('❌ Error handling test failed:', error.message);
  }
  console.log('');
}

// Test 5: Performance test
async function testPerformance() {
  console.log('⚡ Test 5: Performance test (multiple requests)...');
  const startTime = Date.now();
  const promises = [];
  
  // Send 3 concurrent requests
  for (let i = 0; i < 3; i++) {
    promises.push(makeRequest(WEBHOOK_URL, {
      body: {
        message: `Performance test message ${i + 1}`,
        model: 'gpt-5-nano'
      }
    }));
  }
  
  try {
    const responses = await Promise.all(promises);
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    console.log(`   Total time for 3 requests: ${totalTime}ms`);
    console.log(`   Average time per request: ${Math.round(totalTime / 3)}ms`);
    
    const successful = responses.filter(r => r.status === 200 && r.data.success).length;
    console.log(`   Successful requests: ${successful}/3`);
    
    if (successful === 3) {
      console.log('✅ Performance test passed');
    } else {
      console.log('⚠️  Some requests failed in performance test');
    }
  } catch (error) {
    console.log('❌ Performance test error:', error.message);
  }
  console.log('');
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting complete n8n workflow tests...\n');
  
  await testDirectAPI();
  await testN8nWorkflow();
  await testDifferentModels();
  await testErrorHandling();
  await testPerformance();
  
  console.log('='.repeat(60));
  console.log('🎉 All workflow tests completed!');
  
  console.log('\n📋 Summary:');
  console.log('1. Direct API test - Verifies Cloudflare Pages API is working');
  console.log('2. n8n workflow test - Verifies complete webhook → API → response flow');
  console.log('3. Different models test - Verifies multiple AI models work');
  console.log('4. Error handling test - Verifies proper error responses');
  console.log('5. Performance test - Verifies concurrent request handling');
  
  console.log('\n🔗 Manual test commands:');
  console.log('# Test direct API:');
  console.log(`curl -X POST ${API_URL} \\`);
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"message": "Hello!", "model": "gpt-5-nano"}\'');
  
  console.log('\n# Test n8n workflow:');
  console.log(`curl -X POST ${WEBHOOK_URL} \\`);
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"message": "Hello from n8n!", "model": "gpt-4o"}\'');
  
  console.log('\n📊 Expected workflow flow:');
  console.log('1. Send POST to webhook URL');
  console.log('2. n8n receives and processes the request');
  console.log('3. n8n sends HTTP request to Cloudflare API');
  console.log('4. Cloudflare API processes the request');
  console.log('5. Response flows back through n8n to original request');
}

// Run tests
runAllTests().catch(console.error);
