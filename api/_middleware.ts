import { createEdgeRouter } from '@vercel/edge';

export const config = {
  runtime: 'edge',
  matcher: '/cdn/:path*',
};

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  
  if (url.pathname.startsWith('/cdn/')) {
    const targetUrl = 'https://cdn.esp.ovh/' + url.pathname.slice(5);
    const response = await fetch(targetUrl);
    const data = await response.arrayBuffer();

    return new Response(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/octet-stream',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  return new Response(null, { status: 404 });
} 