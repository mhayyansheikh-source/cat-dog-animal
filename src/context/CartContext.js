"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { checkoutAction } from "@/app/actions";
import { toast } from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);

  // Initialize cart from Shopify
  useEffect(() => {
    let mounted = true;
    const fetchCart = async () => {
      try {
        const res = await fetch('/api/cart');
        const data = await res.json();
        if (mounted) setCart(data.cart);
      } catch (error) {
        console.error("Failed to load cart:", error);
      } finally {
        if (mounted) setIsSyncing(false);
      }
    };
    fetchCart();
    return () => { mounted = false; };
  }, []);

  const addToCart = async (product, variant, quantity = 1) => {
    setIsCartOpen(true);
    setIsSyncing(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines: [{ merchandiseId: variant.id, quantity }] })
      });
      const response = await res.json();
      
      if (response?.error) {
        throw new Error(response.error);
      }
      
      if (response?.userErrors?.length > 0) {
        toast.error(response.userErrors[0].message);
      } else if (response?.cart) {
        toast.success(`${product.title} added to cart`);
        setCart(response.cart);
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(error.message || "Could not add item to cart");
    } finally {
      setIsSyncing(false);
    }
  };

  const removeFromCart = async (lineId) => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineIds: [lineId] })
      });
      const response = await res.json();
      
      if (response?.error) throw new Error(response.error);
      
      if (response?.userErrors?.length > 0) {
        toast.error(response.userErrors[0].message);
      } else if (response?.cart) {
        setCart(response.cart);
      }
    } catch (error) {
      console.error("Remove from cart error:", error);
      toast.error("Failed to remove item");
    } finally {
      setIsSyncing(false);
    }
  };

  const updateQuantity = async (lineId, newQuantity) => {
    if (newQuantity <= 0) {
      return removeFromCart(lineId);
    }
    setIsSyncing(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines: [{ id: lineId, quantity: newQuantity }] })
      });
      const response = await res.json();
      
      if (response?.error) throw new Error(response.error);
      
      if (response?.userErrors?.length > 0) {
        toast.error(response.userErrors[0].message);
      } else if (response?.cart) {
        setCart(response.cart);
      }
    } catch (error) {
      console.error("Update quantity error:", error);
      toast.error("Failed to update quantity");
    } finally {
      setIsSyncing(false);
    }
  };

  const clearCart = () => {
    setCart(null);
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
  const subtotal = cart?.cost?.subtotalAmount?.amount ? parseFloat(cart.cost.subtotalAmount.amount) : 0;
  
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
