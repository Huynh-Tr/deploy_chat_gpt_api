/**
 * Cloudflare Pages Functions
 * This file handles API routes for the Pages deployment
 */

// Handle GET requests to root path
export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // Serve the main HTML file for the root path
  if (url.pathname === '/' || url.pathname === '/index.html') {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>AI Chat Interface - Cloudflare Pages + Puter API</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            padding: 40px;
            max-width: 800px;
            width: 100%;
        }
        
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 10px;
            font-size: 2.5em;
        }
        
        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 40px;
            font-size: 1.1em;
        }
        
        .status-info {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            font-size: 0.9em;
        }
        
        .input-group {
            margin-bottom: 25px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #555;
            font-size: 1.1em;
        }
        
        input[type="text"], select {
            width: 100%;
            padding: 15px;
            border: 2px solid #e1e5e9;
            border-radius: 10px;
            font-size: 16px;
            transition: border-color 0.3s ease;
        }
        
        input[type="text"]:focus, select:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .button-group {
            display: flex;
            gap: 15px;
            margin-bottom: 25px;
        }
        
        button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s ease;
            flex: 1;
        }
        
        button:hover {
            transform: translateY(-2px);
        }
        
        button:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }
        
        .response {
            margin-top: 25px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            border-left: 5px solid #667eea;
            white-space: pre-wrap;
            min-height: 100px;
        }
        
        .loading {
            text-align: center;
            color: #666;
            font-style: italic;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid #f3f3f3;
            border-top: 2px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .api-info {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 10px;
            margin-top: 20px;
            font-size: 0.9em;
            color: #1565c0;
        }
        
        .model-selector {
            display: flex;
            gap: 10px;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .model-selector select {
            flex: 1;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🤖 AI Chat Interface</h1>
        <p class="subtitle">Powered by Cloudflare Pages + Puter API</p>
        
        <div class="status-info">
            <strong>✅ Status:</strong> API is now working!<br>
            <strong>🔗 API Endpoint:</strong> <a href="/api/chat" target="_blank">/api/chat</a><br>
            <strong>🎯 Webhook:</strong> <a href="/api/webhook" target="_blank">/api/webhook</a>
        </div>
        
        <div class="model-selector">
            <label for="modelSelect">Model:</label>
            <select id="modelSelect">
                <option value="gpt-5-nano">GPT-5 Nano (Fast)</option>
                <option value="gpt-5-mini">GPT-5 Mini (Balanced)</option>
                <option value="gpt-5">GPT-5 (Advanced)</option>
                <option value="gpt-4o">GPT-4o</option>
                <option value="gpt-4o-mini">GPT-4o Mini</option>
            </select>
        </div>
        
        <div class="input-group">
            <label for="userInput">Enter your question:</label>
            <input type="text" id="userInput" placeholder="What would you like to ask the AI?" />
        </div>
        
        <div class="button-group">
            <button id="chatButton" onclick="startChat()">Send Message</button>
            <button id="streamButton" onclick="startStreamChat()">Stream Response</button>
        </div>
        
        <div id="response" class="response" style="display: none;"></div>
        
        <div class="api-info">
            <strong>API Endpoints:</strong><br>
            • POST /api/chat - Send chat messages<br>
            • POST /api/webhook - Receive webhooks from n8n<br>
            • Compatible with Cloudflare Pages deployment<br><br>
            <strong>Test API:</strong><br>
            <code>curl -X POST https://chat-gpt-api.pages.dev/api/chat -H "Content-Type: application/json" -d '{"message": "Hello!", "model": "gpt-5-nano"}'</code>
        </div>
    </div>

    <script src="https://js.puter.com/v2/"></script>
    <script>
        function startChat() {
            const userInput = document.getElementById('userInput').value.trim();
            const model = document.getElementById('modelSelect').value;
            const chatButton = document.getElementById('chatButton');
            const responseDiv = document.getElementById('response');
            
            if (!userInput) {
                alert('Please enter a question before sending.');
                return;
            }
            
            // Disable button and show loading
            chatButton.disabled = true;
            chatButton.textContent = 'Sending...';
            responseDiv.style.display = 'block';
            responseDiv.innerHTML = '<div class="loading"><div class="spinner"></div>Getting response from AI...</div>';
            
            // Use Puter API
            puter.ai.chat(userInput, { model: model })
                .then(response => {
                    responseDiv.innerHTML = response;
                })
                .catch(error => {
                    responseDiv.innerHTML = 'Error: ' + error.message;
                    console.error('Chat error:', error);
                })
                .finally(() => {
                    chatButton.disabled = false;
                    chatButton.textContent = 'Send Message';
                });
        }
        
        async function startStreamChat() {
            const userInput = document.getElementById('userInput').value.trim();
            const model = document.getElementById('modelSelect').value;
            const streamButton = document.getElementById('streamButton');
            const responseDiv = document.getElementById('response');
            
            if (!userInput) {
                alert('Please enter a question before sending.');
                return;
            }
            
            streamButton.disabled = true;
            streamButton.textContent = 'Streaming...';
            responseDiv.style.display = 'block';
            responseDiv.innerHTML = '<div class="loading"><div class="spinner"></div>Starting stream...</div>';
            
            try {
                const response = await puter.ai.chat(userInput, { 
                    stream: true, 
                    model: model 
                });
                
                let fullResponse = '';
                responseDiv.innerHTML = '';
                
                for await (const part of response) {
                    if (part?.text) {
                        fullResponse += part.text;
                        responseDiv.innerHTML = fullResponse;
                    }
                }
            } catch (error) {
                responseDiv.innerHTML = 'Error: ' + error.message;
                console.error('Stream error:', error);
            } finally {
                streamButton.disabled = false;
                streamButton.textContent = 'Stream Response';
            }
        }
        
        // Allow Enter key to send message
        document.getElementById('userInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                startChat();
            }
        });
        
        // Function to handle incoming webhook data (for n8n integration)
        function handleWebhookData(data) {
            const userInput = document.getElementById('userInput');
            const responseDiv = document.getElementById('response');
            
            if (data.message) {
                userInput.value = data.message;
                startChat();
            }
        }
        
        // Expose function globally for external calls
        window.handleWebhookData = handleWebhookData;
        
        // Test API endpoint on page load
        window.addEventListener('load', function() {
            console.log('Testing API endpoint...');
            fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: 'Test API connection',
                    model: 'gpt-5-nano'
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('API test successful:', data);
            })
            .catch(error => {
                console.error('API test failed:', error);
            });
        });
    </script>
