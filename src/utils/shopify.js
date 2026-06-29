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
  
  const fetchOptions = {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  };

  // Do not cache mutations or cart requests
  if (query.includes("mutation") || query.includes("cart(")) {
    fetchOptions.cache = "no-store";
  } else {
    fetchOptions.next = { revalidate: 30 };
  }

  try {
    const response = await fetch(url, fetchOptions);

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
  const mediaMapped = (node.media?.edges || [])
    .map(edge => edge.node)
    .filter(node => node.mediaContentType === 'VIDEO' || node.mediaContentType === 'EXTERNAL_VIDEO');
  
  const variantsMapped = (node.variants?.edges || []).map(edge => {
    const v = edge.node;
    return {
      id: v.id, // Shopify GID Base64 string
      title: v.title,
      price: v.price?.amount || "0.00",
      currencyCode: v.price?.currencyCode || "USD",
      compare_at_price: v.compareAtPrice?.amount || null,
      available: v.availableForSale,
      sku: v.sku || "",
      image: v.image?.url || null
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
    currencyCode: variantsMapped[0]?.currencyCode || "USD",
    compare_at_price: variantsMapped[0]?.compare_at_price || null,
    images: imagesMapped,
    media: mediaMapped,
    options: optionsMapped,
    variants: variantsMapped,
    body_html: node.descriptionHtml || "",
    metafields: node.metafields || []
  };
}

export async function getShopifyProducts() {
  const query = `
    query getProducts @inContext(country: US) {
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
            media(first: 10) {
              edges {
                node {
                  mediaContentType
                  ... on Video {
                    sources {
                      url
                      format
                      mimeType
                    }
                    previewImage { url }
                  }
                  ... on ExternalVideo {
                    embeddedUrl
                    previewImage { url }
                  }
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
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  availableForSale
                  sku
                  image {
                    url
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
  if (!data) return [];

  const edges = data.products?.edges || [];
  return edges.map(edge => normalizeProduct(edge.node)).filter(Boolean);
}

export async function getShopifyCollectionByHandle(handle, filter = [], sortKey = "COLLECTION_DEFAULT", reverse = false) {
  const query = `
    query getCollectionByHandle($handle: String!, $filters: [ProductFilter!], $sortKey: ProductCollectionSortKeys!, $reverse: Boolean) @inContext(country: US) {
      collection(handle: $handle) {
        id
        title
        descriptionHtml
        image {
          url
        }
        products(first: 50, filters: $filters, sortKey: $sortKey, reverse: $reverse) {
          filters {
            id
            label
            type
            values {
              id
              label
              count
              input
            }
          }
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
            media(first: 10) {
              edges {
                node {
                  mediaContentType
                  ... on Video {
                    sources {
                      url
                      format
                      mimeType
                    }
                    previewImage { url }
                  }
                  ... on ExternalVideo {
                    embeddedUrl
                    previewImage { url }
                  }
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
                  image {
                    url
                  }
                }
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `;

  const variables = {
    handle,
    filters: filter,
    sortKey,
    reverse
  };

  const data = await shopifyFetch({ query, variables });
  if (!data?.collection) return null;
  
  return {
    ...data.collection,
    products: data.collection.products.edges.map(({ node }) => normalizeProduct(node)),
    filters: data.collection.products.filters || []
  };
}
export async function getShopifyProductByHandle(handle) {
  const query = `
    query getProductByHandle($handle: String!) @inContext(country: US) {
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
            media(first: 10) {
              edges {
                node {
                  mediaContentType
                  ... on Video {
                    sources {
                      url
                      format
                      mimeType
                    }
                    previewImage { url }
                  }
                  ... on ExternalVideo {
                    embeddedUrl
                    previewImage { url }
                  }
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
                  image {
                    url
                  }
                }
          }
        }
        metafields(identifiers: [{namespace: "custom", key: "faq_json"}, {namespace: "custom", key: "ingredients"}, {namespace: "custom", key: "bundle_items"}]) {
          namespace
          key
          value
          type
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
    query predictiveSearch($query: String!) @inContext(country: US) {
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
                  currencyCode
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
    price: node.variants.edges[0]?.node?.price?.amount || "0.00",
    currencyCode: node.variants.edges[0]?.node?.price?.currencyCode || "USD"
  }));
}


// -----------------------------------------
// Native Dynamic Cart API Methods
// -----------------------------------------

const cartFragment = `
  fragment cartDetails on Cart {
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
                images(first: 1) {
                  edges {
                    node {
                      url
                    }
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

export async function createCart() {
  const query = `
    mutation cartCreate {
      cartCreate {
        cart {
          ...cartDetails
        }
      }
    }
    ${cartFragment}
  `;
  const data = await shopifyFetch({ query });
  return data?.cartCreate?.cart;
}

export async function getCart(cartId) {
  const query = `
    query getCart($id: ID!) @inContext(country: US) {
      cart(id: $id) {
        ...cartDetails
      }
    }
    ${cartFragment}
  `;
  const data = await shopifyFetch({ query, variables: { id: cartId } });
  return data?.cart;
}

export async function addCartLines(cartId, lines) {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...cartDetails
        }
        userErrors {
          field
          message
        }
      }
    }
    ${cartFragment}
  `;
  const data = await shopifyFetch({ query, variables: { cartId, lines } });
  return data?.cartLinesAdd;
}

export async function updateCartLines(cartId, lines) {
  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...cartDetails
        }
        userErrors {
          field
          message
        }
      }
    }
    ${cartFragment}
  `;
  const data = await shopifyFetch({ query, variables: { cartId, lines } });
  return data?.cartLinesUpdate;
}

export async function removeCartLines(cartId, lineIds) {
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...cartDetails
        }
        userErrors {
          field
          message
        }
      }
    }
    ${cartFragment}
  `;
  const data = await shopifyFetch({ query, variables: { cartId, lineIds } });
  return data?.cartLinesRemove;
}

export async function getShopifyMenu(handle) {
  const query = `
    query getMenu($handle: String!) @inContext(country: US) {
      menu(handle: $handle) {
        id
        title
        items {
          id
          title
          url
          type
          items {
            id
            title
            url
            type
          }
        }
      }
    }
  `;
  try {
    const data = await shopifyFetch({ query, variables: { handle } });
    return data?.menu || null;
  } catch (error) {
    console.error(`Failed to fetch menu ${handle}:`, error);
    return null;
  }
}

export async function getShopifyProductRecommendations(productId) {
  const query = `
    query productRecommendations($productId: ID!) @inContext(country: US) {
      productRecommendations(productId: $productId) {
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
            media(first: 10) {
              edges {
                node {
                  mediaContentType
                  ... on Video {
                    sources {
                      url
                      format
                      mimeType
                    }
                    previewImage { url }
                  }
                  ... on ExternalVideo {
                    embeddedUrl
                    previewImage { url }
                  }
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
                  image {
                    url
                  }
                }
                    }
                  }
      }
    }
  `;
  try {
    const data = await shopifyFetch({ query, variables: { productId } });
    return data?.productRecommendations?.map(normalizeProduct) || [];
  } catch (error) {
    console.error(`Failed to fetch recommendations for ${productId}:`, error);
    return [];
  }
}

export async function getShopifyCollectionsWithProducts(limit = 10, productsPerCollection = 8) {
  const query = `
    query getCollectionsWithProducts($limit: Int!, $productsLimit: Int!) @inContext(country: US) {
      collections(first: $limit, sortKey: UPDATED_AT, reverse: true) {
        edges {
          node {
            id
            title
            handle
            products(first: $productsLimit) {
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
            media(first: 10) {
              edges {
                node {
                  mediaContentType
                  ... on Video {
                    sources {
                      url
                      format
                      mimeType
                    }
                    previewImage { url }
                  }
                  ... on ExternalVideo {
                    embeddedUrl
                    previewImage { url }
                  }
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
                  image {
                    url
                  }
                }
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
  try {
    const data = await shopifyFetch({ query, variables: { limit, productsLimit: productsPerCollection } });
    if (!data?.collections?.edges) return [];
    
    return data.collections.edges.map(edge => {
      const col = edge.node;
      col.products = col.products.edges.map(e => normalizeProduct(e.node));
      return col;
    });
  } catch (error) {
    console.error("Failed to fetch collections with products", error);
    return [];
  }
}

export async function subscribeToNewsletter(email) {
  const query = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
        }
        customerUserErrors {
          code
          field
          message
        }
    }
  `;
  
  // Shopify Storefront API requires a password to create a customer.
  // For a simple newsletter form, we generate a random dummy password.
  const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) + "Aa1!";
  
  const variables = {
    input: {
      email,
      password,
      acceptsMarketing: true
    }
  };

  try {
    const data = await shopifyFetch({ query, variables });
    return data?.customerCreate;
  } catch (error) {
    console.error("Failed to subscribe customer:", error);
    
    // If it's a GraphQL validation error about the password, we should log it
    if (error.isGraphQL) {
      console.error("GraphQL errors:", JSON.stringify(error.errors, null, 2));
    }
    
    return null;
  }
}

export async function getShopifyMetaobject(type, handle) {
  const query = `
    query getMetaobject($handle: MetaobjectHandleInput!) @inContext(country: US) {
      metaobject(handle: $handle) {
        id
        handle
        type
        fields {
          key
          value
        }
      }
    }
  `;
  try {
    const data = await shopifyFetch({ 
      query, 
      variables: { handle: { type, handle } } 
    });
    
    if (!data?.metaobject?.fields) return null;
    
    // Convert fields array into a simple key-value object
    const fieldsMap = {};
    data.metaobject.fields.forEach(f => {
      fieldsMap[f.key] = f.value;
    });
    
    return fieldsMap;
  } catch (error) {
    console.error(`Failed to fetch metaobject ${type}/${handle}`, error);
    return null;
  }
}

export async function getShopInfo() {
  const query = `
    query getShopInfo @inContext(country: US) {
      shop {
        name
        description
        primaryDomain {
          url
        }
        brand {
          logo {
            image {
              url
            }
          }
        }
      }
    }
  `;
  try {
    const data = await shopifyFetch({ query });
    return data?.shop || null;
  } catch (error) {
    console.error("Failed to fetch shop info:", error);
    return null;
  }
}

export async function getShopPolicies() {
  const query = `
    query getShopPolicies @inContext(country: US) {
      shop {
        privacyPolicy {
          title
          body
          url
        }
        refundPolicy {
          title
          body
          url
        }
        shippingPolicy {
          title
          body
          url
        }
        termsOfService {
          title
          body
          url
        }
      }
    }
  `;
  try {
    const data = await shopifyFetch({ query });
    return data?.shop || null;
  } catch (error) {
    console.error("Failed to fetch shop policies:", error);
    return null;
  }
}
