import { getShopifyProducts } from './src/utils/shopify.js';
async function test() {
  const products = await getShopifyProducts();
  const bundleProducts = products.filter(p => p.product_type?.toLowerCase().includes("bundle") || p.tags?.some(t => t.toLowerCase().includes("bundle")));
  console.log('Total products:', products.length);
  console.log('Bundle products:', bundleProducts.length);
  if (bundleProducts.length > 0) {
    console.log(bundleProducts.map(p => p.title));
  } else {
    // maybe check titles
    const bundlesByTitle = products.filter(p => p.title.toLowerCase().includes("bundle") || p.title.toLowerCase().includes("kit"));
    console.log('Bundles by title:', bundlesByTitle.map(p => p.title));
  }
}
test();
