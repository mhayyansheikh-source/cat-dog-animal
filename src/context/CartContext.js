"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { toast } from "react-hot-toast";

const CartContext = createContext();

// ─── Utilities ────────────────────────────────────────────────────────────────
// Exported so CartSheet (and other consumers) can import them directly.

/** Extract the numeric tail from a Shopify GID — e.g. "gid://shopify/ProductVariant/123" → "123" */
export function toCleanId(id) {
  if (!id) return "";
  return id.toString().split("/").pop();
}

/** True if `item` matches `targetId` by any of the ID fields it may carry. */
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

/**
 * Normalize a single Shopify cart line edge (or bare node) into a flat object
 * that CartSheet and other components can render directly.
 */
export function normalizeCartLine(edge) {
  const node = edge?.node || edge;
  if (!node) return null;

  const merch = node.merchandise || {};
  const prod = merch.product || {};
  const price = parseFloat(merch.price?.amount || "0");
  const compareAt = merch.compareAtPrice?.amount
    ? parseFloat(merch.compareAtPrice.amount)
    : null;
  const vTitle =
    merch.title && merch.title !== "Default Title" ? merch.title : "";

  return {
    id: node.id,                              // real Shopify CartLine GID — never a temp-id
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
    image:
      merch.image?.url ||
      prod.images?.edges?.[0]?.node?.url ||
      "/peteora.png",
    price,
    compareAtPrice: compareAt,
    quantity: node.quantity || 1,
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  // cartCount powers the Header badge only.
  // CartSheet owns the full cart data after the sheet opens.
  const [cartCount, setCartCount] = useState(0);

  // Incrementing this tells CartSheet to refetch from Shopify.
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const triggerRefetch = useCallback(
    () => setRefetchTrigger((n) => n + 1),
    []
  );

  // ── Restore badge count on mount (Shopify cookie may already exist) ─────────
  useEffect(() => {
    let cancelled = false;
    fetch("/api/cart")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const count =
          data?.cart?.lines?.edges?.reduce(
            (s, e) => s + (e.node?.quantity ?? 0),
            0
          ) ?? 0;
        setCartCount(count);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // ── addToCart ─────────────────────────────────────────────────────────────
  // Called by ProductDetailsClient, ProductCard, DosageFinder, DirectCheckoutBar.
  // Signature kept identical so none of those components need changes.
  const addToCart = useCallback(
    async (product, variant, quantity = 1) => {
      const cleanId = toCleanId(variant?.id);
      const fullId =
        variant?.id?.toString().includes("gid://")
          ? variant.id
          : `gid://shopify/ProductVariant/${cleanId}`;

      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lines: [{ merchandiseId: fullId, quantity }],
          }),
        });
        const data = await res.json();

        if (data?.cart) {
          // Update badge from the authoritative Shopify response
          const newCount =
            data.cart.lines?.edges?.reduce(
              (s, e) => s + (e.node?.quantity ?? 0),
              0
            ) ?? 0;
          setCartCount(newCount);

          // Tell CartSheet to reload its own data
          triggerRefetch();

          // Auto-open CartSheet so the user sees the updated cart (Q1 ✅)
          setIsCartOpen(true);

          toast.success(
            `${product?.title || "Product"} added to cart! 🐾`,
            { duration: 2500 }
          );
        } else {
          toast.error("Could not add item. Please try again.");
        }
      } catch (err) {
        console.error("[CartContext] addToCart error:", err);
        toast.error("Connection error. Please try again.");
      }
    },
    [triggerRefetch]
  );

  return (
    <CartContext.Provider
      value={{
        // Sheet open/close
        isCartOpen,
        setIsCartOpen,

        // Header badge
        cartCount,
        setCartCount,          // CartSheet updates this after mutations

        // Product page add
        addToCart,

        // Sheet ↔ context sync
        refetchTrigger,
        triggerRefetch,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart must be used within a CartProvider");
  return context;
}
