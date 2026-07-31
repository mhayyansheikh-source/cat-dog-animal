"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Check
} from "lucide-react";
import ShippingTimer from "@/components/ShippingTimer";
import TrustBadges from "@/components/TrustBadges";

export default function CartPageClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
  const [addedItemIds, setAddedItemIds] = useState({});

  // Fetch cross-sell recommendations
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

  // Memoized Financial & Threshold Calculation Engine
  const summary = useMemo(() => {
    const shippingThreshold = 35.0;
    const remainingForFreeShipping = Math.max(0, shippingThreshold - subtotal);
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

    return {
      shippingThreshold,
      remainingForFreeShipping,
      shippingProgress,
      discountPromoText
    };
  }, [subtotal, cartCount]);

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

  const handleAddCrossSell = (prod) => {
    if (prod.variants?.[0]) {
      addToCart(prod, prod.variants[0], 1, false);
      setAddedItemIds((prev) => ({ ...prev, [prod.id]: true }));
      setTimeout(() => {
        setAddedItemIds((prev) => ({ ...prev, [prod.id]: false }));
      }, 2000);
    }
  };

  if (!mounted) {
    return (
      <div className="bg-light min-vh-100 py-5 text-center d-flex align-items-center justify-content-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading Cart...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-light min-vh-100 py-4 py-md-5 font-body"
    >
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
              🛒 Peteora Shopping Cart ({cartCount} {cartCount === 1 ? "Unit" : "Units"})
            </span>
          </div>
        </div>

        {/* Free Shipping & Bulk Discount Banners */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white"
        >
          <div className="row g-3 align-items-center">
            {/* Free Shipping Progress */}
            <div className="col-12 col-md-6 border-end-md">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold small text-charcoal-dark d-inline-flex align-items-center gap-2">
                  <Truck size={18} className="text-zesty-orange" />
                  {subtotal >= summary.shippingThreshold ? (
                    <span className="text-success font-heading">🎉 FREE Tracked US Shipping Unlocked!</span>
                  ) : (
                    <span>Free US Shipping Progress</span>
                  )}
                </span>
                {subtotal < summary.shippingThreshold && (
                  <span className="small text-muted font-heading fw-bold">
                    ${summary.remainingForFreeShipping.toFixed(2)} left
                  </span>
                )}
              </div>
              <div className="progress overflow-hidden bg-light" style={{ height: "10px", borderRadius: "10px" }}>
                <motion.div
                  className="progress-bar bg-success"
                  role="progressbar"
                  initial={{ width: 0 }}
                  animate={{ width: `${summary.shippingProgress}%` }}
                  transition={{ type: "spring", stiffness: 90, damping: 15 }}
                />
              </div>
            </div>

            {/* Volume Discount Progress */}
            <div className="col-12 col-md-6">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold small text-charcoal-dark d-inline-flex align-items-center gap-2 font-heading">
                  <Sparkles size={18} className="text-zesty-orange" />
                  {summary.discountPromoText}
                </span>
              </div>
              <div className="progress overflow-hidden bg-light" style={{ height: "10px", borderRadius: "10px" }}>
                <motion.div
                  className="progress-bar bg-warning text-dark fw-bold"
                  role="progressbar"
                  initial={{ width: 0 }}
                  animate={{ width: cartCount >= 3 ? "100%" : cartCount === 2 ? "66%" : cartCount === 1 ? "33%" : "0%" }}
                  transition={{ type: "spring", stiffness: 90, damping: 15 }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Cart Content Grid */}
        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white my-5"
          >
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
          </motion.div>
        ) : (
          /* Active Cart 2-Column Layout */
          <div className="row g-4 align-items-start">
            {/* Left Column: Cart Items List & Cross-Sells (65% width) */}
            <div className="col-12 col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                <div className="card-header bg-white border-bottom p-3 p-md-4 d-flex align-items-center justify-content-between">
                  <h5 className="font-heading fw-bold mb-0 text-charcoal-dark">
                    Your Selected Items ({cartItems.length} {cartItems.length === 1 ? "product" : "products"} • {cartCount} {cartCount === 1 ? "unit" : "units"} total)
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
                                <AnimatePresence mode="wait">
                                  <motion.span 
                                    key={item.quantity * item.variant.price}
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 4 }}
                                    className="fw-bold text-zesty-orange fs-5"
                                  >
                                    ${(item.variant.price * item.quantity).toFixed(2)}
                                  </motion.span>
                                </AnimatePresence>
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
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9, rotate: -5 }}
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  updateQuantity(item.id, item.quantity - 1);
                                }}
                                className="btn btn-sm px-3 border-0 d-flex align-items-center h-100 text-dark fw-bold"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={16} />
                              </motion.button>
                              <span className="px-3 fw-bold fs-6 text-dark">{item.quantity}</span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9, rotate: 5 }}
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  updateQuantity(item.id, item.quantity + 1);
                                }}
                                className="btn btn-sm px-3 border-0 d-flex align-items-center h-100 text-dark fw-bold"
                                aria-label="Increase quantity"
                              >
                                <Plus size={16} />
                              </motion.button>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.15, backgroundColor: "#fee2e2" }}
                              whileTap={{ scale: 0.85 }}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                removeFromCart(item.id);
                              }}
                              className="btn btn-sm text-danger border-0 p-2 d-flex align-items-center justify-content-center rounded-circle bg-light"
                              style={{ height: "42px", width: "42px" }}
                              aria-label="Remove item"
                            >
                              <Trash2 size={18} />
                            </motion.button>
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
                    {upsellProducts.map((prod) => {
                      const isAdded = !!addedItemIds[prod.id];
                      return (
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
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={() => handleAddCrossSell(prod)}
                              className={`btn btn-sm ${isAdded ? "btn-success" : "btn-zesty-primary"} rounded-pill px-3 py-2 text-nowrap fw-bold d-inline-flex align-items-center gap-1 hover-scale`}
                            >
                              {isAdded ? (
                                <>
                                  <Check size={14} /> Added!
                                </>
                              ) : (
                                <>
                                  <PlusCircle size={14} /> Add
                                </>
                              )}
                            </motion.button>
                          </div>
                        </div>
                      );
                    })}
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
                    <span className="text-muted">Subtotal ({cartCount} {cartCount === 1 ? "unit" : "units"})</span>
                    <AnimatePresence mode="wait">
                      <motion.span 
                        key={subtotal}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="fw-bold text-dark"
                      >
                        ${subtotal.toFixed(2)}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  {discountAmount > 0 && (
                    <div className="d-flex justify-content-between align-items-center text-success fw-bold">
                      <span>Volume Discount Savings</span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={discountAmount}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          -${discountAmount.toFixed(2)}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">US Shipping</span>
                    <span className={subtotal >= summary.shippingThreshold ? "text-success fw-bold" : "text-dark"}>
                      {subtotal >= summary.shippingThreshold ? "FREE Tracked" : "$4.95"}
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
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={total}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="fs-3 fw-bold text-zesty-orange"
                    >
                      ${total.toFixed(2)}
                    </motion.span>
                  </AnimatePresence>
                </div>

                {/* Shipping Dispatch Timer */}
                <div className="mb-3">
                  <ShippingTimer />
                </div>

                {/* Checkout CTA Button */}
                <motion.button
                  whileHover={{ scale: isRedirecting ? 1 : 1.02, y: isRedirecting ? 0 : -2 }}
                  whileTap={{ scale: isRedirecting ? 1 : 0.97 }}
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
                </motion.button>

                {/* Trust Badges */}
                <div className="pt-2">
                  <TrustBadges />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
