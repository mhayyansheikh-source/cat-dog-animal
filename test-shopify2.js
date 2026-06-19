const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = envFile.split('\n').reduce((acc, line) => {
  const [key, value] = line.split('=');
  if (key && value) acc[key.trim()] = value.trim();
  return acc;
}, {});

async function test() {
  const domain = env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const privateToken = env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
  const url = `https://${domain}/api/2024-01/graphql.json`;
  
  const headers = {
    "Content-Type": "application/json",
    "Shopify-Storefront-Private-Token": privateToken,
  };

  const query = `{
    products(first: 1) { edges { node { variants(first: 1) { edges { node { id } } } } } }
  }`;
  
  let response = await fetch(url, { method: "POST", headers, body: JSON.stringify({ query }) });
  let data = await response.json();
  console.log("Private Token Query Response:", JSON.stringify(data, null, 2));
}
test();
