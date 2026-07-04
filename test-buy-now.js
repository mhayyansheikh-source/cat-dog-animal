import { createShopifyCheckout } from "./src/utils/shopify.js";

async function run() {
  const url = await createShopifyCheckout([{ merchandiseId: "gid://shopify/ProductVariant/42220498729577", quantity: 1 }]);
  console.log("URL:", url);
}

run().catch(console.error);
