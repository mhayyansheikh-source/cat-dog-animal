"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Heart, ShieldCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function ProductCard({ product, index = 0, isPriority = false, isMosaic = false }) {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [userSelectedVariant, setUserSelectedVariant] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showMobileVariants, setShowMobileVariants] = useState(false);

  const handleVariantChange = (variantId) => {
    const variant = product.variants.find(v => v.id.toString() === variantId.toString());
    if (variant) {
      setSelectedVariant(variant);
      setUserSelectedVariant(true);
    }
  };

  // Setup product media
  const videoMedia = (product.media || []).find(m => m.mediaContentType === 'VIDEO' || m.mediaContentType === 'EXTERNAL_VIDEO');
  let mainVideo = null;
  let mainExternalVideo = null;
  if (videoMedia && !userSelectedVariant) {
    if (videoMedia.mediaContentType === 'VIDEO') {
      mainVideo = (videoMedia.sources?.find(s => s.format === 'mp4') || videoMedia.sources?.[0])?.url;
    } else if (videoMedia.mediaContentType === 'EXTERNAL_VIDEO') {
      mainExternalVideo = videoMedia.embeddedUrl?.replace("watch?v=", "embed/");
    }
  }

  const defaultImage = selectedVariant?.image?.url || selectedVariant?.image || product.images[0] || "";
  const hoverImage = product.images[1] || defaultImage; // Fallback to same if only 1 image


  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
      className={`card rounded-card h-100 shadow-sm border hover-scale ${isMosaic ? 'mosaic-card' : ''}`}
      style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}
    >
      {/* Top Banner Tag */}
      <div className="position-relative">
        {selectedVariant.compare_at_price && (
          <span
            className="position-absolute top-0 start-0 m-3 badge bg-danger text-white rounded-pill fw-bold z-3"
            style={{ fontSize: "0.75rem" }}
          >
            🔥 SALE
          </span>
        )}

        {/* Product Image Wrapper */}
        <Link 
          href={`/product/${product.handle || product.id}`} 
          className="d-block overflow-hidden position-relative shimmer-placeholder" 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ backgroundColor: "#f9fafb", aspectRatio: "1 / 1" }}
        >
          {mainVideo ? (
              <video
                src={mainVideo}
                poster={videoMedia?.previewImage?.url || defaultImage}
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                className="w-100 transition-all duration-500"
                style={{
                  aspectRatio: "1 / 1",
                  objectFit: "contain",
                  transform: isHovered ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.4s ease-in-out",
                  display: "block"
                }}
              />
          ) : mainExternalVideo ? (
            <div style={{ aspectRatio: "1 / 1", position: "relative", width: "100%", overflow: "hidden" }}>
              <iframe
                src={`${mainExternalVideo}?autoplay=1&mute=1&loop=1&controls=0`}
                title={product.title}
                loading="lazy"
                className="w-100 h-100 transition-all duration-500"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  pointerEvents: "none",
                  transform: isHovered ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.4s ease-in-out",
                  display: "block"
                }}
                allow="autoplay; encrypted-media"
                frameBorder="0"
              />
            </div>
          ) : (!defaultImage || (!defaultImage.startsWith("http") && !defaultImage.startsWith("/"))) ? (
            <div 
              className="w-100 d-flex align-items-center justify-content-center transition-all"
              style={{ 
                height: "auto",
                minHeight: "200px",
                fontSize: "80px",
                transform: isHovered ? "scale(1.1)" : "scale(1)",
                transition: "transform 0.3s ease" 
              }}
            >
              {defaultImage || "🐾"}
            </div>
          ) : (
            <>
              {/* Default Packaging Image */}
              <Image
                src={defaultImage}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                priority={isPriority}
                className="transition-all duration-500"
                style={{
                  objectFit: "contain",
                  opacity: isHovered ? 0 : 1,
                  transform: isHovered ? "scale(1)" : "scale(1.05)",
                  padding: "1.5rem"
                }}
              />
              {/* Lifestyle/Features Hover Image */}
              <Image
                src={hoverImage}
                alt={`${product.title} lifestyle`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                priority={isPriority}
                className="transition-all duration-500"
                style={{
                  objectFit: "contain",
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "scale(1.05)" : "scale(1.1)",
                  padding: "1.5rem"
                }}
              />
            </>
          )}
        </Link>
      </div>

      {/* Card Details */}
      <div className="card-body p-2 p-md-3 text-start d-flex flex-column justify-content-between flex-grow-1">
        <div>
          {/* Ratings */}
          <div className="d-flex align-items-center gap-1 text-warning mb-1 star-rating" style={{ fontSize: "0.75rem" }}>
            ★★★★★ <span className="text-muted font-body" style={{ fontSize: "0.7rem" }}>(4.9)</span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.handle}`} className="text-decoration-none text-dark">
            <h6 className="fw-bold font-heading mb-1 hover-scale" style={{ fontSize: "clamp(0.85rem, 3.5vw, 1rem)", lineHeight: "1.3", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {product.title}
            </h6>
          </Link>

          {/* Dynamic Product Category Badge */}
          {product.product_type ? (
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="d-inline-flex align-items-center px-2 py-1 rounded-pill font-body mb-1 fw-bold text-truncate"
              style={{
                fontSize: "0.65rem",
                background: "linear-gradient(135deg, rgba(254, 146, 77, 0.15) 0%, rgba(25, 142, 122, 0.15) 100%)",
                color: "var(--charcoal-dark)",
                border: "1px solid rgba(254, 146, 77, 0.3)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
              }}
            >
              <Sparkles size={12} className="me-1" style={{ color: "var(--orange)" }} />
              {product.product_type}
            </motion.span>
          ) : (
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="d-inline-flex align-items-center px-2 py-1 rounded-pill font-body mb-1 fw-bold text-muted text-truncate"
              style={{ fontSize: "0.65rem", backgroundColor: "#f8f9fa", border: "1px solid #dee2e6", maxWidth: "100%" }}
            >
              🐾 Pet Essential
            </motion.span>
          )}
        </div>

        <div>
          {/* Variant Selector dropdown */}
          {product.variants.length > 1 && (
            <div className="my-3 d-none d-md-block">
              <select
                className="form-select form-select-sm shadow-none w-100"
                value={selectedVariant.id}
                onChange={(e) => handleVariantChange(e.target.value)}
                style={{
                  borderRadius: "8px",
                  border: "1px solid #dee2e6",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  backgroundColor: "#f8f9fa",
                  padding: "6px 12px",
                  color: "var(--bs-body-color)"
                }}
              >
                {product.variants.map((v) => (
                  <option key={v.id} value={v.id} disabled={!v.available}>
                    {v.title} {!v.available && "(Out of Stock)"}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Bundle Discount Banner */}
          <motion.div 
            className="w-100 py-2 px-1 mt-2 mb-3 rounded d-none d-md-flex align-items-center justify-content-center flex-column text-center"
            style={{ backgroundColor: "rgba(25, 142, 122, 0.08)", border: "1px dashed rgba(25, 142, 122, 0.4)", cursor: "default" }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(25, 142, 122, 0.12)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span className="fw-bold d-block mb-1" style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--teal-dark)" }}>
              🎁 Bundle & Save
            </span>
            <span className="fw-semibold d-block" style={{ fontSize: "0.75rem", lineHeight: "1.3", color: "var(--charcoal-dark)" }}>
              Buy 2 get <strong style={{ color: "var(--orange)" }}>10% OFF</strong> • Buy 3 get <strong style={{ color: "var(--orange)" }}>15% OFF</strong>
            </span>
          </motion.div>

          {/* Pricing Row & Add button */}
          <div className="d-flex align-items-center justify-content-between mt-auto pt-2 border-top gap-1">
            <div className="d-flex flex-wrap align-items-baseline gap-1 gap-md-2">
              <span className="fw-bold" style={{ color: "var(--orange)", fontSize: "clamp(0.9rem, 4vw, 1.25rem)" }}>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(selectedVariant.price)}
              </span>
              {selectedVariant.compare_at_price && (
                <span className="text-decoration-line-through text-muted" style={{ fontSize: "0.7rem" }}>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(selectedVariant.compare_at_price)}
                </span>
              )}
            </div>

            {/* Quick Add CTA plus button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                if (product.variants.length > 1 && typeof window !== 'undefined' && window.innerWidth < 768) {
                  setShowMobileVariants(true);
                } else {
                  addToCart(product, selectedVariant);
                }
              }}
              className="btn d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: "clamp(32px, 8vw, 40px)",
                height: "clamp(32px, 8vw, 40px)",
                borderRadius: "50%",
                backgroundColor: "var(--orange)",
                color: "white",
                border: "none",
                fontSize: "1.2rem",
                fontWeight: "700",
                lineHeight: "1",
                cursor: "pointer",
                padding: "0"
              }}
              aria-label="Add to cart"
            >
              +
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Variant Selection Bottom Sheet */}
      <AnimatePresence>
        {showMobileVariants && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => { e.preventDefault(); setShowMobileVariants(false); }}
              style={{
                position: "fixed",
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 1040
              }}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                position: "fixed",
                bottom: 0, left: 0, right: 0,
                backgroundColor: "white",
                zIndex: 1050,
                borderTopLeftRadius: "24px",
                borderTopRightRadius: "24px",
                padding: "24px",
                boxShadow: "0 -10px 40px rgba(0,0,0,0.15)"
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0" style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif" }}>Select Option</h5>
                <button className="btn-close" onClick={(e) => { e.preventDefault(); setShowMobileVariants(false); }}></button>
              </div>
              <div className="d-flex align-items-center gap-3 mb-4 p-3 rounded" style={{ backgroundColor: "#f8f9fa" }}>
                <div style={{ width: "64px", height: "64px", position: "relative", borderRadius: "8px", overflow: "hidden", backgroundColor: "#fff" }}>
                  <Image src={defaultImage || "/placeholder.png"} alt={product.title} fill style={{ objectFit: "contain", padding: "4px" }} sizes="64px" />
                </div>
                <div>
                  <h6 className="mb-1 fw-bold fs-6 text-dark" style={{ lineHeight: "1.2" }}>{product.title}</h6>
                  <span className="fs-5 fw-bold" style={{ color: "var(--orange)" }}>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(selectedVariant.price)}</span>
                </div>
              </div>
              
              <div className="mb-4" style={{ maxHeight: "40vh", overflowY: "auto" }}>
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={(e) => { e.preventDefault(); handleVariantChange(v.id); }}
                    disabled={!v.available}
                    className={`btn w-100 mb-2 text-start d-flex justify-content-between align-items-center ${selectedVariant.id === v.id ? 'btn-dark' : 'btn-outline-dark'}`}
                    style={{ padding: "12px 16px", borderRadius: "12px", border: selectedVariant.id === v.id ? "2px solid #212529" : "2px solid #e9ecef" }}
                  >
                    <span className="fw-semibold">{v.title}</span>
                    {!v.available && <span className="text-muted small">Out of Stock</span>}
                  </button>
                ))}
              </div>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow-sm" 
                style={{ backgroundColor: "var(--orange)", border: "none", fontSize: "16px" }}
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product, selectedVariant);
                  setShowMobileVariants(false);
                }}
              >
                Add to Cart
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
