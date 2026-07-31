"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { checkoutAction } from "@/app/actions";
import { toast } from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);

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

    // 1. Instant 0ms Optimistic Update
    updateLocalCartState(prev => {
      const existingEdges = prev?.lines?.edges ? [...prev.lines.edges] : [];
      const matchIndex = existingEdges.findIndex(
        e => e.node?.merchandise?.id?.toString() === variant.id?.toString()
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
    updateLocalCartState(prev => {
      if (!prev?.lines?.edges) return prev;
      return {
        ...prev,
        lines: {
          ...prev.lines,
          edges: prev.lines.edges.filter(edge => edge.node.id !== lineId)
        }
      };
    });

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
  };

  const clearCart = () => {
    updateLocalCartState(null);
  };

  // Map Shopify cart data to our UI expectations
  const cartItems = cart?.lines?.edges?.map(edge => ({
    id: edge.node.id, // This is the LINE ID, not the variant ID
    variant: {
      id: edge.node.merchandise.id,
      title: edge.node.merchandise.title,
      price: parseFloat(edge.node.merchandise.price.amount),
      compare_at_price: edge.node.merchandise.compareAtPrice ? parseFloat(edge.node.merchandise.compareAtPrice.amount) : null,
    },
    title: edge.node.merchandise.product.title,
    handle: edge.node.merchandise.product.handle,
    image: edge.node.merchandise.image?.url || edge.node.merchandise.product?.images?.edges?.[0]?.node?.url || "",
    quantity: edge.node.quantity,
  })) || [];

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0);
  
  // Custom discount logic mimicking the ProductDetailsClient logic
  // 3+ items = 15% off, 2 items = 10% off
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
