"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// Constants & Data
const categoryCards = [
  { emoji: "🐕", title: "For Dogs", desc: "Supplements, food & treats", badge: "35+ Products", href: "/collections/dogs", badgeStyle: { backgroundColor: "var(--orange-light)", color: "var(--orange-dark)" }, delay: 0.2, offset: false },
  { emoji: "🐈", title: "For Cats", desc: "Health & wellness range", badge: "20+ Products", href: "/collections/cats", badgeStyle: { backgroundColor: "var(--orange-light)", color: "var(--orange-dark)" }, delay: 0.3, offset: true },
  { emoji: "🎾", title: "Accessories", desc: "Beds, toys & travel gear", badge: "New Arrivals", href: "/collections/accessories", badgeStyle: { backgroundColor: "var(--teal-light)", color: "var(--teal-dark)" }, delay: 0.4, offset: false },
  { emoji: "🎁", title: "Bundles", desc: "Save up to 30% on combos", badge: "Best Value", href: "/collections/bundles", badgeStyle: { backgroundColor: "var(--teal-light)", color: "var(--teal-dark)" }, delay: 0.5, offset: true },
];

const stats = [
  { num: "250K+", label: "Happy Pets" },
  { num: "4.9★", label: "Avg. Rating" },
  { num: "60+", label: "Products" },
];

// Subcomponents for Slides

