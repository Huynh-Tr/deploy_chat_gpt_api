/**
 * Test cURL Commands for n8n Integration
 * This script tests the API endpoints with various messages
 */

const https = require('https');

// Test messages
const testMessages = [
  {
    name: "Vietnamese Date Question",
    message: "hôm nay là thứ mấy",
    expected: "Hôm nay là thứ"
  },
  {
    name: "Days in Month Question", 
    message: "tháng này có bao nhiêu ngày",
    expected: "Tháng"
  },
  {
    name: "Time Question",
    message: "mấy giờ rồi",
    expected: "Bây giờ là"
  },
  {
    name: "Greeting",
    message: "xin chào",
    expected: "Xin chào"
  },
  {
    name: "Help Question",
    message: "giúp tôi",
    expected: "Tôi có thể giúp"
  }
];

// Function to make API request
function makeRequest(message, model = 'gpt-5-nano') {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      message: message,
      model: model
    });

    const options = {
      hostname: 'chat-gpt-api.pages.dev',
      port: 443,
      path: '/api/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({
            status: res.statusCode,
            response: response
          });
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Test all messages
async function runTests() {
  console.log('🧪 Testing cURL Commands for n8n Integration\n');
  console.log('=' .repeat(60));
  
  for (const test of testMessages) {
    try {
      console.log(`\n📝 Testing: ${test.name}`);
      console.log(`Message: "${test.message}"`);
      
      const result = await makeRequest(test.message);
      
      if (result.status === 200) {
        console.log(`✅ Status: ${result.status} OK`);
        console.log(`🤖 Response: ${result.response.message}`);
        
        // Check if response contains expected text
        if (result.response.message.includes(test.expected)) {
          console.log(`✅ Expected content found: "${test.expected}"`);
        } else {
          console.log(`⚠️  Expected content not found: "${test.expected}"`);
        }
        
        console.log(`📊 Model: ${result.response.model}`);
        console.log(`⏰ Timestamp: ${result.response.timestamp}`);
        
      } else {
        console.log(`❌ Status: ${result.status}`);
        console.log(`📄 Response: ${JSON.stringify(result.response, null, 2)}`);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('-'.repeat(40));
  }
  
  // Test cURL command format
  console.log('\n🔧 cURL Command for n8n:');
  console.log('```bash');
  console.log('curl -X POST https://chat-gpt-api.pages.dev/api/chat \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"message": "hôm nay là thứ mấy", "model": "gpt-5-nano"}\'');
  console.log('```');
  
  // Test n8n configuration
  console.log('\n📋 n8n HTTP Request Node Configuration:');
  console.log('Method: POST');
  console.log('URL: https://chat-gpt-api.pages.dev/api/chat');
  console.log('Headers: Content-Type: application/json');
  console.log('Body: {"message": "{{ $json.message }}", "model": "gpt-5-nano"}');
  
  console.log('\n✅ All tests completed!');
}

// Run the tests
runTests().catch(console.error);
