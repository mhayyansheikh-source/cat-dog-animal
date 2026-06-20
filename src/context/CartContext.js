"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCartAction, addCartLinesAction, updateCartLinesAction, removeCartLinesAction } from "@/app/actions";
import { toast } from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);

  // Initialize cart from Shopify
  const refreshCart = useCallback(async () => {
    setIsSyncing(true);
    try {
      const liveCart = await getCartAction();
      setCart(liveCart);
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (product, variant, quantity = 1) => {
    setIsCartOpen(true);
    setIsSyncing(true);
    try {
      const response = await addCartLinesAction([{ merchandiseId: variant.id, quantity }]);
      
      if (response?.error) {
        throw new Error(response.error);
      }
      
      if (response?.userErrors?.length > 0) {
        toast.error(response.userErrors[0].message);
      } else if (response?.cart) {
        toast.success(`${product.title} added to cart`);
        setCart(response.cart);
        await refreshCart(); // Full refresh to get all line item details correctly
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
      const response = await removeCartLinesAction([lineId]);
      
      if (response?.error) throw new Error(response.error);
      
      if (response?.userErrors?.length > 0) {
        toast.error(response.userErrors[0].message);
      } else if (response?.cart) {
        setCart(response.cart);
        await refreshCart();
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
      const response = await updateCartLinesAction([{ id: lineId, quantity: newQuantity }]);
      
      if (response?.error) throw new Error(response.error);
      
      if (response?.userErrors?.length > 0) {
        toast.error(response.userErrors[0].message);
      } else if (response?.cart) {
        setCart(response.cart);
        await refreshCart();
      }
    } catch (error) {
      console.error("Update quantity error:", error);
      toast.error("Failed to update quantity");
    } finally {
      setIsSyncing(false);
    }
  };

  const clearCart = () => {
    // Note: Storefront API doesn't have a direct clear cart, 
    // we would just let the cookie expire or create a new cart.
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
    image: edge.node.merchandise.image?.url || "",
    quantity: edge.node.quantity,
  })) || [];

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart?.cost?.subtotalAmount?.amount ? parseFloat(cart.cost.subtotalAmount.amount) : 0;
  const total = cart?.cost?.totalAmount?.amount ? parseFloat(cart.cost.totalAmount.amount) : 0;
  const discountAmount = subtotal > 0 && total > 0 ? subtotal - total : 0;
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
