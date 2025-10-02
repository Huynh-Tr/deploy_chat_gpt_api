const https = require('https');

// Test the API with Vietnamese message
const testData = {
  message: "hôm nay là thứ mấy",
  model: "gpt-5-nano"
};

const postData = JSON.stringify(testData);

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

console.log('🧪 Testing API with Vietnamese message...');
console.log('📝 Message: "hôm nay là thứ mấy" (what day is today)');
console.log('🎯 Model: gpt-5-nano');
console.log('🔗 URL: https://chat-gpt-api.pages.dev/api/chat');
console.log('');

const req = https.request(options, (res) => {
  console.log(`📊 Status: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);
  console.log('');

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📄 Response:');
    console.log(data);
    
    if (res.statusCode === 200) {
      try {
        const jsonResponse = JSON.parse(data);
        console.log('');
        console.log('✅ API Response:');
        console.log(JSON.stringify(jsonResponse, null, 2));
      } catch (e) {
        console.log('⚠️  Response is not valid JSON');
      }
    } else {
      console.log('');
      console.log('❌ API Error:');
      console.log(`Status: ${res.statusCode}`);
      if (res.statusCode === 405) {
        console.log('🔧 Issue: Method Not Allowed - _worker.js not deployed');
      }
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request error:', e.message);
});

req.write(postData);
req.end();
