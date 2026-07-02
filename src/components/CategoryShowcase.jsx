"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";

/* ─── Single category card ─── */
function CategoryCard({ collection, handle, gradientFrom, gradientTo, accentColor, delay, label }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const products = collection?.products || [];
  const heroImage = collection?.image?.url || products[0]?.images?.[0];
  const productCount = products.length;
  const title = label || collection?.title || handle.charAt(0).toUpperCase() + handle.slice(1);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className="position-relative rounded-4 overflow-hidden"
      style={{ minHeight: 480 }}
    >
      {/* Background image with parallax-like zoom on hover */}
      <motion.div
        className="position-absolute inset-0 w-100 h-100"
        style={{ zIndex: 0 }}
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {heroImage ? (
          <Image
            src={heroImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
            priority
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "#f3f4f6" }} />
        )}
      </motion.div>

      {/* Gradient overlay */}
      <div
        className="position-absolute w-100 h-100"
        style={{
          zIndex: 1,
          background: `linear-gradient(160deg, ${gradientFrom}dd 0%, ${gradientTo}aa 50%, rgba(0,0,0,0.75) 100%)`,
        }}
      />

      {/* Content */}
      <div
        className="position-relative d-flex flex-column justify-content-between h-100 p-4 p-md-5"
        style={{ zIndex: 2, minHeight: 480 }}
      >
        {/* Top: badge + count */}
        <div className="d-flex align-items-center justify-content-between">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: delay + 0.3, duration: 0.5 }}
            className="badge rounded-pill px-3 py-2 fw-bold"
            style={{
              backgroundColor: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(8px)",
              color: "white",
              fontSize: "0.8rem",
              border: "1px solid rgba(255,255,255,0.35)",
            }}
          >
            {productCount} Products
          </motion.span>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: delay + 0.4, type: "spring", stiffness: 300 }}
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 44,
              height: 44,
              backgroundColor: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.35)",
            }}
          >
            <ShoppingBag size={20} color="white" />
          </motion.div>
        </div>

        {/* Middle: title + description */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: delay + 0.2, duration: 0.6 }}
          >
            <h2
              className="fw-black text-white mb-2"
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                lineHeight: 1.05,
                textShadow: "0 2px 20px rgba(0,0,0,0.3)",
              }}
            >
              {title}
            </h2>
            <p
              className="text-white mb-4"
              style={{ fontSize: "0.95rem", opacity: 0.85, maxWidth: 280, lineHeight: 1.6 }}
            >
              {productCount > 0
                ? `Explore our curated selection of ${productCount} premium ${title.toLowerCase()} products.`
                : `Premium products handpicked for your ${title.toLowerCase()}.`}
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: delay + 0.55, duration: 0.5 }}
          >
            <Link href={`/collections/${handle}`} legacyBehavior={false}>
              <motion.span
                className="d-inline-flex align-items-center gap-2 fw-bold rounded-pill px-4 py-3"
                style={{
                  backgroundColor: "white",
                  color: accentColor,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  textDecoration: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                }}
                whileHover={{ scale: 1.05, boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.97 }}
              >
                Shop {title}
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight size={18} />
                </motion.span>
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main section export ─── */
export default function CategoryShowcase({ dogCollection, catCollection, petSupplementsCollection }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section className="py-5" style={{ background: "linear-gradient(180deg, #fafafa 0%, #f3f4f6 100%)" }}>
      <div className="container px-3 px-md-4" style={{ maxWidth: 1400 }}>
        {/* Section Header */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-5"
        >
          <span
            className="badge rounded-pill px-3 py-2 mb-3 fw-bold"
            style={{
              background: "linear-gradient(135deg, rgba(242,122,33,0.15), rgba(33,143,125,0.15))",
              color: "var(--charcoal-dark, #2a2a2a)",
              border: "1px solid rgba(242,122,33,0.3)",
              fontSize: "0.78rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Shop by Pet
          </span>
          <h2
            className="fw-black mb-3"
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              color: "var(--charcoal, #2a2a2a)",
              lineHeight: 1.1,
            }}
          >
            What&apos;s Your Pet?
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: 480, fontSize: "1rem", lineHeight: 1.7 }}>
            Discover products crafted specifically for your furry family member — from nutrition to play.
          </p>
        </motion.div>

        {/* Responsive Grid / Mobile Carousel */}
        <div 
          className="row flex-nowrap flex-md-wrap overflow-auto pb-4 g-4" 
          style={{ 
            scrollSnapType: "x mandatory", 
            scrollbarWidth: "none", /* Firefox */
            WebkitOverflowScrolling: "touch"
          }}
        >
          {/* Hide scrollbar for Chrome/Safari/Edge */}
          <style jsx>{`
            .overflow-auto::-webkit-scrollbar { display: none; }
          `}</style>

          <div className="col-10 col-sm-8 col-md-6 col-lg-4 flex-shrink-0" style={{ scrollSnapAlign: "center" }}>
            <CategoryCard
              collection={dogCollection}
              handle="dogs"
              gradientFrom="#F27A21"
              gradientTo="#C25A12"
              accentColor="#F27A21"
              delay={0.1}
            />
          </div>
          <div className="col-10 col-sm-8 col-md-6 col-lg-4 flex-shrink-0" style={{ scrollSnapAlign: "center" }}>
            <CategoryCard
              collection={catCollection}
              handle="cats-1"
              gradientFrom="#218F7D"
              gradientTo="#135E52"
              accentColor="#218F7D"
              delay={0.25}
            />
          </div>
          <div className="col-10 col-sm-8 col-md-6 col-lg-4 flex-shrink-0" style={{ scrollSnapAlign: "center" }}>
            <CategoryCard
              collection={petSupplementsCollection}
              handle="pet-supplements"
              gradientFrom="#2A2A2A"
              gradientTo="#111111"
              accentColor="#2A2A2A"
              delay={0.4}
              label="Pet Supplements"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
