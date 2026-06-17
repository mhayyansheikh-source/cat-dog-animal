"use client";

import React, { useState } from "react";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";

export default function ProductTabs({ products = [] }) {
  const [activeTab, setActiveTab] = useState("all");

  // Filtering products
  const filteredProducts = products.filter((product) => {
    if (activeTab === "all") return true;
    if (activeTab === "dog") return product.product_type === "Dog";
    if (activeTab === "cat") return product.product_type === "Cat";
    return true;
  });

  return (
    <section id="catalog-section" className="py-5 bg-light">
      <div className="container" id="shop-dogs">
        {/* Anchor point for cats catalog too */}
        <div id="shop-cats" className="text-center mb-5">
          <span className="text-forest-green fw-bold text-uppercase small tracking-wider font-body">
            Our Supplements Catalog
          </span>
          <h2 className="font-heading display-6 fw-bold mt-2">
            Led by Science, Loved by Pets
          </h2>
          <p className="text-muted font-body max-w-lg mx-auto">
            Choose the perfect formula to maintain your pet's wellness. Switch below to preview puppy and kitty formulations.
          </p>

          {/* Switcher Buttons */}
          <div className="d-flex justify-content-center gap-2 mt-4">
            {[
              { id: "all", label: "🌟 Show All" },
              { id: "dog", label: "🐕 Dog Supplements" },
              { id: "cat", label: "🐈 Cat Supplements" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="rounded-pill-cta py-2 px-4 border shadow-sm font-body fw-bold"
                style={{
                  backgroundColor: activeTab === tab.id ? "var(--zesty-orange)" : "var(--white)",
                  color: activeTab === tab.id ? "var(--white)" : "var(--charcoal-dark)",
                  borderColor: activeTab === tab.id ? "var(--zesty-orange)" : "var(--pale-gray)",
                  fontSize: "0.95rem"
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        <motion.div
          layout
          className="row g-4 justify-content-center"
        >
          {filteredProducts.map((product) => (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              key={product.id}
              className="col-xl-3 col-lg-4 col-sm-6"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
