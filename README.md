# Cloudflare + Puter API Web App

A modern web application that integrates Cloudflare Workers with Puter API for AI chat functionality, designed to work seamlessly with n8n workflows.

## 🚀 Features

- **Free AI API**: Uses Puter.js for unlimited OpenAI API access without API keys
- **Cloudflare Workers**: Deploy globally with edge computing
- **n8n Integration**: Built-in webhook support for n8n workflows
- **Multiple AI Models**: Support for GPT-5, GPT-4o, and other models
- **Streaming Responses**: Real-time response streaming
- **Modern UI**: Beautiful, responsive design
- **CORS Support**: Ready for cross-origin requests

## 📁 Project Structure

```
├── index.html          # Main web application
├── src/
│   └── worker.js       # Cloudflare Worker script
├── package.json        # Node.js dependencies
├── wrangler.toml       # Cloudflare Workers configuration
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js (v16 or higher)
- Cloudflare account
- Wrangler CLI

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Install Dependencies

```bash
npm install
```

## 🚀 Deployment

### Deploy to Cloudflare Workers

```bash
# Deploy to production
npm run deploy

# Deploy to staging
wrangler deploy --env staging

# Local development
npm run dev
```

### Manual Deployment

1. Upload the `src/worker.js` file to Cloudflare Workers
2. Configure your worker with the settings from `wrangler.toml`
3. Set up your custom domain (optional)

## 🔧 API Endpoints

### POST /api/chat
Send chat messages to the AI

**Request Body:**
```json
{
  "message": "Hello, how are you?",
  "model": "gpt-5-nano",
  "stream": false
}
```

**Response:**
```json
{
  "message": "AI response here",
  "model": "gpt-5-nano",
  "timestamp": "2024-12-18T10:30:00.000Z"
}
```

### POST /api/webhook
Receive webhooks from n8n

**Request Body:**
```json
{
  "message": "Question from n8n",
  "source": "n8n",
  "timestamp": "2024-12-18T10:30:00.000Z"
}
```

## 🔗 n8n Integration

### Webhook Configuration in n8n

1. Add a "Webhook" node in your n8n workflow
2. Set the webhook URL to: `https://your-worker-domain.workers.dev/api/webhook`
3. Configure the webhook to send JSON data with a `message` field

**Example n8n webhook payload:**
```json
{
  "message": "What is the weather like today?",
  "source": "n8n-workflow",
  "workflow_id": "weather-check"
}
```

### Using the Web App with n8n

The web app includes a global function `handleWebhookData()` that can be called from external sources:

```javascript
// Call this function to trigger a chat with webhook data
window.handleWebhookData({
  message: "Your question here",
  model: "gpt-5-nano"
});
```

## 🎨 Available AI Models

Based on the [Puter API documentation](https://developer.puter.com/tutorials/free-unlimited-openai-api/), the following models are supported:

### Text Generation Models
- `gpt-5` - Advanced GPT-5 model
- `gpt-5-mini` - Balanced GPT-5 mini
- `gpt-5-nano` - Fast GPT-5 nano
- `gpt-5-chat-latest` - Latest chat model
- `gpt-4.1` - GPT-4.1 model
- `gpt-4.1-mini` - GPT-4.1 mini
- `gpt-4.1-nano` - GPT-4.1 nano
- `gpt-4.5-preview` - GPT-4.5 preview
- `gpt-4o` - GPT-4o model
- `gpt-4o-mini` - GPT-4o mini
- `o1` - o1 model
- `o1-mini` - o1 mini
- `o1-pro` - o1 pro
- `o3` - o3 model
- `o3-mini` - o3 mini
- `o4-mini` - o4 mini

### Image Generation Models
- `gpt-image-1` - GPT Image model
- `dall-e-3` - DALL-E 3
- `dall-e-2` - DALL-E 2

## 🔧 Configuration

### Environment Variables

You can set environment variables in your Cloudflare Worker:

```bash
# Set environment variables
wrangler secret put API_KEY
wrangler secret put WEBHOOK_SECRET
```

### Custom Domain Setup

1. Add your domain in Cloudflare dashboard
2. Update `wrangler.toml`:
```toml
[[routes]]
pattern = "yourdomain.com/*"
custom_domain = true
```

## 🧪 Testing

### Local Development

```bash
# Start local development server
npm run dev

# Test API endpoints
curl -X POST http://localhost:8787/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, AI!"}'
```

### Test Webhook

```bash
# Test webhook endpoint
curl -X POST https://your-worker.workers.dev/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": "Test from n8n", "source": "test"}'
```

## 📝 Usage Examples

### Basic Chat

```javascript
// Direct Puter API usage
puter.ai.chat("What is machine learning?", { model: "gpt-5-nano" })
  .then(response => console.log(response));
```

### Streaming Response

```javascript
// Streaming response
async function streamChat() {
  const response = await puter.ai.chat("Explain quantum computing", { 
    stream: true, 
    model: "gpt-5" 
  });
  
  for await (const part of response) {
    console.log(part?.text);
  }
}
```

### Image Generation

```javascript
// Generate images
puter.ai.txt2img("A futuristic cityscape", { model: "gpt-image-1" })
  .then(imageElement => {
    document.body.appendChild(imageElement);
  });
```

## 🔒 Security Considerations

- The app uses CORS headers to allow cross-origin requests
- No API keys are stored in the frontend code
- Webhook endpoints should be secured in production
- Consider rate limiting for production deployments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:

1. Check the [Puter API documentation](https://developer.puter.com/tutorials/free-unlimited-openai-api/)
2. Review Cloudflare Workers documentation
3. Open an issue in this repository

## 🔄 Updates

This project integrates with the latest Puter.js API and supports all available OpenAI models. The integration is based on the official Puter documentation and provides a seamless experience for AI-powered web applications.

---

**Built with ❤️ using Cloudflare Workers and Puter API**

