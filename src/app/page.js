import React from "react";
import Hero from "@/components/Hero";
import FeaturesBand from "@/components/FeaturesBand";
import ProductTabs from "@/components/ProductTabs";
import TrustStats from "@/components/TrustStats";
import BundlesSection from "@/components/BundlesSection";
import ReviewsSection from "@/components/ReviewsSection";
import NewsletterSection from "@/components/NewsletterSection";
import CartDrawer from "@/components/CartDrawer";
import { getShopifyProducts } from "@/utils/shopify";

export default async function Home() {
  // Fetch live products from Shopify
  const products = await getShopifyProducts();

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Features Band Segment */}
      <FeaturesBand />

      {/* Best Sellers Grid Catalog */}
      <ProductTabs products={products} />

      {/* Trust Stats Numbers */}
      <TrustStats />

      {/* Value Combo Packs */}
      <BundlesSection />

      {/* Customer Testimonials reviews */}
      <ReviewsSection />

      {/* Footer Newsletter Action banner */}
      <NewsletterSection />

      {/* Dynamic Slide-out Cart Drawer Overlay */}
      <CartDrawer />
    </>
  );
}
