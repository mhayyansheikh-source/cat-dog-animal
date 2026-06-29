"use client";

import React from "react";
import { motion } from "framer-motion";
import { FlaskConical, Leaf, Truck, ShieldCheck, Recycle } from "lucide-react";

const features = [
  {
    Icon: FlaskConical,
    title: "Science-Backed",
    desc: "Vet-formulated with clinical ingredients",
  },
  {
    Icon: Leaf,
    title: "Natural Ingredients",
    desc: "No fillers, no artificial preservatives",
  },
  {
    Icon: Truck,
    title: "Free Shipping",
    desc: "On all orders over $50",
  },
  {
    Icon: ShieldCheck,
    title: "Satisfaction Guarantee",
    desc: "30-day no-questions refund",
  },
  {
    Icon: Recycle,
    title: "Eco Packaging",
    desc: "Sustainably sourced & recyclable",
  },
];

export default function FeaturesBand() {
  return (
    <div
      style={{
        backgroundColor: "var(--cream, #FDFAF5)",
        padding: "36px 0",
        borderTop: "1px solid var(--border, #E5E7EB)",
        borderBottom: "1px solid var(--border, #E5E7EB)",
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
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: i * 0.1 }}
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
              <div
                style={{
                  color: "var(--teal, #1A8C7A)",
                  marginBottom: "12px",
                }}
              >
                <f.Icon size={36} strokeWidth={1.5} />
              </div>

              {/* Title */}
              <span
                style={{
                  fontWeight: "800",
                  fontSize: "14px",
                  color: "var(--charcoal, #2A2A2A)",
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
                  color: "var(--gray, #6B7280)",
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
