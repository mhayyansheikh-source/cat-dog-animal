import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const savedState = request.cookies.get('oauth_state')?.value;

  if (state !== savedState) {
    return NextResponse.json({ error: 'State mismatch' }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  const tokenEndpoint = process.env.SHOPIFY_CUSTOMER_API_TOKEN_ENDPOINT;
  const clientId = process.env.SHOPIFY_CUSTOMER_API_CLIENT_ID;
  const redirectUri = process.env.SHOPIFY_CUSTOMER_API_REDIRECT_URI || new URL('/api/auth/callback', request.url).toString();

  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        redirect_uri: redirectUri,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", tokenData);
      return NextResponse.json({ error: 'Token exchange failed', details: tokenData }, { status: 400 });
    }

    const { access_token } = tokenData;

    // Create a response that redirects the user to the account page
    const response = NextResponse.redirect(new URL('/account', request.url));
    
    // Store the access token securely in an HTTP-only cookie
    response.cookies.set('shopify_customer_access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: tokenData.expires_in || 3600 // default 1 hour
    });
    
    // Clear the state cookie
    response.cookies.delete('oauth_state');

    return response;
  } catch (error) {
    console.error("Error exchanging token:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
