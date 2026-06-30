import React from "react";
import nextDynamic from "next/dynamic";
import Hero from "@/components/Hero";


const TrustStats = nextDynamic(() => import("@/components/TrustStats"));
import { 
  getShopifyProducts, 
  getShopifyCollectionByHandle, 
  getShopifyCollectionsWithProducts,
  getShopifyMetaobject
} from "@/utils/shopify";

const ProductTabs = nextDynamic(() => import("@/components/ProductTabs"));
const BundlesSection = nextDynamic(() => import("@/components/BundlesSection"));
const ReviewsSection = nextDynamic(() => import("@/components/ReviewsSection"));
const NewsletterSection = nextDynamic(() => import("@/components/NewsletterSection"));

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function Home() {
  // Fetch live products from Shopify
  const products = await getShopifyProducts();
  const collections = await getShopifyCollectionsWithProducts(10, 8);
  
  // Find promo products for the Hero carousel
  const catBackpack = products.find(p => p.handle === 'breathable-pet-cat-carrier-backpack') || null;
  const dogHarness = products.find(p => p.handle === 'quick-release-dog-harness-vest') || null;
  const promoProducts = { catBackpack, dogHarness };
  
  // Fetch Homepage Metaobject configuration (gracefully falls back if not created yet)
  const heroMeta = await getShopifyMetaobject("homepage_config", "hero") || null;
  const statsMeta = await getShopifyMetaobject("homepage_config", "stats") || null;

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
      <Hero collections={collections} heroMeta={heroMeta} promoProducts={promoProducts} />



      {/* Best Sellers Grid Catalog */}
      <ProductTabs products={products} collections={collections} />

      {/* Trust Stats Numbers */}
      <div className="cv-auto">
        <TrustStats statsMeta={statsMeta} />
      </div>

      {/* Value Combo Packs */}
      <div className="cv-auto-large">
        <BundlesSection dynamicProducts={bundleProducts} />
      </div>

      {/* Customer Testimonials reviews */}
      <div className="cv-auto-large">
        <ReviewsSection />
      </div>

      {/* Footer Newsletter Action banner */}
      <div className="cv-auto">
        <NewsletterSection />
      </div>
    </>
  );
}
