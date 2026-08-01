"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  CreditCard,
  Shield,
  Truck,
  Sparkles,
  PlusCircle,
  Check,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import { normalizeCartLine, toCleanId } from "@/context/CartContext";
import ShippingTimer from "@/components/ShippingTimer";

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div
      className="d-flex gap-3 p-3 border rounded-4 align-items-center bg-white shadow-sm"
      aria-hidden="true"
    >
      <div
        className="rounded-3 flex-shrink-0"
        style={{
          width: 80,
          height: 80,
          background: "linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)",
          backgroundSize: "200% 100%",
          animation: "skeleton-shimmer 1.4s infinite",
        }}
      />
      <div className="flex-grow-1 d-flex flex-column gap-2">
        <div
          className="rounded"
          style={{
            height: 14,
            width: "65%",
            background: "linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)",
            backgroundSize: "200% 100%",
            animation: "skeleton-shimmer 1.4s infinite",
          }}
        />
        <div
          className="rounded"
          style={{
            height: 12,
            width: "40%",
            background: "linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)",
            backgroundSize: "200% 100%",
            animation: "skeleton-shimmer 1.4s infinite 0.2s",
          }}
        />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CartSheet() {
  const {
    isCartOpen,
    setIsCartOpen,
    cartCount,
    setCartCount,
    refetchTrigger,
  } = useCart();

  // ── Portal mount guard ──────────────────────────────────────────────────────
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // ── Self-contained cart data (Shopify is source of truth) ──────────────────
  const [lines, setLines] = useState([]);           // normalizeCartLine[] 
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [loading, setLoading] = useState(false);    // true only on first open
  const [updating, setUpdating] = useState(null);   // lineId being mutated
  const [isRedirecting, setIsRedirecting] = useState(false);

  // ── Upsell ─────────────────────────────────────────────────────────────────
  const [upsellProduct, setUpsellProduct] = useState(null);
  const [addedUpsell, setAddedUpsell] = useState(false);

  // ── Refs ───────────────────────────────────────────────────────────────────
  const sheetRef   = useRef(null);
  const debounceRef = useRef({});
  const touchStartY = useRef(null);
  const touchCurrentY = useRef(null);

  // ── fetchCart ────────────────────────────────────────────────────────────────
  const fetchCart = useCallback(async (showSkeleton = false) => {
    if (showSkeleton) setLoading(true);
    try {
      const res  = await fetch("/api/cart");
      const data = await res.json();
      if (data?.cart?.lines?.edges) {
        const normalized = data.cart.lines.edges
          .map(normalizeCartLine)
          .filter(Boolean);
        setLines(normalized);
        setCheckoutUrl(data.cart.checkoutUrl || null);
        // Keep Context badge in sync
        const count = normalized.reduce((s, i) => s + i.quantity, 0);
        setCartCount(count);
      } else {
        setLines([]);
        setCheckoutUrl(null);
        setCartCount(0);
      }
    } catch (err) {
      console.error("[CartSheet] fetchCart error:", err);
    } finally {
      setLoading(false);
    }
  }, [setCartCount]);

  // ── Load cart whenever sheet opens or addToCart fires ────────────────────────
  useEffect(() => {
    if (isCartOpen) {
      fetchCart(lines.length === 0); // skeleton only on first open
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCartOpen]);

  useEffect(() => {
    if (refetchTrigger > 0) {
      fetchCart(false); // background refresh — no skeleton flash
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchTrigger]);

  // ── Upsell fetch ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isCartOpen && !upsellProduct) {
      fetch("/api/search?q=bundle")
        .then((r) => r.json())
        .then((data) => {
          if (data?.products?.length > 0) setUpsellProduct(data.products[0]);
        })
        .catch(() => {});
    }
  }, [isCartOpen, upsellProduct]);

  // ── Body scroll lock ────────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isCartOpen]);

  // ── Escape key ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setIsCartOpen(false); };
    if (isCartOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isCartOpen, setIsCartOpen]);

  // ── handleQtyChange (optimistic + debounced PUT) ──────────────────────────
  const handleQtyChange = useCallback(
    (lineId, newQty) => {
      if (newQty <= 0) {
        handleRemove(lineId);
        return;
      }
      // Optimistic update immediately
      setLines((prev) =>
        prev.map((item) =>
          item.id === lineId ? { ...item, quantity: newQty } : item
        )
      );

      // Debounce the Shopify PUT
      clearTimeout(debounceRef.current[lineId]);
      debounceRef.current[lineId] = setTimeout(async () => {
        setUpdating(lineId);
        try {
          const res = await fetch("/api/cart", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lines: [{ id: lineId, quantity: newQty }],
            }),
          });
          const data = await res.json();
          if (data?.cart?.lines?.edges) {
            const fresh = data.cart.lines.edges
              .map(normalizeCartLine)
              .filter(Boolean);
            setLines(fresh);
            setCheckoutUrl(data.cart.checkoutUrl || null);
            const count = fresh.reduce((s, i) => s + i.quantity, 0);
            setCartCount(count);
          }
        } catch (err) {
          console.error("[CartSheet] qty update error:", err);
        } finally {
          setUpdating(null);
        }
      }, 300);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setCartCount]
  );

  // ── handleRemove (optimistic + immediate DELETE) ──────────────────────────
  const handleRemove = useCallback(
    async (lineId) => {
      // Capture the item before removing (for undo)
      const removedItem = lines.find((i) => i.id === lineId) ?? null;

      // Optimistic removal
      setLines((prev) => prev.filter((i) => i.id !== lineId));
      const newCount = Math.max(0, cartCount - (removedItem?.quantity ?? 1));
      setCartCount(newCount);

      // Undo toast
      if (removedItem) {
        toast(
          (t) => (
            <div className="d-flex align-items-center justify-content-between gap-3">
              <span className="small fw-semibold">Item removed from cart</span>
              <button
                onClick={async () => {
                  toast.dismiss(t.id);
                  // Re-add via POST
                  try {
                    const res = await fetch("/api/cart", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        lines: [{
                          merchandiseId: removedItem.merchandiseId,
                          quantity: removedItem.quantity,
                        }],
                      }),
                    });
                    const data = await res.json();
                    if (data?.cart?.lines?.edges) {
                      const fresh = data.cart.lines.edges
                        .map(normalizeCartLine)
                        .filter(Boolean);
                      setLines(fresh);
                      setCheckoutUrl(data.cart.checkoutUrl || null);
                      setCartCount(fresh.reduce((s, i) => s + i.quantity, 0));
                    }
                  } catch {
                    toast.error("Could not restore item. Please add it again.");
                  }
                }}
                className="btn btn-sm btn-dark rounded-pill py-1 px-3 fw-bold text-warning"
                style={{ fontSize: "12px" }}
              >
                Undo
              </button>
            </div>
          ),
          { duration: 4000 }
        );
      }

      // Background DELETE
      try {
        setUpdating(lineId);
        const res = await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lineIds: [lineId] }),
        });
        const data = await res.json();
        if (data?.cart?.lines?.edges) {
          const fresh = data.cart.lines.edges
            .map(normalizeCartLine)
            .filter(Boolean);
          setLines(fresh);
          setCheckoutUrl(data.cart.checkoutUrl || null);
          setCartCount(fresh.reduce((s, i) => s + i.quantity, 0));
        }
      } catch (err) {
        console.error("[CartSheet] remove error:", err);
      } finally {
        setUpdating(null);
      }
    },
    [lines, cartCount, setCartCount]
  );

  // ── handleAddUpsell ───────────────────────────────────────────────────────
  const handleAddUpsell = useCallback(async () => {
    if (!upsellProduct?.variants?.[0]) return;
    const variant = upsellProduct.variants[0];
    const cleanId = toCleanId(variant.id);
    const fullId  = variant.id?.toString().includes("gid://")
      ? variant.id
      : `gid://shopify/ProductVariant/${cleanId}`;
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: [{ merchandiseId: fullId, quantity: 1 }] }),
      });
      const data = await res.json();
      if (data?.cart?.lines?.edges) {
        const fresh = data.cart.lines.edges.map(normalizeCartLine).filter(Boolean);
        setLines(fresh);
        setCheckoutUrl(data.cart.checkoutUrl || null);
        setCartCount(fresh.reduce((s, i) => s + i.quantity, 0));
        setAddedUpsell(true);
        setTimeout(() => setAddedUpsell(false), 2500);
        toast.success(`${upsellProduct.title} added! 🐾`, { duration: 2000 });
      }
    } catch { /* silent */ }
  }, [upsellProduct, setCartCount]);

  // ── handleCheckout ─────────────────────────────────────────────────────────
  const handleCheckout = useCallback(() => {
    setIsRedirecting(true);
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
      return;
    }
    // Fallback: build Shopify /cart URL from line variantIds
    const parts = lines
      .map((item) => {
        const rawId = toCleanId(item.variant?.id || item.variantId || item.merchandiseId);
        return rawId ? `${rawId}:${item.quantity}` : null;
      })
      .filter(Boolean);
    if (parts.length > 0) {
      window.location.href = `https://peteora.com/cart/${parts.join(",")}`;
      return;
    }
    toast.error("Checkout session not found. Please refresh.");
    setIsRedirecting(false);
  }, [checkoutUrl, lines]);

  // ── Derived totals ─────────────────────────────────────────────────────────
  const totals = useMemo(() => {
    const totalQty    = lines.reduce((s, i) => s + i.quantity, 0);
    const subtotal    = lines.reduce((s, i) => s + (i.price || 0) * i.quantity, 0);
    const shippingThreshold = 35;
    const discountPct = totalQty >= 3 ? 0.15 : totalQty === 2 ? 0.10 : 0;
    const discountAmt = subtotal * discountPct;
    const afterDiscount = subtotal - discountAmt;
    const shipping    = afterDiscount > 0 && afterDiscount < shippingThreshold ? 4.95 : 0;
    const total       = afterDiscount + shipping;
    const remaining   = Math.max(0, shippingThreshold - subtotal);
    const progress    = Math.min((subtotal / shippingThreshold) * 100, 100);
    const discountBarWidth =
      totalQty >= 3 ? "100%" : totalQty === 2 ? "66%" : totalQty === 1 ? "33%" : "0%";

    let discountNudge = "";
    if (totalQty === 0) discountNudge = "Buy 2 items save 10%, buy 3+ items save 15%!";
    else if (totalQty === 1) discountNudge = "⚡ Add 1 more item to unlock 10% OFF!";
    else if (totalQty === 2) discountNudge = "🔥 Add 1 more item to unlock 15% OFF!";
    else discountNudge = "🎉 Maximum 15% bulk discount applied!";

    return {
      totalQty, subtotal, discountPct, discountAmt, afterDiscount,
      shipping, total, remaining, progress, discountBarWidth, discountNudge,
    };
  }, [lines]);

  // ── Touch swipe-to-dismiss (mobile bottom sheet) ───────────────────────────
  const handleTouchStart = useCallback((e) => {
    touchStartY.current = e.touches[0].clientY;
    touchCurrentY.current = 0;
  }, []);

  const handleTouchMove = useCallback((e) => {
    const delta = e.touches[0].clientY - touchStartY.current;
    touchCurrentY.current = delta;
    if (delta > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${delta}px)`;
      sheetRef.current.style.transition = "none";
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    const delta = touchCurrentY.current;
    if (sheetRef.current) {
      sheetRef.current.style.transition = "transform 0.3s ease";
      sheetRef.current.style.transform  = "";
    }
    if (delta > 80) setIsCartOpen(false);
  }, [setIsCartOpen]);

  // ── Framer variants ────────────────────────────────────────────────────────
  // Desktop: slides from right. Mobile: slides from bottom.
  // We detect mobile via CSS media but framer needs JS — use a simple ref.
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const sheetVariants = {
    hidden:  isMobile ? { y: "100%" } : { x: "100%" },
    visible: isMobile ? { y: 0 }      : { x: 0 },
    exit:    isMobile ? { y: "100%" } : { x: "100%" },
  };

  if (!mounted) return null;

  // ─── JSX ──────────────────────────────────────────────────────────────────
  return createPortal(
    <>
      {/* Shimmer keyframe (injected once) */}
      <style>{`
        @keyframes skeleton-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* ── Backdrop ─────────────────────────────────────────────── */}
            <motion.div
              key="cs-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsCartOpen(false)}
              style={{
                position: "fixed", inset: 0, zIndex: 1040,
                background: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                cursor: "pointer",
              }}
            />

            {/* ── Sheet Panel ──────────────────────────────────────────── */}
            <motion.div
              key="cs-panel"
              ref={sheetRef}
              role="dialog"
              aria-modal="true"
              aria-label="Shopping cart"
              variants={sheetVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
              // Mobile touch handlers
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "fixed",
                zIndex: 1050,
                background: "#fff",
                display: "flex",
                flexDirection: "column",
                overflowY: "hidden",
                // Mobile: full-width bottom sheet
                ...(isMobile
                  ? {
                      bottom: 0, left: 0, right: 0,
                      height: "92dvh",
                      borderRadius: "20px 20px 0 0",
                      boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
                    }
                  : {
                      top: 0, right: 0, bottom: 0,
                      width: "min(460px, 100vw)",
                      boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
                    }),
              }}
            >
              {/* ── Drag Handle (mobile only) ─────────────────────────── */}
              {isMobile && (
                <div
                  style={{
                    display: "flex", justifyContent: "center",
                    paddingTop: "10px", paddingBottom: "2px", cursor: "grab",
                  }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <div style={{
                    width: 44, height: 5,
                    borderRadius: 99,
                    background: "#d1d5db",
                  }} />
                </div>
              )}

              {/* ── Header ───────────────────────────────────────────────── */}
              <div
                className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom bg-white"
                style={{ flexShrink: 0 }}
              >
                <div className="d-flex align-items-center gap-2">
                  <img src="/peteora.png" alt="Peteora" style={{ height: 22, width: "auto" }} />
                  <h5 className="mb-0 fw-bold font-heading" style={{ fontSize: "1.05rem" }}>
                    Your Pet Pack
                  </h5>
                  {totals.totalQty > 0 && (
                    <span
                      className="badge rounded-pill"
                      style={{ background: "var(--zesty-orange)", color: "#fff", fontSize: "0.75rem" }}
                    >
                      {totals.totalQty}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="btn p-1 d-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: 34, height: 34, background: "#f3f4f6", border: "none" }}
                  aria-label="Close cart"
                >
                  <X size={18} />
                </button>
              </div>

              {/* ── Progress Banners ──────────────────────────────────────── */}
              <div
                className="px-3 py-2 border-bottom"
                style={{ background: "#fafafa", flexShrink: 0 }}
              >
                {/* Free shipping */}
                <div className="mb-2">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="small fw-semibold d-inline-flex align-items-center gap-1">
                      <Truck size={13} className="text-zesty-orange" />
                      {totals.subtotal >= 35 ? (
                        <span className="text-success fw-bold">
                          🎉 FREE Tracked US Shipping Unlocked!
                        </span>
                      ) : (
                        <span>
                          Add <strong className="text-zesty-orange">${totals.remaining.toFixed(2)}</strong> for{" "}
                          <strong>FREE Tracked Shipping</strong>
                        </span>
                      )}
                    </span>
                  </div>
                  <div
                    className="progress"
                    style={{ height: 7, borderRadius: 10, background: "#e5e7eb" }}
                  >
                    <div
                      className="progress-bar bg-success"
                      style={{ width: `${totals.progress}%`, transition: "width 0.4s ease" }}
                    />
                  </div>
                </div>

                {/* Volume discount */}
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="small fw-bold d-inline-flex align-items-center gap-1 text-charcoal-dark font-heading">
                      <Sparkles size={13} className="text-zesty-orange" />
                      {totals.discountNudge}
                    </span>
                  </div>
                  <div
                    className="progress"
                    style={{ height: 7, borderRadius: 10, background: "#e5e7eb" }}
                  >
                    <div
                      className="progress-bar bg-warning"
                      style={{
                        width: totals.discountBarWidth,
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* ── Scrollable Body ────────────────────────────────────────── */}
              <div
                className="flex-grow-1 overflow-auto px-3 py-3"
                style={{ overscrollBehavior: "contain" }}
              >
                {/* Loading skeletons */}
                {loading && (
                  <div className="d-flex flex-column gap-3">
                    <SkeletonRow />
                    <SkeletonRow />
                  </div>
                )}

                {/* Empty state */}
                {!loading && lines.length === 0 && (
                  <div className="text-center py-5">
                    <div className="mb-3 text-muted">
                      <ShoppingBag size={52} strokeWidth={1} />
                    </div>
                    <h5 className="font-heading fw-bold mb-2">Your cart is empty</h5>
                    <p className="text-muted small mb-4">
                      Explore our best-selling pet wellness products!
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="btn btn-zesty-primary rounded-pill px-4 py-2 fw-bold"
                    >
                      Start Shopping
                    </button>
                  </div>
                )}

                {/* Item rows */}
                {!loading && lines.length > 0 && (
                  <div className="d-flex flex-column gap-3">
                    <AnimatePresence initial={false}>
                      {lines.map((item) => {
                        const itemPrice  = item.variant?.price ?? item.price ?? 0;
                        const compareAt  = item.variant?.compare_at_price ?? item.compareAtPrice ?? null;
                        const lineTotal  = (itemPrice * item.quantity).toFixed(2);
                        const compareTotal = compareAt
                          ? (compareAt * item.quantity).toFixed(2)
                          : null;
                        const isUpdating = updating === item.id;
                        const vTitle =
                          item.variant?.title && item.variant.title !== "Default Title"
                            ? item.variant.title
                            : item.variantTitle || "";

                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 60, height: 0, marginBottom: 0, padding: 0 }}
                            transition={{ duration: 0.22 }}
                            className="d-flex gap-3 p-2 border rounded-4 align-items-center bg-white shadow-sm"
                            style={{ overflow: "hidden", opacity: isUpdating ? 0.65 : 1 }}
                          >
                            {/* Product image */}
                            <Link
                              href={`/products/${item.handle}`}
                              onClick={() => setIsCartOpen(false)}
                              className="d-block flex-shrink-0"
                            >
                              <img
                                src={item.image || "/peteora.png"}
                                alt={item.title}
                                className="rounded-3 object-fit-cover hover-scale"
                                style={{ width: 80, height: 80, background: "#f9f9f9" }}
                                onError={(e) => { e.currentTarget.src = "/peteora.png"; }}
                              />
                            </Link>

                            {/* Info */}
                            <div className="flex-grow-1 text-start min-width-0">
                              <Link
                                href={`/products/${item.handle}`}
                                onClick={() => setIsCartOpen(false)}
                                className="text-decoration-none"
                              >
                                <h6
                                  className="fw-bold mb-0 text-charcoal-dark hover-orange"
                                  style={{
                                    fontSize: "0.88rem",
                                    lineHeight: 1.3,
                                    overflow: "hidden",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                  }}
                                >
                                  {item.title}
                                </h6>
                              </Link>

                              {vTitle && (
                                <span className="badge bg-light text-secondary rounded-pill px-2 py-1 border small d-inline-block mt-1 mb-1">
                                  {vTitle}
                                </span>
                              )}

                              {/* Price */}
                              <div className="d-flex flex-wrap align-items-baseline gap-2 mb-2">
                                <span className="fw-bold text-zesty-orange" style={{ fontSize: "0.95rem" }}>
                                  ${lineTotal}
                                </span>
                                {compareTotal && (
                                  <span className="text-decoration-line-through text-muted small">
                                    ${compareTotal}
                                  </span>
                                )}
                                {item.quantity > 1 && (
                                  <span className="text-muted" style={{ fontSize: "0.72rem" }}>
                                    (${itemPrice.toFixed(2)} ea)
                                  </span>
                                )}
                              </div>

                              {/* Qty stepper + remove */}
                              <div className="d-flex align-items-center gap-2">
                                <div
                                  className="d-flex align-items-center border rounded-pill overflow-hidden bg-light shadow-sm"
                                  style={{ height: 34 }}
                                >
                                  <button
                                    type="button"
                                    onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                                    className="btn btn-sm px-2 border-0 d-flex align-items-center h-100"
                                    aria-label="Decrease quantity"
                                    disabled={isUpdating}
                                  >
                                    <Minus size={13} />
                                  </button>
                                  <input
                                    type="number"
                                    min="1"
                                    max="999"
                                    value={item.quantity}
                                    onChange={(e) => {
                                      const v = parseInt(e.target.value, 10);
                                      if (!isNaN(v) && v > 0) handleQtyChange(item.id, v);
                                    }}
                                    onBlur={(e) => {
                                      const v = parseInt(e.target.value, 10);
                                      if (isNaN(v) || v <= 0) handleQtyChange(item.id, 1);
                                    }}
                                    className="form-control border-0 bg-transparent text-center fw-bold p-0"
                                    style={{ width: 34, fontSize: "0.85rem", MozAppearance: "textfield" }}
                                    disabled={isUpdating}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                                    className="btn btn-sm px-2 border-0 d-flex align-items-center h-100"
                                    aria-label="Increase quantity"
                                    disabled={isUpdating}
                                  >
                                    <Plus size={13} />
                                  </button>
                                </div>

                                {/* Spinner while updating */}
                                {isUpdating && (
                                  <span
                                    className="spinner-border spinner-border-sm text-warning"
                                    role="status"
                                    aria-hidden="true"
                                    style={{ width: 14, height: 14 }}
                                  />
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleRemove(item.id)}
                                  className="btn btn-sm text-danger border-0 p-1 d-flex align-items-center justify-content-center rounded-circle bg-light ms-auto hover-scale"
                                  style={{ width: 32, height: 32 }}
                                  aria-label="Remove item"
                                  disabled={isUpdating}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>

                    {/* ── Upsell Slot ────────────────────────────────────── */}
                    {upsellProduct && (
                      <div
                        className="p-3 rounded-4 border shadow-sm"
                        style={{
                          background: "linear-gradient(135deg,#fff8f3 0%,#fff 100%)",
                          borderColor: "rgba(245,118,26,0.25)",
                        }}
                      >
                        <p className="small fw-bold text-charcoal-dark mb-2 font-heading d-flex justify-content-between align-items-center">
                          <span>🔥 Complete Your Pack</span>
                          <span
                            className="badge rounded-pill"
                            style={{ background: "var(--zesty-orange)", color: "#fff", fontSize: "0.7rem" }}
                          >
                            Recommended
                          </span>
                        </p>
                        <div className="d-flex gap-3 align-items-center">
                          <div
                            className="rounded-3 bg-white d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{ width: 56, height: 56, border: "1px solid #f0f0f0" }}
                          >
                            {upsellProduct.image && (
                              <img
                                src={upsellProduct.image}
                                alt={upsellProduct.title}
                                className="w-100 h-100 object-fit-contain"
                                style={{ borderRadius: 8 }}
                                onError={(e) => { e.currentTarget.src = "/peteora.png"; }}
                              />
                            )}
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-0 small fw-bold text-dark" style={{ fontSize: "0.82rem" }}>
                              {upsellProduct.title}
                            </h6>
                            <span className="text-zesty-orange fw-bold small">${upsellProduct.price}</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleAddUpsell}
                            className={`btn btn-sm rounded-pill px-3 py-2 fw-bold d-inline-flex align-items-center gap-1 ${
                              addedUpsell ? "btn-success" : "btn-zesty-primary"
                            }`}
                            style={{ fontSize: "0.78rem", whiteSpace: "nowrap" }}
                          >
                            {addedUpsell ? (
                              <><Check size={13} /> Added!</>
                            ) : (
                              <><PlusCircle size={13} /> Add</>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── Footer: Order Summary + Checkout ─────────────────────── */}
              {!loading && lines.length > 0 && (
                <div
                  className="border-top bg-white px-3 pt-3 pb-2"
                  style={{
                    flexShrink: 0,
                    paddingBottom: `max(12px, env(safe-area-inset-bottom))`,
                  }}
                >
                  {/* Summary rows */}
                  <div className="d-flex flex-column gap-1 mb-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted small">
                        Subtotal ({totals.totalQty} {totals.totalQty === 1 ? "unit" : "units"})
                      </span>
                      <span className="fw-semibold text-dark small">${totals.subtotal.toFixed(2)}</span>
                    </div>

                    {totals.discountAmt > 0 && (
                      <div className="d-flex justify-content-between align-items-center text-success">
                        <span className="small">
                          Volume Discount ({Math.round(totals.discountPct * 100)}%)
                        </span>
                        <span className="fw-semibold small">-${totals.discountAmt.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted small">US Shipping</span>
                      <span className="small">
                        {totals.shipping === 0 ? (
                          <strong className="text-success">FREE Tracked</strong>
                        ) : (
                          "$4.95"
                        )}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted small">Estimated Tax</span>
                      <span className="text-muted small">$0.00</span>
                    </div>

                    <hr className="my-1" />

                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold font-heading text-dark">Total</span>
                      <span className="fw-bold fs-4 text-zesty-orange">
                        ${totals.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Shipping timer */}
                  <ShippingTimer />

                  {/* Checkout CTA */}
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={isRedirecting || lines.length === 0}
                    className={`w-100 rounded-pill-cta btn-zesty-primary d-flex align-items-center justify-content-center gap-2 py-3 mt-2 mb-2 shadow ${
                      isRedirecting ? "opacity-75" : ""
                    }`}
                    style={{ fontSize: "0.95rem" }}
                  >
                    {isRedirecting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                        <span>REDIRECTING TO SHOPIFY...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        <span className="fw-bold">PROCEED TO SECURE CHECKOUT</span>
                      </>
                    )}
                  </button>

                  {/* Trust note */}
                  <div
                    className="d-flex justify-content-center align-items-center gap-2 text-muted mb-1"
                    style={{ fontSize: "0.72rem" }}
                  >
                    <Shield size={12} className="text-success" />
                    <span>McAfee Secure • 256-Bit SSL Encrypted</span>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}
