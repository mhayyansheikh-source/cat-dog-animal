import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request) {
  const authorizationEndpoint = process.env.SHOPIFY_CUSTOMER_API_AUTHORIZATION_ENDPOINT;
  const clientId = process.env.SHOPIFY_CUSTOMER_API_CLIENT_ID;
  // Dynamically resolve redirect URI for Cloudflare preview deployments
  const redirectUri = process.env.SHOPIFY_CUSTOMER_API_REDIRECT_URI || new URL('/api/auth/callback', request.url).toString();

  if (!authorizationEndpoint || !clientId || !redirectUri) {
    return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 });
  }

  // Generate a random state for security
  const state = Math.random().toString(36).substring(7);

  // Note: For a production app, Shopify Customer Account API requires PKCE.
  // For demonstration, we construct the authorization URL with minimal required parameters.
  // We recommend using a library like 'oauth4webapi' or 'client-oauth2' for full PKCE compliance.
  
  const authUrl = new URL(authorizationEndpoint);
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('state', state);
  authUrl.searchParams.append('scope', 'openid email https://api.customers.com/auth/customer.graphql');

  // Set the state in a cookie to verify it in the callback
  const response = NextResponse.redirect(authUrl.toString());
  response.cookies.set('oauth_state', state, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

  return response;
}
