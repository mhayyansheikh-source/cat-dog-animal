require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch'); // Use standard fetch or node-fetch

async function run() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  
  const query = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  // We need a real variant ID to test
  // Let's query products first to get a real variant ID
  const pQuery = `
    query {
      products(first: 1) {
        edges {
          node {
            variants(first: 1) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  `;

  const pRes = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token
    },
    body: JSON.stringify({ query: pQuery })
  });
  
  const pData = await pRes.json();
  const variantId = pData.data.products.edges[0].node.variants.edges[0].node.id;
  console.log("Variant ID:", variantId);

  const res = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token
    },
    body: JSON.stringify({ query, variables: { input: { lines: [{ merchandiseId: variantId, quantity: 1 }] } } })
  });

  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

run();
