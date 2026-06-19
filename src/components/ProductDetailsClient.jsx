"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import ShippingTimer from "@/components/ShippingTimer";
import LiveScarcity from "@/components/LiveScarcity";
import TrustBadges from "@/components/TrustBadges";
import DirectCheckoutBar from "@/components/DirectCheckoutBar";
import { ShoppingCart, Star, Sparkles, Check, ChevronDown, ChevronUp } from "lucide-react";

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
    // Add to cart with quantity based on selectedBulkQty
    addToCart(product, activeVariant, selectedBulkQty);
  };

  // Dynamic pricing for bulk discount options cards
  const basePrice = parseFloat(activeVariant.price);
  const getBulkCardPrice = (qty) => {
    let rate = 1.0;
    if (qty === 2) rate = 0.90; // 10% off
    if (qty >= 3) rate = 0.85; // 15% off
    return basePrice * rate;
  };

  return (
    <div className="py-4 py-md-5">
      <div className="row g-5">
        {/* Left Column: Image Gallery */}
        <div className="col-lg-6">
          <div className="sticky-top" style={{ top: "100px", zIndex: 1 }}>
            {/* Main Showcase Image */}
            <div className="rounded-card p-4 mb-3 d-flex align-items-center justify-content-center bg-white" style={{ height: "450px" }}>
              <img
                src={activeImage}
                alt={product.title}
                className="img-fluid h-100 object-fit-contain"
              />
            </div>

            {/* Thumbnail Carousel */}
            {product.images.length > 1 && (
              <div className="d-flex gap-2 overflow-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className="btn p-0 border rounded overflow-hidden flex-shrink-0 bg-white"
                    style={{
                      width: "80px",
                      height: "80px",
                      border: activeImage === img ? "2px solid var(--zesty-orange)" : "1px solid var(--pale-gray)",
                    }}
                    aria-label={`View image thumbnail ${idx + 1}`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-100 h-100 object-fit-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
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

          <h1 className="font-heading fw-bold mb-2 display-6">{product.title}</h1>
          
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
          <div className="mb-4">
            <div className="text-muted font-body" dangerouslySetInnerHTML={{ __html: product.body_html }} />
          </div>

          {/* Scarcity Widget */}
          <LiveScarcity variantId={activeVariant.id} />

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
              {/* Option 1: 1 Item */}
              <div
                onClick={() => setSelectedBulkQty(1)}
                className={`volume-card d-flex align-items-center justify-content-between ${selectedBulkQty === 1 ? "active" : ""}`}
              >
                <div>
                  <strong className="d-block">Buy 1 Item</strong>
                  <span className="small text-muted font-body">Perfect for trying it out</span>
                </div>
                <div className="text-end">
                  <strong className="fs-5">${basePrice.toFixed(2)}</strong>
                  <span className="d-block small text-muted">/unit</span>
                </div>
              </div>

              {/* Option 2: 2 Items (10% Off) */}
              <div
                onClick={() => setSelectedBulkQty(2)}
                className={`volume-card d-flex align-items-center justify-content-between ${selectedBulkQty === 2 ? "active" : ""}`}
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
              </div>

              {/* Option 3: 3 Items (15% Off) */}
              <div
                onClick={() => setSelectedBulkQty(3)}
                className={`volume-card d-flex align-items-center justify-content-between ${selectedBulkQty === 3 ? "active" : ""}`}
              >
                <span className="discount-badge bg-success">🏆 BEST VALUE</span>
                <div>
                  <strong className="d-block">Buy 3 Items (Save 15% Off)</strong>
                  <span className="small text-success font-body">Maximum savings for your pet</span>
                </div>
                <div className="text-end">
                  <strong className="fs-5 text-success">${getBulkCardPrice(3).toFixed(2)}</strong>
                  <span className="d-block small text-muted">/unit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="mb-4">
            <button
              onClick={handleAddToCart}
              className="w-100 rounded-pill-cta btn-zesty-primary py-3 fs-5 d-flex align-items-center justify-content-center gap-2 shadow"
            >
              <ShoppingCart size={22} />
              ADD TO CART
            </button>
          </div>

          {/* Shipping Cutoff details */}
          <ShippingTimer />

          {/* Objection Trust Badges */}
          <TrustBadges />

          {/* Scraper-Friendly Comparison Table (GEO/AEO Optimization) */}
          <div className="mt-5 text-start">
            <h4 className="font-heading mb-3 fw-bold">How We Measure Up Against Generic Brands</h4>
            <div className="table-responsive">
              <table className="table border align-middle font-body small bg-white">
                <thead className="table-light text-center">
                  <tr>
                    <th>Feature</th>
                    <th className="text-success fw-bold" style={{ backgroundColor: "rgba(33,123,55,0.05)" }}>
                      Peteora Standard
                    </th>
                    <th>Generic Brands</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Quality & Materials</strong></td>
                    <td className="text-success fw-semibold" style={{ backgroundColor: "rgba(33,123,55,0.05)" }}>
                      ✓ Premium, durable materials and clean ingredients
                    </td>
                    <td>Cheap fillers, flimsy plastics, or low-grade materials</td>
                  </tr>
                  <tr>
                    <td><strong>Safety Standards</strong></td>
                    <td className="text-success fw-semibold" style={{ backgroundColor: "rgba(33,123,55,0.05)" }}>
                      ✓ Rigorously tested for pet safety and wellness
                    </td>
                    <td>Unknown origins with questionable safety records</td>
                  </tr>
                  <tr>
                    <td><strong>Effectiveness</strong></td>
                    <td className="text-success fw-semibold" style={{ backgroundColor: "rgba(33,123,55,0.05)" }}>
                      ✓ Loved by pets, formulated for results
                    </td>
                    <td>Hit or miss performance</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Dynamic Factual FAQ (AEO/GEO Optimization) */}
          <div className="mt-5 text-start mb-5">
            <h4 className="font-heading mb-3 fw-bold">Frequently Asked Questions</h4>
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
                  <div className="geo-faq-question font-body" onClick={() => toggleFaq(index)}>
                    <span>{faq.q}</span>
                    {openFaq === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                  {openFaq === index && (
                    <div className="geo-faq-answer font-body">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom checkout bar for mobile views */}
      <DirectCheckoutBar product={product} activeVariant={activeVariant} />
    </div>
  );
}
