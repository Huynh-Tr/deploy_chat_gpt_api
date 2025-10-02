#!/usr/bin/env node

/**
 * Webhook URL Verification Script
 * Verifies the webhook URL is correctly configured and accessible
 */

const https = require('https');

const WEBHOOK_URL = 'https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a';

console.log('🔍 Verifying Webhook URL Configuration...\n');
console.log(`Webhook URL: ${WEBHOOK_URL}\n`);

// Helper function to make HTTP requests
function makeRequest(url, method = 'POST', body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Webhook-Verification-Script'
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

// Test 1: URL Structure Validation
function validateUrlStructure() {
  console.log('📋 Test 1: URL Structure Validation...');
  
  const url = new URL(WEBHOOK_URL);
  
  console.log(`   Domain: ${url.hostname}`);
  console.log(`   Path: ${url.pathname}`);
  
  // Check for common issues
  const issues = [];
  
  if (url.pathname.includes('//')) {
    issues.push('Double slashes in path');
  }
  
  if (url.pathname.split('/').filter(p => p === 'webhook-test').length > 1) {
    issues.push('Duplicate webhook-test path segment');
  }
  
  if (url.pathname.endsWith('/')) {
    issues.push('Trailing slash in path');
  }
  
  if (issues.length === 0) {
    console.log('   ✅ URL structure is correct');
  } else {
    console.log('   ❌ URL structure issues found:');
    issues.forEach(issue => console.log(`      - ${issue}`));
  }
  
  console.log('');
}

// Test 2: GET Request (should fail)
async function testGetRequest() {
  console.log('📄 Test 2: GET Request (should fail)...');
  
  try {
    const response = await makeRequest(WEBHOOK_URL, 'GET');
    console.log(`   Status: ${response.status}`);
    
    if (response.status === 404 && response.data.message) {
      if (response.data.message.includes('GET requests')) {
        console.log('   ✅ Correctly rejects GET requests');
        console.log(`   Message: ${response.data.message}`);
      } else {
        console.log('   ⚠️  Unexpected GET response');
        console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
      }
    } else {
      console.log('   ❌ Unexpected response for GET request');
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
    }
  } catch (error) {
    console.log(`   ❌ GET request error: ${error.message}`);
  }
  
  console.log('');
}

// Test 3: POST Request (should work if workflow is active)
async function testPostRequest() {
  console.log('📤 Test 3: POST Request...');
  
  const testData = {
    message: 'Webhook URL verification test',
    model: 'gpt-5-nano'
  };
  
  try {
    const response = await makeRequest(WEBHOOK_URL, 'POST', testData);
    console.log(`   Status: ${response.status}`);
    
    if (response.status === 200 && response.data.success) {
      console.log('   ✅ POST request successful');
      console.log(`   Original message: ${response.data.original_message}`);
      console.log(`   AI response: ${response.data.ai_response.substring(0, 100)}...`);
      console.log(`   Model used: ${response.data.model_used}`);
      console.log(`   Timestamp: ${response.data.timestamp}`);
    } else if (response.status === 404) {
      console.log('   ❌ Webhook not found - workflow may not be active');
      console.log(`   Message: ${response.data.message}`);
      if (response.data.hint) {
        console.log(`   Hint: ${response.data.hint}`);
      }
    } else {
      console.log('   ⚠️  Unexpected POST response');
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
    }
  } catch (error) {
    console.log(`   ❌ POST request error: ${error.message}`);
  }
  
  console.log('');
}

// Test 4: Invalid JSON (error handling)
async function testInvalidJson() {
  console.log('⚠️  Test 4: Invalid JSON handling...');
  
  try {
    // This will send invalid JSON
    const response = await makeRequest(WEBHOOK_URL, 'POST', 'invalid json');
    console.log(`   Status: ${response.status}`);
    
    if (response.status === 400 || response.status === 500) {
      console.log('   ✅ Correctly handles invalid JSON');
    } else {
      console.log('   ⚠️  Unexpected response for invalid JSON');
    }
    console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
  } catch (error) {
    console.log(`   ❌ Invalid JSON test error: ${error.message}`);
  }
  
  console.log('');
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting webhook URL verification...\n');
  
  validateUrlStructure();
  await testGetRequest();
  await testPostRequest();
  await testInvalidJson();
  
  console.log('='.repeat(60));
  console.log('🎉 Webhook URL verification completed!');
  
  console.log('\n📋 Summary:');
  console.log('1. URL structure validation - Checks for common URL issues');
  console.log('2. GET request test - Verifies GET requests are rejected');
  console.log('3. POST request test - Verifies POST requests work (if workflow active)');
  console.log('4. Error handling test - Verifies invalid JSON handling');
  
  console.log('\n🔗 Your webhook URL:');
  console.log(`   ${WEBHOOK_URL}`);
  
  console.log('\n📊 Expected behavior:');
  console.log('- GET requests → 404 (rejected)');
  console.log('- POST with valid JSON → 200 (if workflow active)');
  console.log('- POST with invalid JSON → 400/500 (error)');
  console.log('- Workflow not active → 404 (not registered)');
  
  console.log('\n🚀 Next steps:');
  console.log('1. If POST test fails with 404, activate your n8n workflow');
  console.log('2. If URL structure issues found, fix the webhook path in n8n');
  console.log('3. If all tests pass, your webhook is ready for integration');
  
  console.log('\n🧪 Manual test command:');
  console.log(`curl -X POST ${WEBHOOK_URL} \\`);
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"message": "Hello!", "model": "gpt-5-nano"}\'');
}

// Run verification
runAllTests().catch(console.error);
