/**
 * Cloudflare Pages Functions
 * This file handles API routes for the Pages deployment
 */

// Handle GET requests to /api/chat
export async function onRequestGet(context) {
  return new Response(JSON.stringify({ 
    error: 'GET method not supported. Use POST instead.',
    message: 'Please use POST method to send chat messages'
  }), {
    status: 405,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  });
}

// Handle POST requests to /api/chat
export async function onRequestPost(context) {
  try {
    const { request } = context;
    const body = await request.json();
    const { message, model = 'gpt-5-nano' } = body;
    
    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }
    
    // Process user message and generate appropriate response
    let responseMessage;
    const lowerMessage = message.toLowerCase();
    
    // Vietnamese date and time questions
    if (lowerMessage.includes("hôm nay") || lowerMessage.includes("thứ mấy") || lowerMessage.includes("ngày hôm nay")) {
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      const dayOfWeek = today.toLocaleDateString('vi-VN', { weekday: 'long' });
      responseMessage = `Hôm nay là ${dayOfWeek}, ngày ${day} tháng ${month} năm ${year}`;
    }
    // Days in month questions
    else if (lowerMessage.includes("tháng này có bao nhiêu ngày") || lowerMessage.includes("bao nhiêu ngày")) {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const daysInMonth = new Date(year, month, 0).getDate();
      responseMessage = `Tháng ${month} có ${daysInMonth} ngày`;
    }
    // Time questions
    else if (lowerMessage.includes("mấy giờ") || lowerMessage.includes("thời gian")) {
      const now = new Date();
      const time = now.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });
      responseMessage = `Bây giờ là ${time}`;
    }
    // Weather questions
    else if (lowerMessage.includes("thời tiết") || lowerMessage.includes("nhiệt độ")) {
      responseMessage = "Tôi không thể cung cấp thông tin thời tiết thực tế. Vui lòng kiểm tra ứng dụng thời tiết để biết thông tin chính xác.";
    }
    // Greeting responses
    else if (lowerMessage.includes("xin chào") || lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      responseMessage = "Xin chào! Tôi có thể giúp gì cho bạn?";
    }
    // Help questions
    else if (lowerMessage.includes("giúp") || lowerMessage.includes("help") || lowerMessage.includes("hỗ trợ")) {
      responseMessage = "Tôi có thể giúp bạn với các câu hỏi về ngày tháng, thời gian, và thông tin cơ bản. Bạn muốn hỏi gì?";
    }
    // Math questions (simple)
    else if (lowerMessage.includes("cộng") || lowerMessage.includes("trừ") || lowerMessage.includes("nhân") || lowerMessage.includes("chia")) {
      responseMessage = "Tôi có thể giúp với các phép tính đơn giản. Bạn có thể hỏi cụ thể hơn không?";
    }
    // Default response for other messages
    else {
      responseMessage = `Tôi đã nhận được tin nhắn của bạn: "${message}". Đây là phản hồi từ AI service với model ${model}. Bạn có thể hỏi về ngày tháng, thời gian, hoặc các câu hỏi khác.`;
    }
    
    const response = {
      message: responseMessage,
      model: model,
      timestamp: new Date().toISOString(),
      note: "This is running on Cloudflare Pages Functions. For full AI functionality, implement Puter API integration."
    };
    
    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}

// Handle OPTIONS requests for CORS
export async function onRequestOptions(context) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}
