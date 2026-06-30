"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

// Default marquee items when no products are available
const DEFAULT_ITEMS = [
  { emoji: "🐾", text: "Free Shipping Over $50" },
  { emoji: "🎁", text: "Buy 2 Get 10% OFF — Shop Bundles" },
  { emoji: "⭐", text: "4.9/5 Rating · 2,000+ Happy Pets" },
  { emoji: "📦", text: "Fast Delivery Worldwide" },
  { emoji: "🐕", text: "Premium Dog Supplements" },
  { emoji: "🐈", text: "Cat Products Your Feline Will Love" },
  { emoji: "💊", text: "Science-Backed Pet Nutrition" },
  { emoji: "🏷️", text: "Subscribe & Save 20%" },
];

function buildItems(products = []) {
  // Mix live product promos with static store messages
  const productItems = products.slice(0, 5).map((p) => {
    const price = p.variants?.[0]?.price
      ? `$${parseFloat(p.variants[0].price).toFixed(2)}`
      : null;
    return {
      emoji: "🛒",
      text: price ? `${p.title} — Only ${price}` : p.title,
      href: `/products/${p.handle}`,
    };
  });

  // Interleave product items with static promo items
  const merged = [];
  const statics = DEFAULT_ITEMS;
  const maxLen = Math.max(statics.length, productItems.length);
  for (let i = 0; i < maxLen; i++) {
    if (statics[i]) merged.push(statics[i]);
    if (productItems[i]) merged.push(productItems[i]);
  }
  return merged.length > 0 ? merged : statics;
}

export default function MarqueeTopBar({ products = [], collections = [] }) {
  const trackRef = useRef(null);

  const items = buildItems(products);
  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div
      className="overflow-hidden position-relative"
      style={{
        backgroundColor: "#198e7a",
        color: "white",
        fontSize: "13px",
        fontWeight: "700",
        height: "36px",
        display: "flex",
        alignItems: "center",
        userSelect: "none",
      }}
      aria-label="Store promotions"
    >
      {/* CSS-driven infinite marquee — no JS animation loop */}
      <style>{`
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          align-items: center;
          white-space: nowrap;
          animation: marqueeScroll 35s linear infinite;
          will-change: transform;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="marquee-track" ref={trackRef}>
        {doubled.map((item, i) => (
          <span key={i} className="d-inline-flex align-items-center">
            {item.href ? (
              <Link
                href={item.href}
                className="text-white text-decoration-none"
                style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}
              >
                <span>{item.emoji}</span>
                <span>{item.text}</span>
              </Link>
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <span>{item.emoji}</span>
                <span>{item.text}</span>
              </span>
            )}
            {/* Separator dot */}
            <span
              style={{
                display: "inline-block",
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.5)",
                margin: "0 20px",
                flexShrink: 0,
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
