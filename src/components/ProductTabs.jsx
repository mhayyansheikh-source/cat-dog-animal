"use client";

import React, { useState } from "react";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "framer-motion";



// ── All tabs config ───────────────────────────────────────────────────────────
const TABS = [
  { id: "all",               label: "All" },
  { id: "dog",               label: "🐶 Dogs" },
  { id: "cat",               label: "🐱 Cats" },
  { id: "accessories",       label: "🎾 Accessories" },
  { id: "bundles",           label: "🎁 Bundles" },
  { id: "cat-supplements",   label: "💊 Cat Supplements" },
  { id: "scratchers",        label: "📦 Scratchers" },
];

// ── Filter Logic ──────────────────────────────────────────────────────────────
function filterProducts(tab, liveProducts = []) {
  if (!liveProducts) return [];
  switch (tab) {
    case "all":
      return liveProducts;
    case "dog":
      return liveProducts.filter(p => p.tags?.some(t => t.toLowerCase() === "dog") || p.product_type === "Dog");
    case "cat":
      return liveProducts.filter(p => p.tags?.some(t => t.toLowerCase() === "cat") || p.product_type === "Cat" || p.product_type === "Cat Supplements");
    case "accessories":
      return liveProducts.filter(p => p.tags?.some(t => t.toLowerCase() === "accessory") || p.product_type === "Accessory");
    case "bundles":
      return liveProducts.filter(p => p.tags?.some(t => t.toLowerCase() === "bundle") || p.product_type === "Bundle");
    case "cat-supplements":
      return liveProducts.filter(p => p.tags?.some(t => t.toLowerCase() === "cat-supplement") || p.product_type === "Cat Supplements");
    case "scratchers":
      return liveProducts.filter(p => p.tags?.some(t => t.toLowerCase() === "scratcher"));
    default:
      return liveProducts;
  }
}

// ── View All link per tab ─────────────────────────────────────────────────────
const TAB_LINKS = {
  all:             "/collections/dogs",
  dog:             "/collections/dogs",
  cat:             "/collections/cats",
  accessories:     "/collections/accessories",
  bundles:         "/collections/bundles",
  "cat-supplements": "/collections/cat-supplements",
  scratchers:      "/collections/cardboard-scratchers",
};

export default function ProductTabs({ products = [] }) {
  const [activeTab, setActiveTab] = useState("all");
  const displayProducts = filterProducts(activeTab, products);

  return (
    <section id="catalog-section" className="py-5" style={{ backgroundColor: "var(--cream, #FDFAF5)" }}>
      <div className="container" id="shop-dogs">
        <div id="shop-cats" className="text-center mb-5">

          {/* Eyebrow */}
          <span
            className="fw-bold text-uppercase small font-body d-block mb-2"
            style={{ color: "var(--orange)", letterSpacing: "0.12em" }}
          >
            Top Picks
          </span>

          {/* Heading */}
          <h2
            className="font-heading fw-bold mt-2"
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "clamp(32px, 5vw, 52px)",
              color: "var(--charcoal, #2A2A2A)",
              marginBottom: "14px",
            }}
          >
            Best Sellers This Week
          </h2>

          {/* Subtitle */}
          <p
            className="mx-auto"
            style={{ fontSize: "17px", color: "#6B7280", maxWidth: "560px", marginBottom: "32px" }}
          >
            The products your fellow pet parents can't stop ordering.
          </p>

          {/* Tab Pills */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    backgroundColor: isActive ? "var(--orange)" : "white",
                    color: isActive ? "white" : "#6B7280",
                    border: isActive ? "2px solid var(--orange)" : "2px solid #E5E7EB",
                    borderRadius: "100px",
                    padding: "10px 22px",
                    fontSize: "14px",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontFamily: "var(--font-nunito), 'Nunito', sans-serif",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = "var(--orange)";
                      e.currentTarget.style.color = "var(--orange)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = "#E5E7EB";
                      e.currentTarget.style.color = "#6B7280";
                    }
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="row g-4 justify-content-center text-start"
          >
            {displayProducts.map((product) => (
              <div key={product.id} className="col-xl-3 col-lg-4 col-sm-6">
                <ProductCard product={product} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View All CTA */}
        <div className="text-center" style={{ marginTop: "40px" }}>
          <a
            href={TAB_LINKS[activeTab] || "/collections/dogs"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "var(--orange)",
              color: "white",
              borderRadius: "100px",
              padding: "13px 32px",
              fontWeight: "800",
              fontSize: "15px",
              textDecoration: "none",
              boxShadow: "0 4px 16px rgba(245,118,26,0.28)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#C45A0E";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--orange)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            View All Products →
          </a>
        </div>
      </div>
    </section>
  );
}
