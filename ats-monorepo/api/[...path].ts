/**
 * Vercel Serverless Function Proxy for Internal Service Communication
 * Utilizes the BACKEND_API_URL service binding injected by Vercel Services.
 */

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  // Read the bound service URL injected by Vercel Services via the binding
  const backendBaseUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';

  const url = new URL(req.url);
  // Strip '/api/' prefix when proxying to FastAPI backend routes
  const subPath = url.pathname.replace(/^\/api\/?/, '');
  const targetUrl = new URL(subPath + url.search, backendBaseUrl);

  const forwardHeaders = new Headers(req.headers);
  // Ensure host header matches the internal target
  forwardHeaders.set('host', new URL(backendBaseUrl).host);

  try {
    const isBodyAllowed = req.method !== 'GET' && req.method !== 'HEAD';
    const body = isBodyAllowed ? await req.arrayBuffer() : undefined;

    const response = await fetch(targetUrl.toString(), {
      method: req.method,
      headers: forwardHeaders,
      body,
    });

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: 'Backend service communication failure',
        message: error?.message || 'Unable to connect to internal backend service',
        target: targetUrl.toString(),
      }),
      {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
