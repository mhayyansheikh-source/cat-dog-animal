import React from "react";
import Hero from "@/components/Hero";
import ConcernGrid from "@/components/ConcernGrid";
import ProductTabs from "@/components/ProductTabs";
import DosageFinder from "@/components/DosageFinder";
import IngredientsSpotlight from "@/components/IngredientsSpotlight";
import CartDrawer from "@/components/CartDrawer";

export default function Home() {
  return (
    <>
      {/* Hero Entrance Banners */}
      <Hero />

      {/* Target Concern Category Lists */}
      <div className="container">
        <ConcernGrid />
      </div>

      {/* Tabbed Product Catalog grids */}
      <ProductTabs />

      {/* Interactive Dosage finder quiz widgets */}
      <div className="container">
        <DosageFinder />
      </div>

      {/* Scientific Active Ingredients spotlight columns */}
      <IngredientsSpotlight />

      {/* Dynamic slide-out Cart Drawer elements */}
      <CartDrawer />
    </>
  );
}
