const https = require('https');

// Test the API with the new Vietnamese question about days in the month
const testMonthDays = async () => {
  console.log('🧪 Testing Vietnamese Month Days Question');
  console.log('=' .repeat(50));

  const question = "tháng này có bao nhiêu ngày";
  const model = "gpt-5-nano";

  // Calculate expected response
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const expectedResponse = `Tháng ${month} có ${daysInMonth} ngày`;

  console.log(`💬 Vietnamese Question: "${question}"`);
  console.log(`🤖 Model: ${model}`);
  console.log(`📅 Current month: ${month}/${year}`);
  console.log(`📊 Days in current month: ${daysInMonth}`);
  console.log(`📝 Expected response: "${expectedResponse}"`);
  console.log('⏳ Sending request to API...\n');

  try {
    const response = await fetch('https://chat-gpt-api.pages.dev/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: question,
        model: model
      })
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('\n✅ API Response:');
    console.log(JSON.stringify(data, null, 2));
    
    console.log('\n📝 Response Analysis:');
    console.log(`- Message: ${data.message}`);
    console.log(`- Expected: ${expectedResponse}`);
    
    if (data.message === expectedResponse) {
      console.log('\n🎉 SUCCESS: API returned the correct number of days in the month!');
    } else if (data.message.includes('Tháng') && data.message.includes('có') && data.message.includes('ngày')) {
      console.log('\n✅ PARTIAL SUCCESS: API returned Vietnamese month format, but may not match exactly');
      console.log(`   Got: "${data.message}"`);
      console.log(`   Expected: "${expectedResponse}"`);
    } else {
      console.log('\n❌ FAILED: API did not return the expected Vietnamese month format');
      console.log('💡 The API may still be using the old response format');
    }

    // Simulate puter.print() output
    console.log('\n🖨️  Simulating puter.print() output:');
    console.log('─'.repeat(50));
    console.log(data.message);
    console.log('─'.repeat(50));

  } catch (error) {
    console.error('\n❌ Error testing API:');
    console.error(`Error: ${error.message}`);
  }
};

// Test the original date question as well
const testDateQuestion = async () => {
  console.log('\n\n🧪 Testing Original Date Question');
  console.log('=' .repeat(50));

  const question = "hôm nay là thứ mấy";
  const model = "gpt-5-nano";

  // Calculate expected response
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const expectedResponse = `ngày ${day} tháng ${month} năm ${year}`;

  console.log(`💬 Vietnamese Question: "${question}"`);
  console.log(`📝 Expected response: "${expectedResponse}"`);
  console.log('⏳ Sending request to API...\n');

  try {
    const response = await fetch('https://chat-gpt-api.pages.dev/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: question,
        model: model
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    console.log(`📄 Response: ${data.message}`);
    
    if (data.message === expectedResponse) {
      console.log('\n🎉 SUCCESS: Date question also working correctly!');
    } else {
      console.log('\n⚠️  Date question may still be using old format');
    }

  } catch (error) {
    console.error('\n❌ Error testing date question:');
    console.error(`Error: ${error.message}`);
  }
};

// Run both tests
const runTests = async () => {
  console.log('🚀 Vietnamese Month Days Test Suite');
  console.log('=' .repeat(50));
  
  await testMonthDays();
  await testDateQuestion();
  
  console.log('\n🏁 All tests completed!');
};

runTests();
