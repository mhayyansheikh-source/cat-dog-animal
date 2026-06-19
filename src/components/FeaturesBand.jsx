"use client";

import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    emoji: "🔬",
    title: "Science-Backed",
    desc: "Vet-formulated with clinical ingredients",
  },
  {
    emoji: "🌿",
    title: "Natural Ingredients",
    desc: "No fillers, no artificial preservatives",
  },
  {
    emoji: "🚀",
    title: "Free Shipping",
    desc: "On all orders over $50",
  },
  {
    emoji: "💯",
    title: "Satisfaction Guarantee",
    desc: "30-day no-questions refund",
  },
  {
    emoji: "♻️",
    title: "Eco Packaging",
    desc: "Sustainably sourced & recyclable",
  },
];

export default function FeaturesBand() {
  return (
    <div
      style={{
        backgroundColor: "#1E1E1E",
        padding: "36px 0",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                flex: "1 1 160px",
                minWidth: "140px",
              }}
            >
              {/* Icon */}
              <span
                style={{
                  fontSize: "36px",
                  display: "block",
                  marginBottom: "10px",
                  lineHeight: "1",
                  filter: "drop-shadow(0 2px 6px rgba(255,255,255,0.1))",
                }}
              >
                {f.emoji}
              </span>

              {/* Title */}
              <span
                style={{
                  fontWeight: "800",
                  fontSize: "14px",
                  color: "#FFFFFF",
                  marginBottom: "4px",
                  fontFamily: "var(--font-nunito), 'Nunito', sans-serif",
                  letterSpacing: "0.01em",
                }}
              >
                {f.title}
              </span>

              {/* Description */}
              <span
                style={{
                  fontSize: "12.5px",
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: "1.45",
                  maxWidth: "160px",
                }}
              >
                {f.desc}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
