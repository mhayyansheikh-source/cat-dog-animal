"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";

const CartContext = createContext();

// ─── Storage Keys ─────────────────────────────────────────────────────────────
const STORAGE_KEY = "peteora_cart_v2";
const CHECKOUT_KEY = "peteora_checkout_url";
// Legacy key used by older code — migrated on first load
const LEGACY_KEY = "peteora_flat_cart";

// ─── ID Utilities ─────────────────────────────────────────────────────────────

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

// ─── Normalizer ───────────────────────────────────────────────────────────────

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

/** Read items from storage, migrating legacy key on first call */
function readStorage() {
  try {
    if (typeof window === "undefined") return { items: [], checkoutUrl: null };

    // [C1-FIX] Migrate from legacy key if new key doesn't exist yet
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        // Migrate: copy to new key and remove old one
        localStorage.setItem(STORAGE_KEY, legacy);
        localStorage.removeItem(LEGACY_KEY);
        const parsed = JSON.parse(legacy);
        return {
          items: Array.isArray(parsed) ? parsed : [],
          checkoutUrl: localStorage.getItem(CHECKOUT_KEY) || null,
        };
      }
    }

    return {
      items: raw ? JSON.parse(raw) : [],
      checkoutUrl: localStorage.getItem(CHECKOUT_KEY) || null,
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


// ─── [S1-FIX] Pure function — no need to live inside CartProvider or be wrapped in useCallback.
// Being module-level makes it completely immune to stale closure bugs.
function processServerCart(cartData) {
  if (!cartData?.lines?.edges) return [];
  // Each edge = one unique line; do NOT accumulate quantities
  return cartData.lines.edges.map(normalizeCartLine).filter(Boolean);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }) {
  // Synchronous init from localStorage — no flash of empty cart on /cart
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window === "undefined") return [];
    return readStorage().items;
  });

  const [checkoutUrl, setCheckoutUrl] = useState(() => {
    if (typeof window === "undefined") return null;
    return readStorage().checkoutUrl;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const debounceTimers = useRef({});
  // Track the last known good cart ID to detect expiry
  const lastCartIdRef = useRef(null);


  // ── Commit items to state + localStorage atomically ────────────────────────
  const commit = useCallback((items, url = null) => {
    setCartItems(items);
    writeStorage(items, url);
    if (url !== null) setCheckoutUrl(url);
  }, []);

  // ── [S1-FIX] processServerCart is now a module-level pure function — removed from here ──

  // ── [C5-FIX] Background sync with Shopify on mount ────────────────────────
  // Merges server state with local optimistic items intelligently
  useEffect(() => {
    let mounted = true;
    const sync = async () => {
      setIsSyncing(true);
      try {
        const res = await fetch("/api/cart");
        const data = await res.json();

        if (!mounted) return;

        if (data?.cart?.id) {
          lastCartIdRef.current = data.cart.id;
          const fresh = processServerCart(data.cart);

          // Read current local items to check for pending temp items
          const local = readStorage().items;
          const hasPending = local.some((i) => i.id?.startsWith("temp-"));

          if (fresh.length > 0 && !hasPending) {
            // Server has items and nothing pending locally → use server state
            commit(fresh, data.cart.checkoutUrl || null);
          } else if (fresh.length > 0 && hasPending) {
            // Server has items but we also have pending temp items
            // Keep local state — pending sync effect below will reconcile
          } else if (fresh.length === 0 && !hasPending) {
            // Both empty — clear to keep in sync
            commit([], data.cart.checkoutUrl || null);
          }
          // If server is empty but we have pending items, do nothing here —
          // the pending sync effect below will POST them
        }
        // data.cart === null means no cart cookie → leave local items alone
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
  const addToCart = useCallback(
    async (product, variant, quantity = 1, redirect = true) => {
      const cleanVariantId = toCleanId(variant?.id);
      const fullMerchId = variant?.id?.toString().includes("gid://")
        ? variant.id
        : `gid://shopify/ProductVariant/${cleanVariantId}`;

      const price = parseFloat(variant?.price || "0");
      const compareAt = variant?.compare_at_price
        ? parseFloat(variant.compare_at_price)
        : null;
      const vTitle =
        variant?.title && variant.title !== "Default Title" ? variant.title : "";

      // Build the optimistic item
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const newItem = {
        id: tempId,
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
        image:
          variant?.image?.url ||
          variant?.image ||
          product?.images?.[0] ||
          "/peteora.png",
        price,
        compareAtPrice: compareAt,
        quantity,
      };

      // Compute next state from localStorage (not React state) to avoid stale closure
      const current = readStorage().items;
      const existingIdx = current.findIndex((item) => isMatch(item, cleanVariantId));
      const nextItems =
        existingIdx !== -1
          ? current.map((item, i) =>
              i === existingIdx
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          : [...current, newItem];

      // [C2-FIX] Write to localStorage AND React state BEFORE any async work
      commit(nextItems);
      toast.success(`${product?.title || "Product"} added to cart`);

      if (redirect && typeof window !== "undefined" && window.location.pathname !== "/cart") {
        // [C2-FIX] Fire POST with keepalive:true BEFORE navigating
        // keepalive ensures the browser completes this request even after page unload
        fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lines: [{ merchandiseId: fullMerchId, quantity }],
          }),
          keepalive: true, // ← critical: survives page navigation
        })
          .then((r) => r.json())
          .then((data) => {
            // Response arrives on the new /cart page — update items with real IDs
            if (data?.cart) {
              const fresh = processServerCart(data.cart);
              if (fresh.length > 0) {
                commit(fresh, data.cart.checkoutUrl || null);
              }
            }
          })
          .catch((err) => console.error("Pre-navigate cart POST error:", err));

        // Navigate immediately — keepalive fetch continues in background
        window.location.href = "/cart";
        return;
      }

      // Not redirecting — wait for the POST response normally
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
          commit(fresh, data.cart.checkoutUrl || null);
        }
      } catch (err) {
        console.error("Add to cart API error:", err);
      } finally {
        setIsSyncing(false);
      }
    },
    [commit] // processServerCart is module-level, not a dep
  );

  // ── 2. UPDATE QUANTITY ────────────────────────────────────────────────────
  const updateQuantity = useCallback(
    async (targetId, newQuantity) => {
      if (newQuantity <= 0) return removeFromCart(targetId);

      // Optimistic update — immediately reflect in UI and localStorage
      setCartItems((prev) => {
        const next = prev.map((item) =>
          isMatch(item, targetId) ? { ...item, quantity: newQuantity } : item
        );
        writeStorage(next);
        return next;
      });

      // Debounce the API call (400ms)
      const key = targetId.toString(); // use full ID as key, not just numeric tail [S3-FIX]
      clearTimeout(debounceTimers.current[key]);
      debounceTimers.current[key] = setTimeout(async () => {
        const current = readStorage().items;
        const targetItem = current.find((item) => isMatch(item, targetId));
        if (!targetItem) return;

        const isRealLine = targetItem.id?.startsWith("gid://shopify/CartLine");

        if (isRealLine) {
          // Normal path: update existing Shopify line
          setIsSyncing(true);
          try {
            const res = await fetch("/api/cart", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                lines: [{ id: targetItem.id, quantity: newQuantity }],
              }),
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
        } else {
          // [C4-FIX] Item still has temp ID → POST to create it on Shopify instead of silently skipping
          setIsSyncing(true);
          try {
            const res = await fetch("/api/cart", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                lines: [
                  {
                    merchandiseId: targetItem.merchandiseId,
                    quantity: newQuantity, // use the new desired quantity
                  },
                ],
              }),
            });
            const data = await res.json();
            if (data?.cart) {
              const fresh = processServerCart(data.cart);
              commit(fresh, data.cart.checkoutUrl || null);
            }
          } catch (err) {
            console.error("Temp-item update via POST error:", err);
          } finally {
            setIsSyncing(false);
          }
        }
      }, 400);
    },
    [commit] // processServerCart is module-level, not a dep
  );

  // ── 3. REMOVE FROM CART ───────────────────────────────────────────────────
  const removeFromCart = useCallback(
    async (targetId) => {
      // [S1b-FIX] Read removedItem synchronously from localStorage BEFORE commit.
      // Previous pattern (setCartItems functional updater + await Promise.resolve())
      // was a race: React's scheduler does not guarantee the updater runs within
      // a single microtask, so removedItem could still be null when the DELETE ran.
      const snapshot = readStorage().items;
      const removedItem = snapshot.find((item) => isMatch(item, targetId)) ?? null;
      const nextItems = snapshot.filter((item) => !isMatch(item, targetId));

      // Atomic commit: updates React state + localStorage in one call
      commit(nextItems);

      // Show undo toast with the item we just captured above
      if (removedItem) {
        toast(
          (t) => (
            <div className="d-flex align-items-center justify-content-between gap-3">
              <span className="small fw-semibold">Item removed from cart</span>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  // Re-insert the captured item into whatever is current at undo time
                  const atUndo = readStorage().items;
                  commit([...atUndo, removedItem]);
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
      // Prefer the Shopify CartLine GID; fall back to variant GID for temp items
      const lineId = removedItem?.id?.startsWith("gid://shopify/CartLine")
        ? removedItem.id
        : removedItem?.variantId
        ? `gid://shopify/ProductVariant/${removedItem.variantId}`
        : null;

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
          commit(processServerCart(data.cart), data.cart.checkoutUrl || null);
        }
      } catch (err) {
        console.error("Remove from cart error:", err);
      } finally {
        setIsSyncing(false);
      }
    },
    [commit]
  );

  // ── 4. CLEAR ──────────────────────────────────────────────────────────────
  // [S1c-FIX] Use commit() for consistency — updates state + storage atomically
  const clearCart = useCallback(() => {
    commit([]);
    try {
      localStorage.removeItem(CHECKOUT_KEY);
      localStorage.removeItem(LEGACY_KEY);
    } catch {}
  }, [commit]);

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
