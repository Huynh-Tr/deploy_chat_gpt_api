# 🔄 Webhook URL Revision Guide

## 🎯 Your Correct Webhook Configuration

### Webhook URL (for external requests)
```
https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a
```

### Webhook Path (for n8n node configuration)
```
webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a
```

## 📋 Files That Reference This URL

### 1. Configuration Files
- ✅ `WEBHOOK_REFERENCE.md` - Updated with correct URL
- ✅ `n8n-webhook-config.json` - Contains webhook configuration
- ✅ `n8n-simple-workflow.json` - Simple workflow configuration
- ✅ `n8n-complete-workflow.json` - Complete workflow configuration

### 2. Test Scripts
- ✅ `test-webhook.js` - Tests your webhook
- ✅ `test-webhook-url.js` - Compares correct vs incorrect URLs
- ✅ `test-n8n-workflow.js` - Tests complete workflow
- ✅ `curl-examples.md` - Contains cURL examples

### 3. Documentation Files
- ✅ `N8N_WORKFLOW_SETUP.md` - Setup guide
- ✅ `FIX_WEBHOOK_STEP_BY_STEP.md` - Fix guide
- ✅ `WEBHOOK_TEST_GUIDE.md` - Testing guide

## 🚀 Quick Setup Commands

### Test Your Webhook
```bash
# Test with cURL
curl -X POST https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello from test!",
    "model": "gpt-5-nano"
  }'

# Test with our script
node test-webhook.js

# Test URL comparison
node test-webhook-url.js
```

### Import Workflow to n8n
1. **Download**: `n8n-simple-workflow.json`
2. **Go to**: https://vn.n8n.asia
3. **Import**: Click "Import from file"
4. **Upload**: The JSON file
5. **Activate**: Toggle the "Active" switch ON
6. **Test**: Use the webhook URL

## 🔧 n8n Node Configuration

### Webhook Node Settings
- **HTTP Method**: POST
- **Path**: `webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a`
- **Response Mode**: "Respond to Webhook"

### HTTP Request Node Settings
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

## 🧪 Testing Scenarios

### Scenario 1: Workflow Not Active
**Response**: 404 - "Webhook not registered"
**Solution**: Activate the workflow in n8n

### Scenario 2: Wrong HTTP Method
**Response**: 404 - "This webhook is not registered for GET requests"
**Solution**: Use POST method, not GET (browser)

### Scenario 3: Wrong URL Path
**Response**: 404 - "Webhook not found"
**Solution**: Use correct path without duplicates

### Scenario 4: Success
**Response**: 200 - JSON with AI response
**Expected**:
```json
{
  "success": true,
  "original_message": "Hello from test!",
  "ai_response": "AI Response to: \"Hello from test!\"...",
  "model_used": "gpt-5-nano",
  "timestamp": "2024-12-18T10:30:00.000Z"
}
```

## 📊 URL Structure Breakdown

```
https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a
│              │ │          │
│              │ │          └─ Webhook ID (unique identifier)
│              │ └─ Webhook path (configured in n8n)
│              └─ n8n instance domain
└─ Protocol
```

## 🎯 Key Points

1. **Correct URL**: `https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a`
2. **Correct Path**: `webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a`
3. **Use POST**: Don't test in browser (GET), use cURL or tools
4. **Activate Workflow**: Must be active in n8n for webhook to work
5. **JSON Body**: Include `message` and `model` fields

## 🔗 Integration Points

### Your API Endpoint
```
https://chat-gpt-api.pages.dev/api/chat
```

### Complete Flow
```
External Request → n8n Webhook → Cloudflare API → Puter API → Response
```

### Test Commands
```bash
# Test complete workflow
npm run test:workflow

# Test webhook only
npm run test:webhook

# Test URL comparison
npm run test:webhook-url
```

## ✅ Verification Checklist

- [ ] Webhook URL is correct (no duplicates)
- [ ] n8n workflow is ACTIVE
- [ ] Webhook node path matches: `webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a`
- [ ] HTTP Request node points to: `https://chat-gpt-api.pages.dev/api/chat`
- [ ] Using POST method for testing
- [ ] JSON body includes required fields

---

**Your webhook URL is correctly configured as: `https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a` 🚀**
