"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import ShippingTimer from "@/components/ShippingTimer";
import LiveScarcity from "@/components/LiveScarcity";
import TrustBadges from "@/components/TrustBadges";
import DirectCheckoutBar from "@/components/DirectCheckoutBar";
import { ShoppingCart, Star, Sparkles, Check, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetailsClient({ product }) {
  const { addToCart } = useCart();
  
  // Gallery state
  const [activeImage, setActiveImage] = useState(product.images[0] || "");
  
  // Variant states
  const [activeVariant, setActiveVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);

  // FAQ states
  const [openFaq, setOpenFaq] = useState(null);

  // Volume discount card selector
  const [selectedBulkQty, setSelectedBulkQty] = useState(1);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleVariantSelect = (v) => {
    setActiveVariant(v);
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
            
            {/* Desktop Gallery Viewer (Hidden on mobile) */}
            <div className="d-none d-md-block">
              <div className="rounded-card p-4 mb-3 bg-white position-relative" style={{ height: "450px", overflow: "hidden" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="position-absolute w-100 h-100 top-0 start-0"
                  >
                    <Image
                      src={activeImage}
                      alt={product.title}
                      fill
                      priority={true}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: "contain", padding: "1.5rem" }}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Desktop Thumbnail Carousel */}
              {product.images.length > 1 && (
                <div className="d-flex gap-2 overflow-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className="btn p-0 border rounded overflow-hidden flex-shrink-0 bg-white position-relative"
                      style={{
                        width: "80px",
                        height: "80px",
                        border: activeImage === img ? "2px solid var(--zesty-orange)" : "1px solid var(--pale-gray)",
                        transition: "border 0.3s ease"
                      }}
                      aria-label={`View image thumbnail ${idx + 1}`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        sizes="80px"
                        style={{ objectFit: "contain", padding: "4px" }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Swipeable Gallery (Hidden on desktop) */}
            <div className="d-block d-md-none">
              <div 
                className="d-flex overflow-auto" 
                style={{ 
                  scrollSnapType: "x mandatory", 
                  gap: "10px", 
                  paddingBottom: "15px",
                  msOverflowStyle: "none", 
                  scrollbarWidth: "none" 
                }}
              >
                {product.images.map((img, idx) => (
                  <div 
                    key={idx} 
                    className="rounded bg-white position-relative flex-shrink-0" 
                    style={{ 
                      scrollSnapAlign: "center", 
                      width: "100%", 
                      height: "350px",
                      border: "1px solid #E5E7EB"
                    }}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} view ${idx + 1}`}
                      fill
                      priority={idx === 0}
                      sizes="100vw"
                      style={{ objectFit: "contain", padding: "1rem" }}
                    />
                  </div>
                ))}
              </div>
              {product.images.length > 1 && (
                <div className="text-center small text-muted mb-3 font-body">
                  <span style={{ fontSize: "20px" }}>↔</span> Swipe to see more
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

          <h1 className="font-heading fw-bold mb-2 display-6" style={{ fontSize: "clamp(24px, 5vw, 40px)" }}>{product.title}</h1>
          
          <div className="d-flex align-items-baseline gap-2 mb-4">
            <span className="fs-3 fw-bold text-zesty-orange">${activeVariant.price}</span>
            {activeVariant.compare_at_price && (
              <span className="text-decoration-line-through text-muted fs-5">
                ${activeVariant.compare_at_price}
              </span>
            )}
            <span className="small text-muted font-body ms-2">(Local sales tax calculated at checkout)</span>
          </div>

          {/* Description Snippet */}
          <section className="mb-4">
            <div className="text-muted font-body" dangerouslySetInnerHTML={{ __html: product.body_html }} />
          </section>

          {/* Scarcity Widget */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <LiveScarcity variantId={activeVariant.id} />
          </motion.div>

          {/* Variant Selector Swatches */}
          {product.variants.length > 1 && (
            <div className="mb-4">
              <span className="d-block small text-muted fw-bold mb-2 font-body text-uppercase">
                Select Option / Flavor:
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
                  <strong className="fs-5">${basePrice.toFixed(2)}</strong>
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
                  <strong className="fs-5 text-success">${getBulkCardPrice(2).toFixed(2)}</strong>
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
                  <strong className="fs-5 text-success">${getBulkCardPrice(3).toFixed(2)}</strong>
                  <span className="d-block small text-muted">/unit</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="mb-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="w-100 rounded-pill-cta btn-zesty-primary fs-5 d-flex align-items-center justify-content-center gap-2 shadow"
              style={{ minHeight: "56px" }}
            >
              <ShoppingCart size={22} />
              ADD TO CART
            </motion.button>
          </div>

          <ShippingTimer />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <TrustBadges />
          </motion.div>

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
              {[
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
              ].map((faq, index) => (
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
