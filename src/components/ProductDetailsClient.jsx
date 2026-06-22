"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import ShippingTimer from "@/components/ShippingTimer";
import LiveScarcity from "@/components/LiveScarcity";
import TrustBadges from "@/components/TrustBadges";
import DirectCheckoutBar from "@/components/DirectCheckoutBar";
import { ShoppingCart, Star, Sparkles, Check, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  // Volume discount card selector
  const [selectedBulkQty, setSelectedBulkQty] = useState(1);

  // Parse Metafields
  const getMetafield = (key) => product.metafields?.find(m => m && m.key === key)?.value;
  
  let parsedFaqs = [];
  try {
    const faqJson = getMetafield("faq_json");
    if (faqJson) parsedFaqs = JSON.parse(faqJson);
  } catch(e) { console.error("Failed to parse FAQ JSON", e); }

  const ingredientsText = getMetafield("ingredients");
  
  // Use 'bundle_items' metafield as an indicator for showing volume discounts (can be adapted as needed)
  const hasBulkDiscount = !!getMetafield("bundle_items");

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

  const handleAddToCart = () => {
    addToCart(product, activeVariant, selectedBulkQty);
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
                className="rounded-card p-0 mb-3 position-relative w-100" 
                style={{ 
                  aspectRatio: "1 / 1",
                  maxHeight: "600px",
                  overflow: "hidden", 
                  background: "linear-gradient(to right, #fe924d 50%, #198e7a 50%)" 
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="position-absolute w-100 h-100 top-0 start-0 d-flex justify-content-center align-items-center"
                  >
                    {activeItem?.type === 'IMAGE' && (
                      <Image
                        src={activeItem.url}
                        alt={product.title}
                        fill
                        priority={true}
                        fetchPriority="high"
                        quality={90}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: "cover" }}
                      />
                    )}
                    {activeItem?.type === 'VIDEO' && (
                      <video
                        src={activeItem.url}
                        poster={activeItem.preview}
                        controls
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-100 h-100"
                        style={{ objectFit: "cover", backgroundColor: "#000" }}
                      />
                    )}
                    {activeItem?.type === 'EXTERNAL_VIDEO' && (
                      <iframe
                        src={activeItem.url.replace("watch?v=", "embed/")}
                        title={product.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-100 h-100 border-0"
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
                        background: "linear-gradient(to right, #fe924d 50%, #198e7a 50%)",
                        scrollSnapAlign: "start"
                      }}
                      aria-label={`View media thumbnail ${idx + 1}`}
                    >
                      <Image
                        src={item.preview || item.url}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        quality={60}
                        sizes="80px"
                        loading="lazy"
                        style={{ objectFit: "cover" }}
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
            <span className="badge bg-forest-green text-white fw-bold">✓ PREMIUM QUALITY</span>
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
          {hasBulkDiscount && (
            <div className="mb-4 text-start">
              <span className="d-block small text-muted fw-bold mb-2 font-body text-uppercase">
                Choose Bundle Package & Save:
              </span>
              <div className="d-flex flex-column gap-2">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedBulkQty(1)}
                  className={`volume-card d-flex align-items-center justify-content-between cursor-pointer ${selectedBulkQty === 1 ? "active" : ""}`}
                  style={{ cursor: "pointer", minHeight: "72px" }}
                >
                  <div>
                    <strong className="d-block">Buy 1 Item</strong>
                    <span className="small text-muted font-body">Perfect for trying it out</span>
                  </div>
                  <div className="text-end">
                    <strong className="fs-5">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(basePrice)}
                    </strong>
                    <span className="d-block small text-muted">/unit</span>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedBulkQty(2)}
                  className={`volume-card d-flex align-items-center justify-content-between cursor-pointer ${selectedBulkQty === 2 ? "active" : ""}`}
                  style={{ cursor: "pointer", minHeight: "72px" }}
                >
                  <span className="discount-badge">★ STOCK UP</span>
                  <div>
                    <strong className="d-block">Buy 2 Items (Save 10% Off)</strong>
                    <span className="small text-success font-body">Recommended - ensure you don't run out</span>
                  </div>
                  <div className="text-end">
                    <strong className="fs-5 text-success">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(getBulkCardPrice(2))}
                    </strong>
                    <span className="d-block small text-muted">/unit</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ boxShadow: selectedBulkQty === 3 ? "0 0 15px rgba(245,118,26,0.3)" : "none" }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedBulkQty(3)}
                  className={`volume-card d-flex align-items-center justify-content-between cursor-pointer ${selectedBulkQty === 3 ? "active" : ""}`}
                  style={{ cursor: "pointer", minHeight: "72px" }}
                >
                  <motion.span 
                    animate={{ scale: [1, 1.05, 1] }} 
                    transition={{ duration: 2, repeat: Infinity }} 
                    className="discount-badge bg-success"
                  >
                    🏆 BEST VALUE
                  </motion.span>
                  <div>
                    <strong className="d-block">Buy 3 Items (Save 15% Off)</strong>
                    <span className="small text-success font-body">Maximum savings for your pet</span>
                  </div>
                  <div className="text-end">
                    <strong className="fs-5 text-success">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(getBulkCardPrice(3))}
                    </strong>
                    <span className="d-block small text-muted">/unit</span>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* Add to Cart Actions */}
          <div className="mb-3">
            <motion.button
              whileHover={{ scale: activeVariant.available ? 1.02 : 1 }}
              whileTap={{ scale: activeVariant.available ? 0.98 : 1 }}
              onClick={handleAddToCart}
              disabled={!activeVariant.available}
              className={`w-100 rounded-pill-cta fs-5 d-flex align-items-center justify-content-center gap-2 shadow ${!activeVariant.available ? "btn-secondary opacity-75" : "btn-zesty-primary"}`}
              style={{ minHeight: "56px" }}
            >
              <ShoppingCart size={22} />
              {activeVariant.available ? "ADD TO CART" : "OUT OF STOCK"}
            </motion.button>
          </div>

          <div className="mb-2">
            <ShippingTimer />
          </div>

          <motion.div className="mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <TrustBadges />
          </motion.div>

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
                    <td><strong>Safety Standards</strong></td>
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

      <DirectCheckoutBar product={product} activeVariant={activeVariant} />
    </article>
  );
}
