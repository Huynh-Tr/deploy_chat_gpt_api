# 🔄 n8n Workflow Setup Guide

## 📋 Overview

This guide shows you how to set up your n8n workflow to work with your deployed Cloudflare Pages API.

## 🎯 Your Configuration

- **n8n Instance**: `https://vn.n8n.asia`
- **Webhook URL**: `https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a`
- **API Endpoint**: `https://chat-gpt-api.pages.dev/api/chat`

## 🚀 Quick Setup

### Option 1: Import Complete Workflow (Recommended)

1. **Download the workflow file**: `n8n-complete-workflow.json`
2. **Open n8n**: Go to your n8n instance
3. **Import workflow**: Click "Import from file" and upload the JSON file
4. **Activate workflow**: Toggle the "Active" switch
5. **Test**: Send a POST request to your webhook URL

### Option 2: Import Simple Workflow

1. **Download**: `n8n-simple-workflow.json`
2. **Import**: Same process as above
3. **Activate**: Toggle the "Active" switch

### Option 3: Manual Setup

Follow the step-by-step guide below to create the workflow manually.

## 🔧 Manual Setup Steps

### Step 1: Create Webhook Trigger

1. **Add Webhook Node**
   - Drag "Webhook" node to canvas
   - Configure:
     - **HTTP Method**: POST
     - **Path**: `webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a`
     - **Response Mode**: "Respond to Webhook"

2. **Copy Webhook URL**
   - The webhook URL will be: `https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a`

### Step 2: Add HTTP Request Node

1. **Add HTTP Request Node**
   - Drag "HTTP Request" node to canvas
   - Connect it to the Webhook node

2. **Configure HTTP Request**
   - **URL**: `https://chat-gpt-api.pages.dev/api/chat`
   - **Method**: POST
   - **Authentication**: None

3. **Add Headers**
   - Add header parameter:
     - **Name**: `Content-Type`
     - **Value**: `application/json`

4. **Configure Body**
   - Set **Body Content Type** to "JSON"
   - Add these parameters:
   ```json
   {
     "message": "={{ $json.message || 'Hello from n8n!' }}",
     "model": "={{ $json.model || 'gpt-5-nano' }}"
   }
   ```

5. **Advanced Settings**
   - **Timeout**: 30000 (30 seconds)

### Step 3: Add Response Node

1. **Add Respond to Webhook Node**
   - Drag "Respond to Webhook" node to canvas
   - Connect it to the HTTP Request node

2. **Configure Response**
   - **Respond With**: JSON
   - **Response Body**:
   ```json
   {
     "success": true,
     "original_message": "={{ $('Webhook Trigger').item.json.message }}",
     "ai_response": "={{ $('HTTP Request').item.json.message }}",
     "model_used": "={{ $('HTTP Request').item.json.model }}",
     "timestamp": "={{ $('HTTP Request').item.json.timestamp }}"
   }
   ```

### Step 4: Activate Workflow

1. **Save the workflow**
2. **Toggle the "Active" switch** to enable it
3. **Test the workflow**

## 🧪 Testing Your Workflow

### Test with cURL

```bash
curl -X POST https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is artificial intelligence?",
    "model": "gpt-5-nano"
  }'
```

### Test with Postman

1. **Method**: POST
2. **URL**: `https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a`
3. **Headers**: `Content-Type: application/json`
4. **Body** (raw JSON):
```json
{
  "message": "Explain machine learning",
  "model": "gpt-4o"
}
```

### Test with JavaScript

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

## 📊 Expected Response

### Success Response
```json
{
  "success": true,
  "original_message": "What is artificial intelligence?",
  "ai_response": "Artificial intelligence (AI) is a branch of computer science...",
  "model_used": "gpt-5-nano",
  "timestamp": "2024-12-18T10:30:00.000Z"
}
```

### Error Response (if API fails)
```json
{
  "success": false,
  "error": "API endpoint not responding",
  "original_message": "What is artificial intelligence?",
  "timestamp": "2024-12-18T10:30:00.000Z"
}
```

## 🔍 Troubleshooting

### Common Issues

1. **Workflow not triggering**
   - Check if workflow is active
   - Verify webhook URL is correct
   - Check n8n logs for errors

2. **API request failing**
   - Ensure Cloudflare Pages API is deployed with `_worker.js`
   - Test API endpoint directly: `https://chat-gpt-api.pages.dev/api/chat`
   - Check timeout settings (increase to 30+ seconds)

3. **CORS errors**
   - The Cloudflare Worker includes CORS headers
   - Ensure API is properly deployed

4. **Invalid JSON responses**
   - Check HTTP Request node body configuration
   - Verify Content-Type header is set

### Debug Steps

1. **Test API endpoint directly**:
   ```bash
   curl -X POST https://chat-gpt-api.pages.dev/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "test", "model": "gpt-5-nano"}'
   ```

2. **Check n8n execution logs**:
   - Go to "Executions" tab in n8n
   - View detailed logs for failed executions

3. **Test webhook without API call**:
   - Temporarily remove HTTP Request node
   - Return simple response to verify webhook works

## 🎯 Available Models

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

## 📋 Workflow Files

- **`n8n-complete-workflow.json`** - Full workflow with logging and error handling
- **`n8n-simple-workflow.json`** - Basic workflow for quick setup
- **`n8n-http-request-workflow.json`** - Alternative workflow configuration

## 🚀 Next Steps

1. **Import and activate** your chosen workflow
2. **Test** with the provided examples
3. **Monitor** n8n executions for any issues
4. **Customize** the workflow for your specific needs
5. **Scale** by adding more nodes or integrations

---

**Your n8n workflow is ready to process AI chat requests! 🎉**
