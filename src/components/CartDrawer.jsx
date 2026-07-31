"use client";

import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, CreditCard, Shield, PlusCircle } from "lucide-react";
import Link from "next/link";
// checkoutAction removed — using direct checkout URL redirect instead

export default function CartDrawer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartCount,
    subtotal,
    discountAmount,
    total,
    checkoutUrl,
    isSyncing,
  } = useCart();

  const drawerRef = useRef();
  const [upsellProduct, setUpsellProduct] = useState(null);

  // Close drawer on clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      // Ignore if target is no longer attached to DOM (e.g. unmounted during re-render/state update)
      if (e.target && !document.body.contains(e.target)) return;
      if (isCartOpen && drawerRef.current && !drawerRef.current.contains(e.target)) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isCartOpen, setIsCartOpen]);

  // Prevent background scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  // Fetch upsell product
  useEffect(() => {
    if (isCartOpen && !upsellProduct) {
      fetch("/api/search?q=bundle")
        .then(res => res.json())
        .then(data => {
          if (data.products && data.products.length > 0) {
            setUpsellProduct(data.products[0]);
          }
        })
        .catch(err => console.error("Failed to fetch upsell", err));
    }
  }, [isCartOpen, upsellProduct]);

  // Shipping Threshold Calculations
  const shippingThreshold = 35.0;
  // [D2-FIX] Always >= 0 so we never display negative dollar amounts
  const remainingForFreeShipping = Math.max(0, shippingThreshold - subtotal);
  const shippingProgress = Math.min((subtotal / shippingThreshold) * 100, 100);

  // Volume Discount Promotion Text
  let discountPromoText = "";
  if (cartCount === 0) {
    discountPromoText = "Buy 2 items save 10%, Buy 3+ items save 15%!";
  } else if (cartCount === 1) {
    discountPromoText = "⚡ Add 1 more jar to unlock 10% OFF your entire order!";
  } else if (cartCount === 2) {
    discountPromoText = "🔥 Great job! Add 1 more jar to unlock 15% OFF!";
  } else {
    discountPromoText = "🎉 Max 15% bulk discount applied to your order!";
  }

  const [isRedirecting, setIsRedirecting] = useState(false);

  // Handle Shopify checkout redirect with multi-tier fallback strategy
  const handleCheckout = () => {
    setIsRedirecting(true);

    if (checkoutUrl) {
      window.location.href = checkoutUrl;
      return;
    }

    // Fallback: Construct direct Shopify cart URL from cart items
    if (cartItems.length > 0) {
      const linePermutations = cartItems
        .map(item => {
          const rawId = item.variant?.id ? item.variant.id.toString().split('/').pop() : "";
          return rawId ? `${rawId}:${item.quantity}` : null;
        })
        .filter(Boolean);

      if (linePermutations.length > 0) {
        const fallbackCheckoutUrl = `https://peteora.com/cart/${linePermutations.join(',')}`;
        window.location.href = fallbackCheckoutUrl;
        return;
      }
    }

    alert("Checkout session not found. Please refresh or try again.");
    setIsRedirecting(false);
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
            style={{ zIndex: 1040, cursor: "pointer" }}
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer container */}
          <motion.div
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
            className="position-fixed top-0 end-0 h-100 bg-white shadow d-flex flex-column"
            style={{
              width: "100%",
              maxWidth: "480px",
              zIndex: 1050,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <img src="/peteora.png" alt="Peteora Logo" style={{ height: "24px", width: "auto" }} />
                <h5 className="mb-0 fw-bold font-heading">Your Pet Pack</h5>
                <span className="badge bg-secondary rounded-pill">{cartCount}</span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="btn-close"
                aria-label="Close cart"
              />
            </div>

            {/* Shipping & Volume Discount Meters */}
            <div className="p-3 bg-light border-bottom">
              <div className="d-flex justify-content-between align-items-center mb-1 small font-body">
                {subtotal >= shippingThreshold ? (
                  <span className="fw-bold text-success">🎉 You've unlocked FREE Tracked US Shipping!</span>
                ) : (
                  <span>Add <strong className="text-zesty-orange">${remainingForFreeShipping.toFixed(2)}</strong> more for <strong>FREE Tracked US Shipping</strong>!</span>
                )}
              </div>
              
              <div className="progress mb-2" style={{ height: "8px", borderRadius: "10px", backgroundColor: "#e9ecef" }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${shippingProgress}%`, transition: "width 0.4s ease" }}
                />
              </div>

              {discountPromoText && (
                <div className="small font-body text-charcoal-dark fw-bold border-top pt-2 mt-2">
                  {discountPromoText}
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="flex-grow-1 overflow-auto p-3">
              {cartItems.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-3 text-muted">
                    <ShoppingBag size={48} strokeWidth={1} />
                  </div>
                  <h5 className="font-heading fw-bold">Your cart is empty</h5>
                  <p className="text-muted small max-w-sm mb-4">
                    It looks like you haven't added any supplements yet. Let's find the perfect bites for your puppy or cat!
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="rounded-pill-cta btn-zesty-primary"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 50, height: 0, marginBottom: 0, padding: 0 }}
                        transition={{ duration: 0.25 }}
                        className="d-flex gap-3 p-2 border rounded align-items-center bg-white shadow-sm overflow-hidden"
                      >
                        {/* Product Image — [D1-FIX] onError fallback prevents broken-image crash */}
                        <img
                          src={item.image || "/peteora.png"}
                          alt={item.title}
                          className="rounded object-fit-cover"
                          style={{ width: "80px", height: "80px", backgroundColor: "#f9f9f9" }}
                          onError={(e) => { e.currentTarget.src = "/peteora.png"; }}
                        />

                        {/* Info & Quantity controls */}
                        <div className="flex-grow-1 text-start">
                          <h6 className="fw-bold mb-0 small text-charcoal-dark">{item.title}</h6>
                          <span className="small text-muted d-block mb-1">
                            {/* [D3-FIX] optional chain — variant may be missing on temp items */}
                            {item.variant?.title && item.variant.title !== "Default Title" ? item.variant.title : ""}
                          </span>

                          {/* Price */}
                          <div className="d-flex align-items-center gap-2 mb-2">
                            {/* [D3-FIX] optional chain on variant fields */}
                            <span className="fw-bold text-zesty-orange">${((item.variant?.price || item.price || 0) * item.quantity).toFixed(2)}</span>
                            {(item.variant?.compare_at_price || item.compareAtPrice) && (
                              <span className="text-decoration-line-through text-muted small">
                                ${( (item.variant?.compare_at_price || item.compareAtPrice || 0) * item.quantity).toFixed(2)}
                              </span>
                            )}
                          </div>

                          {/* Quantity Counter */}
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="d-flex align-items-center border rounded-pill overflow-hidden bg-light"
                              style={{ height: "36px" }}
                            >
                              <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateQuantity(item.id, item.quantity - 1); }}
                                className="btn btn-sm px-3 border-0 d-flex align-items-center h-100"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="px-2 small fw-bold">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateQuantity(item.id, item.quantity + 1); }}
                                className="btn btn-sm px-3 border-0 d-flex align-items-center h-100"
                                aria-label="Increase quantity"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            {/* Delete button */}
                            <button
                              type="button"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFromCart(item.id); }}
                              className="btn btn-sm text-danger border-0 p-2 hover-scale d-flex align-items-center justify-content-center"
                              style={{ height: "36px", width: "36px" }}
                              aria-label="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
              
              {/* Dynamic In-Cart Upsell */}
              {cartCount > 0 && upsellProduct && (
                <div className="mt-4 p-3 bg-light rounded border border-zesty-orange border-opacity-25 shadow-sm">
                  <p className="small fw-bold text-charcoal-dark mb-2 font-heading d-flex justify-content-between">
                    <span>🔥 Complete Your Pack</span>
                    <span className="badge bg-danger rounded-pill">Limited Offer</span>
                  </p>
                  <div className="d-flex gap-3 align-items-center">
                    <div className="bg-white rounded p-1" style={{ width: "60px", height: "60px", flexShrink: 0 }}>
                      {upsellProduct.image && (
                        <img 
                          src={upsellProduct.image} 
                          alt={upsellProduct.title}
                          className="w-100 h-100 object-fit-contain"
                        />
                      )}
                    </div>
                    <div className="flex-grow-1 text-start">
                      <h6 className="mb-0 small fw-bold text-dark">{upsellProduct.title}</h6>
                      <span className="text-zesty-orange fw-bold small">${upsellProduct.price}</span>
                    </div>
                    <Link href={`/products/${upsellProduct.handle}`} onClick={() => setIsCartOpen(false)}>
                      <button className="btn btn-sm btn-outline-zesty-primary rounded-circle p-2 hover-scale">
                        <PlusCircle size={18} />
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer Summary & Checkout */}
            {cartItems.length > 0 && (
              <div 
                className="p-3 border-top bg-light" 
                style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
              >
                <div className="d-flex flex-column gap-2 text-start mb-3">
                  {/* Subtotal */}
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Subtotal</span>
                    <span className="fw-semibold text-dark">${subtotal.toFixed(2)}</span>
                  </div>

                  {/* Volume Discount */}
                  {discountAmount > 0 && (
                    <div className="d-flex justify-content-between align-items-center text-success">
                      <span className="small">Bulk Savings</span>
                      <span className="fw-semibold">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  {/* Shipping */}
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Shipping</span>
                    <span className="small">
                      {remainingForFreeShipping <= 0 ? (
                        <strong className="text-success">FREE Tracked</strong>
                      ) : (
                        "$4.95"
                      )}
                    </span>
                  </div>

                  {/* Estimated Taxes */}
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Estimated Tax</span>
                    <span className="text-muted small">$0.00</span>
                  </div>

                  <hr className="my-1" />

                  {/* Total */}
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-dark font-heading">Total</span>
                    <span className="fw-bold fs-4 text-zesty-orange">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={handleCheckout}
                  disabled={isRedirecting || cartItems.length === 0}
                  className={`w-100 rounded-pill-cta btn-zesty-primary d-flex align-items-center justify-content-center gap-2 mb-3 py-3 ${isRedirecting ? "opacity-75" : ""}`}
                >
                  {isRedirecting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>REDIRECTING TO SHOPIFY CHECKOUT...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      <span>PROCEED TO SECURE CHECKOUT</span>
                    </>
                  )}
                </button>

                {/* Safe payment note */}
                <div className="d-flex justify-content-center align-items-center gap-2 text-muted" style={{ fontSize: "0.75rem" }}>
                  <Shield size={14} className="text-success" />
                  <span>McAfee Secure checkout • 256-Bit SSL Encrypted Encryption</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
