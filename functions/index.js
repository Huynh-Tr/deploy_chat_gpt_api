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
    
    // Mock response for Vietnamese message
    const response = {
      message: `AI Response to: "${message}". This is a mock response. The actual implementation would call Puter API with model: ${model}`,
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
