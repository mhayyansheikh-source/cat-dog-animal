import { getShopifyProducts } from "@/utils/shopify";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://peteora.com";

  // Static routes
  const staticRoutes = [
    "",
    "/collections/dogs",
    "/collections/cats",
    "/collections/accessories",
    "/collections/bundles",
    "/collections/replacement-parts",
    "/policies/refund-policy",
    "/policies/privacy-policy",
    "/policies/terms-of-service",
    "/policies/shipping-policy",
    "/policies/contact-information",
    "/policies/legal-notice",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily",
    priority: route === "" ? 1 : 0.8,
  }));

  try {
    // Dynamic Product Routes
    const products = await getShopifyProducts();
    const productRoutes = products.map((product) => ({
      url: `${baseUrl}/product/${product.handle}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

    return [...staticRoutes, ...productRoutes];
  } catch (error) {
    console.error("Failed to generate sitemap for products", error);
    return staticRoutes;
  }
}
