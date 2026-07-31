"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";

const CartContext = createContext();

// ─── Storage Key ──────────────────────────────────────────────────────────────
const STORAGE_KEY = "peteora_cart_v2";
const CHECKOUT_KEY = "peteora_checkout_url";

// ─── ID Utilities ────────────────────────────────────────────────────────────

export function toCleanId(id) {
  if (!id) return "";
  return id.toString().split("/").pop();
}

export function isMatch(item, targetId) {
  if (!item || !targetId) return false;
  const t = toCleanId(targetId);
  if (!t) return false;
  return (
    toCleanId(item.id) === t ||
    toCleanId(item.variantId) === t ||
    toCleanId(item.merchandiseId) === t ||
    toCleanId(item.variant?.id) === t
  );
}

// ─── Normalizer ──────────────────────────────────────────────────────────────

export function normalizeCartLine(edge) {
  const node = edge?.node || edge;
  if (!node) return null;

  const merch = node.merchandise || {};
  const prod = merch.product || {};
  const price = parseFloat(merch.price?.amount || "0");
  const compareAt = merch.compareAtPrice?.amount
    ? parseFloat(merch.compareAtPrice.amount)
    : null;
  const vTitle = merch.title && merch.title !== "Default Title" ? merch.title : "";

  return {
    id: node.id || `temp-${Date.now()}`,
    variantId: toCleanId(merch.id),
    merchandiseId: merch.id || `gid://shopify/ProductVariant/${toCleanId(merch.id)}`,
    title: prod.title || merch.title || "Pet Product",
    variantTitle: vTitle,
    variant: {
      id: merch.id || "",
      title: merch.title || "Default Title",
      price,
      compare_at_price: compareAt,
    },
    handle: prod.handle || "",
    image: merch.image?.url || prod.images?.edges?.[0]?.node?.url || "/peteora.png",
    price,
    compareAtPrice: compareAt,
    quantity: node.quantity || 1,
  };
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

function readStorage() {
  try {
    if (typeof window === "undefined") return { items: [], checkoutUrl: null };
    const raw = localStorage.getItem(STORAGE_KEY);
    const url = localStorage.getItem(CHECKOUT_KEY);
    return {
      items: raw ? JSON.parse(raw) : [],
      checkoutUrl: url || null,
    };
  } catch {
    return { items: [], checkoutUrl: null };
  }
}

function writeStorage(items, checkoutUrl = null) {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    if (checkoutUrl) localStorage.setItem(CHECKOUT_KEY, checkoutUrl);
  } catch (e) {
    console.error("Cart storage write error:", e);
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }) {
  // Start with localStorage data synchronously to avoid flash of empty cart
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [checkoutUrl, setCheckoutUrl] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(CHECKOUT_KEY) || null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const debounceTimers = useRef({});

  // ── Commit items to both state and localStorage atomically ─────────────────
  const commit = useCallback((items, url = null) => {
    setCartItems(items);
    writeStorage(items, url);
    if (url) setCheckoutUrl(url);
  }, []);

  // ── Shopify server cart → flat item list ───────────────────────────────────
  const processServerCart = useCallback((cartData) => {
    if (!cartData?.lines?.edges) return [];
    // No accumulation – each Shopify edge = one unique line
    return cartData.lines.edges.map(normalizeCartLine).filter(Boolean);
  }, []);

  // ── Background sync with Shopify on mount (reconcile) ─────────────────────
  useEffect(() => {
    let mounted = true;
    const sync = async () => {
      setIsSyncing(true);
      try {
        const res = await fetch("/api/cart");
        const data = await res.json();
        if (mounted && data?.cart) {
          const fresh = processServerCart(data.cart);
          // Only replace if server has items, otherwise keep localStorage items
          if (fresh.length > 0) {
            commit(fresh, data.cart.checkoutUrl || null);
          }
        }
      } catch (err) {
        console.error("Cart initial sync error:", err);
      } finally {
        if (mounted) setIsSyncing(false);
      }
    };
    sync();
    return () => { mounted = false; };
  }, []);

  // ── 1. ADD TO CART ────────────────────────────────────────────────────────
  const addToCart = useCallback(async (product, variant, quantity = 1, redirect = true) => {
    const cleanVariantId = toCleanId(variant?.id);
    const fullMerchId = variant?.id?.toString().includes("gid://")
      ? variant.id
      : `gid://shopify/ProductVariant/${cleanVariantId}`;

    const price = parseFloat(variant?.price || "0");
    const compareAt = variant?.compare_at_price ? parseFloat(variant.compare_at_price) : null;
    const vTitle = variant?.title && variant.title !== "Default Title" ? variant.title : "";

    // 1. Build optimistic item
    const newItem = {
      id: `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      variantId: cleanVariantId,
      merchandiseId: fullMerchId,
      title: product?.title || "Pet Product",
      variantTitle: vTitle,
      variant: {
        id: fullMerchId,
        title: variant?.title || "Default Title",
        price,
        compare_at_price: compareAt,
      },
      handle: product?.handle || "",
      image: variant?.image?.url || variant?.image || product?.images?.[0] || "/peteora.png",
      price,
      compareAtPrice: compareAt,
      quantity,
    };

    // 2. Compute next cart state
    const current = readStorage().items;
    const existingIdx = current.findIndex((item) => isMatch(item, cleanVariantId));
    let nextItems;
    if (existingIdx !== -1) {
      nextItems = current.map((item, i) =>
        i === existingIdx ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      nextItems = [...current, newItem];
    }

    // 3. Write to localStorage AND state BEFORE navigating
    commit(nextItems);

    toast.success(`${product?.title || "Product"} added to cart`);

    // 4. Navigate (localStorage is already written, cart page will read it)
    if (redirect && typeof window !== "undefined" && window.location.pathname !== "/cart") {
      window.location.href = "/cart";
      return; // Stop here – page navigates away, no need to await API
    }

    // 5. Background Shopify POST (only runs if not redirecting)
    setIsSyncing(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: [{ merchandiseId: fullMerchId, quantity }] }),
      });
      const data = await res.json();
      if (data?.cart) {
        const fresh = processServerCart(data.cart);
        commit(fresh, data.cart.checkoutUrl || null);
      }
    } catch (err) {
      console.error("Add to cart API error:", err);
    } finally {
      setIsSyncing(false);
    }
  }, [commit, processServerCart]);

  // ── 2. UPDATE QUANTITY ────────────────────────────────────────────────────
  const updateQuantity = useCallback(async (targetId, newQuantity) => {
    if (newQuantity <= 0) return removeFromCart(targetId);

    // Optimistic update to state + localStorage
    setCartItems((prev) => {
      const next = prev.map((item) =>
        isMatch(item, targetId) ? { ...item, quantity: newQuantity } : item
      );
      writeStorage(next);
      return next;
    });

    // Debounced API call
    const key = toCleanId(targetId);
    clearTimeout(debounceTimers.current[key]);
    debounceTimers.current[key] = setTimeout(async () => {
      // Read fresh state to get correct line id
      const current = readStorage().items;
      const targetItem = current.find((item) => isMatch(item, targetId));
      if (!targetItem) return;

      const lineId = targetItem.id?.startsWith("gid://shopify/CartLine")
        ? targetItem.id
        : null;

      if (!lineId) {
        // temp id still – POST to Shopify instead of update
        // (will be resolved on next background sync)
        return;
      }

      setIsSyncing(true);
      try {
        const res = await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lines: [{ id: lineId, quantity: newQuantity }] }),
        });
        const data = await res.json();
        if (data?.cart) {
          const fresh = processServerCart(data.cart);
          commit(fresh, data.cart.checkoutUrl || null);
        }
      } catch (err) {
        console.error("Update quantity API error:", err);
      } finally {
        setIsSyncing(false);
      }
    }, 400);
  }, [commit, processServerCart]);

  // ── 3. REMOVE FROM CART ───────────────────────────────────────────────────
  const removeFromCart = useCallback(async (targetId) => {
    const current = readStorage().items;
    const removedItem = current.find((item) => isMatch(item, targetId));
    const next = current.filter((item) => !isMatch(item, targetId));

    commit(next);

    if (removedItem) {
      toast(
        (t) => (
          <div className="d-flex align-items-center justify-content-between gap-3">
            <span className="small fw-semibold">Item removed from cart</span>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                const restored = [...readStorage().items, removedItem];
                commit(restored);
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
        commit(fresh, data.cart.checkoutUrl || null);
      }
    } catch (err) {
      console.error("Remove from cart error:", err);
    } finally {
      setIsSyncing(false);
    }
  }, [commit, processServerCart]);

  // ── 4. CLEAR ──────────────────────────────────────────────────────────────
  const clearCart = useCallback(() => {
    commit([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CHECKOUT_KEY);
    } catch {}
  }, [commit]);

  // ── POST add-to-cart Shopify sync (runs on /cart page load) ───────────────
  // When user lands on /cart after redirect, the temp item is in localStorage.
  // We now fire the Shopify POST to register the item and get real line IDs.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.pathname !== "/cart") return;

    const pendingItems = cartItems.filter((item) => item.id?.startsWith("temp-"));
    if (pendingItems.length === 0) return;

    let mounted = true;
    const syncPending = async () => {
      setIsSyncing(true);
      for (const item of pendingItems) {
        try {
          const res = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lines: [{ merchandiseId: item.merchandiseId, quantity: item.quantity }],
            }),
          });
          const data = await res.json();
          if (mounted && data?.cart) {
            const fresh = processServerCart(data.cart);
            if (fresh.length > 0) {
              commit(fresh, data.cart.checkoutUrl || null);
              break; // All items synced via one cart response
            }
          }
        } catch (err) {
          console.error("Pending item sync error:", err);
        }
      }
      if (mounted) setIsSyncing(false);
    };

    syncPending();
    return () => { mounted = false; };
  }, []); // Only on initial mount of /cart

  // ── Derived totals ────────────────────────────────────────────────────────
  const cartCount = cartItems.reduce((s, i) => s + (i.quantity || 0), 0);
  const subtotal = cartItems.reduce(
    (s, i) => s + (i.price || i.variant?.price || 0) * (i.quantity || 0),
    0
  );

  let calculatedTotal = subtotal;
  if (cartCount >= 3) calculatedTotal = subtotal * 0.85;
  else if (cartCount === 2) calculatedTotal = subtotal * 0.9;
  const discountAmount = subtotal - calculatedTotal;

  if (calculatedTotal > 0 && calculatedTotal < 35) calculatedTotal += 4.95;
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
