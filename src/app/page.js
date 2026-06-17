import React from "react";
import Hero from "@/components/Hero";
import ConcernGrid from "@/components/ConcernGrid";
import ProductTabs from "@/components/ProductTabs";
import DosageFinder from "@/components/DosageFinder";
import IngredientsSpotlight from "@/components/IngredientsSpotlight";
import CartDrawer from "@/components/CartDrawer";
import { getShopifyProducts } from "@/utils/shopify";

export default async function Home() {
  // Fetch live products from Shopify
  const products = await getShopifyProducts();

  return (
    <>
      {/* Hero Entrance Banners */}
      <Hero />

      {/* Target Concern Category Lists */}
      <div className="container">
        <ConcernGrid />
      </div>

      {/* Tabbed Product Catalog grids feeding live data */}
      <ProductTabs products={products} />

      {/* Interactive Dosage finder quiz widgets feeding live data */}
      <div className="container">
        <DosageFinder products={products} />
      </div>

      {/* Scientific Active Ingredients spotlight columns */}
      <IngredientsSpotlight />

      {/* Dynamic slide-out Cart Drawer elements */}
      <CartDrawer />
    </>
  );
}
