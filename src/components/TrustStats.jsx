"use client";

import React from "react";
import { motion } from "framer-motion";

const stats = [
  { num: "250K+", label: "Happy Pets Fed" },
  { num: "4.9★", label: "Average Rating" },
  { num: "98%", label: "Would Recommend" },
  { num: "60+", label: "Premium Products" },
  { num: "12+", label: "Years of Expertise" },
];

export default function TrustStats({ statsMeta = null }) {
  let displayStats = stats;
  
  if (statsMeta?.stats_json) {
    try {
      displayStats = JSON.parse(statsMeta.stats_json);
    } catch(e) {
      console.error("Failed to parse stats JSON", e);
    }
  }

  return (
    <section
      style={{
        backgroundColor: "var(--cream, #FDFAF5)",
        padding: "60px 24px",
        borderTop: "1px solid #E5E7EB",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <div className="container">
        {/* Header */}
        <div className="text-center" style={{ marginBottom: "40px" }}>
          <p
            style={{
              fontSize: "13px",
              color: "#6B7280",
              fontWeight: "700",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Trusted by Pet Parents Everywhere
          </p>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "20px",
          }}
        >
          {displayStats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              style={{
                background: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "16px",
                padding: "28px 20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "36px",
                  fontWeight: "700",
                  color: "var(--orange, #F5761A)",
                  marginBottom: "6px",
                  lineHeight: "1.2",
                }}
              >
                {s.num}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#6B7280",
                  fontWeight: "600",
                }}
              >
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
