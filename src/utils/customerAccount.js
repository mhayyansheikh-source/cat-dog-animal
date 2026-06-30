/**
 * customerAccount.js
 *
 * Utility for calling the Shopify Customer Account API GraphQL endpoint.
 * The Customer Account API is a separate API from the Storefront API.
 * It uses OAuth2 tokens obtained via /api/auth/login → /api/auth/callback.
 *
 * Cookie used: 'shopify_customer_token' (set by /api/auth/callback)
 * GraphQL endpoint: https://shopify.com/{shopId}/account/graphql
 */

const TOKEN_COOKIE = 'shopify_customer_token';

function getCustomerGraphQLUrl() {
  const tokenEndpoint = process.env.SHOPIFY_CUSTOMER_API_TOKEN_ENDPOINT;
  if (!tokenEndpoint) return '';
  // Extract shop ID from: https://shopify.com/authentication/{shopId}/oauth/token
  const parts = tokenEndpoint.split('/');
  const storeId = parts[4];
  return `https://shopify.com/${storeId}/account/graphql`;
}

/**
 * Make an authenticated GraphQL request to the Customer Account API.
 * Can be used from Edge API routes (pass token directly) or Server Components (reads cookie).
 */
export async function customerAccountFetch({ query, variables = {}, token }) {
  const url = getCustomerGraphQLUrl();

  // Accept token as parameter (for use in API routes) or fall back to cookie
  let accessToken = token;
  if (!accessToken) {
    // Dynamic import so this file can be used in both edge + server contexts
    const { cookies } = await import('next/headers');
    const cookieStore = cookies();
    accessToken = cookieStore.get(TOKEN_COOKIE)?.value;
  }

  if (!accessToken) {
    throw new Error('Unauthorized: No customer token found');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': accessToken,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  const result = await response.json();
  if (result.errors) {
    console.error('Customer Account API GraphQL errors:', result.errors);
    throw new Error(result.errors[0].message || 'GraphQL Error');
  }

  return result.data;
}
