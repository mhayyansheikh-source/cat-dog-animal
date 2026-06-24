"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";



function BundleCard({ bundle }) {
  return (
    <div
      className="bundle-card"
      style={{
        background: "white",
        border: "1px solid #E5E7EB",
        borderRadius: "16px",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        transition: "box-shadow 0.25s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 40px rgba(0,0,0,0.14)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.08)")}
    >
      {/* Visual Side */}
      <div
        style={{
          background: bundle.bg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "40px 20px",
          minHeight: "260px",
          gap: "10px",
        }}
      >
        <span style={{ fontSize: "72px", lineHeight: "1" }}>{bundle.emoji}</span>
        <span
          style={{
            fontSize: "13px",
            fontWeight: "700",
            color: bundle.btnStyle.backgroundColor,
          }}
        >
          {bundle.label}
        </span>
      </div>

      {/* Content Side */}
      <div
        style={{
          padding: "32px 28px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <span
            style={{
              display: "inline-block",
              borderRadius: "100px",
              padding: "4px 14px",
              fontSize: "12px",
              fontWeight: "800",
              marginBottom: "14px",
              ...bundle.tagStyle,
            }}
          >
            {bundle.tag}
          </span>
          <h3
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "22px",
              fontWeight: "700",
              marginBottom: "10px",
              color: "var(--charcoal, #2A2A2A)",
            }}
          >
            {bundle.title}
          </h3>
          <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "18px", lineHeight: "1.55" }}>
            {bundle.desc}
          </p>
          <ul style={{ listStyle: "none", padding: 0, marginBottom: "22px" }}>
            {bundle.items.map((item, i) => (
              <li
                key={i}
                style={{
                  fontSize: "14px",
                  color: "var(--charcoal, #2A2A2A)",
                  padding: "4px 0",
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ color: "var(--teal, #1A8C7A)", fontWeight: "800", flexShrink: 0 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "18px" }}>
            <span
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: "30px",
                fontWeight: "700",
                color: "var(--orange)",
              }}
            >
              {bundle.newPrice}
            </span>
            <span style={{ fontSize: "16px", color: "#6B7280", textDecoration: "line-through" }}>
              {bundle.oldPrice}
            </span>
          </div>

          <Link href={bundle.href} className="text-decoration-none d-block">
            <button
              style={{
                width: "100%",
                border: "none",
                borderRadius: "100px",
                padding: "13px 20px",
                fontWeight: "800",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s",
                ...bundle.btnStyle,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = bundle.btnHover;
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = bundle.btnStyle.backgroundColor;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Add Bundle to Cart
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BundlesSection({ dynamicProducts }) {
  const hasDynamic = dynamicProducts && dynamicProducts.length > 0;
  
  if (!hasDynamic) {
    return null; // Return null if no live bundles are found
  }

  const renderDynamicBundles = () => {
    return dynamicProducts.map((product, idx) => {
      const isEven = idx % 2 === 0;
      
      // Attempt to parse items from a Metafield if it exists (e.g. custom.bundle_items JSON array)
      let parsedItems = ["Premium Pet Wellness Routine", "Vet Recommended", "100% Satisfaction Guarantee"];
      const bundleItemsMeta = product.metafields?.find(m => m && m.key === "bundle_items");
      if (bundleItemsMeta && bundleItemsMeta.value) {
        try {
          parsedItems = JSON.parse(bundleItemsMeta.value);
        } catch(e) {
          console.error("Failed to parse bundle items metafield", e);
        }
      }

      // Format prices
      const currentPrice = product.price ? `$${parseFloat(product.price).toFixed(2)}` : "TBD";
      const oldPrice = product.compareAtPrice ? `$${parseFloat(product.compareAtPrice).toFixed(2)}` : "";
      
      // Calculate savings if possible
      let tagText = "Special Offer";
      if (product.price && product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price)) {
        const savingStr = Math.round((1 - (parseFloat(product.price) / parseFloat(product.compareAtPrice))) * 100);
        tagText = `Save ${savingStr}%`;
      }

      const bundleConfig = {
        emoji: isEven ? "🐕" : "🐈",
        label: "Value Bundle",
        bg: isEven ? "var(--orange-light)" : "var(--teal-light)",
        tag: tagText,
        tagStyle: isEven 
          ? { backgroundColor: "var(--teal-light)", color: "var(--teal-dark)" }
          : { backgroundColor: "var(--orange-light)", color: "var(--orange-dark)" },
        title: product.title,
        desc: product.body_html ? product.body_html.replace(/<[^>]*>/g, '').substring(0, 100) + "..." : "A complete routine for your pet.",
        items: parsedItems,
        newPrice: currentPrice,
        oldPrice: oldPrice,
        href: `/product/${product.handle}`,
        btnStyle: isEven ? { backgroundColor: "var(--orange)", color: "white" } : { backgroundColor: "var(--teal)", color: "white" },
        btnHover: isEven ? "#C45A0E" : "#0F5E52",
      };

      return <BundleCard key={product.id} bundle={bundleConfig} />;
    });
  };

  return (
    <section className="py-5 bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-5">
          <span
            className="fw-bold text-uppercase small font-body d-block mb-2"
            style={{ color: "var(--orange)", letterSpacing: "0.12em" }}
          >
            Save More
          </span>
          <h2
            className="font-heading fw-bold mt-2"
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "clamp(28px, 4vw, 40px)",
              color: "var(--charcoal, #2A2A2A)",
              marginBottom: "14px",
            }}
          >
            Value Bundle Packs
          </h2>
          <p
            className="mx-auto"
            style={{ fontSize: "17px", color: "#6B7280", maxWidth: "560px" }}
          >
            Complete wellness kits for your pet — curated by our vets and bundled for savings.
          </p>
        </div>

        {/* Bundle Grid */}
        <div className="bundle-carousel">
          {renderDynamicBundles()}
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          .bundle-carousel {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            gap: 16px;
            padding-bottom: 16px;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .bundle-carousel::-webkit-scrollbar {
            display: none;
          }
          .bundle-card {
            scroll-snap-align: start;
            flex: 0 0 88vw;
            max-width: 480px;
          }
          @media (min-width: 768px) {
            .bundle-carousel {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(min(100%, 480px), 1fr));
              gap: 24px;
              overflow-x: visible;
            }
            .bundle-card {
              flex: auto;
              max-width: none;
            }
          }
          @media (max-width: 575px) {
            .bundle-card {
              grid-template-columns: 1fr !important;
            }
            .bundle-card > div:first-child {
              min-height: 160px !important;
              padding: 20px 16px !important;
            }
            .bundle-card > div:last-child {
              padding: 24px 20px !important;
            }
          }
        `}} />
      </div>
    </section>
  );
}
