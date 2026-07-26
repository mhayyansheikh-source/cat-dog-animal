import { NextResponse } from 'next/server';

/**
 * Edge Middleware — runs on every request before it hits a page.
 *
 * 1. Restricts website access exclusively to US visitors in production.
 * 2. Handles Shopify Customer Account API redirect pattern.
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Extract visitor country code detected by edge hosting (Vercel, Cloudflare, Cloudflare/Next Headers)
  const country =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    request.geo?.country;

  // Enforce US-only access in production (allow US visitors and local development/testing)
  if (process.env.NODE_ENV === 'production' && country && country.toUpperCase() !== 'US') {
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Access Restricted — Peteora</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #FDFAF5; color: #2A2A2A; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; padding: 20px; }
            .card { background: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); max-width: 480px; }
            h1 { font-size: 1.6rem; color: #1E3A8A; margin-bottom: 12px; }
            p { font-size: 0.95rem; line-height: 1.6; color: #4A5568; margin-bottom: 0; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>🇺🇸 Store Limited to US Region</h1>
            <p>Peteora currently operates and delivers exclusively within the United States. Access from outside the US is restricted.</p>
          </div>
        </body>
      </html>
      `,
      {
        status: 403,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      }
    );
  }

  // Match paths that start with a numeric segment (Shopify shop ID)
  // e.g. /99213639976/account/orders → /account/orders
  const shopIdPathMatch = pathname.match(/^\/(\d+)(\/.*)?$/);

  if (shopIdPathMatch) {
    const remainingPath = shopIdPathMatch[2] || '/';
    const url = request.nextUrl.clone();
    url.pathname = remainingPath;
    return NextResponse.redirect(url, { status: 302 });
  }

  return NextResponse.next();
}

export const config = {
  // Run on all paths except static assets and images
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

