"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  ArrowLeft, 
  Sparkles, 
  PlusCircle, 
  CheckCircle,
  HelpCircle,
  Clock
} from "lucide-react";
import ShippingTimer from "@/components/ShippingTimer";
import TrustBadges from "@/components/TrustBadges";

export default function CartPageClient() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartCount,
    subtotal,
    discountAmount,
    total,
    checkoutUrl,
    addToCart,
    isSyncing,
  } = useCart();

  const [upsellProducts, setUpsellProducts] = useState([]);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Fetch cross-sell upsell recommendations
  useEffect(() => {
    fetch("/api/search?q=comb")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setUpsellProducts(data.products.slice(0, 4));
        }
      })
      .catch((err) => console.error("Failed to fetch upsells", err));
  }, []);

  // Shipping & Bulk Discount Calculations
  const shippingThreshold = 35.0;
  const remainingForFreeShipping = shippingThreshold - subtotal;
  const shippingProgress = Math.min((subtotal / shippingThreshold) * 100, 100);

  let discountPromoText = "";
  if (cartCount === 0) {
    discountPromoText = "Buy 2 items save 10%, Buy 3+ items save 15%!";
  } else if (cartCount === 1) {
    discountPromoText = "⚡ Add 1 more item to unlock 10% OFF your entire order!";
  } else if (cartCount === 2) {
    discountPromoText = "🔥 Great job! Add 1 more item to unlock 15% OFF!";
  } else {
    discountPromoText = "🎉 Maximum 15% bulk discount applied to your order!";
  }

  // Multi-tier Checkout Redirection Strategy
  const handleCheckout = () => {
    setIsRedirecting(true);

    if (checkoutUrl) {
      window.location.href = checkoutUrl;
      return;
    }

    if (cartItems.length > 0) {
      const linePermutations = cartItems
        .map((item) => {
          const rawId = item.variant?.id ? item.variant.id.toString().split("/").pop() : "";
          return rawId ? `${rawId}:${item.quantity}` : null;
        })
        .filter(Boolean);

      if (linePermutations.length > 0) {
        const fallbackCheckoutUrl = `https://peteora.com/cart/${linePermutations.join(",")}`;
        window.location.href = fallbackCheckoutUrl;
        return;
      }
    }

    alert("Checkout session not found. Please refresh the page.");
    setIsRedirecting(false);
  };

  return (
    <div className="bg-light min-vh-100 py-4 py-md-5 font-body">
      <div className="container" style={{ maxWidth: "1140px" }}>
        
        {/* Header Breadcrumbs & Back Link */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <Link
            href="/"
            className="text-decoration-none text-muted small fw-bold d-inline-flex align-items-center gap-2 hover-scale"
          >
            <ArrowLeft size={16} /> Continue Shopping
          </Link>

          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-soft-sand text-dark rounded-pill px-3 py-2 fw-semibold small">
              🛒 Peteora Shopping Cart ({cartCount} {cartCount === 1 ? "Item" : "Items"})
            </span>
          </div>
        </div>

        {/* Free Shipping & Bulk Discount Banners */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
          <div className="row g-3 align-items-center">
            {/* Free Shipping Progress */}
            <div className="col-12 col-md-6 border-end-md">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold small text-charcoal-dark d-inline-flex align-items-center gap-2">
                  <Truck size={18} className="text-zesty-orange" />
                  {subtotal >= shippingThreshold ? (
                    <span className="text-success font-heading">🎉 FREE Tracked US Shipping Unlocked!</span>
                  ) : (
                    <span>Free US Shipping Progress</span>
                  )}
                </span>
                {subtotal < shippingThreshold && (
                  <span className="small text-muted font-heading fw-bold">
                    ${remainingForFreeShipping.toFixed(2)} left
                  </span>
                )}
              </div>
              <div className="progress overflow-hidden bg-light" style={{ height: "10px", borderRadius: "10px" }}>
                <motion.div
                  className="progress-bar bg-success"
                  role="progressbar"
                  initial={{ width: 0 }}
                  animate={{ width: `${shippingProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Volume Discount Progress */}
            <div className="col-12 col-md-6">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold small text-charcoal-dark d-inline-flex align-items-center gap-2 font-heading">
                  <Sparkles size={18} className="text-zesty-orange" />
                  {discountPromoText}
                </span>
              </div>
              <div className="progress overflow-hidden bg-light" style={{ height: "10px", borderRadius: "10px" }}>
                <motion.div
                  className="progress-bar bg-warning text-dark fw-bold"
                  role="progressbar"
                  initial={{ width: 0 }}
                  animate={{ width: cartCount >= 3 ? "100%" : cartCount === 2 ? "66%" : cartCount === 1 ? "33%" : "0%" }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Cart Content Grid */}
        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white my-5">
            <div className="mb-4 text-muted d-inline-flex justify-content-center">
              <div className="p-4 rounded-circle bg-light">
                <ShoppingBag size={64} strokeWidth={1} className="text-zesty-orange" />
              </div>
            </div>
            <h3 className="font-heading fw-bold text-charcoal-dark mb-2">Your Shopping Cart is Empty</h3>
            <p className="text-muted max-w-md mx-auto mb-4" style={{ fontSize: "1.05rem" }}>
              Explore our best-selling pet wellness products, supplements, and grooming tools to build your custom pack!
            </p>
            <div>
              <Link
                href="/collections/all"
                className="btn btn-zesty-primary rounded-pill px-5 py-3 fs-5 fw-bold hover-scale text-decoration-none shadow"
              >
                Browse All Pet Products
              </Link>
            </div>
          </div>
        ) : (
          /* Active Cart 2-Column Layout */
          <div className="row g-4 align-items-start">
            {/* Left Column: Cart Items List & Cross-Sells (65% width) */}
            <div className="col-12 col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                <div className="card-header bg-white border-bottom p-3 p-md-4 d-flex align-items-center justify-content-between">
                  <h5 className="font-heading fw-bold mb-0 text-charcoal-dark">
                    Your Selected Items ({cartItems.length})
                  </h5>
                  <span className="small text-muted">Instant 0ms Updates</span>
                </div>

                <div className="card-body p-3 p-md-4 bg-white">
                  <div className="d-flex flex-column gap-3">
                    <AnimatePresence>
                      {cartItems.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 50, height: 0, marginBottom: 0, padding: 0 }}
                          transition={{ duration: 0.25 }}
                          className="d-flex flex-column flex-sm-row gap-3 p-3 border rounded-4 align-items-sm-center justify-content-between bg-white shadow-sm position-relative overflow-hidden"
                        >
                          {/* Image & Title */}
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="rounded-3 object-fit-cover"
                              style={{ width: "90px", height: "90px", backgroundColor: "#f9f9f9" }}
                            />
                            <div>
                              <Link
                                href={`/products/${item.handle}`}
                                className="fw-bold text-charcoal-dark text-decoration-none font-heading hover-scale d-block mb-1"
                                style={{ fontSize: "1.05rem" }}
                              >
                                {item.title}
                              </Link>
                              {item.variant.title !== "Default Title" && (
                                <span className="badge bg-light text-secondary rounded-pill px-3 py-1 border small d-inline-block mb-2">
                                  {item.variant.title}
                                </span>
                              )}
                              <div className="d-flex align-items-center gap-2">
                                <span className="fw-bold text-zesty-orange fs-5">
                                  ${(item.variant.price * item.quantity).toFixed(2)}
                                </span>
                                {item.variant.compare_at_price && (
                                  <span className="text-decoration-line-through text-muted small">
                                    ${(item.variant.compare_at_price * item.quantity).toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Stepper Controls & Delete Button */}
                          <div className="d-flex align-items-center justify-content-between justify-content-sm-end gap-3 mt-2 mt-sm-0 pt-2 pt-sm-0 border-top border-top-sm-0">
                            <div
                              className="d-flex align-items-center border border-2 rounded-pill overflow-hidden bg-light"
                              style={{ height: "42px" }}
                            >
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  updateQuantity(item.id, item.quantity - 1);
                                }}
                                className="btn btn-sm px-3 border-0 d-flex align-items-center h-100 text-dark fw-bold"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-3 fw-bold fs-6 text-dark">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  updateQuantity(item.id, item.quantity + 1);
                                }}
                                className="btn btn-sm px-3 border-0 d-flex align-items-center h-100 text-dark fw-bold"
                                aria-label="Increase quantity"
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                removeFromCart(item.id);
                              }}
                              className="btn btn-sm text-danger border-0 p-2 hover-scale d-flex align-items-center justify-content-center rounded-circle bg-light"
                              style={{ height: "42px", width: "42px" }}
                              aria-label="Remove item"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Cross-Sell Recommendations Section */}
              {upsellProducts.length > 0 && (
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="font-heading fw-bold mb-0 text-charcoal-dark d-flex align-items-center gap-2">
                      <Sparkles className="text-warning" size={20} /> Complete Your Pet Pack
                    </h5>
                    <span className="badge bg-danger rounded-pill px-3 py-1">Recommended</span>
                  </div>
                  <div className="row g-3">
                    {upsellProducts.map((prod) => (
                      <div key={prod.id} className="col-12 col-sm-6">
                        <div className="p-3 border rounded-3 d-flex align-items-center justify-content-between gap-3 h-100 bg-light">
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={prod.images?.[0] || ""}
                              alt={prod.title}
                              className="rounded object-fit-cover"
                              style={{ width: "60px", height: "60px", backgroundColor: "#fff" }}
                            />
                            <div>
                              <h6 className="fw-bold mb-0 small text-dark line-clamp-1">{prod.title}</h6>
                              <span className="fw-bold text-zesty-orange small">${prod.price}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (prod.variants?.[0]) {
                                addToCart(prod, prod.variants[0], 1);
                              }
                            }}
                            className="btn btn-sm btn-zesty-primary rounded-pill px-3 py-2 text-nowrap fw-bold d-inline-flex align-items-center gap-1 hover-scale"
                          >
                            <PlusCircle size={14} /> Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary Card (35% width) */}
            <div className="col-12 col-lg-4 position-sticky" style={{ top: "20px" }}>
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white p-4">
                <h5 className="font-heading fw-bold mb-3 text-charcoal-dark border-bottom pb-3">
                  Order Summary
                </h5>

                <div className="d-flex flex-column gap-2 mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Subtotal ({cartCount} items)</span>
                    <span className="fw-bold text-dark">${subtotal.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="d-flex justify-content-between align-items-center text-success fw-bold">
                      <span>Volume Discount Savings</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">US Shipping</span>
                    <span className={subtotal >= shippingThreshold ? "text-success fw-bold" : "text-dark"}>
                      {subtotal >= shippingThreshold ? "FREE Tracked" : "$4.95"}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Estimated Tax</span>
                    <span className="text-muted">$0.00</span>
                  </div>
                </div>

                <hr className="my-2" />

                {/* Total */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="fs-5 fw-bold font-heading text-dark">Total</span>
                  <span className="fs-3 fw-bold text-zesty-orange">${total.toFixed(2)}</span>
                </div>

                {/* Shipping Dispatch Timer */}
                <div className="mb-3">
                  <ShippingTimer />
                </div>

                {/* Checkout CTA Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isRedirecting || cartItems.length === 0}
                  className={`w-100 rounded-pill-cta btn-zesty-primary fs-5 d-flex align-items-center justify-content-center gap-2 py-3 mb-3 shadow ${
                    isRedirecting ? "opacity-75" : ""
                  }`}
                >
                  {isRedirecting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                      <span>REDIRECTING TO SHOPIFY...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={22} />
                      <span className="fw-bold">PROCEED TO CHECKOUT</span>
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="pt-2">
                  <TrustBadges />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