const ProductPromoSlide = ({ product, fallbackTitle, fallbackImage }) => {
  const imageSrc = product?.image || fallbackImage;
  const title = product?.title || fallbackTitle;
  const handle = product?.handle || "#";
  const desc = product?.description ? product.description.replace(/<[^>]+>/g, '').substring(0, 120) + "..." : "Shop our latest premium collection. Quality guaranteed.";
  
  return (
    <div className="container position-relative" style={{ paddingTop: "60px", paddingBottom: "60px", minHeight: "580px", display: "flex", alignItems: "center" }}>
      <div className="row align-items-center g-5 w-100">
        <div className="col-lg-6 text-center text-lg-start">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="d-inline-flex align-items-center gap-2 rounded-pill mb-4"
            style={{ backgroundColor: "var(--teal-light)", color: "var(--teal-dark)", border: "1.5px solid var(--teal)", fontSize: "13px", fontWeight: "800", padding: "6px 16px" }}
          >
            <span>⭐</span>
            <span>Featured Product</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading fw-bold mb-3"
            style={{ fontSize: "clamp(38px, 5vw, 56px)", lineHeight: "1.1", color: "var(--charcoal)" }}
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: "17px", color: "var(--gray)", marginBottom: "36px", maxWidth: "480px", lineHeight: "1.65" }}
          >
            {desc}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Link href={`/product/${handle}`} className="text-decoration-none">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="d-inline-flex justify-content-center align-items-center"
                style={{ background: "var(--orange)", color: "white", border: "none", borderRadius: "100px", padding: "12px 32px", fontWeight: "800", fontSize: "15px", cursor: "pointer", minHeight: "52px", boxShadow: "0 4px 16px rgba(245,118,26,0.3)" }}
              >
                Shop Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
        <div className="col-lg-6 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <div style={{ position: "relative", width: "100%", maxWidth: "450px", aspectRatio: "1/1", margin: "0 auto", borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}>
              {imageSrc ? (
                <Image src={imageSrc} alt={title} fill style={{ objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center" }}>No Image Available</div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const FomoSalesSlide = () => {
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 15, s: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else {
          s = 59;
          if (m > 0) m--;
          else {
            m = 59;
            if (h > 0) h--;
            else h = 0;
          }
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container position-relative" style={{ paddingTop: "60px", paddingBottom: "60px", minHeight: "580px", display: "flex", alignItems: "center" }}>
      <div className="row align-items-center justify-content-center w-100 text-center">
        <div className="col-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="d-inline-flex align-items-center gap-2 rounded-pill mb-4"
            style={{ backgroundColor: "var(--alert-red, #DE2A2A)", color: "white", fontSize: "14px", fontWeight: "800", padding: "8px 20px", textTransform: "uppercase", letterSpacing: "1px" }}
          >
            <span>🔥</span>
            <span>Flash Sale Ending Soon</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading fw-bold mb-4"
            style={{ fontSize: "clamp(42px, 6vw, 72px)", lineHeight: "1.1", color: "var(--charcoal)" }}
          >
            Save Up To <span style={{ color: "var(--orange)" }}>40% OFF</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="d-flex justify-content-center gap-3 mb-5"
          >
            {[ 
              { val: timeLeft.h, label: "HOURS" }, 
              { val: timeLeft.m, label: "MINS" }, 
              { val: timeLeft.s, label: "SECS" } 
            ].map((t, i) => (
              <div key={i} style={{ background: "var(--charcoal)", color: "white", padding: "16px", borderRadius: "12px", minWidth: "90px" }}>
                <div style={{ fontSize: "32px", fontWeight: "800", lineHeight: "1" }}>{String(t.val).padStart(2, '0')}</div>
                <div style={{ fontSize: "11px", fontWeight: "700", marginTop: "4px", color: "var(--gray)" }}>{t.label}</div>
              </div>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Link href="/collections/all" className="text-decoration-none">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="d-inline-flex justify-content-center align-items-center"
                style={{ background: "var(--orange)", color: "white", border: "none", borderRadius: "100px", padding: "16px 40px", fontWeight: "800", fontSize: "18px", cursor: "pointer", boxShadow: "0 8px 24px rgba(245,118,26,0.4)" }}
              >
                Shop The Sale Now!
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const MainHeroSlide = ({ collections, heroMeta }) => {
  const displayCards = collections && collections.length > 0 
    ? collections.slice(0, 4).map((col, i) => {
        const emojis = ["🐕", "🐈", "🎾", "🎁"];
        const colors = [
          { bg: "var(--orange-light)", text: "var(--orange-dark)" },
          { bg: "var(--orange-light)", text: "var(--orange-dark)" },
          { bg: "var(--teal-light)", text: "var(--teal-dark)" },
          { bg: "var(--teal-light)", text: "var(--teal-dark)" }
        ];
        return {
          emoji: emojis[i % emojis.length],
          title: col.title,
          desc: col.description || "Discover premium products",
          badge: `${col.products?.length || 0} Products`,
          href: `/collections/${col.handle}`,
          badgeStyle: { backgroundColor: colors[i].bg, color: colors[i].text },
          delay: 0.2 + (i * 0.1),
          offset: i % 2 !== 0,
        };
      })
    : categoryCards;

  const titleText = heroMeta?.title || "Your Pet Deserves the Best of Everything";
  const titleWords = titleText.split(" ");
  const lastThreeWords = titleWords.splice(-3).join(" ");
  const firstPartWords = titleWords;
  
  const descriptionText = heroMeta?.description || "Premium supplements, treats, food, and accessories for happy, healthy cats and dogs. Science-backed ingredients, loved by pets worldwide.";
  const badgeText = heroMeta?.badge_text || "Vet-Recommended Formulas";

  return (
    <div className="container position-relative" style={{ paddingTop: "60px", paddingBottom: "60px", minHeight: "580px", display: "flex", alignItems: "center" }}>
      <div className="row align-items-center g-5 w-100">
        <div className="col-lg-6 text-center text-lg-start">
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="d-inline-flex align-items-center gap-2 rounded-pill mb-4" style={{ backgroundColor: "var(--orange-light)", color: "var(--orange-dark)", border: "1.5px solid #F5C49A", fontSize: "13px", fontWeight: "800", padding: "6px 16px" }}>
            <span>✨</span><span>{badgeText}</span>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }} className="font-heading fw-bold mb-3" style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: "clamp(38px, 5vw, 56px)", lineHeight: "1.1", color: "var(--charcoal)" }}>
            {firstPartWords.map((word, i) => (
              <motion.span key={i} style={{ display: "inline-block", marginRight: "8px" }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } }}>{word}</motion.span>
            ))}
            <br className="d-none d-md-block" />
            <motion.span style={{ color: "var(--orange)", fontStyle: "italic", display: "inline-block" }} variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } } }}>{lastThreeWords}</motion.span>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} style={{ fontSize: "17px", color: "var(--gray, #6B7280)", marginBottom: "36px", maxWidth: "480px", lineHeight: "1.65" }}>{descriptionText}</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-3 mb-5">
            <Link href="/collections/dogs" className="text-decoration-none d-block w-100" style={{ maxWidth: "sm-auto" }}>
              <motion.button animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-100 d-flex justify-content-center align-items-center" style={{ background: "var(--orange)", color: "white", border: "none", borderRadius: "100px", padding: "12px 26px", fontWeight: "800", fontSize: "15px", cursor: "pointer", minHeight: "52px", gap: "8px", boxShadow: "0 4px 16px rgba(245,118,26,0.3)" }}>Shop for Dogs 🐶</motion.button>
            </Link>
            <Link href="/collections/cats" className="text-decoration-none d-block w-100" style={{ maxWidth: "sm-auto" }}>
              <motion.button animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} whileHover={{ scale: 1.05, backgroundColor: "var(--orange)", color: "white" }} whileTap={{ scale: 0.95 }} className="w-100 d-flex justify-content-center align-items-center" style={{ background: "transparent", color: "var(--orange)", border: "2px solid var(--orange)", borderRadius: "100px", padding: "12px 26px", fontWeight: "800", fontSize: "15px", cursor: "pointer", minHeight: "52px", gap: "8px" }}>Shop for Cats 🐱</motion.button>
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }} className="d-flex justify-content-center justify-content-lg-start gap-4" style={{ paddingTop: "28px", borderTop: "1px solid #E5E7EB", flexWrap: "wrap" }}>
            {stats.map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: "28px", fontWeight: "700", color: "var(--orange)", lineHeight: "1.2" }}>{s.num}</div>
                <div style={{ fontSize: "13px", color: "var(--gray, #6B7280)", fontWeight: "600" }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
        <div className="col-lg-6">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {displayCards.map((card, i) => (
              <Link key={i} href={card.href} className="text-decoration-none">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: card.delay }} whileHover={{ y: -6, boxShadow: "0 8px 40px rgba(0,0,0,0.14)" }} style={{ background: "white", borderRadius: "16px", padding: "28px 20px", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", cursor: "pointer", transition: "transform 0.25s, box-shadow 0.25s", marginTop: card.offset ? "24px" : "0" }}>
                  <span style={{ fontSize: "52px", display: "block", marginBottom: "12px", lineHeight: "1" }}>{card.emoji}</span>
                  <h3 style={{ fontSize: "16px", fontWeight: "800", color: "var(--charcoal, #2A2A2A)", marginBottom: "4px", fontFamily: "var(--font-nunito), 'Nunito', sans-serif" }}>{card.title}</h3>
                  <p style={{ fontSize: "13px", color: "var(--gray, #6B7280)", marginBottom: "12px" }}>{card.desc}</p>
                  <span style={{ display: "inline-block", borderRadius: "100px", padding: "3px 14px", fontSize: "12px", fontWeight: "700", ...card.badgeStyle }}>{card.badge}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Export Component
export default function Hero({ collections = [], heroMeta = null, promoProducts = {} }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Slides definition
  const slides = [
    { id: 'cat-backpack', content: <ProductPromoSlide product={{ ...(promoProducts?.catBackpack || {}), image: "https://cdn.shopify.com/s/files/1/0992/1363/9976/files/imgi_204_715vHyNs3VL._AC_SL1500.webp?v=1782507867&width=1080&quality=90&format=webp" }} fallbackTitle="Breathable Pet Cat Carrier Backpack" fallbackImage="https://cdn.shopify.com/s/files/1/0992/1363/9976/files/imgi_204_715vHyNs3VL._AC_SL1500.webp?v=1782507867&width=1080&quality=90&format=webp" /> },
    { id: 'dog-harness', content: <ProductPromoSlide product={{ ...(promoProducts?.dogHarness || {}), image: "https://cdn.shopify.com/s/files/1/0992/1363/9976/files/21.svg?v=1782599952&width=1080&quality=90&format=webp" }} fallbackTitle="Quick Release Dog Harness Vest" fallbackImage="https://cdn.shopify.com/s/files/1/0992/1363/9976/files/21.svg?v=1782599952&width=1080&quality=90&format=webp" /> },
    { id: 'fomo-sale', content: <FomoSalesSlide /> },
    { id: 'main', content: <MainHeroSlide collections={collections} heroMeta={heroMeta} /> }
  ];

  // Auto-play logic
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
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
      <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "320px", height: "320px", borderRadius: "50%", background: "radial-gradient(circle, rgba(245,118,26,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "240px", height: "240px", borderRadius: "50%", background: "radial-gradient(circle, rgba(26,140,122,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", position: "relative" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            {slides[activeSlide].content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel Controls */}
      <div style={{ position: "absolute", bottom: "30px", left: "0", right: "0", display: "flex", justifyContent: "center", gap: "12px", zIndex: 10 }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveSlide(i)}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              padding: 0,
              border: "none",
              backgroundColor: activeSlide === i ? "var(--orange)" : "rgba(42, 42, 42, 0.2)",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
