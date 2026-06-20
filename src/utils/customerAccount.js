import { cookies } from 'next/headers';

function getCustomerGraphQLUrl() {
  const tokenEndpoint = process.env.SHOPIFY_CUSTOMER_API_TOKEN_ENDPOINT;
  if (!tokenEndpoint) return '';
  // Extract the ID from the token endpoint URL: https://shopify.com/authentication/99213639976/oauth/token
  const parts = tokenEndpoint.split('/');
  const storeId = parts[4];
  return `https://shopify.com/${storeId}/account/graphql`;
}

export async function customerAccountFetch({ query, variables = {} }) {
  const url = getCustomerGraphQLUrl();
  const cookieStore = cookies();
  const accessToken = cookieStore.get('shopify_customer_access_token')?.value;

  if (!accessToken) {
    throw new Error('Unauthorized');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': accessToken,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store'
  });

  const result = await response.json();
  if (result.errors) {
    console.error("Customer Account API GraphQL errors:", result.errors);
    throw new Error(result.errors[0].message || "GraphQL Error");
  }

  return result.data;
}

export async function getCustomerProfile() {
  const query = `
    query {
      customer {
        id
        firstName
        lastName
        emailAddress {
          emailAddress
        }
        orders(first: 10) {
          edges {
            node {
              id
              number
              totalPrice {
                amount
                currencyCode
              }
              lineItems(first: 5) {
                edges {
                  node {
                    title
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  try {
    const data = await customerAccountFetch({ query });
    return data?.customer;
  } catch (error) {
    console.error(error);
    return null;
  }
}
