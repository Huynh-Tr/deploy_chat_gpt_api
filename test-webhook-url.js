#!/usr/bin/env node

/**
 * Test script to verify the correct webhook URL
 */

const https = require('https');

console.log('🧪 Testing Webhook URL...\n');

// Test both URLs to see which one works
const urls = [
  {
    name: 'Correct URL (without duplicate)',
    url: 'https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a'
  },
  {
    name: 'URL with duplicate path (what you were using)',
    url: 'https://vn.n8n.asia/webhook-test/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a'
  }
];

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
        'User-Agent': 'Webhook-URL-Test'
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

// Test each URL
async function testUrls() {
  const testData = {
    message: 'Hello from webhook URL test!',
    model: 'gpt-5-nano'
  };
  
  for (const urlInfo of urls) {
    console.log(`🔗 Testing: ${urlInfo.name}`);
    console.log(`   URL: ${urlInfo.url}\n`);
    
    // Test 1: GET request (what browser does)
    console.log('   📄 Test 1: GET request (browser method)...');
    try {
      const getResponse = await makeRequest(urlInfo.url, 'GET');
      console.log(`   Status: ${getResponse.status}`);
      if (getResponse.data) {
        console.log(`   Response: ${JSON.stringify(getResponse.data, null, 2)}`);
      }
    } catch (error) {
      console.log(`   Error: ${error.message}`);
    }
    console.log('');
    
    // Test 2: POST request (correct method)
    console.log('   📤 Test 2: POST request (correct method)...');
    try {
      const postResponse = await makeRequest(urlInfo.url, 'POST', testData);
      console.log(`   Status: ${postResponse.status}`);
      if (postResponse.data) {
        console.log(`   Response: ${JSON.stringify(postResponse.data, null, 2)}`);
        
        // Check if it's a successful response
        if (postResponse.status === 200 && postResponse.data.success) {
          console.log('   ✅ This URL works with POST!');
        } else if (postResponse.status === 404) {
          console.log('   ❌ Webhook not found (workflow might not be active)');
        } else {
          console.log('   ⚠️  Unexpected response');
        }
      }
    } catch (error) {
      console.log(`   Error: ${error.message}`);
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
  }
  
  console.log('🎯 Summary:');
  console.log('1. GET requests will always fail - n8n webhooks require POST');
  console.log('2. Use the correct URL without duplicate paths');
  console.log('3. Make sure your n8n workflow is ACTIVE');
  console.log('4. Use POST method with JSON body');
  
  console.log('\n🔗 Correct usage:');
  console.log('curl -X POST https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"message": "Hello!", "model": "gpt-5-nano"}\'');
}

// Run tests
testUrls().catch(console.error);
