"use client";

import React from "react";
import { motion } from "framer-motion";
import { testimonials } from "@/data/testimonials";

export default function ReviewsSection() {

  const MarqueeRow = ({ items, reverse = false }) => (
    <div style={{ display: "flex", overflow: "hidden", position: "relative", width: "100%", paddingBottom: "24px" }}>
      <motion.div
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: 400, ease: "linear", repeat: Infinity }}
        style={{ display: "flex", gap: "24px", minWidth: "max-content", paddingLeft: "24px" }}
      >
        {/* We duplicate the items array so the loop is seamless */}
        {[...items, ...items].map((r, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02 }}
            style={{
              background: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "16px",
              padding: "24px",
              width: "350px", // Fixed width for marquee items
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              cursor: "pointer"
            }}
          >
            {/* Stars */}
            <div style={{ color: "#F59E0B", fontSize: "16px", marginBottom: "12px" }}>
              {r.stars}
            </div>

            {/* Review Text */}
            <p
              style={{
                fontSize: "14px",
                color: "var(--charcoal, #2A2A2A)",
                lineHeight: "1.6",
                fontStyle: "italic",
                marginBottom: "20px",
                flexGrow: 1,
              }}
            >
              "{r.text}"
            </p>

            {/* Reviewer Info */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "var(--orange-light, #FEF0E6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  flexShrink: 0,
                }}
              >
                {r.avatar}
              </div>
              <div>
                <div style={{ fontWeight: "800", fontSize: "13px", color: "var(--charcoal, #2A2A2A)" }}>
                  {r.name}
                </div>
                <div style={{ fontSize: "11px", color: "#6B7280" }}>{r.pet}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );

  return (
    <section
      className="py-5"
      style={{ backgroundColor: "var(--cream, #FDFAF5)", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB", overflow: "hidden" }}
    >
      <div className="font-body text-start">
        {/* Section Header */}
        <div className="container text-center mb-5">
          <span
            className="fw-bold text-uppercase small d-block mb-2"
            style={{ color: "var(--orange)", letterSpacing: "0.12em" }}
          >
            Real Reviews from the Peteora Pack
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
            Loved by 100,000+ Pets Across the USA
          </h2>
          <p
            className="mx-auto"
            style={{ fontSize: "17px", color: "#6B7280", maxWidth: "600px" }}
          >
            Don't just take our word for it. Here is what real pet parents from Austin to Boston are saying about their results.
          </p>
        </div>

        {/* Marquee Rows */}
        <div style={{ position: "relative" }}>
          {/* Edge fade gradients for seamless marquee illusion */}
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: "100px", zIndex: 2,
            background: "linear-gradient(to right, var(--cream, #FDFAF5) 0%, transparent 100%)",
            pointerEvents: "none"
          }}></div>
          <div style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: "100px", zIndex: 2,
            background: "linear-gradient(to left, var(--cream, #FDFAF5) 0%, transparent 100%)",
            pointerEvents: "none"
          }}></div>

          <MarqueeRow items={testimonials} />
        </div>
      </div>
    </section>
  );
}
