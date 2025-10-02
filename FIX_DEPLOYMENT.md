# 🔧 Fix Your Cloudflare Pages Deployment

## Current Issue
Your site at [https://chat-gpt-api.pages.dev/](https://chat-gpt-api.pages.dev/) is working, but the API endpoints return **405 Method Not Allowed** instead of JSON responses.

## Root Cause
The `_worker.js` file is not deployed or not working properly. This file is required for Cloudflare Pages to handle API routes.

## 🚀 Quick Fix

### Step 1: Deploy with the Worker File
```bash
# Make sure you're in the Deploy directory
cd D:\Deploy

# Deploy to Cloudflare Pages with the worker
npm run deploy:pages
```

### Step 2: Verify the Fix
```bash
# Test your deployment
npm run test:pages
```

### Step 3: Test API Endpoint
```bash
curl -X POST https://chat-gpt-api.pages.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello from test!",
    "model": "gpt-5-nano"
  }'
```

## 📁 Required Files

Make sure these files are in your deployment:
- ✅ `_worker.js` - **CRITICAL** - Handles API routing
- ✅ `index.html` - Your web app
- ✅ `package.json` - Dependencies
- ✅ Other configuration files

## 🔍 What Should Happen

### Before Fix:
- GET `/` → ✅ HTML page (working)
- POST `/api/chat` → ❌ 405 Method Not Allowed
- POST `/api/webhook` → ❌ 405 Method Not Allowed

### After Fix:
- GET `/` → ✅ HTML page
- POST `/api/chat` → ✅ JSON response
- POST `/api/webhook` → ✅ JSON response

## 📋 Expected API Response

```json
{
  "message": "AI Response to: \"Hello from test!\". This is a mock response...",
  "model": "gpt-5-nano",
  "timestamp": "2024-12-18T10:30:00.000Z",
  "note": "This is running on Cloudflare Pages..."
}
```

## 🔗 n8n Integration After Fix

Once your API is working:

1. **Your n8n webhook:** `https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a`
2. **Your API endpoint:** `https://chat-gpt-api.pages.dev/api/chat`
3. **Test the complete flow**

## 🧪 Test Commands

```bash
# Test your webhook
npm run test:webhook

# Test your pages deployment
npm run test:pages

# Manual API test
curl -X POST https://chat-gpt-api.pages.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Test", "model": "gpt-5-nano"}'
```

## 🎯 Success Indicators

- [ ] Main page loads: https://chat-gpt-api.pages.dev/
- [ ] API returns JSON: POST to `/api/chat`
- [ ] Webhook returns JSON: POST to `/api/webhook`
- [ ] CORS headers present
- [ ] Error handling works (400 for invalid requests)

---

**Run `npm run deploy:pages` to fix your deployment! 🚀**
