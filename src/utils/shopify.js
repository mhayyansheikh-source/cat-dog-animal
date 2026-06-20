const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;

async function shopifyFetch({ query, variables = {} }) {
  const url = `https://${domain}/api/2024-01/graphql.json`;
  
  const headers = {
    "Content-Type": "application/json",
  };

  if (privateToken) {
    headers["Shopify-Storefront-Private-Token"] = privateToken;
  } else {
    headers["X-Shopify-Storefront-Access-Token"] = token;
  }
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 30 } // Cache data on Vercel for 30 seconds
    });

    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error(`Shopify API Error: ${response.status} ${response.statusText}`);
      error.status = response.status;
      error.details = errorText;
      throw error;
    }

    const result = await response.json();
    if (result.errors) {
      console.error("Shopify GraphQL errors:", result.errors);
      const graphqlError = new Error(result.errors[0].message || "GraphQL Error");
      graphqlError.isGraphQL = true;
      graphqlError.errors = result.errors;
      throw graphqlError;
    }
    return result.data;
  } catch (error) {
    console.error("Failed to query Shopify Storefront API:", error);
    throw error;
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

  // Map variantId parameter keys to merchandiseId as expected by CartInput
  const lines = lineItems.map((item) => ({
    merchandiseId: item.variantId || item.id,
    quantity: item.quantity,
  }));

  const data = await shopifyFetch({
    query: mutation,
    variables: { input: { lines } }
  });

  if (data?.cartCreate?.userErrors?.length > 0) {
    console.error("Shopify Cart mutation errors:", data.cartCreate.userErrors);
  }

  return data?.cartCreate?.cart?.checkoutUrl || null;
}

export async function getPredictiveSearch(queryStr) {
  const query = `
    query predictiveSearch($query: String!) {
      predictiveSearch(query: $query) {
        products {
          id
          title
          handle
          images(first: 1) {
            edges {
              node {
                url
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                price {
                  amount
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch({ query, variables: { query: queryStr } });
  
  if (!data?.predictiveSearch?.products) return [];
  
  return data.predictiveSearch.products.map(node => ({
    id: node.id,
    title: node.title,
    handle: node.handle,
    image: node.images.edges[0]?.node?.url || null,
    price: node.variants.edges[0]?.node?.price?.amount || "0.00"
  }));
}

// Headless Customer Auth Mutations
export async function customerAccessTokenCreate(email, password) {
  const query = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;
  const data = await shopifyFetch({
    query,
    variables: { input: { email, password } }
  });
  return data?.customerAccessTokenCreate;
}

export async function customerCreate(email, password, firstName, lastName) {
  const query = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;
  const data = await shopifyFetch({
    query,
    variables: { input: { email, password, firstName, lastName } }
  });
  return data?.customerCreate;
}

export async function getCustomerData(accessToken) {
  const query = `
    query getCustomerData($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        firstName
        lastName
        email
        orders(first: 10) {
          edges {
            node {
              id
              orderNumber
              processedAt
              totalPrice {
                amount
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
  const data = await shopifyFetch({
    query,
    variables: { customerAccessToken: accessToken }
  });
  return data?.customer;
}

// -----------------------------------------
// Native Dynamic Cart API Methods
// -----------------------------------------

export async function createCart() {
  const query = `
    mutation cartCreate {
      cartCreate {
        cart {
          id
          checkoutUrl
          cost {
            totalAmount {
              amount
            }
            subtotalAmount {
              amount
            }
          }
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                cost {
                  totalAmount {
                    amount
                  }
                }
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                    }
                    product {
                      title
                      handle
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch({ query });
  return data?.cartCreate?.cart;
}

export async function getCart(cartId) {
  const query = `
    query getCart($id: ID!) {
      cart(id: $id) {
        id
        checkoutUrl
        cost {
          totalAmount {
            amount
          }
          subtotalAmount {
            amount
          }
        }
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              cost {
                totalAmount {
                  amount
                }
              }
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                  }
                  compareAtPrice {
                    amount
                  }
                  image {
                    url
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch({ query, variables: { id: cartId } });
  return data?.cart;
}

export async function addCartLines(cartId, lines) {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const data = await shopifyFetch({ query, variables: { cartId, lines } });
  return data?.cartLinesAdd;
}

export async function updateCartLines(cartId, lines) {
  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const data = await shopifyFetch({ query, variables: { cartId, lines } });
  return data?.cartLinesUpdate;
}

export async function removeCartLines(cartId, lineIds) {
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const data = await shopifyFetch({ query, variables: { cartId, lineIds } });
  return data?.cartLinesRemove;
}
