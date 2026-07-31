"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

const CartContext = createContext();

function extractId(gidOrId) {
  if (!gidOrId) return "";
  const str = gidOrId.toString();
  const parts = str.split('/');
  return parts[parts.length - 1];
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);
  const updateDebounceTimers = useRef({});

  // Initialize cart from localStorage + Shopify API
  useEffect(() => {
    let mounted = true;

    // 1. Instant load from localStorage
    try {
      const savedCart = localStorage.getItem("peteora_local_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
        setIsSyncing(false);
      }
    } catch (e) {
      console.error("Failed to load local cart cache", e);
    }

    // 2. Background sync with Shopify API
    const fetchCart = async () => {
      try {
        const res = await fetch('/api/cart');
        const data = await res.json();
        if (mounted && data?.cart) {
          setCart(data.cart);
          localStorage.setItem("peteora_local_cart", JSON.stringify(data.cart));
        }
      } catch (error) {
        console.error("Failed to sync cart with Shopify:", error);
      } finally {
        if (mounted) setIsSyncing(false);
      }
    };

    fetchCart();
    return () => { mounted = false; };
  }, []);

  // Save cart changes to localStorage for 0ms page transitions
  const updateLocalCartState = (newCart) => {
    setCart(newCart);
    try {
      if (newCart) {
        localStorage.setItem("peteora_local_cart", JSON.stringify(newCart));
      } else {
        localStorage.removeItem("peteora_local_cart");
      }
    } catch (e) {
      console.error("Failed to save local cart", e);
    }
  };

  const addToCart = async (product, variant, quantity = 1) => {
    setIsCartOpen(true);
    const targetVariantId = extractId(variant.id);

    // 1. Instant 0ms Optimistic Update
    updateLocalCartState(prev => {
      const existingEdges = prev?.lines?.edges ? [...prev.lines.edges] : [];
      const matchIndex = existingEdges.findIndex(
        e => extractId(e.node?.merchandise?.id) === targetVariantId
      );

      if (matchIndex !== -1) {
        const existingNode = existingEdges[matchIndex].node;
        existingEdges[matchIndex] = {
          ...existingEdges[matchIndex],
          node: {
            ...existingNode,
            quantity: existingNode.quantity + quantity
          }
        };
      } else {
        const tempLineId = `temp-line-${Date.now()}-${Math.random()}`;
        existingEdges.push({
          node: {
            id: tempLineId,
            quantity: quantity,
            merchandise: {
              id: variant.id,
              title: variant.title || "Default Title",
              price: { amount: (variant.price || 0).toString() },
              compareAtPrice: variant.compare_at_price ? { amount: variant.compare_at_price.toString() } : null,
              image: { url: variant.image?.url || variant.image || product.images?.[0] || "" },
              product: {
                title: product.title,
                handle: product.handle,
                images: { edges: [{ node: { url: product.images?.[0] || "" } }] }
              }
            }
          }
        });
      }

      return {
        ...prev,
        lines: { edges: existingEdges }
      };
    });

    toast.success(`${product.title} added to cart`);

    // 2. Background Shopify Sync
    setIsSyncing(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines: [{ merchandiseId: variant.id, quantity }] })
      });
      const response = await res.json();

      if (response?.cart) {
        updateLocalCartState(response.cart);
      }
    } catch (error) {
      console.error("Add to cart sync error:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const removeFromCart = async (lineId) => {
    let removedEdge = null;
    updateLocalCartState(prev => {
      if (!prev?.lines?.edges) return prev;
      removedEdge = prev.lines.edges.find(edge => edge.node.id === lineId);
      return {
        ...prev,
        lines: {
          ...prev.lines,
          edges: prev.lines.edges.filter(edge => edge.node.id !== lineId)
        }
      };
    });

    if (removedEdge) {
      toast(
        (t) => (
          <div className="d-flex align-items-center justify-content-between gap-3">
            <span className="small fw-semibold">Item removed from cart</span>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                updateLocalCartState(prev => {
                  const edges = prev?.lines?.edges ? [...prev.lines.edges, removedEdge] : [removedEdge];
                  return { ...prev, lines: { edges } };
                });
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

    setIsSyncing(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineIds: [lineId] })
      });
      const response = await res.json();
      if (response?.cart) {
        updateLocalCartState(response.cart);
      }
    } catch (error) {
      console.error("Remove from cart sync error:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const updateQuantity = async (lineId, newQuantity) => {
    if (newQuantity <= 0) {
      return removeFromCart(lineId);
    }

    // 1. Instant 0ms Optimistic UI update
    updateLocalCartState(prev => {
      if (!prev?.lines?.edges) return prev;
      return {
        ...prev,
        lines: {
          ...prev.lines,
          edges: prev.lines.edges.map(edge => {
            if (edge.node.id === lineId) {
              return {
                ...edge,
                node: {
                  ...edge.node,
                  quantity: newQuantity
                }
              };
            }
            return edge;
          })
        }
      };
    });

    // 2. Debounced 350ms background sync with Shopify API
    if (updateDebounceTimers.current[lineId]) {
      clearTimeout(updateDebounceTimers.current[lineId]);
    }

    updateDebounceTimers.current[lineId] = setTimeout(async () => {
      setIsSyncing(true);
      try {
        const res = await fetch('/api/cart', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lines: [{ id: lineId, quantity: newQuantity }] })
        });
        const response = await res.json();
        if (response?.cart) {
          updateLocalCartState(response.cart);
        }
      } catch (error) {
        console.error("Update quantity sync error:", error);
      } finally {
        setIsSyncing(false);
      }
    }, 350);
  };

  const clearCart = () => {
    updateLocalCartState(null);
  };

  // Map and deduplicate cart items cleanly
  const rawCartItems = cart?.lines?.edges?.map(edge => {
    const node = edge?.node;
    if (!node) return null;
    const merch = node.merchandise || {};
    const prod = merch.product || {};
    const priceAmt = parseFloat(merch.price?.amount || "0");
    const compareAmt = merch.compareAtPrice?.amount ? parseFloat(merch.compareAtPrice.amount) : null;
    
    return {
      id: node.id,
      variantId: extractId(merch.id),
      variant: {
        id: merch.id || "",
        title: merch.title || "",
        price: priceAmt,
        compare_at_price: compareAmt,
      },
      title: prod.title || merch.title || "Pet Product",
      handle: prod.handle || "",
      image: merch.image?.url || prod.images?.edges?.[0]?.node?.url || "",
      quantity: node.quantity || 1,
    };
  }).filter(Boolean) || [];

  // Deduplicate items with the same variant ID
  const cartItems = [];
  const variantMap = new Map();

  for (const item of rawCartItems) {
    const key = item.variantId || item.id;
    if (variantMap.has(key)) {
      const existing = variantMap.get(key);
      existing.quantity += item.quantity;
    } else {
      const clone = { ...item };
      variantMap.set(key, clone);
      cartItems.push(clone);
    }
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0);
  
  // Custom discount logic: 3+ items = 15% off, 2 items = 10% off
  let calculatedTotal = subtotal;
  let discountAmount = 0;
  
  if (cartCount >= 3) {
    calculatedTotal = subtotal * 0.85;
  } else if (cartCount === 2) {
    calculatedTotal = subtotal * 0.90;
  }
  
  discountAmount = subtotal - calculatedTotal;

  // Add $4.95 shipping if under $35
  const shippingThreshold = 35.0;
  if (calculatedTotal > 0 && calculatedTotal < shippingThreshold) {
    calculatedTotal += 4.95;
  }

  const total = calculatedTotal;
  const checkoutUrl = cart?.checkoutUrl || null;

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
