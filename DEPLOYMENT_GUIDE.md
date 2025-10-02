# 🚀 Quick Deployment Guide

## Prerequisites
- Node.js (v16+)
- Cloudflare account
- Git (optional)

## Quick Start

### 1. Install Dependencies
```bash
npm install -g wrangler
npm install
```

### 2. Login to Cloudflare
```bash
wrangler login
```

### 3. Deploy
```bash
npm run deploy
```

## File Structure
```
├── index.html              # Main web app (updated with Puter API)
├── src/worker.js           # Cloudflare Worker
├── package.json            # Dependencies & scripts
├── wrangler.toml          # Cloudflare config
├── deploy.js              # Deployment script
├── test-setup.js          # Setup verification
├── n8n-example-workflow.json # n8n integration example
└── README.md              # Full documentation
```

## Key Features
- ✅ **Free AI API** via Puter.js (no API keys needed)
- ✅ **Cloudflare Workers** deployment
- ✅ **n8n Integration** with webhook support
- ✅ **Multiple AI Models** (GPT-5, GPT-4o, etc.)
- ✅ **Streaming Responses**
- ✅ **Modern UI** with responsive design

## API Endpoints
- `GET /` - Main web interface
- `POST /api/chat` - Chat with AI
- `POST /api/webhook` - n8n webhook receiver

## n8n Integration
1. Import `n8n-example-workflow.json` into n8n
2. Update webhook URL to your deployed worker
3. Configure your workflow to send data to `/api/webhook`

## Available Models
- `gpt-5-nano` (fastest)
- `gpt-5-mini` (balanced)
- `gpt-5` (advanced)
- `gpt-4o` / `gpt-4o-mini`
- `o1` / `o1-mini` / `o1-pro`
- `o3` / `o3-mini`
- `o4-mini`

## Commands
```bash
npm run dev          # Local development
npm run deploy       # Deploy to Cloudflare
npm run deploy:prod  # Deploy to production
npm run tail         # View logs
```

## Support
- Check [Puter API docs](https://developer.puter.com/tutorials/free-unlimited-openai-api/)
- Review README.md for detailed documentation
- Test with `node test-setup.js`

---
**Ready to deploy! 🎉**

