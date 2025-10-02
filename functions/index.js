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
    
    // Check if the message is asking about days in the month in Vietnamese
    let responseMessage;
    if (message.toLowerCase().includes("tháng này có bao nhiêu ngày") || message.toLowerCase().includes("bao nhiêu ngày")) {
      // Return the number of days in the current month
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const daysInMonth = new Date(year, month, 0).getDate();
      responseMessage = `Tháng ${month} có ${daysInMonth} ngày`;
    } else if (message.toLowerCase().includes("hôm nay") || message.toLowerCase().includes("thứ mấy") || message.toLowerCase().includes("ngày")) {
      // Return the actual date in Vietnamese
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      responseMessage = `ngày ${day} tháng ${month} năm ${year}`;
    } else {
      // Default response for other messages
      responseMessage = `AI Response to: "${message}". This is a mock response. The actual implementation would call Puter API with model: ${model}`;
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
