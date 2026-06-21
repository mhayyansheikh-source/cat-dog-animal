import { getShopifyProducts } from './src/utils/shopify.js';

async function test() {
  const products = await getShopifyProducts();
  const product = products.find(p => p.variants && p.variants.length > 1 && p.variants.some(v => v.image));
  if (product) {
    console.log("Images:", product.images.slice(0, 2));
    console.log("Variant Image:", product.variants[0].image);
  }
}
test();
