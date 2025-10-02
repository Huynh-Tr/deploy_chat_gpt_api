# 🔧 Webhook Testing Guide

## 🚨 Issue Identified

You're accessing the wrong URL with a GET request:

### ❌ Wrong URL (what you're using):
```
https://vn.n8n.asia/webhook-test/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a
```

### ✅ Correct URL:
```
https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a
```

## 🔍 Why This Happens

1. **Duplicate Path**: The URL has `/webhook-test/webhook-test/` instead of `/webhook-test/`
2. **GET vs POST**: Browsers make GET requests, but n8n webhooks expect POST requests
3. **Webhook Not Active**: The workflow might not be active in n8n

## 🚀 How to Fix and Test

### Step 1: Check Your n8n Workflow

1. **Go to your n8n instance**: https://vn.n8n.asia
2. **Find your workflow** with the webhook
3. **Make sure it's ACTIVE** (toggle switch should be ON)
4. **Check the webhook path** in the Webhook node:
   - Should be: `webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a`
   - NOT: `webhook-test/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a`

### Step 2: Test with Correct Method and URL

#### Option A: Using cURL (Recommended)
```bash
curl -X POST https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello from test!",
    "model": "gpt-5-nano"
  }'
```

#### Option B: Using our Test Script
```bash
node test-webhook.js
```

#### Option C: Using Postman
1. **Method**: POST
2. **URL**: `https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a`
3. **Headers**: `Content-Type: application/json`
4. **Body** (raw JSON):
```json
{
  "message": "Hello from Postman!",
  "model": "gpt-5-nano"
}
```

### Step 3: Check n8n Workflow Status

If you still get 404 errors:

1. **Activate the workflow** in n8n
2. **Check webhook URL** in the Webhook node settings
3. **Test in n8n** by clicking "Execute Workflow" button
4. **Check n8n logs** for any errors

## 🧪 Test Commands

### Quick Test
```bash
# Test with correct URL and POST method
curl -X POST https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a \
  -H "Content-Type: application/json" \
  -d '{"message": "Test", "model": "gpt-5-nano"}'
```

### Expected Success Response
```json
{
  "success": true,
  "original_message": "Test",
  "ai_response": "AI Response to: \"Test\". This is a mock response...",
  "model_used": "gpt-5-nano",
  "timestamp": "2024-12-18T10:30:00.000Z"
}
```

### Expected Error Response (if workflow not active)
```json
{
  "code": 404,
  "message": "The requested webhook \"1d2a2e0c-3a12-4c72-9efd-174d67247e1a\" is not registered.",
  "hint": "Click the 'Execute workflow' button on the canvas, then try again."
}
```

## 🔧 Troubleshooting Steps

### 1. Check Webhook Path in n8n
- Open your workflow in n8n
- Click on the Webhook node
- Verify the path is exactly: `webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a`

### 2. Activate the Workflow
- Make sure the workflow is ACTIVE (toggle switch ON)
- Save the workflow if you made changes

### 3. Test in n8n First
- Click "Execute Workflow" button in n8n
- This will show you the webhook URL and test it

### 4. Check n8n Logs
- Go to "Executions" tab in n8n
- Look for any error messages

### 5. Verify API Endpoint
- Test your Cloudflare API directly:
```bash
curl -X POST https://chat-gpt-api.pages.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Test", "model": "gpt-5-nano"}'
```

## 📋 Checklist

- [ ] Workflow is ACTIVE in n8n
- [ ] Webhook path is correct (no duplicates)
- [ ] Using POST method, not GET
- [ ] Using correct URL without duplicate paths
- [ ] Content-Type header is set to application/json
- [ ] Request body contains message and model fields

## 🎯 Quick Fix Summary

1. **Remove duplicate path**: Use `/webhook-test/` not `/webhook-test/webhook-test/`
2. **Use POST method**: Don't test in browser (GET), use cURL or Postman (POST)
3. **Activate workflow**: Make sure it's active in n8n
4. **Test properly**: Use the test script or cURL command

---

**The main issue is the duplicate path segment and using GET instead of POST! 🚀**
