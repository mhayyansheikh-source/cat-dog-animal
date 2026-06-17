const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function shopifyFetch({ query, variables = {} }) {
  const url = `https://${domain}/api/2024-01/graphql.json`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 300 } // Cache data on Vercel for 5 minutes
    });

    const result = await response.json();
    if (result.errors) {
      console.error("Shopify API errors in payload:", result.errors);
    }
    return result.data;
  } catch (error) {
    console.error("Failed to query Shopify Storefront API:", error);
    return null;
  }
}

// Normalizes GraphQL schema to match our clean static products.json format
function normalizeProduct(node) {
  if (!node) return null;

  const optionsMapped = (node.options || []).map((opt, idx) => ({
    name: opt.name,
    position: idx + 1,
    values: opt.values
  }));

  const imagesMapped = (node.images?.edges || []).map(edge => edge.node.url);
  
  const variantsMapped = (node.variants?.edges || []).map(edge => {
    const v = edge.node;
    return {
      id: v.id, // Shopify GID Base64 string
      title: v.title,
      price: v.price?.amount || "0.00",
      compare_at_price: v.compareAtPrice?.amount || null,
      available: v.availableForSale,
      sku: v.sku || ""
    };
  });

  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    vendor: node.vendor,
    product_type: node.productType,
    tags: node.tags || [],
    price: variantsMapped[0]?.price || "0.00",
    compare_at_price: variantsMapped[0]?.compare_at_price || null,
    images: imagesMapped,
    options: optionsMapped,
    variants: variantsMapped,
    body_html: node.descriptionHtml || ""
  };
}

export async function getShopifyProducts() {
  const query = `
    query getProducts {
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            vendor
            productType
            tags
            descriptionHtml
            options {
              name
              values
            }
            images(first: 10) {
              edges {
                node {
                  url
                }
              }
            }
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                  }
                  compareAtPrice {
                    amount
                  }
                  availableForSale
                  sku
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch({ query });
  if (!data) return [];

  const edges = data.products?.edges || [];
  return edges.map(edge => normalizeProduct(edge.node)).filter(Boolean);
}

export async function getShopifyProductByHandle(handle) {
  const query = `
    query getProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        vendor
        productType
        tags
        descriptionHtml
        options {
          name
          values
        }
        images(first: 10) {
          edges {
            node {
              url
            }
          }
        }
        variants(first: 20) {
          edges {
            node {
              id
              title
              price {
                amount
              }
              compareAtPrice {
                amount
              }
              availableForSale
              sku
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch({ query, variables: { handle } });
  return normalizeProduct(data?.productByHandle);
}

export async function createShopifyCheckout(lineItems) {
  const mutation = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          webUrl
        }
        checkoutUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch({
    query: mutation,
    variables: { input: { lineItems } }
  });

  if (data?.checkoutCreate?.checkoutUserErrors?.length > 0) {
    console.error("Shopify Checkout mutation errors:", data.checkoutCreate.checkoutUserErrors);
  }

  return data?.checkoutCreate?.checkout?.webUrl || null;
}
