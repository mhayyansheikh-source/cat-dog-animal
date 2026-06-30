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
const CategoryShowcase = nextDynamic(() => import("@/components/CategoryShowcase"));
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

  // Fetch dog, cat, accessories, and bundles collections in parallel
  const [dogCollection, catCollection, accessoriesCollection, bundleCollection] = await Promise.allSettled([
    getShopifyCollectionByHandle("dogs"),
    getShopifyCollectionByHandle("cats-1"),
    getShopifyCollectionByHandle("accessories"),
    getShopifyCollectionByHandle("bundles"),
  ]);

  const dogData = dogCollection.status === 'fulfilled' ? dogCollection.value : null;
  const catData = catCollection.status === 'fulfilled' ? catCollection.value : null;
  const accessoriesData = accessoriesCollection.status === 'fulfilled' ? accessoriesCollection.value : null;

  let bundleProducts = [];
  if (bundleCollection.status === 'fulfilled' && bundleCollection.value?.products) {
    bundleProducts = bundleCollection.value.products;
  } else {
    bundleProducts = products.filter(p => p.product_type?.toLowerCase().includes("bundle") || p.tags?.some(t => t.toLowerCase().includes("bundle")));
  }

  return (
    <>
      {/* Hero Section */}
      <Hero collections={collections} heroMeta={heroMeta} promoProducts={promoProducts} />



      {/* Best Sellers Grid Catalog */}
      <ProductTabs products={products} collections={collections} />

      {/* Shop by Category — Dogs, Cats & Other Pets */}
      <CategoryShowcase dogCollection={dogData} catCollection={catData} otherCollection={accessoriesData} />

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
