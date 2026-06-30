import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const savedState = request.cookies.get('oauth_state')?.value;
  const codeVerifier = request.cookies.get('oauth_code_verifier')?.value;

  // Validate state to prevent CSRF
  if (!savedState || state !== savedState) {
    return NextResponse.json({ error: 'State mismatch — possible CSRF attack' }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 });
  }

  if (!codeVerifier) {
    return NextResponse.json({ error: 'Missing PKCE code verifier' }, { status: 400 });
  }

  const tokenEndpoint = process.env.SHOPIFY_CUSTOMER_API_TOKEN_ENDPOINT;
  const clientId = process.env.SHOPIFY_CUSTOMER_API_CLIENT_ID;
  const redirectUri =
    process.env.SHOPIFY_CUSTOMER_API_REDIRECT_URI ||
    new URL('/api/auth/callback', request.url).toString();

  try {
    // Exchange the authorization code + code_verifier for tokens (PKCE)
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
        code_verifier: codeVerifier, // PKCE: verifier must match the challenge sent during login
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData);
      return NextResponse.redirect(new URL('/?error=token_failed', request.url));
    }

    const { access_token, id_token, expires_in } = tokenData;

    const response = NextResponse.redirect(new URL('/account/orders', request.url));

    // Store the Customer Account API access token
    response.cookies.set('shopify_customer_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: expires_in || 3600,
    });

    if (id_token) {
      response.cookies.set('shopify_customer_id_token', id_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: expires_in || 3600,
      });
    }

    // Clear PKCE and state cookies
    response.cookies.delete('oauth_state');
    response.cookies.delete('oauth_code_verifier');

    return response;
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    return NextResponse.redirect(new URL('/?error=server_error', request.url));
  }
}
