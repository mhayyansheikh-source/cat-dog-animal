"use server";

import { 
  createShopifyCheckout, 
  createCart, 
  getCart, 
  addCartLines, 
  updateCartLines, 
  removeCartLines,
  subscribeToNewsletter
} from "@/utils/shopify";
import { cookies } from "next/headers";

export async function checkoutAction(lineItems) {
  return await createShopifyCheckout(lineItems);
}

export async function createCartAction() {
  try {
    const cart = await createCart();
    if (cart?.id) {
      const cookieStore = await cookies();
      cookieStore.set("shopify_cart_id", cart.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
    }
    return cart;
  } catch (error) {
    console.error("Server Action createCartAction failed:", error);
    return { error: error.message };
  }
}

export async function getCartAction() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("shopify_cart_id")?.value;
  if (!cartId) return null;
  return await getCart(cartId);
}

export async function addCartLinesAction(lines) {
  try {
    const cookieStore = await cookies();
    let cartId = cookieStore.get("shopify_cart_id")?.value;
    if (!cartId) {
      const cart = await createCartAction();
      if (cart?.error) return cart;
      cartId = cart?.id;
    }
    if (!cartId) return { error: "Could not create cart" };
    return await addCartLines(cartId, lines);
  } catch (error) {
    console.error("Server Action addCartLinesAction failed:", error);
    return { error: error.message };
  }
}

export async function updateCartLinesAction(lines) {
  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get("shopify_cart_id")?.value;
    if (!cartId) return { error: "Cart not found" };
    return await updateCartLines(cartId, lines);
  } catch (error) {
    return { error: error.message };
  }
}

export async function removeCartLinesAction(lineIds) {
  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get("shopify_cart_id")?.value;
    if (!cartId) return { error: "Cart not found" };
    return await removeCartLines(cartId, lineIds);
  } catch (error) {
    return { error: error.message };
  }
}

export async function subscribeAction(email) {
  try {
    const result = await subscribeToNewsletter(email);
    if (!result) return { error: "Subscription failed." };
    
    if (result.customerUserErrors?.length > 0) {
      return { error: result.customerUserErrors[0].message };
    }
    
    return { success: true, message: "Successfully subscribed!" };
  } catch (error) {
    return { error: error.message };
  }
}
