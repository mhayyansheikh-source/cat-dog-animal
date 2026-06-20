import React from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import FeaturesBand from "@/components/FeaturesBand";
import TrustStats from "@/components/TrustStats";
import { getShopifyProducts, getShopifyCollectionByHandle, getShopifyCollectionsWithProducts } from "@/utils/shopify";

const ProductTabs = dynamic(() => import("@/components/ProductTabs"));
const BundlesSection = dynamic(() => import("@/components/BundlesSection"));
const ReviewsSection = dynamic(() => import("@/components/ReviewsSection"));
const NewsletterSection = dynamic(() => import("@/components/NewsletterSection"));

export default async function Home() {
  // Fetch live products from Shopify
  const products = await getShopifyProducts();
  const collections = await getShopifyCollectionsWithProducts(10, 8);

  // Fetch bundles explicitly
  let bundleProducts = [];
  try {
    const bundleCollection = await getShopifyCollectionByHandle("bundles");
    if (bundleCollection && bundleCollection.products) {
      bundleProducts = bundleCollection.products;
    } else {
      // Fallback
      bundleProducts = products.filter(p => p.product_type?.toLowerCase().includes("bundle") || p.tags?.some(t => t.toLowerCase().includes("bundle")));
    }
  } catch(e) {
    console.error("Error fetching bundles", e);
  }

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Features Band Segment */}
      <FeaturesBand />

      {/* Best Sellers Grid Catalog */}
      <ProductTabs products={products} collections={collections} />

      {/* Trust Stats Numbers */}
      <TrustStats />

      {/* Value Combo Packs */}
      <BundlesSection dynamicProducts={bundleProducts} />

      {/* Customer Testimonials reviews */}
      <ReviewsSection />

      {/* Footer Newsletter Action banner */}
      <NewsletterSection />
    </>
  );
}
