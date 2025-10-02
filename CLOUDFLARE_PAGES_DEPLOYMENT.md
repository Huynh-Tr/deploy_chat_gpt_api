# 🚀 Cloudflare Pages Deployment Guide

## Current Issue
Your site is deployed at [https://chat-gpt-api.pages.dev/](https://chat-gpt-api.pages.dev/) but the API endpoints are returning HTML instead of JSON responses.

## 🔧 Fix Required

### 1. Add the Worker File
The `_worker.js` file must be in the **root directory** of your Cloudflare Pages deployment.

### 2. File Structure for Cloudflare Pages
```
├── _worker.js          # ← This file handles API routing
├── index.html          # Your main web app
├── package.json        # Dependencies
└── other files...
```

### 3. Deploy to Cloudflare Pages

#### Option A: Using Wrangler (Recommended)
```bash
# Install wrangler if not already installed
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy to Pages
wrangler pages deploy . --project-name chat-gpt-api
```

#### Option B: Using Git Integration
1. Push your code to GitHub/GitLab
2. Connect your repository to Cloudflare Pages
3. Set build command: `echo "No build needed"`
4. Set output directory: `.`
5. Deploy

#### Option C: Direct Upload
1. Go to Cloudflare Dashboard → Pages
2. Upload your project folder
3. Make sure `_worker.js` is in the root

## 🧪 Test Your Deployment

### Run the test script:
```bash
node test-pages-deployment.js
```

### Manual test with cURL:
```bash
# Test API endpoint
curl -X POST https://chat-gpt-api.pages.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello from test!",
    "model": "gpt-5-nano"
  }'
```

### Expected Response:
```json
{
  "message": "AI Response to: \"Hello from test!\". This is a mock response...",
  "model": "gpt-5-nano",
  "timestamp": "2024-12-18T10:30:00.000Z",
  "note": "This is running on Cloudflare Pages..."
}
```

## 🔍 Troubleshooting

### Problem: API returns HTML instead of JSON
**Solution:** Ensure `_worker.js` is in the root directory and redeploy.

### Problem: 404 errors on API endpoints
**Solution:** Check that Cloudflare Pages is configured to use Functions.

### Problem: CORS errors
**Solution:** The `_worker.js` file includes CORS headers - ensure it's deployed.

## 📋 Verification Checklist

- [ ] `_worker.js` is in the root directory
- [ ] Site loads at https://chat-gpt-api.pages.dev/
- [ ] API endpoint returns JSON: `/api/chat`
- [ ] Webhook endpoint returns JSON: `/api/webhook`
- [ ] CORS headers are present
- [ ] Error handling works (400 status for invalid requests)

## 🔗 n8n Integration

Once your API is working, update your n8n workflow:

1. **Webhook URL:** `https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a`
2. **HTTP Request URL:** `https://chat-gpt-api.pages.dev/api/chat`
3. **Test the complete flow**

## 🎯 Quick Fix Commands

```bash
# 1. Ensure _worker.js is in root
ls -la _worker.js

# 2. Test locally first
node test-pages-deployment.js

# 3. Deploy to Cloudflare Pages
wrangler pages deploy . --project-name chat-gpt-api

# 4. Test deployed site
curl -X POST https://chat-gpt-api.pages.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Test", "model": "gpt-5-nano"}'
```

---

**After deploying `_worker.js`, your API endpoints should return JSON responses instead of HTML! 🎉**
