import React from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import FeaturesBand from "@/components/FeaturesBand";
import TrustStats from "@/components/TrustStats";
import { getShopifyProducts } from "@/utils/shopify";

// Lazy-load heavy or below-the-fold components
const ProductTabs = dynamic(() => import("@/components/ProductTabs"), { ssr: true });
const BundlesSection = dynamic(() => import("@/components/BundlesSection"), { ssr: true });
const ReviewsSection = dynamic(() => import("@/components/ReviewsSection"), { ssr: true });
const NewsletterSection = dynamic(() => import("@/components/NewsletterSection"), { ssr: false });
const CartDrawer = dynamic(() => import("@/components/CartDrawer"), { ssr: false });


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
