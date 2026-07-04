import { createShopifyCheckout } from "./src/utils/shopify.js";

async function run() {
  try {
    // Assuming a dummy GID for variant, but we can fetch one first to be safe
    const { getShopifyProducts } = await import("./src/utils/shopify.js");
    const products = await getShopifyProducts();
    if (products.length === 0) {
      console.log("No products found");
      return;
    }
    const variantId = products[0].variants[0].id;
    console.log("Using variantId:", variantId);
    
    const url = await createShopifyCheckout([{ variantId, quantity: 1 }]);
    console.log("Checkout URL:", url);
  } catch (err) {
    console.error("Test failed:", err);
  }
}
run();
