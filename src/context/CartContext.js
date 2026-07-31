"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

const CartContext = createContext();

// Universal ID Normalizer
export function toCleanId(id) {
  if (!id) return "";
  const str = id.toString();
  const parts = str.split('/');
  return parts[parts.length - 1];
}

// Universal Item Matcher
export function isMatch(item, targetId) {
  if (!item || !targetId) return false;
  const cleanTarget = toCleanId(targetId);
  if (!cleanTarget) return false;

  return (
    toCleanId(item.id) === cleanTarget ||
    toCleanId(item.variantId) === cleanTarget ||
    toCleanId(item.merchandiseId) === cleanTarget
  );
}

// Standardized Item Normalizer for raw GraphQL nodes or custom objects
export function normalizeCartLine(edge) {
  const node = edge?.node || edge;
  if (!node) return null;

  const merch = node.merchandise || {};
  const prod = merch.product || {};
  const priceAmt = parseFloat(merch.price?.amount || "0");
  const compareAmt = merch.compareAtPrice?.amount ? parseFloat(merch.compareAtPrice.amount) : null;

  return {
    id: node.id || `temp-line-${Date.now()}`,
    variantId: toCleanId(merch.id),
    merchandiseId: merch.id || `gid://shopify/ProductVariant/${toCleanId(merch.id)}`,
    title: prod.title || merch.title || "Pet Product",
    variantTitle: merch.title !== "Default Title" ? (merch.title || "") : "",
    handle: prod.handle || "",
    image: merch.image?.url || prod.images?.edges?.[0]?.node?.url || "/peteora.png",
    price: priceAmt,
    compareAtPrice: compareAmt,
    quantity: node.quantity || 1,
  };
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const updateDebounceTimers = useRef({});

  // Helper to sync local state & localStorage cache
  const updateLocalItemsState = (items, newCheckoutUrl = null) => {
    setCartItems(items);
    if (newCheckoutUrl !== null) {
      setCheckoutUrl(newCheckoutUrl);
    }
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("peteora_flat_cart", JSON.stringify(items));
        if (newCheckoutUrl) {
          localStorage.setItem("peteora_checkout_url", newCheckoutUrl);
        }
      }
    } catch (e) {
      console.error("Failed to save local cart cache:", e);
    }
  };

  // Helper to convert GraphQL cart object to flat CleanCartItems
  const processServerCart = (cartData) => {
    if (!cartData?.lines?.edges) return [];
    
    const rawItems = cartData.lines.edges.map(normalizeCartLine).filter(Boolean);
    const variantMap = new Map();
    const cleanList = [];

    for (const item of rawItems) {
      const key = item.variantId || item.id;
      if (variantMap.has(key)) {
        const existing = variantMap.get(key);
        existing.quantity += item.quantity;
      } else {
        const clone = { ...item };
        variantMap.set(key, clone);
        cleanList.push(clone);
      }
    }

    return cleanList;
  };

  // Initial Load & Background Shopify Sync
  useEffect(() => {
    let mounted = true;

    // 1. Instant 0ms cache load
    try {
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("peteora_flat_cart");
        const cachedUrl = localStorage.getItem("peteora_checkout_url");
        if (cached) {
          setCartItems(JSON.parse(cached));
          if (cachedUrl) setCheckoutUrl(cachedUrl);
          setIsSyncing(false);
        }
      }
    } catch (e) {
      console.error("Failed to load local cart cache", e);
    }

    // 2. Background Shopify Sync
    const syncWithServer = async () => {
      try {
        const res = await fetch('/api/cart');
        const data = await res.json();
        if (mounted && data?.cart) {
          const freshItems = processServerCart(data.cart);
          updateLocalItemsState(freshItems, data.cart.checkoutUrl || null);
        }
      } catch (err) {
        console.error("Failed to sync cart with Shopify API:", err);
      } finally {
        if (mounted) setIsSyncing(false);
      }
    };

    syncWithServer();
    return () => { mounted = false; };
  }, []);

  // 1. CREATE (Add to Cart)
  const addToCart = async (product, variant, quantity = 1, redirect = true) => {
    const targetVariantId = toCleanId(variant.id);
    const fullMerchId = variant.id?.toString().includes("gid://") 
      ? variant.id 
      : `gid://shopify/ProductVariant/${targetVariantId}`;

    // A. Instant 0ms Optimistic Local State Update
    const currentItems = [...cartItems];
    const matchIndex = currentItems.findIndex(item => isMatch(item, targetVariantId));

    if (matchIndex !== -1) {
      currentItems[matchIndex] = {
        ...currentItems[matchIndex],
        quantity: currentItems[matchIndex].quantity + quantity
      };
    } else {
      currentItems.push({
        id: `temp-line-${Date.now()}-${Math.random()}`,
        variantId: targetVariantId,
        merchandiseId: fullMerchId,
        title: product.title,
        variantTitle: variant.title !== "Default Title" ? (variant.title || "") : "",
        handle: product.handle || "",
        image: variant.image?.url || variant.image || product.images?.[0] || "/peteora.png",
        price: parseFloat(variant.price || "0"),
        compareAtPrice: variant.compare_at_price ? parseFloat(variant.compare_at_price) : null,
        quantity: quantity
      });
    }

    updateLocalItemsState(currentItems);
    toast.success(`${product.title} added to cart`);

    // B. Immediate Redirect if on product page
    if (redirect && typeof window !== "undefined" && window.location.pathname !== "/cart") {
      window.location.href = "/cart";
    }

    // C. Background Shopify Sync
    setIsSyncing(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines: [{ merchandiseId: fullMerchId, quantity }] })
      });
      const response = await res.json();
      if (response?.cart) {
        const freshItems = processServerCart(response.cart);
        updateLocalItemsState(freshItems, response.cart.checkoutUrl || null);
      }
    } catch (err) {
      console.error("Add to cart sync error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // 2. UPDATE (Quantity Adjustment)
  const updateQuantity = async (targetId, newQuantity) => {
    if (newQuantity <= 0) {
      return removeFromCart(targetId);
    }

    // A. Instant 0ms Optimistic UI Update
    const updatedItems = cartItems.map(item => {
      if (isMatch(item, targetId)) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    updateLocalItemsState(updatedItems);

    // B. Debounced 300ms Background Shopify Sync
    const cleanTargetId = toCleanId(targetId);
    if (updateDebounceTimers.current[cleanTargetId]) {
      clearTimeout(updateDebounceTimers.current[cleanTargetId]);
    }

    updateDebounceTimers.current[cleanTargetId] = setTimeout(async () => {
      setIsSyncing(true);
      try {
        const targetItem = cartItems.find(item => isMatch(item, targetId));
        const lineIdToSend = targetItem?.id?.startsWith("gid://") ? targetItem.id : targetItem?.variantId;

        const res = await fetch('/api/cart', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lines: [{ id: lineIdToSend, quantity: newQuantity }] })
        });
        const response = await res.json();
        if (response?.cart) {
          const freshItems = processServerCart(response.cart);
          updateLocalItemsState(freshItems, response.cart.checkoutUrl || null);
        }
      } catch (err) {
        console.error("Update quantity sync error:", err);
      } finally {
        setIsSyncing(false);
      }
    }, 300);
  };

  // 3. DELETE (Remove Line Item)
  const removeFromCart = async (targetId) => {
    const removedItem = cartItems.find(item => isMatch(item, targetId));
    const filteredItems = cartItems.filter(item => !isMatch(item, targetId));

    // A. Instant 0ms Optimistic Deletion
    updateLocalItemsState(filteredItems);

    // B. 4-Second Undo Toast
    if (removedItem) {
      toast(
        (t) => (
          <div className="d-flex align-items-center justify-content-between gap-3">
            <span className="small fw-semibold">Item removed from cart</span>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                updateLocalItemsState([...cartItems, removedItem]);
              }}
              className="btn btn-sm btn-dark rounded-pill py-1 px-3 fw-bold text-warning hover-scale"
              style={{ fontSize: "12px" }}
            >
              Undo
            </button>
          </div>
        ),
        { duration: 4000 }
      );
    }

    // C. Background Shopify Delete Request
    setIsSyncing(true);
    try {
      const lineIdToSend = removedItem?.id?.startsWith("gid://") ? removedItem.id : removedItem?.variantId;

      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineIds: [lineIdToSend] })
      });
      const response = await res.json();
      if (response?.cart) {
        const freshItems = processServerCart(response.cart);
        updateLocalItemsState(freshItems, response.cart.checkoutUrl || null);
      }
    } catch (err) {
      console.error("Remove from cart sync error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // 4. CLEAR CART
  const clearCart = () => {
    updateLocalItemsState([], null);
  };

  // Derived Financial Calculations
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let calculatedTotal = subtotal;
  let discountAmount = 0;
  
  if (cartCount >= 3) {
    calculatedTotal = subtotal * 0.85;
  } else if (cartCount === 2) {
    calculatedTotal = subtotal * 0.90;
  }
  
  discountAmount = subtotal - calculatedTotal;

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
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
