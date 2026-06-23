"use server";

import { 
  createShopifyCheckout, 
  createCart
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

