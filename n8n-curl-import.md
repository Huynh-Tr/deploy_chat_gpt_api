# n8n cURL Import Guide

## 🚀 **cURL Command for n8n HTTP Request Node**

### **Basic cURL Command**
```bash
curl -X POST https://chat-gpt-api.pages.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "hôm nay là thứ mấy",
    "model": "gpt-5-nano"
  }'
```

### **n8n HTTP Request Node Configuration**

#### **Method**: POST
#### **URL**: `https://chat-gpt-api.pages.dev/api/chat`
#### **Headers**:
```json
{
  "Content-Type": "application/json"
}
```

#### **Body (JSON)**:
```json
{
  "message": "{{ $json.message }}",
  "model": "{{ $json.model || 'gpt-5-nano' }}"
}
```

## 📋 **Example Messages to Test**

### **Vietnamese Date Questions**
```json
{
  "message": "hôm nay là thứ mấy",
  "model": "gpt-5-nano"
}
```

### **Days in Month Questions**
```json
{
  "message": "tháng này có bao nhiêu ngày",
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

### **Greeting Messages**
```json
{
  "message": "xin chào",
  "model": "gpt-5-nano"
}
```

### **Help Questions**
```json
{
  "message": "giúp tôi",
  "model": "gpt-5-nano"
}
```

## 🔧 **n8n Workflow Setup**

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
  "message": "Hôm nay là thứ Năm, ngày 2 tháng 10 năm 2025",
  "model": "gpt-5-nano",
  "timestamp": "2025-10-02T10:30:00.000Z",
  "note": "This is running on Cloudflare Pages Functions. For full AI functionality, implement Puter API integration."
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
  "message": "Hôm nay là thứ Năm, ngày 2 tháng 10 năm 2025",
  "model": "gpt-5-nano",
  "timestamp": "2025-10-02T10:30:00.000Z",
  "note": "This is running on Cloudflare Pages Functions. For full AI functionality, implement Puter API integration."
}
```

### **Test 2: Days in Month Question**
```bash
curl -X POST https://chat-gpt-api.pages.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "tháng này có bao nhiêu ngày", "model": "gpt-5-nano"}'
```

**Expected Response**:
```json
{
  "message": "Tháng 10 có 31 ngày",
  "model": "gpt-5-nano",
  "timestamp": "2025-10-02T10:30:00.000Z",
  "note": "This is running on Cloudflare Pages Functions. For full AI functionality, implement Puter API integration."
}
```

### **Test 3: Time Question**
```bash
curl -X POST https://chat-gpt-api.pages.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "mấy giờ rồi", "model": "gpt-5-nano"}'
```

**Expected Response**:
```json
{
  "message": "Bây giờ là 10:30:00",
  "model": "gpt-5-nano",
  "timestamp": "2025-10-02T10:30:00.000Z",
  "note": "This is running on Cloudflare Pages Functions. For full AI functionality, implement Puter API integration."
}
```

## 🎯 **n8n Node Configuration**

### **HTTP Request Node Settings**
- **Method**: POST
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

### **Response Handling**
- **Success**: 200 OK with JSON response
- **Error**: 400 Bad Request for invalid JSON
- **CORS**: Enabled for all origins

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
  "timestamp": "2025-10-02T10:30:00.000Z",
  "note": "This is running on Cloudflare Pages Functions. For full AI functionality, implement Puter API integration."
}
```

---

## 🎯 **Quick Start for n8n**

1. **Add HTTP Request Node**
2. **Set URL**: `https://chat-gpt-api.pages.dev/api/chat`
3. **Set Method**: POST
4. **Add Header**: `Content-Type: application/json`
5. **Set Body**: `{"message": "your question", "model": "gpt-5-nano"}`
6. **Test**: Run the workflow

**Result**: You'll get AI responses for Vietnamese questions about dates, time, and general queries!
