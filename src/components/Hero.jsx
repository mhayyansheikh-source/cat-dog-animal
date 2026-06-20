"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const categoryCards = [
  {
    emoji: "🐕",
    title: "For Dogs",
    desc: "Supplements, food & treats",
    badge: "35+ Products",
    href: "/collections/dogs",
    badgeStyle: { backgroundColor: "var(--orange-light)", color: "var(--orange-dark)" },
    delay: 0.2,
    offset: false,
  },
  {
    emoji: "🐈",
    title: "For Cats",
    desc: "Health & wellness range",
    badge: "20+ Products",
    href: "/collections/cats",
    badgeStyle: { backgroundColor: "var(--orange-light)", color: "var(--orange-dark)" },
    delay: 0.3,
    offset: true,
  },
  {
    emoji: "🎾",
    title: "Accessories",
    desc: "Beds, toys & travel gear",
    badge: "New Arrivals",
    href: "/collections/accessories",
    badgeStyle: { backgroundColor: "var(--teal-light)", color: "var(--teal-dark)" },
    delay: 0.4,
    offset: false,
  },
  {
    emoji: "🎁",
    title: "Bundles",
    desc: "Save up to 30% on combos",
    badge: "Best Value",
    href: "/collections/bundles",
    badgeStyle: { backgroundColor: "var(--teal-light)", color: "var(--teal-dark)" },
    delay: 0.5,
    offset: true,
  },
];

const stats = [
  { num: "250K+", label: "Happy Pets" },
  { num: "4.9★", label: "Avg. Rating" },
  { num: "60+", label: "Products" },
];

export default function Hero() {
  return (
    <section
      style={{
        background: "linear-gradient(135deg, #FDFAF5 0%, #FEF0E6 50%, #E0F5F2 100%)",
        minHeight: "580px",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Decorative blobs */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,118,26,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-60px",
          left: "-60px",
          width: "240px",
          height: "240px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(26,140,122,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="container position-relative" style={{ paddingTop: "60px", paddingBottom: "60px" }}>
        <div className="row align-items-center g-5">

          {/* ── LEFT COLUMN ── */}
          <div className="col-lg-6 text-center text-lg-start">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="d-inline-flex align-items-center gap-2 rounded-pill mb-4"
              style={{
                backgroundColor: "var(--orange-light)",
                color: "var(--orange-dark)",
                border: "1.5px solid #F5C49A",
                fontSize: "13px",
                fontWeight: "800",
                padding: "6px 16px",
              }}
            >
              <span>✨</span>
              <span>Vet-Recommended Formulas</span>
            </motion.div>

            {/* H1 */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1, delayChildren: 0.1 }
                }
              }}
              className="font-heading fw-bold mb-3"
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: "clamp(38px, 5vw, 56px)",
                lineHeight: "1.1",
                color: "var(--charcoal)",
              }}
            >
              {"Your Pet Deserves the ".split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  style={{ display: "inline-block", marginRight: "8px" }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                  }}
                >
                  {word}
                </motion.span>
              ))}
              <br className="d-none d-md-block" />
              <motion.span 
                style={{ color: "var(--orange)", fontStyle: "italic", display: "inline-block" }}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } }
                }}
              >
                Best of Everything
              </motion.span>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontSize: "17px",
                color: "var(--gray, #6B7280)",
                marginBottom: "36px",
                maxWidth: "480px",
                lineHeight: "1.65",
              }}
            >
              Premium supplements, treats, food, and accessories for happy, healthy cats and dogs.
              Science-backed ingredients, loved by pets worldwide.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3 mb-5"
            >
              <Link href="/collections/dogs" className="text-decoration-none">
                <motion.button
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: "var(--orange)",
                    color: "white",
                    border: "none",
                    borderRadius: "100px",
                    padding: "12px 26px",
                    fontWeight: "800",
                    fontSize: "15px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 4px 16px rgba(245,118,26,0.3)",
                  }}
                >
                  Shop for Dogs 🐶
                </motion.button>
              </Link>

              <Link href="/collections/cats" className="text-decoration-none">
                <motion.button
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  whileHover={{ scale: 1.05, backgroundColor: "var(--orange)", color: "white" }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: "transparent",
                    color: "var(--orange)",
                    border: "2px solid var(--orange)",
                    borderRadius: "100px",
                    padding: "12px 26px",
                    fontWeight: "800",
                    fontSize: "15px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  Shop for Cats 🐱
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="d-flex justify-content-center justify-content-lg-start gap-4"
              style={{
                paddingTop: "28px",
                borderTop: "1px solid #E5E7EB",
                flexWrap: "wrap",
              }}
            >
              {stats.map((s, i) => (
                <div key={i}>
                  <div
                    style={{
                      fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                      fontSize: "28px",
                      fontWeight: "700",
                      color: "var(--orange)",
                      lineHeight: "1.2",
                    }}
                  >
                    {s.num}
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--gray, #6B7280)", fontWeight: "600" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN: 2×2 Category Cards ── */}
          <div className="col-lg-6">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              {categoryCards.map((card, i) => (
                <Link key={i} href={card.href} className="text-decoration-none">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: card.delay }}
                    whileHover={{ y: -6, boxShadow: "0 8px 40px rgba(0,0,0,0.14)" }}
                    style={{
                      background: "white",
                      borderRadius: "16px",
                      padding: "28px 20px",
                      textAlign: "center",
                      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                      cursor: "pointer",
                      transition: "transform 0.25s, box-shadow 0.25s",
                      marginTop: card.offset ? "24px" : "0",
                    }}
                  >
                    <span style={{ fontSize: "52px", display: "block", marginBottom: "12px", lineHeight: "1" }}>
                      {card.emoji}
                    </span>
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: "800",
                        color: "var(--charcoal, #2A2A2A)",
                        marginBottom: "4px",
                        fontFamily: "var(--font-nunito), 'Nunito', sans-serif",
                      }}
                    >
                      {card.title}
                    </h3>
                    <p style={{ fontSize: "13px", color: "var(--gray, #6B7280)", marginBottom: "12px" }}>
                      {card.desc}
                    </p>
                    <span
                      style={{
                        display: "inline-block",
                        borderRadius: "100px",
                        padding: "3px 14px",
                        fontSize: "12px",
                        fontWeight: "700",
                        ...card.badgeStyle,
                      }}
                    >
                      {card.badge}
                    </span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
