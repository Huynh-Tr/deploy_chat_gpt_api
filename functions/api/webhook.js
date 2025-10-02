/**
 * Cloudflare Pages Functions - Webhook Handler
 * Handles POST requests to /api/webhook
 */

export async function onRequestPost(context) {
  try {
    const { request } = context;
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

// Handle OPTIONS requests for CORS
export async function onRequestOptions(context) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}
