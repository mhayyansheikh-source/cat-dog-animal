import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request) {
  const logoutEndpoint = process.env.SHOPIFY_CUSTOMER_API_LOGOUT_ENDPOINT;
  const clientId = process.env.SHOPIFY_CUSTOMER_API_CLIENT_ID;

  const redirectUri = new URL('/', request.url).toString();

  const idToken = request.cookies.get('shopify_customer_id_token')?.value;

  let shopifyLogoutUrl = '/';
  if (logoutEndpoint && clientId) {
    const url = new URL(logoutEndpoint);
    url.searchParams.set('post_logout_redirect_uri', redirectUri);
    url.searchParams.set('client_id', clientId);
    if (idToken) {
      url.searchParams.set('id_token_hint', idToken);
    }
    shopifyLogoutUrl = url.toString();
  }

  const response = NextResponse.redirect(shopifyLogoutUrl);
  // Clear the customer token cookies
  response.cookies.delete('shopify_customer_token');
  response.cookies.delete('shopify_customer_id_token');

  return response;
}
