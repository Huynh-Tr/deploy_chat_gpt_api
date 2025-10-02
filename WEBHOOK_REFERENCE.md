# 🎯 Your n8n Webhook Reference

## Webhook URL
```
https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a
```

## Quick cURL Test
```bash
curl -X POST https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello from test!",
    "model": "gpt-5-nano"
  }'
```

## Expected Response
```json
{
  "success": true,
  "original_message": "Hello from test!",
  "ai_response": "Hello! How can I help you today?",
  "model_used": "gpt-5-nano",
  "timestamp": "2024-12-18T10:30:00.000Z"
}
```

## Available Models
- `gpt-5-nano` - Fastest
- `gpt-5-mini` - Balanced  
- `gpt-5` - Advanced
- `gpt-4o` - High quality
- `gpt-4o-mini` - Fast GPT-4o
- `o1` - Reasoning model
- `o1-mini` - Fast reasoning
- `o3` - Latest model
- `o3-mini` - Fast o3

## Test Scripts
- `node test-webhook.js` - Test your webhook directly
- `node test-api.js` - Test Cloudflare Worker API
- `node test-setup.js` - Verify repository setup

## Workflow Flow
1. **Send message** → Your webhook URL
2. **n8n receives** → Processes the message
3. **HTTP Request** → Sends to Cloudflare Worker
4. **Worker calls** → Puter API for AI response
5. **Response flows back** → Through n8n to you

## Files Created
- ✅ `n8n-webhook-config.json` - Your webhook configuration
- ✅ `test-webhook.js` - Test your specific webhook
- ✅ Updated `curl-examples.md` - Examples with your URL
- ✅ Updated `n8n-setup-guide.md` - Setup guide with your URL

---

**Ready to test! 🚀**
