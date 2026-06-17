"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("zesty_cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error loading cart:", e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("zesty_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, variant, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.variant.id === variant.id
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      }

      return [
        ...prevItems,
        {
          id: product.id,
          title: product.title,
          handle: product.handle,
          product_type: product.product_type,
          image: product.images[0] || "",
          variant: {
            id: variant.id,
            title: variant.title,
            price: parseFloat(variant.price),
            compare_at_price: variant.compare_at_price ? parseFloat(variant.compare_at_price) : null,
          },
          quantity,
        },
      ];
    });
    setIsCartOpen(true); // Automatically slide open cart on add
  };

  const removeFromCart = (variantId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.variant.id !== variantId)
    );
  };

  const updateQuantity = (variantId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.variant.id === variantId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculations
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  );

  // Dynamic Dropshipping Volume Discount tiers:
  // Buy 2 items -> 10% discount on entire cart
  // Buy 3+ items -> 15% discount on entire cart
  let discountRate = 0;
  if (cartCount >= 3) {
    discountRate = 0.15;
  } else if (cartCount === 2) {
    discountRate = 0.10;
  }

  const discountAmount = subtotal * discountRate;
  const total = subtotal - discountAmount;

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
        discountRate,
        discountAmount,
        total,
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
