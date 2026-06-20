"use server";

import { 
  createShopifyCheckout, 
  createCart, 
  getCart, 
  addCartLines, 
  updateCartLines, 
  removeCartLines 
} from "@/utils/shopify";
import { cookies } from "next/headers";

export async function checkoutAction(lineItems) {
  return await createShopifyCheckout(lineItems);
}

export async function createCartAction() {
  const cart = await createCart();
  if (cart?.id) {
    cookies().set("shopify_cart_id", cart.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
  }
  return cart;
}

export async function getCartAction() {
  const cartId = cookies().get("shopify_cart_id")?.value;
  if (!cartId) return null;
  return await getCart(cartId);
}

export async function addCartLinesAction(lines) {
  let cartId = cookies().get("shopify_cart_id")?.value;
  if (!cartId) {
    const cart = await createCartAction();
    cartId = cart?.id;
  }
  if (!cartId) throw new Error("Could not create cart");
  return await addCartLines(cartId, lines);
}

export async function updateCartLinesAction(lines) {
  const cartId = cookies().get("shopify_cart_id")?.value;
  if (!cartId) throw new Error("Cart not found");
  return await updateCartLines(cartId, lines);
}

export async function removeCartLinesAction(lineIds) {
  const cartId = cookies().get("shopify_cart_id")?.value;
  if (!cartId) throw new Error("Cart not found");
  return await removeCartLines(cartId, lineIds);
}
