# cURL Examples for n8n Integration

## 1. Send Message to Your n8n Webhook

### cURL Command:
```bash
curl -X POST https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is machine learning?",
    "model": "gpt-5-nano",
    "stream": false
  }'
```

## 2. Direct API Call to Cloudflare Worker

### cURL Command:
```bash
curl -X POST https://your-worker-domain.workers.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is machine learning?",
    "model": "gpt-5-nano",
    "stream": false
  }'
```

### Expected Response:
```json
{
  "message": "Machine learning is a subset of artificial intelligence...",
  "model": "gpt-5-nano",
  "timestamp": "2024-12-18T10:30:00.000Z"
}
```

## 3. Test Different Models via n8n Webhook

### GPT-5 Advanced:
```bash
curl -X POST https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explain quantum computing in simple terms",
    "model": "gpt-5"
  }'
```

### GPT-4o:
```bash
curl -X POST https://vn.n8n.asia/webhook-test/1d2a2e0c-3a12-4c72-9efd-174d67247e1a \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Write a short poem about coding",
    "model": "gpt-4o"
  }'
```

## 4. Send Webhook Data to Cloudflare Worker

### cURL Command:
```bash
curl -X POST https://your-worker-domain.workers.dev/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello from n8n workflow",
    "source": "n8n",
    "workflow_id": "ai-chat-workflow",
    "timestamp": "2024-12-18T10:30:00.000Z"
  }'
```

### Expected Response:
```json
{
  "status": "received",
  "message": "Webhook processed successfully",
  "timestamp": "2024-12-18T10:30:00.000Z",
  "data": {
    "message": "Hello from n8n workflow",
    "source": "n8n",
    "workflow_id": "ai-chat-workflow",
    "timestamp": "2024-12-18T10:30:00.000Z"
  }
}
```

## 5. Test with Different Models (Direct to Worker)

### GPT-5 Advanced:
```bash
curl -X POST https://your-worker-domain.workers.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explain quantum computing in simple terms",
    "model": "gpt-5",
    "stream": false
  }'
```

### GPT-4o:
```bash
curl -X POST https://your-worker-domain.workers.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Write a short poem about coding",
    "model": "gpt-4o",
    "stream": false
  }'
```

### o1 Model:
```bash
curl -X POST https://your-worker-domain.workers.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Solve this math problem: What is 15% of 240?",
    "model": "o1",
    "stream": false
  }'
```

## 4. Error Handling Examples

### Missing Message:
```bash
curl -X POST https://your-worker-domain.workers.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5-nano"
  }'
```

### Expected Error Response:
```json
{
  "error": "Message is required"
}
```

### Invalid JSON:
```bash
curl -X POST https://your-worker-domain.workers.dev/api/chat \
  -H "Content-Type: application/json" \
  -d 'invalid json'
```

### Expected Error Response:
```json
{
  "error": "Invalid JSON"
}
```

## 5. Local Testing (Development)

If testing locally with `wrangler dev`:

```bash
curl -X POST http://localhost:8787/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello from local testing",
    "model": "gpt-5-nano"
  }'
```

## Notes:
- Replace `your-worker-domain.workers.dev` with your actual Cloudflare Worker domain
- All requests require `Content-Type: application/json` header
- The `message` field is required for `/api/chat` endpoint
- The `model` field is optional (defaults to "gpt-5-nano")
- The `stream` field is optional (defaults to false)
