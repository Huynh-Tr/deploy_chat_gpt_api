# 🔧 Fix Your n8n Webhook - Step by Step

## 🚨 Issues Identified

1. **Duplicate URL path**: You're using `/webhook-test/webhook-test/` instead of `/webhook-test/`
2. **GET vs POST**: You're testing in browser (GET) but n8n webhooks need POST requests
3. **Workflow not active**: The webhook is not registered because the workflow isn't active

## 🚀 Step-by-Step Fix

### Step 1: Go to Your n8n Instance
1. **Open**: https://vn.n8n.asia
2. **Login** to your n8n account
3. **Find your workflow** (or create a new one)

### Step 2: Create/Configure the Workflow

#### Option A: Import Pre-built Workflow
1. **Download**: `n8n-simple-workflow.json` from your Deploy folder
2. **In n8n**: Click "Import from file"
3. **Upload** the JSON file
4. **Save** the workflow

#### Option B: Create Manually
1. **Add Webhook Node**:
   - Drag "Webhook" node to canvas
   - Configure:
     - **HTTP Method**: POST
     - **Path**: `webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a`
     - **Response Mode**: "Respond to Webhook"

2. **Add HTTP Request Node**:
   - Drag "HTTP Request" node to canvas
   - Connect to Webhook node
   - Configure:
     - **URL**: `https://chat-gpt-api.pages.dev/api/chat`
     - **Method**: POST
     - **Headers**: `Content-Type: application/json`
     - **Body** (JSON):
     ```json
     {
       "message": "={{ $json.message || 'Hello from n8n!' }}",
       "model": "={{ $json.model || 'gpt-5-nano' }}"
     }
     ```

3. **Add Response Node**:
   - Drag "Respond to Webhook" node to canvas
   - Connect to HTTP Request node
   - Configure:
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

### Step 3: Activate the Workflow
1. **Save** the workflow
2. **Toggle the "Active" switch** to ON (this is critical!)
3. **Wait** for the workflow to activate

### Step 4: Test the Webhook

#### Test 1: In n8n (Recommended)
1. **Click "Execute Workflow"** button in n8n
2. **Copy the webhook URL** that appears
3. **Test with the provided data**

#### Test 2: With cURL
```bash
curl -X POST https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello from test!",
    "model": "gpt-5-nano"
  }'
```

#### Test 3: With our Script
```bash
node test-webhook.js
```

## 🎯 Expected Results

### ✅ Success Response
```json
{
  "success": true,
  "original_message": "Hello from test!",
  "ai_response": "AI Response to: \"Hello from test!\". This is a mock response...",
  "model_used": "gpt-5-nano",
  "timestamp": "2024-12-18T10:30:00.000Z"
}
```

### ❌ Still Getting 404?
If you still get 404 errors:

1. **Check workflow is ACTIVE** (toggle switch ON)
2. **Check webhook path** is exactly: `webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a`
3. **Test in n8n first** using "Execute Workflow"
4. **Check n8n logs** in "Executions" tab

## 🔍 Troubleshooting

### Problem: "Webhook not registered"
**Solution**: Make sure the workflow is ACTIVE and saved

### Problem: "Wrong URL"
**Solution**: Use the correct URL without duplicates:
- ✅ `https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a`
- ❌ `https://vn.n8n.asia/webhook-test/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a`

### Problem: "GET request error"
**Solution**: Use POST method, not browser (GET)

### Problem: API not responding
**Solution**: Test your Cloudflare API directly:
```bash
curl -X POST https://chat-gpt-api.pages.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Test", "model": "gpt-5-nano"}'
```

## 📋 Quick Checklist

- [ ] n8n workflow is ACTIVE (toggle switch ON)
- [ ] Webhook path is correct (no duplicates)
- [ ] Using POST method, not GET
- [ ] Using correct URL: `https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a`
- [ ] Content-Type header: `application/json`
- [ ] Request body has `message` and `model` fields

## 🚀 Quick Test Commands

```bash
# Test the webhook
curl -X POST https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!", "model": "gpt-5-nano"}'

# Test the API directly
curl -X POST https://chat-gpt-api.pages.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!", "model": "gpt-5-nano"}'

# Run our test script
node test-webhook.js
```

## 🎉 Success Indicators

- ✅ Workflow shows as ACTIVE in n8n
- ✅ Webhook URL responds with JSON (not 404)
- ✅ API endpoint returns AI response
- ✅ Complete flow: webhook → n8n → API → response works

---

**The main issue is that your workflow needs to be ACTIVE in n8n! 🚀**
