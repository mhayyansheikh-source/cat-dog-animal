"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Heart, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [userSelectedVariant, setUserSelectedVariant] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="card rounded-card h-100 shadow-sm border hover-scale"
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
          className="d-block overflow-hidden position-relative" 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ height: "240px", background: "transparent" }}
        >
          {mainVideo ? (
              <video
                src={mainVideo}
                poster={videoMedia?.previewImage?.url || defaultImage}
                autoPlay
                muted
                loop
                playsInline
                className="w-100 h-100 object-fit-cover transition-all duration-500"
                style={{
                  transform: isHovered ? "scale(1.05)" : "scale(1)",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transition: "all 0.4s ease-in-out"
                }}
              />
          ) : mainExternalVideo ? (
              <iframe
                src={`${mainExternalVideo}?autoplay=1&mute=1&loop=1&controls=0`}
                title={product.title}
                className="w-100 h-100 object-fit-cover transition-all duration-500"
                style={{
                  pointerEvents: "none",
                  transform: isHovered ? "scale(1.05)" : "scale(1)",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transition: "all 0.4s ease-in-out"
                }}
                allow="autoplay; encrypted-media"
                frameBorder="0"
              />
          ) : (!defaultImage || (!defaultImage.startsWith("http") && !defaultImage.startsWith("/"))) ? (
            <div 
              className="w-100 h-100 d-flex align-items-center justify-content-center transition-all"
              style={{ 
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
              <img
                src={defaultImage}
                alt={product.title}
                loading="lazy"
                decoding="async"
                className="w-100 h-100 object-fit-cover transition-all duration-500"
                style={{
                  opacity: isHovered ? 0 : 1,
                  transform: isHovered ? "scale(1)" : "scale(1.05)",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transition: "all 0.4s ease-in-out"
                }}
              />
              {/* Lifestyle/Features Hover Image */}
              <img
                src={hoverImage}
                alt={`${product.title} lifestyle`}
                loading="lazy"
                decoding="async"
                className="w-100 h-100 object-fit-cover transition-all duration-500"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "scale(1.05)" : "scale(1.1)",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transition: "all 0.4s ease-in-out"
                }}
              />
            </>
          )}
        </Link>
      </div>

      {/* Card Details */}
      <div className="card-body p-3 text-start d-flex flex-column justify-content-between flex-grow-1">
        <div>
          {/* Ratings */}
          <div className="d-flex align-items-center gap-1 text-warning mb-1 star-rating small">
            ★ ★ ★ ★ ★ <span className="text-muted font-body" style={{ fontSize: "0.75rem" }}>(4.9)</span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.handle}`} className="text-decoration-none text-dark">
            <h6 className="fw-bold font-heading mb-1 hover-scale" style={{ fontSize: "1rem" }}>
              {product.title}
            </h6>
          </Link>

          {/* Dynamic Product Category Badge */}
          {product.product_type ? (
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="d-inline-flex align-items-center px-2 py-1 rounded-pill font-body mb-2 fw-bold"
              style={{
                fontSize: "0.75rem",
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
              className="d-inline-flex align-items-center px-2 py-1 rounded-pill font-body mb-2 fw-bold text-muted"
              style={{ fontSize: "0.75rem", backgroundColor: "#f8f9fa", border: "1px solid #dee2e6" }}
            >
              🐾 Pet Essential
            </motion.span>
          )}
        </div>

        <div>
          {/* Variant Selector dropdown */}
          {product.variants.length > 1 && (
            <div className="my-3">
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
            className="w-100 py-2 px-1 mt-2 mb-3 rounded d-flex align-items-center justify-content-center flex-column text-center"
            style={{ backgroundColor: "rgba(25, 142, 122, 0.08)", border: "1px dashed rgba(25, 142, 122, 0.4)", cursor: "default" }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(25, 142, 122, 0.12)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span className="fw-bold d-block mb-1" style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--teal-dark)" }}>
              🎁 Bundle & Save
            </span>
            <span className="fw-semibold d-block" style={{ fontSize: "0.75rem", lineHeight: "1.3", color: "var(--charcoal-dark)" }}>
              Buy 2 get <strong style={{ color: "var(--orange)" }}>10% OFF</strong> • Buy 3 get <strong style={{ color: "var(--orange)" }}>20% OFF</strong>
            </span>
          </motion.div>

          {/* Pricing Row & Add button */}
          <div className="d-flex align-items-center justify-content-between mt-auto pt-2 border-top">
            <div className="d-flex align-items-baseline gap-2">
              <span className="fs-5 fw-bold" style={{ color: "var(--orange)" }}>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(selectedVariant.price)}
              </span>
              {selectedVariant.compare_at_price && (
                <span className="text-decoration-line-through text-muted small">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(selectedVariant.compare_at_price)}
                </span>
              )}
            </div>

            {/* Quick Add CTA plus button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => addToCart(product, selectedVariant)}
              className="btn d-flex align-items-center justify-content-center"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "var(--orange)",
                color: "white",
                border: "none",
                fontSize: "20px",
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
    </motion.div>
  );
}
