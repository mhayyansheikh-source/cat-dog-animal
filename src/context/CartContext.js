"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

const CartContext = createContext();

// ─── ID Utilities ────────────────────────────────────────────────────────────

/** Strip GID prefix → plain numeric string: "gid://shopify/ProductVariant/123" → "123" */
export function toCleanId(id) {
  if (!id) return "";
  const str = id.toString();
  const parts = str.split("/");
  return parts[parts.length - 1];
}

/** True if `item` matches the given targetId (by line id, variantId, or merchandiseId) */
export function isMatch(item, targetId) {
  if (!item || !targetId) return false;
  const cleanTarget = toCleanId(targetId);
  if (!cleanTarget) return false;
  return (
    toCleanId(item.id) === cleanTarget ||
    toCleanId(item.variantId) === cleanTarget ||
    toCleanId(item.merchandiseId) === cleanTarget ||
    toCleanId(item.variant?.id) === cleanTarget
  );
}

// ─── Normalizer ──────────────────────────────────────────────────────────────

/** Convert a raw Shopify GraphQL cart-line edge/node to a flat clean item */
export function normalizeCartLine(edge) {
  const node = edge?.node || edge;
  if (!node) return null;

  const merch = node.merchandise || {};
  const prod = merch.product || {};
  const priceAmt = parseFloat(merch.price?.amount || "0");
  const compareAmt = merch.compareAtPrice?.amount
    ? parseFloat(merch.compareAtPrice.amount)
    : null;
  const vTitle =
    merch.title && merch.title !== "Default Title" ? merch.title : "";

  return {
    id: node.id || `temp-line-${Date.now()}`,
    variantId: toCleanId(merch.id),
    merchandiseId:
      merch.id ||
      `gid://shopify/ProductVariant/${toCleanId(merch.id)}`,
    title: prod.title || merch.title || "Pet Product",
    variantTitle: vTitle,
    variant: {
      id: merch.id || "",
      title: merch.title || "Default Title",
      price: priceAmt,
      compare_at_price: compareAmt,
    },
    handle: prod.handle || "",
    image:
      merch.image?.url ||
      prod.images?.edges?.[0]?.node?.url ||
      "/peteora.png",
    price: priceAmt,
    compareAtPrice: compareAmt,
    quantity: node.quantity || 1,
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);
  const [checkoutUrl, setCheckoutUrl] = useState(null);

  // Debounce timers per line id
  const debounceTimers = useRef({});

  // ── Local state + localStorage helper ──────────────────────────────────────
  const saveItems = (items, newCheckoutUrl = null) => {
    setCartItems(items);
    if (newCheckoutUrl !== null) setCheckoutUrl(newCheckoutUrl);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("peteora_flat_cart", JSON.stringify(items));
        if (newCheckoutUrl)
          localStorage.setItem("peteora_checkout_url", newCheckoutUrl);
      }
    } catch (e) {
      console.error("Failed to save cart to localStorage:", e);
    }
  };

  // ── Convert server GraphQL cart → flat array (NO accumulation) ─────────────
  const processServerCart = (cartData) => {
    if (!cartData?.lines?.edges) return [];
    // Each edge is already one unique line – do NOT sum quantities.
    return cartData.lines.edges.map(normalizeCartLine).filter(Boolean);
  };

  // ── Initial load from localStorage + background Shopify sync ───────────────
  useEffect(() => {
    let mounted = true;

    // 1. Instant load from cache
    try {
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("peteora_flat_cart");
        const cachedUrl = localStorage.getItem("peteora_checkout_url");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) setCartItems(parsed);
          if (cachedUrl) setCheckoutUrl(cachedUrl);
          setIsSyncing(false);
        }
      }
    } catch (e) {
      console.error("Failed to read cart cache:", e);
    }

    // 2. Background Shopify sync
    const syncWithServer = async () => {
      try {
        const res = await fetch("/api/cart");
        const data = await res.json();
        if (mounted && data?.cart) {
          const fresh = processServerCart(data.cart);
          saveItems(fresh, data.cart.checkoutUrl || null);
        }
      } catch (err) {
        console.error("Cart sync error:", err);
      } finally {
        if (mounted) setIsSyncing(false);
      }
    };

    syncWithServer();
    return () => {
      mounted = false;
    };
  }, []);

  // ── 1. CREATE ─────────────────────────────────────────────────────────────
  const addToCart = async (product, variant, quantity = 1, redirect = true) => {
    const cleanVariantId = toCleanId(variant?.id);
    const fullMerchId = variant?.id?.toString().includes("gid://")
      ? variant.id
      : `gid://shopify/ProductVariant/${cleanVariantId}`;

    const priceNum = parseFloat(variant?.price || "0");
    const compareNum = variant?.compare_at_price
      ? parseFloat(variant.compare_at_price)
      : null;
    const vTitle =
      variant?.title && variant.title !== "Default Title"
        ? variant.title
        : "";

    // Optimistic update
    setCartItems((prev) => {
      const idx = prev.findIndex((item) => isMatch(item, cleanVariantId));
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [
        ...prev,
        {
          id: `temp-line-${Date.now()}-${Math.random()}`,
          variantId: cleanVariantId,
          merchandiseId: fullMerchId,
          title: product?.title || "Pet Product",
          variantTitle: vTitle,
          variant: {
            id: fullMerchId,
            title: variant?.title || "Default Title",
            price: priceNum,
            compare_at_price: compareNum,
          },
          handle: product?.handle || "",
          image:
            variant?.image?.url ||
            variant?.image ||
            product?.images?.[0] ||
            "/peteora.png",
          price: priceNum,
          compareAtPrice: compareNum,
          quantity,
        },
      ];
    });

    toast.success(`${product?.title || "Product"} added to cart`);

    if (redirect && typeof window !== "undefined" && window.location.pathname !== "/cart") {
      window.location.href = "/cart";
    }

    // Background Shopify POST
    setIsSyncing(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: [{ merchandiseId: fullMerchId, quantity }],
        }),
      });
      const data = await res.json();
      if (data?.cart) {
        const fresh = processServerCart(data.cart);
        saveItems(fresh, data.cart.checkoutUrl || null);
      }
    } catch (err) {
      console.error("Add to cart API error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // ── 2. UPDATE ─────────────────────────────────────────────────────────────
  const updateQuantity = async (targetId, newQuantity) => {
    if (newQuantity <= 0) {
      return removeFromCart(targetId);
    }

    // Optimistic: immediately set the exact new quantity in state
    setCartItems((prev) =>
      prev.map((item) =>
        isMatch(item, targetId) ? { ...item, quantity: newQuantity } : item
      )
    );

    // Debounce the API call; use functional setCartItems to read fresh state
    const cleanKey = toCleanId(targetId);
    if (debounceTimers.current[cleanKey]) {
      clearTimeout(debounceTimers.current[cleanKey]);
    }

    debounceTimers.current[cleanKey] = setTimeout(() => {
      // Read current items from functional updater to avoid stale closure
      setCartItems((prev) => {
        const targetItem = prev.find((item) => isMatch(item, targetId));
        if (!targetItem) return prev;

        // Must send CartLine GID for Shopify to identify the line
        const lineId = targetItem.id?.startsWith("gid://shopify/CartLine")
          ? targetItem.id
          : null;

        if (!lineId) {
          // Line still has temp id – skip API; the next addToCart will reconcile
          return prev;
        }

        setIsSyncing(true);
        fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lines: [{ id: lineId, quantity: newQuantity }] }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data?.cart) {
              const fresh = processServerCart(data.cart);
              saveItems(fresh, data.cart.checkoutUrl || null);
            }
          })
          .catch((err) => console.error("Update quantity API error:", err))
          .finally(() => setIsSyncing(false));

        return prev; // state is already optimistic; server response will correct it
      });
    }, 400);
  };

  // ── 3. DELETE ─────────────────────────────────────────────────────────────
  const removeFromCart = async (targetId) => {
    // Capture item before removing
    const removedItem = cartItems.find((item) => isMatch(item, targetId));

    // Optimistic removal
    setCartItems((prev) => prev.filter((item) => !isMatch(item, targetId)));

    // Undo toast
    if (removedItem) {
      toast(
        (t) => (
          <div className="d-flex align-items-center justify-content-between gap-3">
            <span className="small fw-semibold">Item removed from cart</span>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                setCartItems((prev) => [...prev, removedItem]);
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

    // Background Shopify DELETE
    const lineId = removedItem?.id?.startsWith("gid://shopify/CartLine")
      ? removedItem.id
      : removedItem?.variantId;

    if (!lineId) return;

    setIsSyncing(true);
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineIds: [lineId] }),
      });
      const data = await res.json();
      if (data?.cart) {
        const fresh = processServerCart(data.cart);
        saveItems(fresh, data.cart.checkoutUrl || null);
      }
    } catch (err) {
      console.error("Remove from cart API error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // ── 4. CLEAR ──────────────────────────────────────────────────────────────
  const clearCart = () => {
    saveItems([], null);
  };

  // ── Derived totals ─────────────────────────────────────────────────────────
  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + (item.price || item.variant?.price || 0) * (item.quantity || 0),
    0
  );

  let calculatedTotal = subtotal;
  if (cartCount >= 3) {
    calculatedTotal = subtotal * 0.85;
  } else if (cartCount === 2) {
    calculatedTotal = subtotal * 0.9;
  }
  const discountAmount = subtotal - calculatedTotal;

  const shippingThreshold = 35.0;
  if (calculatedTotal > 0 && calculatedTotal < shippingThreshold) {
    calculatedTotal += 4.95;
  }
  const total = calculatedTotal;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        discountAmount,
        total,
        checkoutUrl,
        isSyncing,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
