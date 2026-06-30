import { NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * Generate a cryptographically random code_verifier for PKCE.
 * Must be 43-128 URL-safe characters.
 */
async function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Derive the code_challenge from the code_verifier using SHA-256.
 * code_challenge = BASE64URL(SHA256(ASCII(code_verifier)))
 */
async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export async function GET(request) {
  const authorizationEndpoint = process.env.SHOPIFY_CUSTOMER_API_AUTHORIZATION_ENDPOINT;
  const clientId = process.env.SHOPIFY_CUSTOMER_API_CLIENT_ID;
  const redirectUri =
    process.env.SHOPIFY_CUSTOMER_API_REDIRECT_URI ||
    new URL('/api/auth/callback', request.url).toString();

  if (!authorizationEndpoint || !clientId || !redirectUri) {
    return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 });
  }

  // Generate PKCE pair
  const codeVerifier = await generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Generate random state for CSRF protection
  const state = crypto.randomUUID();

  const authUrl = new URL(authorizationEndpoint);
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('scope', 'openid email customer-account-api:full');
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');

  const response = NextResponse.redirect(authUrl.toString());

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 600, // 10 minutes
  };

  // Store state and code_verifier in cookies for the callback
  response.cookies.set('oauth_state', state, cookieOptions);
  response.cookies.set('oauth_code_verifier', codeVerifier, cookieOptions);

  return response;
}
