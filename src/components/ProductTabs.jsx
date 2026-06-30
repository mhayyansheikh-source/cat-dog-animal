"use client";

import React, { useState } from "react";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "framer-motion";



export default function ProductTabs({ products = [], collections = [] }) {
  const [activeTab, setActiveTab] = useState("all");

  // Build dynamic tabs
  const tabs = [{ id: "all", label: "All" }];
  collections.forEach(col => {
    if (col.handle !== "all") {
      tabs.push({ id: col.handle, label: col.title });
    }
  });

  // Filter products based on active tab
  const displayProducts = activeTab === "all" 
    ? products.slice(0, 8) 
    : collections.find(c => c.handle === activeTab)?.products || [];

  const viewAllLink = activeTab === "all" ? "/collections/all" : `/collections/${activeTab}`;

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
            The products your fellow pet parents can&apos;t stop ordering.
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
            {tabs.map((tab) => {
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
            {displayProducts.map((product, index) => (
              <div key={product.id} className="col-6 col-md-4 col-lg-3">
                <ProductCard product={product} index={index} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View All CTA */}
        <div className="text-center" style={{ marginTop: "40px" }}>
          <a
            href={viewAllLink}
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
