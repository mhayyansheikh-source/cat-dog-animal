"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import ShippingTimer from "@/components/ShippingTimer";
import LiveScarcity from "@/components/LiveScarcity";
import TrustBadges from "@/components/TrustBadges";
import DirectCheckoutBar from "@/components/DirectCheckoutBar";
import { ShoppingCart, Star, Sparkles, Check, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const shopifyLoader = ({ src, width, quality }) => {
  try {
    const url = new URL(src);
    url.searchParams.set('width', width.toString());
    if (quality) url.searchParams.set('quality', quality.toString());
    url.searchParams.set('format', 'webp');
    return url.href;
  } catch (e) {
    return src;
  }
};

const blurPlaceholder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";

export default function ProductDetailsClient({ product }) {
  const { addToCart } = useCart();
  
  // Additional images added dynamically when variants are clicked
  const [extraImages, setExtraImages] = useState([]);

  // Combine images and media into a unified gallery array
  const galleryItems = [
    ...(product.images || []).map(img => ({ type: 'IMAGE', url: img, preview: img })),
    ...extraImages,
    ...(product.media || []).map(m => {
      if (m.mediaContentType === 'VIDEO') {
        const source = m.sources?.find(s => s.format === 'mp4') || m.sources?.[0];
        return { type: 'VIDEO', url: source?.url, preview: m.previewImage?.url };
      } else if (m.mediaContentType === 'EXTERNAL_VIDEO') {
        return { type: 'EXTERNAL_VIDEO', url: m.embeddedUrl, preview: m.previewImage?.url };
      }
      return null;
    }).filter(Boolean)
  ];

  const uniqueGalleryItems = [];
  const seenUrls = new Set();
  galleryItems.forEach(item => {
    const key = item.url || item.preview;
    if (key && !seenUrls.has(key)) {
      seenUrls.add(key);
      uniqueGalleryItems.push(item);
    }
  });
  
  // Reorder so that VIDEO or EXTERNAL_VIDEO comes first
  uniqueGalleryItems.sort((a, b) => {
    const aIsVideo = a.type === 'VIDEO' || a.type === 'EXTERNAL_VIDEO';
    const bIsVideo = b.type === 'VIDEO' || b.type === 'EXTERNAL_VIDEO';
    if (aIsVideo && !bIsVideo) return -1;
    if (!aIsVideo && bIsVideo) return 1;
    return 0;
  });

  // Gallery state
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = uniqueGalleryItems[activeIndex] || uniqueGalleryItems[0];
  
  // Variant states
  const [activeVariant, setActiveVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);

  // FAQ states
  const [openFaq, setOpenFaq] = useState(null);
  const [openAccordion, setOpenAccordion] = useState("desc");

  // Sticky mobile CTA state
  const [showStickyAdd, setShowStickyAdd] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowStickyAdd(true);
      } else {
        setShowStickyAdd(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Volume discount cards are now direct Add To Cart buttons

  // Parse Metafields
  const getMetafield = (key) => product.metafields?.find(m => m && m.key === key)?.value;
  
  let parsedFaqs = [];
  try {
    const faqJson = getMetafield("faq_json");
    if (faqJson) parsedFaqs = JSON.parse(faqJson);
  } catch(e) { console.error("Failed to parse FAQ JSON", e); }

  let testimonials = [
    { name: "Sarah M.", rating: 5, text: `Absolutely incredible quality. My pet loves the ${product.title || "product"} and the shipping was so fast!` },
    { name: "David T.", rating: 5, text: `I was skeptical at first, but this exceeded all my expectations. Highly recommend this for any pet owner.` },
    { name: "Emily R.", rating: 5, text: `Customer service is top notch and it works exactly as described. Worth every penny.` }
  ];

  try {
    const testimonialJson = getMetafield("testimonials_json");
    if (testimonialJson) {
      const parsed = JSON.parse(testimonialJson);
      if (parsed.length > 0) testimonials = parsed;
    }
  } catch(e) { console.error("Failed to parse Testimonials JSON", e); }

  const ingredientsText = getMetafield("ingredients");

  // Dynamic YouTube Shorts Logic
  let youtubeShorts = [];
  
  // 1. Check for specific product handle
  if (product.handle === "breathable-pet-cat-carrier-backpack") {
    youtubeShorts = [
      "E07RjcNgIOA",
      "Piaj11uRvsc",
      "tACKkJ0geq8",
      "tPjnaoQF95s"
    ];
  } else if (product.handle === "quick-release-dog-harness-vest") {
    youtubeShorts = [
      "zU69mDYiJ2o",
      "a3XF6zIM-M8",
      "EtHofhA1zLw"
    ];
  }

  // 2. Robust Future-Proofing: Override with Metafields if they exist
  try {
    const shortsJson = getMetafield("youtube_shorts_json");
    if (shortsJson) {
      const parsed = JSON.parse(shortsJson);
      if (parsed.length > 0) youtubeShorts = parsed;
    }
  } catch(e) { console.error("Failed to parse Shorts JSON", e); }
  
  // Always show bulk discount options for every product to boost AOV
  const hasBulkDiscount = true;

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleVariantSelect = (v) => {
    setActiveVariant(v);
    const vImageUrl = v.image?.url || v.image;
    if (vImageUrl) {
      const cleanUrl = (url) => {
        if (!url) return "";
        try { return new URL(url).pathname; } 
        catch { return url.split('?')[0]; }
      };
      const vPath = cleanUrl(vImageUrl);
      const idx = uniqueGalleryItems.findIndex(item => {
        const itemUrl = item.preview || item.url || "";
        return cleanUrl(itemUrl) === vPath;
      });
      if (idx !== -1) {
        setActiveIndex(idx);
      } else {
        // Variant image not in default gallery, add it
        setExtraImages(prev => [...prev, { type: 'IMAGE', url: vImageUrl, preview: vImageUrl }]);
        setActiveIndex(uniqueGalleryItems.length); // Point to newly added item
      }
    }
  };


  const basePrice = parseFloat(activeVariant.price);
  const getBulkCardPrice = (qty) => {
    let rate = 1.0;
    if (qty === 2) rate = 0.90;
    if (qty >= 3) rate = 0.85;
    return basePrice * rate;
  };

  return (
    <article className="py-3 py-md-5">
      <div className="row g-4 g-md-5">
        {/* Left Column: Image Gallery */}
        <div className="col-lg-6">
          <div className="sticky-top" style={{ top: "100px", zIndex: 1 }}>
            
            {/* Unified Responsive Gallery Viewer */}
            <div>
              <div 
                className="rounded-card p-0 mb-3 position-relative w-100 shimmer-placeholder" 
                style={{ 
                  overflow: "hidden", 
                  backgroundColor: "#ffffff",
                  minHeight: "300px"
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="w-100 h-100 d-flex justify-content-center align-items-center"
                  >
                    {activeItem?.type === 'IMAGE' && (
                      <Image
                        loader={shopifyLoader}
                        src={activeItem.url}
                        alt={product.title}
                        width={1000}
                        height={1000}
                        priority={activeIndex === 0}
                        fetchPriority={activeIndex === 0 ? "high" : "auto"}
                        quality={90}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ width: "100%", height: "auto", display: "block" }}
                      />
                    )}
                    {activeItem?.type === 'VIDEO' && (
                      <video
                        src={activeItem.url}
                        poster={activeItem.preview}
                        controls
                        muted
                        loop
                        playsInline
                        preload="none"
                        className="w-100"
                        style={{ height: "auto", backgroundColor: "#000", display: "block" }}
                        ref={(el) => {
                          if (el && typeof window !== 'undefined' && 'IntersectionObserver' in window) {
                            const observer = new window.IntersectionObserver(
                              ([entry]) => {
                                if (entry.isIntersecting) {
                                  el.play().catch(() => {});
                                  observer.disconnect();
                                }
                              },
                              { threshold: 0.1 }
                            );
                            observer.observe(el);
                          } else if (el) {
                            el.play().catch(() => {});
                          }
                        }}
                      />
                    )}
                    {activeItem?.type === 'EXTERNAL_VIDEO' && (
                      <iframe
                        src={activeItem.url.replace("watch?v=", "embed/")}
                        title={product.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                        className="w-100 border-0"
                        style={{ aspectRatio: "16/9" }}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Responsive Thumbnail Carousel */}
              {uniqueGalleryItems.length > 1 && (
                <div 
                  className="d-flex gap-2 overflow-auto pb-2 hide-scrollbar w-100"
                  style={{
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                    scrollSnapType: "x mandatory",
                    WebkitOverflowScrolling: "touch"
                  }}
                >
                  {uniqueGalleryItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className="btn p-0 border rounded overflow-hidden flex-shrink-0 position-relative"
                      style={{
                        width: "80px",
                        height: "80px",
                        border: activeIndex === idx ? "2px solid var(--zesty-orange)" : "1px solid var(--pale-gray)",
                        transition: "border 0.3s ease",
                        background: "transparent",
                        scrollSnapAlign: "start"
                      }}
                      aria-label={`View media thumbnail ${idx + 1}`}
                    >
                      <Image
                        loader={shopifyLoader}
                        src={item.preview || item.url}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        quality={60}
                        sizes="80px"
                        loading="lazy"
                        style={{ objectFit: "cover" }}
                        className="shimmer-placeholder"
                      />
                      {(item.type === 'VIDEO' || item.type === 'EXTERNAL_VIDEO') && (
                        <div className="position-absolute top-50 start-50 translate-middle text-white" style={{ background: "rgba(0,0,0,0.5)", borderRadius: "50%", padding: "5px" }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Config & Details */}
        <div className="col-lg-6 text-start">
          <div className="d-flex align-items-center gap-2 mb-2">
            {product.product_type ? (
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="badge d-inline-flex align-items-center gap-1 text-charcoal-dark fw-bold py-1 px-3 rounded-pill shadow-sm"
                style={{
                  background: "linear-gradient(135deg, rgba(254, 146, 77, 0.15) 0%, rgba(25, 142, 122, 0.15) 100%)",
                  border: "1px solid rgba(254, 146, 77, 0.3)",
                }}
              >
                <Sparkles size={14} style={{ color: "var(--orange)" }} />
                {product.product_type}
              </motion.span>
            ) : (
              <span className="badge bg-forest-green text-white fw-bold py-1 px-3 rounded-pill shadow-sm">✓ PREMIUM QUALITY</span>
            )}
            <div className="d-flex align-items-center gap-1 text-warning star-rating small">
              ★ ★ ★ ★ ★ <span className="text-muted font-body" style={{ fontSize: "0.75rem" }}>(4.9/5 Rating)</span>
            </div>
          </div>

          <h1 className="font-heading fw-bold mb-2" style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", lineHeight: "1.2" }}>{product.title}</h1>
          
          <div className="d-flex align-items-baseline gap-2 mb-3">
            <span className="fs-3 fw-bold text-zesty-orange">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(activeVariant.price)}
            </span>
            {activeVariant.compare_at_price && (
              <span className="text-decoration-line-through text-muted fs-5">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(activeVariant.compare_at_price)}
              </span>
            )}
            <span className="small text-muted font-body ms-2">(Local sales tax calculated at checkout)</span>
          </div>

          {/* Scarcity Widget */}
          <motion.div className="mb-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <LiveScarcity variantId={activeVariant.id} />
          </motion.div>

          {/* Modern Animated Variant Selector */}
          {product.options && product.options.length > 0 && product.options[0].name !== "Title" && product.variants.length > 1 ? (
            <div className="mb-4">
              {product.options.map((option, optIdx) => {
                const currentParts = activeVariant.title.split(' / ');
                const activeValue = currentParts[optIdx];
                return (
                  <div key={option.name} className="mb-3">
                    <span className="d-flex align-items-center gap-2 small text-muted fw-bold mb-2 font-body text-uppercase">
                      {option.name}: <span className="text-dark" style={{ color: "var(--forest-green)" }}>{activeValue}</span>
                    </span>
                    
                    {option.values.length > 5 ? (
                      <div className="position-relative">
                        <select
                          className="form-select w-100 border-2 font-body"
                          style={{ 
                            borderColor: "var(--bs-gray-300)", 
                            cursor: "pointer",
                            height: "50px",
                            borderRadius: "12px",
                            fontWeight: "500",
                            fontSize: "15px"
                          }}
                          value={activeValue}
                          onChange={(e) => {
                            const val = e.target.value;
                            const targetParts = [...currentParts];
                            targetParts[optIdx] = val;
                            const exactMatch = product.variants.find(v => v.title.split(' / ').every((p, i) => p === targetParts[i]));
                            
                            let newMatched = exactMatch;
                            if (!newMatched) {
                              newMatched = product.variants.find(v => v.title.split(' / ')[optIdx] === val && v.available);
                            }
                            if (!newMatched) {
                              newMatched = product.variants.find(v => v.title.split(' / ')[optIdx] === val);
                            }
                            if (newMatched) handleVariantSelect(newMatched);
                          }}
                        >
                          {option.values.map((val) => {
                            // Check if this specific combination is available for dropdown styling (optional, but good practice)
                            const targetParts = [...currentParts];
                            targetParts[optIdx] = val;
                            const exactMatch = product.variants.find(v => v.title.split(' / ').every((p, i) => p === targetParts[i]));
                            const isAvailable = exactMatch ? exactMatch.available : true;
                            
                            return (
                              <option key={val} value={val} disabled={!isAvailable}>
                                {val} {!isAvailable ? "(Out of Stock)" : ""}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    ) : (
                      <div className="d-flex gap-2 flex-wrap">
                        {option.values.map(val => {
                          const isActive = activeValue === val;
                          // Check if this specific combination is available
                          const targetParts = [...currentParts];
                          targetParts[optIdx] = val;
                          const exactMatch = product.variants.find(v => v.title.split(' / ').every((p, i) => p === targetParts[i]));
                          const isAvailable = exactMatch ? exactMatch.available : true;
                          
                          return (
                            <motion.button
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              key={val}
                              onClick={() => {
                                // Prioritize exact match, fallback to first available variant with this option
                                let newMatched = exactMatch;
                                if (!newMatched) {
                                  newMatched = product.variants.find(v => v.title.split(' / ')[optIdx] === val && v.available);
                                }
                                if (!newMatched) {
                                  newMatched = product.variants.find(v => v.title.split(' / ')[optIdx] === val);
                                }
                                if (newMatched) handleVariantSelect(newMatched);
                              }}
                              className={`btn position-relative overflow-hidden ${isActive ? "active-variant-btn" : "inactive-variant-btn"}`}
                              style={{
                                minHeight: "44px",
                                border: isActive ? "2px solid var(--orange)" : "1px solid #e5e7eb",
                                background: isActive ? "var(--orange-light)" : "#fff",
                                color: isActive ? "var(--orange-dark)" : "#4b5563",
                                borderRadius: "12px",
                                fontWeight: "600",
                                fontSize: "14px",
                                padding: "8px 16px",
                                opacity: isAvailable ? 1 : 0.5,
                                textDecoration: isAvailable ? "none" : "line-through",
                                transition: "all 0.3s ease",
                                boxShadow: isActive ? "0 4px 12px rgba(254, 146, 77, 0.15)" : "none"
                              }}
                            >
                              {val}
                              {isActive && (
                                <motion.div
                                  layoutId="activeVariantHighlight"
                                  className="position-absolute top-0 start-0 w-100 h-100"
                                  style={{
                                    background: "var(--orange)",
                                    opacity: 0.05,
                                    borderRadius: "10px"
                                  }}
                                />
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : product.variants.length > 1 && (
            <div className="mb-4">
              <span className="d-block small text-muted fw-bold mb-2 font-body text-uppercase">
                Select Option:
              </span>
              <div className="d-flex gap-2 flex-wrap">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleVariantSelect(v)}
                    className={`variant-swatch py-2 px-3 ${activeVariant.id === v.id ? "active" : ""}`}
                    style={{ minHeight: "48px" }}
                  >
                    {v.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Volume Bundle Cards - High Converting Dropshipping Feature */}
          {hasBulkDiscount ? (
            <div className="mb-4 text-start">
              <span className="d-block small text-muted fw-bold mb-2 font-body text-uppercase">
                Choose Bundle Package & Add to Cart:
              </span>
              <div className="d-flex flex-column gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: activeVariant.available ? 1.01 : 1 }}
                  whileTap={{ scale: activeVariant.available ? 0.99 : 1 }}
                  onClick={(e) => { e.preventDefault(); addToCart(product, activeVariant, 1); }}
                  disabled={!activeVariant.available}
                  className="btn btn-outline-secondary d-flex align-items-center justify-content-between p-3 position-relative w-100 text-start"
                  style={{ minHeight: "72px", border: "1px solid #dee2e6", borderRadius: "12px" }}
                >
                  <div className="d-flex flex-column">
                    <strong className="d-block text-dark">Buy 1 Item</strong>
                    <span className="small text-muted font-body">Perfect for trying it out</span>
                  </div>
                  <div className="d-flex flex-column align-items-end" style={{ paddingRight: "45px" }}>
                    <strong className="fs-5 text-dark">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(basePrice)}
                    </strong>
                    <span className="d-block small text-muted">Total</span>
                  </div>
                  <div className="position-absolute end-0 top-0 bottom-0 d-flex align-items-center justify-content-center bg-light px-3 border-start" style={{ borderTopRightRadius: "11px", borderBottomRightRadius: "11px" }}>
                    <ShoppingCart size={20} className="text-muted" />
                  </div>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: activeVariant.available ? 1.01 : 1 }}
                  whileTap={{ scale: activeVariant.available ? 0.99 : 1 }}
                  onClick={(e) => { e.preventDefault(); addToCart(product, activeVariant, 2); }}
                  disabled={!activeVariant.available}
                  className="btn btn-outline-success d-flex align-items-center justify-content-between p-3 position-relative w-100 text-start"
                  style={{ minHeight: "72px", border: "2px solid #198e7a", borderRadius: "12px", backgroundColor: "rgba(25, 142, 122, 0.03)" }}
                >
                  <motion.span 
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="discount-badge"
                  >
                    ★ STOCK UP (10% OFF)
                  </motion.span>
                  <div className="d-flex flex-column mt-2">
                    <strong className="d-block" style={{ color: "#198e7a" }}>Buy 2 Items</strong>
                  </div>
                  <div className="d-flex flex-column align-items-end" style={{ paddingRight: "45px" }}>
                    <strong className="fs-5" style={{ color: "#198e7a" }}>
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(getBulkCardPrice(2) * 2)}
                    </strong>
                    <span className="d-block small" style={{ color: "#198e7a" }}>Total</span>
                  </div>
                  <div className="position-absolute end-0 top-0 bottom-0 d-flex align-items-center justify-content-center px-3" style={{ backgroundColor: "#198e7a", color: "white", borderTopRightRadius: "10px", borderBottomRightRadius: "10px" }}>
                    <ShoppingCart size={20} />
                  </div>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: activeVariant.available ? 1.02 : 1 }}
                  whileTap={{ scale: activeVariant.available ? 0.98 : 1 }}
                  onClick={(e) => { e.preventDefault(); addToCart(product, activeVariant, 3); }}
                  disabled={!activeVariant.available}
                  className="btn btn-outline-warning d-flex align-items-center justify-content-between p-3 position-relative w-100 text-start shadow-sm"
                  style={{ minHeight: "72px", border: "2px solid var(--orange)", borderRadius: "12px", backgroundColor: "rgba(254, 146, 77, 0.05)" }}
                >
                  <motion.span 
                    animate={{ scale: [1, 1.05, 1], backgroundColor: ["#198e7a", "var(--orange)", "#198e7a"] }} 
                    transition={{ duration: 2, repeat: Infinity }} 
                    className="discount-badge text-white border-0"
                  >
                    🏆 BEST VALUE (15% OFF)
                  </motion.span>
                  <div className="d-flex flex-column mt-2">
                    <strong className="d-block" style={{ color: "var(--orange)" }}>Buy 3 Items</strong>
                  </div>
                  <div className="d-flex flex-column align-items-end" style={{ paddingRight: "45px" }}>
                    <strong className="fs-5" style={{ color: "var(--orange)" }}>
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(getBulkCardPrice(3) * 3)}
                    </strong>
                    <span className="d-block small" style={{ color: "var(--orange)" }}>Total</span>
                  </div>
                  <div className="position-absolute end-0 top-0 bottom-0 d-flex align-items-center justify-content-center px-3" style={{ backgroundColor: "var(--orange)", color: "white", borderTopRightRadius: "10px", borderBottomRightRadius: "10px" }}>
                    <ShoppingCart size={20} />
                  </div>
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="mb-3">
              <motion.button
                type="button"
                whileHover={{ scale: activeVariant.available ? 1.02 : 1 }}
                whileTap={{ scale: activeVariant.available ? 0.98 : 1 }}
                onClick={(e) => { e.preventDefault(); addToCart(product, activeVariant, 1); }}
                disabled={!activeVariant.available}
                className={`w-100 rounded-pill-cta fs-5 d-flex align-items-center justify-content-center gap-2 shadow ${!activeVariant.available ? "btn-secondary opacity-75" : "btn-zesty-primary"}`}
                style={{ minHeight: "56px" }}
              >
                <ShoppingCart size={22} />
                {activeVariant.available ? "ADD TO CART" : "OUT OF STOCK"}
              </motion.button>
            </div>
          )}

          <div className="mb-2">
            <ShippingTimer />
          </div>

          <motion.div className="mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <TrustBadges />
          </motion.div>

          {/* Generative Engine Optimized YouTube Shorts Section */}
          {youtubeShorts.length > 0 && (
            <section 
              className="mb-5 mt-2" 
              aria-label="Product Demonstration Videos"
            >
              <h4 className="font-heading mb-3 fw-bold text-charcoal-dark" style={{ fontSize: "clamp(18px, 3vw, 22px)" }}>
                See It In Action
              </h4>
              
              {/* Fully Responsive Grid: 1 col on foldable, 2 col on mobile/tablet, 4 col on desktop/XXL */}
              <div 
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: "12px"
                }}
              >
                {youtubeShorts.map((videoId, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15, duration: 0.4 }}
                    className="rounded-4 overflow-hidden shadow-sm position-relative bg-light"
                    style={{ 
                      aspectRatio: "9/16", 
                      width: "100%",
                      pointerEvents: "none" 
                    }}
                  >
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&rel=0&modestbranding=1&playsinline=1`}
                      title={`Demonstration of ${product.title || "Pet Carrier"} - Video ${idx + 1}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                      className="position-absolute border-0"
                      style={{
                        width: "120%",
                        height: "120%",
                        top: "-10%",
                        left: "-10%"
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* React-based Accordions for Details & Ingredients */}
          <div className="mb-5 bg-light rounded p-3 border">
            {/* Description Accordion */}
            <div className="border-bottom pb-2 mb-2">
              <button 
                onClick={() => setOpenAccordion(openAccordion === "desc" ? null : "desc")}
                className="w-100 bg-transparent border-0 d-flex justify-content-between align-items-center py-2 px-0 fw-bold font-heading text-charcoal-dark"
                style={{ fontSize: "1.1rem" }}
              >
                Product Description
                {openAccordion === "desc" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              <AnimatePresence>
                {openAccordion === "desc" && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: "auto", opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div 
                      className="text-muted font-body pt-2 pb-3" 
                      style={{ lineHeight: "1.7" }}
                      dangerouslySetInnerHTML={{ 
                        __html: (product.body_html || "")
                          .replace(/<p>[^<]*Competitor:.*?<\/p>/gi, '')
                          .replace(/<p>[^<]*Supplier:.*?<\/p>/gi, '')
                          .replace(/Competitor:.*?$/gim, '')
                          .replace(/Supplier:.*?$/gim, '')
                      }} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Ingredients Accordion */}
            {ingredientsText && (
              <div className="pt-2">
                <button 
                  onClick={() => setOpenAccordion(openAccordion === "ing" ? null : "ing")}
                  className="w-100 bg-transparent border-0 d-flex justify-content-between align-items-center py-2 px-0 fw-bold font-heading text-charcoal-dark"
                  style={{ fontSize: "1.1rem" }}
                >
                  Key Ingredients
                  {openAccordion === "ing" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <AnimatePresence>
                  {openAccordion === "ing" && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: "auto", opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="text-muted font-body pt-2 pb-3" style={{ lineHeight: "1.7" }}>
                        {ingredientsText}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Scraper-Friendly Comparison Table */}
          <section className="mt-5 text-start">
            <h4 className="font-heading mb-3 fw-bold" style={{ fontSize: "clamp(20px, 4vw, 24px)" }}>How We Measure Up Against Generic Brands</h4>
            <div className="table-responsive">
              <table className="table border align-middle font-body small bg-white">
                <thead className="table-light text-center">
                  <tr>
                    <th>Feature</th>
                    <th className="text-success fw-bold" style={{ backgroundColor: "rgba(33,123,55,0.05)" }}>Peteora Standard</th>
                    <th>Generic Brands</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Quality & Materials</strong></td>
                    <td className="text-success fw-semibold" style={{ backgroundColor: "rgba(33,123,55,0.05)" }}>✓ Premium, durable materials and clean ingredients</td>
                    <td>Cheap fillers, flimsy plastics, or low-grade materials</td>
                  </tr>
                  <tr>
                    <td><strong>Safety Standar  §ds</strong></td>
                    <td className="text-success fw-semibold" style={{ backgroundColor: "rgba(33,123,55,0.05)" }}>✓ Rigorously tested for pet safety and wellness</td>
                    <td>Unknown origins with questionable safety records</td>
                  </tr>
                  <tr>
                    <td><strong>Effectiveness</strong></td>
                    <td className="text-success fw-semibold" style={{ backgroundColor: "rgba(33,123,55,0.05)" }}>✓ Loved by pets, formulated for results</td>
                    <td>Hit or miss performance</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Automated & Animated Testimonials Section */}
          <section className="mb-5 mt-4 text-start overflow-hidden">
            <motion.h4 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-heading mb-4 fw-bold text-center" 
              style={{ fontSize: "clamp(24px, 5vw, 32px)" }}
            >
              Loved by Pets & Parents
            </motion.h4>
            
            <motion.div 
              className="row g-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.2 }
                }
              }}
            >
              {testimonials.slice(0, 3).map((t, idx) => (
                <motion.div 
                  key={idx} 
                  className="col-12 col-sm-12 col-md-4 col-lg-4"
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                  }}
                >
                  <motion.div 
                    whileHover={{ y: -8, boxShadow: "0 12px 24px rgba(0,0,0,0.08)" }}
                    className="p-4 border-0 rounded-4 bg-white h-100 d-flex flex-column position-relative"
                    style={{ 
                      boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                      transition: "all 0.3s ease" 
                    }}
                  >
                    <div className="position-absolute" style={{ top: "15px", right: "20px", opacity: 0.05 }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/></svg>
                    </div>

                    <div className="d-flex mb-3 gap-1" style={{ color: "var(--orange)" }}>
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + (i * 0.1) }}>
                          <Star size={18} fill="currentColor" stroke="none" />
                        </motion.div>
                      ))}
                    </div>
                    
                    <p className="font-body text-charcoal-dark flex-grow-1 mb-4" style={{ fontSize: "15px", lineHeight: "1.6" }}>
                      "{t.text}"
                    </p>
                    
                    <div className="d-flex align-items-center mt-auto border-top pt-3">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3 shadow-sm flex-shrink-0" 
                        style={{ width: 40, height: 40, fontSize: "16px", background: "linear-gradient(135deg, var(--orange) 0%, #ff6b6b 100%)" }}
                      >
                        {t.name.charAt(0)}
                      </div>
                      
                      <div className="d-flex flex-column" style={{ minWidth: 0 }}>
                        <span className="fw-bold text-charcoal-dark text-truncate" style={{ fontSize: "15px", display: "block" }}>{t.name}</span>
                        <span className="d-flex align-items-center text-success fw-semibold" style={{ fontSize: "12px" }}>
                          <Check size={12} className="me-1 flex-shrink-0" strokeWidth={3} /> Verified Buyer
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Dynamic Factual FAQ */}
          <section className="mt-5 text-start mb-5">
            <h4 className="font-heading mb-3 fw-bold" style={{ fontSize: "clamp(20px, 4vw, 24px)" }}>Frequently Asked Questions</h4>
            <div className="border rounded bg-white shadow-sm p-2">
              {(parsedFaqs.length > 0 ? parsedFaqs : [
                {
                  q: `How fast is shipping?`,
                  a: `We process all orders within 24-48 hours. Standard US delivery typically takes 5-8 business days, and all orders include tracking information.`
                },
                {
                  q: `Do you offer a guarantee?`,
                  a: `Yes! We are so confident your pet will love our products that we offer a 30-day money back guarantee. If you're not satisfied, just reach out to our support team.`
                },
                {
                  q: `Are your products safe for my pet?`,
                  a: `Absolutely. Pet safety is our #1 priority. All our products are vetted, tested, and made from high-quality materials and ingredients to ensure the well-being of your companion.`
                }
              ]).map((faq, index) => (
                <div key={index} className="geo-faq-item">
                  <div 
                    className="geo-faq-question font-body cursor-pointer d-flex align-items-center justify-content-between" 
                    onClick={() => toggleFaq(index)} 
                    style={{ cursor: "pointer", minHeight: "48px" }}
                  >
                    <span>{faq.q}</span>
                    <motion.div animate={{ rotate: openFaq === index ? 180 : 0 }}>
                      <ChevronDown size={16} />
                    </motion.div>
                  </div>
                  <AnimatePresence initial={false}>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                      >
                        <div className="geo-faq-answer font-body pt-2 pb-3 text-muted">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Mobile Sticky Add to Cart */}
      <AnimatePresence>
        {showStickyAdd && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="d-md-none position-fixed bottom-0 start-0 w-100 bg-white p-3 shadow-lg border-top"
            style={{ zIndex: 1050 }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="fw-bold text-truncate" style={{ maxWidth: '70%', fontSize: '14px' }}>{product.title}</span>
              <span className="fw-bold text-zesty-orange" style={{ fontSize: '14px' }}>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(activeVariant.price)}
              </span>
            </div>
            <button
              onClick={(e) => { e.preventDefault(); addToCart(product, activeVariant, 1); }}
              disabled={!activeVariant.available}
              className={`w-100 btn fw-bold py-2 shadow-sm ${!activeVariant.available ? "btn-secondary" : "btn-zesty-primary"}`}
              style={{ borderRadius: '12px' }}
            >
              <ShoppingCart size={18} className="me-2" />
              {activeVariant.available ? "ADD TO CART" : "OUT OF STOCK"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <DirectCheckoutBar product={product} activeVariant={activeVariant} />
    </article>
  );
}
