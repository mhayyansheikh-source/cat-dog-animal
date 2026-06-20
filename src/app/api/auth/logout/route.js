import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request) {
  const logoutEndpoint = process.env.SHOPIFY_CUSTOMER_API_LOGOUT_ENDPOINT;
  
  // Construct the redirect back to the home page or login page after Shopify logs them out
  const redirectUri = new URL('/', request.url).toString();

  let shopifyLogoutUrl = '/';
  if (logoutEndpoint) {
    const url = new URL(logoutEndpoint);
    url.searchParams.append('post_logout_redirect_uri', redirectUri);
    // Usually a client_id might be needed here, depending on Shopify API version
    url.searchParams.append('client_id', process.env.SHOPIFY_CUSTOMER_API_CLIENT_ID);
    shopifyLogoutUrl = url.toString();
  }

  // Clear the local token cookie
  const response = NextResponse.redirect(shopifyLogoutUrl);
  response.cookies.delete('shopify_customer_access_token');

  return response;
}
