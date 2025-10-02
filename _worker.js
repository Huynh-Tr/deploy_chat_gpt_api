/**
 * Cloudflare Pages Worker for handling API requests and serving the web app
 * This file should be placed in the root directory for Cloudflare Pages
 */

// Handle incoming requests
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return handleCORS()
  }
  
  // Serve the main HTML file for the root path
  if (url.pathname === '/' || url.pathname === '/index.html') {
    return new Response(getHTML(), {
      headers: {
        'Content-Type': 'text/html',
        ...getCORSHeaders()
      }
    })
  }
  
  // Handle API endpoint for n8n integration
  if (url.pathname === '/api/chat' && request.method === 'POST') {
    return handleChatAPI(request)
  }
  
  // Handle webhook endpoint for n8n
  if (url.pathname === '/api/webhook' && request.method === 'POST') {
    return handleWebhook(request)
  }
  
  // For Cloudflare Pages, try to serve static files first
  // This will be handled by Cloudflare Pages for static assets
  return new Response('Not Found', { 
    status: 404,
    headers: getCORSHeaders()
  })
}

// Handle CORS preflight requests
function handleCORS() {
  return new Response(null, {
    headers: getCORSHeaders()
  })
}

// Get CORS headers
function getCORSHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

// Handle chat API requests
async function handleChatAPI(request) {
  try {
    const body = await request.json()
    const { message, model = 'gpt-5-nano', stream = false } = body
    
    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...getCORSHeaders()
        }
      })
    }
    
    // In a real implementation, you would call the Puter API here
    // For now, we'll return a mock response
    const response = {
      message: `AI Response to: "${message}". This is a mock response. The actual implementation would call Puter API with model: ${model}`,
      model: model,
      timestamp: new Date().toISOString(),
      note: "This is running on Cloudflare Pages. For full AI functionality, implement Puter API integration."
    }
    
    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
        ...getCORSHeaders()
      }
    })
    
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...getCORSHeaders()
      }
    })
  }
}

// Handle webhook requests from n8n
async function handleWebhook(request) {
  try {
    const body = await request.json()
    
    // Log the webhook data (you can store this in KV or send to external service)
    console.log('Webhook received:', JSON.stringify(body))
    
    // Process the webhook data and potentially trigger AI response
    const response = {
      status: 'received',
      message: 'Webhook processed successfully',
      timestamp: new Date().toISOString(),
      data: body
    }
    
    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
        ...getCORSHeaders()
      }
    })
    
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid webhook data' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...getCORSHeaders()
      }
    })
  }
}

// HTML content for the web app
function getHTML() {
  return `<!DOCTYPE html>
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
        
        .status-info {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🤖 AI Chat Interface</h1>
        <p class="subtitle">Powered by Cloudflare Pages + Puter API</p>
        
        <div class="status-info">
            <strong>📡 Status:</strong> Running on Cloudflare Pages<br>
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
</html>`
}
