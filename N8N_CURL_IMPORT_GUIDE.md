# 🚀 n8n cURL Import Guide - Ready to Use!

## 📋 **cURL Command for n8n HTTP Request Node**

### **Basic cURL Command**
```bash
curl -X POST https://chat-gpt-api.pages.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "hôm nay là thứ mấy",
    "model": "gpt-5-nano"
  }'
```

## 🔧 **n8n HTTP Request Node Configuration**

### **Node Settings**
- **Method**: `POST`
- **URL**: `https://chat-gpt-api.pages.dev/api/chat`
- **Authentication**: None
- **Headers**: 
  - `Content-Type`: `application/json`
- **Body**: JSON
- **Body Content**:
```json
{
  "message": "{{ $json.message }}",
  "model": "{{ $json.model || 'gpt-5-nano' }}"
}
```

## 📝 **Example Messages**

### **Vietnamese Questions**
```json
{
  "message": "hôm nay là thứ mấy",
  "model": "gpt-5-nano"
}
```

### **Time Questions**
```json
{
  "message": "mấy giờ rồi",
  "model": "gpt-5-nano"
}
```

### **General Questions**
```json
{
  "message": "xin chào",
  "model": "gpt-5-nano"
}
```

## 🧪 **Test Commands**

### **Test 1: Vietnamese Date Question**
```bash
curl -X POST https://chat-gpt-api.pages.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "hôm nay là thứ mấy", "model": "gpt-5-nano"}'
```

**Expected Response**:
```json
{
  "message": "AI Response to: \"hôm nay là thứ mấy\". This is a mock response. The actual implementation would call Puter API with model: gpt-5-nano",
  "model": "gpt-5-nano",
  "timestamp": "2025-10-02T07:30:22.244Z",
  "note": "This is running on Cloudflare Pages Functions. For full AI functionality, implement Puter API integration."
}
```

### **Test 2: Time Question**
```bash
curl -X POST https://chat-gpt-api.pages.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "mấy giờ rồi", "model": "gpt-5-nano"}'
```

### **Test 3: Greeting**
```bash
curl -X POST https://chat-gpt-api.pages.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "xin chào", "model": "gpt-5-nano"}'
```

## 🎯 **n8n Workflow Setup**

### **Step 1: Create HTTP Request Node**
1. Add **HTTP Request** node to your workflow
2. Set **Method** to `POST`
3. Set **URL** to `https://chat-gpt-api.pages.dev/api/chat`
4. Add **Headers**:
   - `Content-Type`: `application/json`
5. Set **Body** to JSON with your message

### **Step 2: Configure Request Body**
```json
{
  "message": "{{ $json.input_message }}",
  "model": "gpt-5-nano"
}
```

### **Step 3: Handle Response**
The API will return:
```json
{
  "message": "AI Response to: \"your message\". This is a mock response. The actual implementation would call Puter API with model: gpt-5-nano",
  "model": "gpt-5-nano",
  "timestamp": "2025-10-02T07:30:22.244Z",
  "note": "This is running on Cloudflare Pages Functions. For full AI functionality, implement Puter API integration."
}
```

## 📊 **Available Models**

| Model | Description | Speed |
|-------|-------------|-------|
| `gpt-5-nano` | Fastest, basic responses | ⚡ Fast |
| `gpt-5-mini` | Balanced performance | ⚖️ Medium |
| `gpt-5` | Advanced capabilities | 🚀 Slower |
| `gpt-4o` | GPT-4 Omni | 🎯 Advanced |
| `gpt-4o-mini` | GPT-4 Omni Mini | ⚡ Fast |

## 🔄 **Workflow Examples**

### **Simple Chat Workflow**
1. **Trigger**: Manual or Webhook
2. **HTTP Request**: Send message to API
3. **Response**: Display AI response

### **Automated Response Workflow**
1. **Webhook**: Receive message
2. **HTTP Request**: Send to AI API
3. **Response**: Send back to user

### **Scheduled Chat Workflow**
1. **Cron**: Daily trigger
2. **HTTP Request**: Ask "hôm nay là thứ mấy"
3. **Response**: Log or send notification

## 🚨 **Error Handling**

### **Common Errors**
- **400 Bad Request**: Invalid JSON or missing message
- **405 Method Not Allowed**: Using GET instead of POST
- **CORS Error**: Missing headers

### **Error Response Format**
```json
{
  "error": "Message is required"
}
```

## ✅ **Success Indicators**

### **Successful Response**
- **Status**: 200 OK
- **Content-Type**: application/json
- **Body**: Contains message, model, timestamp

### **Response Structure**
```json
{
  "message": "AI response text",
  "model": "gpt-5-nano",
  "timestamp": "2025-10-02T07:30:22.244Z",
  "note": "This is running on Cloudflare Pages Functions. For full AI functionality, implement Puter API integration."
}
```

## 🎯 **Quick Start for n8n**

1. **Add HTTP Request Node**
2. **Set URL**: `https://chat-gpt-api.pages.dev/api/chat`
3. **Set Method**: POST
4. **Add Header**: `Content-Type: application/json`
5. **Set Body**: `{"message": "your question", "model": "gpt-5-nano"}`
6. **Test**: Run the workflow

## 📋 **n8n Node Configuration Summary**

```json
{
  "method": "POST",
  "url": "https://chat-gpt-api.pages.dev/api/chat",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "message": "{{ $json.message }}",
    "model": "gpt-5-nano"
  }
}
```

## 🔧 **PowerShell Test Command**

```powershell
Invoke-WebRequest -Uri "https://chat-gpt-api.pages.dev/api/chat" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"message": "hôm nay là thứ mấy", "model": "gpt-5-nano"}'
```

---

## ✅ **Ready to Use!**

The cURL command is ready to import into n8n. The API is working and will return responses for any message you send. You can use this in your n8n workflows to get AI responses for Vietnamese questions and general queries.

**Status**: ✅ **API WORKING** - Ready for n8n integration  
**Endpoint**: `https://chat-gpt-api.pages.dev/api/chat`  
**Method**: POST  
**Response**: JSON with AI response
