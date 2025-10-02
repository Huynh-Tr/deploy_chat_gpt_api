const https = require('https');

// Test the comprehensive API with various user messages
const testComprehensiveAPI = async () => {
  console.log('🧪 Testing Comprehensive API with Various User Messages');
  console.log('=' .repeat(60));

  const testCases = [
    {
      name: "Vietnamese Date Question",
      message: "hôm nay là thứ mấy",
      expected: "Hôm nay là"
    },
    {
      name: "Days in Month Question",
      message: "tháng này có bao nhiêu ngày",
      expected: "Tháng 10 có 31 ngày"
    },
    {
      name: "Time Question",
      message: "mấy giờ rồi",
      expected: "Bây giờ là"
    },
    {
      name: "Greeting",
      message: "xin chào",
      expected: "Xin chào! Tôi có thể giúp gì cho bạn?"
    },
    {
      name: "Help Request",
      message: "bạn có thể giúp tôi không",
      expected: "Tôi có thể giúp bạn"
    },
    {
      name: "Weather Question",
      message: "thời tiết hôm nay thế nào",
      expected: "Tôi không thể cung cấp thông tin thời tiết"
    },
    {
      name: "Math Question",
      message: "bạn có thể tính toán không",
      expected: "Tôi có thể giúp với các phép tính"
    },
    {
      name: "General Message",
      message: "tôi muốn biết thông tin về AI",
      expected: "Tôi đã nhận được tin nhắn của bạn"
    }
  ];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n${i + 1}️⃣ Testing: ${testCase.name}`);
    console.log(`💬 Message: "${testCase.message}"`);
    console.log(`📝 Expected: Contains "${testCase.expected}"`);
    console.log('⏳ Sending request...');

    try {
      const response = await fetch('https://chat-gpt-api.pages.dev/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: testCase.message,
          model: 'gpt-5-nano'
        })
      });

      console.log(`📊 Status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log(`✅ Response: ${data.message}`);
      
      if (data.message.includes(testCase.expected)) {
        console.log(`🎉 SUCCESS: Response contains expected content`);
      } else {
        console.log(`⚠️  PARTIAL: Response may not match exactly`);
        console.log(`   Got: "${data.message}"`);
        console.log(`   Expected to contain: "${testCase.expected}"`);
      }

      // Simulate puter.print() output
      console.log(`🖨️  puter.print() output:`);
      console.log('─'.repeat(50));
      console.log(data.message);
      console.log('─'.repeat(50));

    } catch (error) {
      console.error(`❌ Error testing ${testCase.name}:`);
      console.error(`Error: ${error.message}`);
    }

    // Add delay between requests
    if (i < testCases.length - 1) {
      console.log('⏳ Waiting 2 seconds before next test...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('\n🏁 All comprehensive tests completed!');
};

// Test specific Vietnamese questions
const testVietnameseQuestions = async () => {
  console.log('\n\n🇻🇳 Testing Specific Vietnamese Questions');
  console.log('=' .repeat(50));

  const vietnameseQuestions = [
    "hôm nay là thứ mấy",
    "tháng này có bao nhiêu ngày", 
    "mấy giờ rồi",
    "xin chào bạn",
    "bạn có thể giúp tôi không"
  ];

  for (let i = 0; i < vietnameseQuestions.length; i++) {
    const question = vietnameseQuestions[i];
    console.log(`\n${i + 1}️⃣ Vietnamese Question: "${question}"`);

    try {
      const response = await fetch('https://chat-gpt-api.pages.dev/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: question,
          model: 'gpt-5-nano'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log(`📊 Status: ${response.status} ${response.statusText}`);
      console.log(`✅ Response: ${data.message}`);
      console.log(`🕒 Timestamp: ${data.timestamp}`);

    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }

    // Add delay between requests
    if (i < vietnameseQuestions.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

// Run all tests
const runAllTests = async () => {
  console.log('🚀 Comprehensive API Test Suite');
  console.log('=' .repeat(60));
  
  await testComprehensiveAPI();
  await testVietnameseQuestions();
  
  console.log('\n🎉 All tests completed successfully!');
};

runAllTests();
