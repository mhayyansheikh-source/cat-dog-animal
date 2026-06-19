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
          <span
            className="fw-bold text-uppercase small font-body d-block mb-2"
            style={{ color: "var(--orange)", letterSpacing: "0.12em" }}
          >
            Our Supplements Catalog
          </span>
          <h2 className="font-heading display-5 fw-bold mt-2" style={{ color: "var(--charcoal)" }}>
            Led by Science, Loved by Pets
          </h2>
          <p className="text-muted font-body max-w-lg mx-auto" style={{ fontSize: "16px" }}>
            Choose the perfect formula to maintain your pet's wellness. Switch below to preview puppy and kitty formulations.
          </p>

          {/* Switcher Buttons */}
          <div className="d-flex justify-content-center gap-2 mt-4 flex-wrap">
            {[
              { id: "all", label: "🌟 Show All" },
              { id: "dog", label: "🐕 Dog Supplements" },
              { id: "cat", label: "🐈 Cat Supplements" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="rounded-pill-cta py-2.5 px-4 border font-body fw-bold shadow-sm"
                style={{
                  backgroundColor:
                    activeTab === tab.id
                      ? tab.id === "cat"
                        ? "var(--teal)"
                        : "var(--orange)"
                      : "var(--white)",
                  color: activeTab === tab.id ? "var(--white)" : "var(--gray)",
                  borderColor:
                    activeTab === tab.id
                      ? tab.id === "cat"
                        ? "var(--teal)"
                        : "var(--orange)"
                      : "var(--border)",
                  fontSize: "0.95rem",
                  transition: "all 0.2s ease"
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
