export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    }
    
    // Handle API endpoint for chat
    if (url.pathname === '/api/chat' && request.method === 'POST') {
      try {
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
          note: "This is running on Cloudflare Workers. For full AI functionality, implement Puter API integration."
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
    
    // Handle webhook endpoint
    if (url.pathname === '/api/webhook' && request.method === 'POST') {
      try {
        const body = await request.json();
        
        const response = {
          status: 'received',
          message: 'Webhook processed successfully',
          timestamp: new Date().toISOString(),
          data: body
        };
        
        return new Response(JSON.stringify(response), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        });
        
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Invalid webhook data' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        });
      }
    }
    
    // Return 404 for other paths
    return new Response('Not Found', { 
      status: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
};