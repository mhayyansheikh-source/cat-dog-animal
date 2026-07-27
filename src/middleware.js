import { NextResponse } from 'next/server';

/**
 * Edge Middleware — runs on every request before it hits a page.
 *
 * Handles Shopify Customer Account API redirect pattern.
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;

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

