# n8n HTTP Request Setup Guide

## Method 1: Import Complete Workflow

### Step 1: Import the Workflow
1. Open your n8n instance
2. Click "Import from file" or "Import from URL"
3. Upload the `n8n-http-request-workflow.json` file
4. Update the URL in the "Send to AI API" node to your actual Cloudflare Worker domain

### Step 2: Activate the Workflow
1. Click the "Activate" toggle to enable the workflow
2. Test by sending a POST request to your webhook URL

## Method 2: Manual Setup

### Step 1: Create Webhook Trigger
1. Add a "Webhook" node to your canvas
2. Configure:
   - **HTTP Method**: POST
   - **Path**: `ai-chat-request` (or any path you prefer)
   - **Response Mode**: "Respond to Webhook"
3. Copy the webhook URL for testing

### Step 2: Add HTTP Request Node
1. Add an "HTTP Request" node
2. Connect it to your Webhook node
3. Configure the HTTP Request:

#### Basic Settings:
- **URL**: `https://your-worker-domain.workers.dev/api/chat`
- **Method**: POST
- **Authentication**: None

#### Headers:
Add a header parameter:
- **Name**: `Content-Type`
- **Value**: `application/json`

#### Body:
Set **Body Content Type** to "JSON" and add these parameters:

```json
{
  "message": "={{ $json.message || 'Hello, how can I help you today?' }}",
  "model": "={{ $json.model || 'gpt-5-nano' }}",
  "stream": "={{ $json.stream || false }}"
}
```

#### Advanced Settings:
- **Timeout**: 30000 (30 seconds)
- **Ignore SSL Issues**: False (unless testing locally)

### Step 3: Add Response Node
1. Add a "Respond to Webhook" node
2. Connect it to your HTTP Request node
3. Configure:
   - **Respond With**: JSON
   - **Response Body**:

```json
{
  "success": true,
  "original_message": "={{ $('Webhook').item.json.message }}",
  "ai_response": "={{ $('HTTP Request').item.json.message }}",
  "model_used": "={{ $('HTTP Request').item.json.model }}",
  "timestamp": "={{ $('HTTP Request').item.json.timestamp }}"
}
```

### Step 4: Add Error Handling (Optional)
1. Add an "IF" node between HTTP Request and Response
2. Configure condition:
   - **Left Value**: `={{ $json.error }}`
   - **Operator**: exists
3. Create two response paths:
   - **True**: Error response
   - **False**: Success response

## Testing the Setup

### Test with cURL:
```bash
curl -X POST https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is artificial intelligence?",
    "model": "gpt-5-nano"
  }'
```

### Test with Postman:
1. Set method to POST
2. URL: `https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "message": "Explain machine learning",
  "model": "gpt-4o"
}
```

### Test with Browser (JavaScript):
```javascript
fetch('https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'Hello from browser',
    model: 'gpt-5-mini'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## Expected Response Format

### Success Response:
```json
{
  "success": true,
  "original_message": "What is artificial intelligence?",
  "ai_response": "Artificial intelligence (AI) is a branch of computer science...",
  "model_used": "gpt-5-nano",
  "timestamp": "2024-12-18T10:30:00.000Z"
}
```

### Error Response:
```json
{
  "success": false,
  "error": "Message is required",
  "original_message": "",
  "timestamp": "2024-12-18T10:30:00.000Z"
}
```

## Available Models for Testing

You can test with different models by changing the `model` parameter:

- `gpt-5-nano` - Fastest response
- `gpt-5-mini` - Balanced performance
- `gpt-5` - Most advanced
- `gpt-4o` - High quality
- `gpt-4o-mini` - Fast GPT-4o
- `o1` - Reasoning model
- `o1-mini` - Fast reasoning
- `o3` - Latest model
- `o3-mini` - Fast o3

## Troubleshooting

### Common Issues:

1. **Timeout Error**: Increase timeout in HTTP Request node
2. **CORS Error**: Ensure your Cloudflare Worker has CORS headers
3. **Invalid JSON**: Check your request body format
4. **Webhook Not Triggering**: Verify the webhook URL is correct
5. **Model Not Found**: Use supported model names from the list above

### Debug Tips:

1. Enable "Continue on Fail" in HTTP Request node
2. Add "Set" nodes to log intermediate values
3. Check n8n execution logs for detailed error messages
4. Test the Cloudflare Worker endpoint directly with cURL first

## Production Considerations

1. **Rate Limiting**: Implement rate limiting in your workflow
2. **Error Handling**: Add comprehensive error handling
3. **Logging**: Log requests and responses for monitoring
4. **Security**: Validate input data and implement authentication if needed
5. **Monitoring**: Set up alerts for failed requests

---

**Your n8n workflow is now ready to send messages to your AI-powered Cloudflare Worker! 🚀**