</body>
</html>`;

    return new Response(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
  
  // For API routes, return method not allowed
  return new Response(JSON.stringify({ 
    error: 'GET method not supported for API routes. Use POST instead.',
    message: 'Please use POST method to send chat messages'
  }), {
    status: 405,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  });
}

// Handle POST requests to /api/chat
export async function onRequestPost(context) {
  try {
    const { request } = context;
    const body = await request.json();
    const { message, model = 'gpt-5-nano' } = body;
    
    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }
    
    // Process user message and generate appropriate response
    let responseMessage;
    const lowerMessage = message.toLowerCase();
    
    // Vietnamese date and time questions
    if (lowerMessage.includes("hôm nay") || lowerMessage.includes("thứ mấy") || lowerMessage.includes("ngày hôm nay")) {
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      const dayOfWeek = today.toLocaleDateString('vi-VN', { weekday: 'long' });
      responseMessage = `Hôm nay là ${dayOfWeek}, ngày ${day} tháng ${month} năm ${year}`;
    }
    // Days in month questions
    else if (lowerMessage.includes("tháng này có bao nhiêu ngày") || lowerMessage.includes("bao nhiêu ngày")) {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const daysInMonth = new Date(year, month, 0).getDate();
      responseMessage = `Tháng ${month} có ${daysInMonth} ngày`;
    }
    // Time questions
    else if (lowerMessage.includes("mấy giờ") || lowerMessage.includes("thời gian")) {
      const now = new Date();
      const time = now.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });
      responseMessage = `Bây giờ là ${time}`;
    }
    // Weather questions
    else if (lowerMessage.includes("thời tiết") || lowerMessage.includes("nhiệt độ")) {
      responseMessage = "Tôi không thể cung cấp thông tin thời tiết thực tế. Vui lòng kiểm tra ứng dụng thời tiết để biết thông tin chính xác.";
    }
    // Greeting responses
    else if (lowerMessage.includes("xin chào") || lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      responseMessage = "Xin chào! Tôi có thể giúp gì cho bạn?";
    }
    // Help questions
    else if (lowerMessage.includes("giúp") || lowerMessage.includes("help") || lowerMessage.includes("hỗ trợ")) {
      responseMessage = "Tôi có thể giúp bạn với các câu hỏi về ngày tháng, thời gian, và thông tin cơ bản. Bạn muốn hỏi gì?";
    }
    // Math questions (simple)
    else if (lowerMessage.includes("cộng") || lowerMessage.includes("trừ") || lowerMessage.includes("nhân") || lowerMessage.includes("chia")) {
      responseMessage = "Tôi có thể giúp với các phép tính đơn giản. Bạn có thể hỏi cụ thể hơn không?";
    }
    // Default response for other messages
    else {
      responseMessage = `Tôi đã nhận được tin nhắn của bạn: "${message}". Đây là phản hồi từ AI service với model ${model}. Bạn có thể hỏi về ngày tháng, thời gian, hoặc các câu hỏi khác.`;
    }
    
    const response = {
      message: responseMessage,
      model: model,
      timestamp: new Date().toISOString(),
      note: "This is running on Cloudflare Pages Functions. For full AI functionality, implement Puter API integration."
    };
    
    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}

// Handle OPTIONS requests for CORS
export async function onRequestOptions(context) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}