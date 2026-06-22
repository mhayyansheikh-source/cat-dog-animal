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
