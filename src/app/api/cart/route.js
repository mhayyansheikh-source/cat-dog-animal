import { createCart, getCart, addCartLines, updateCartLines, removeCartLines } from "@/utils/shopify";
import { cookies } from "next/headers";

export const runtime = "edge";

async function getOrCreateCartId() {
  const cookieStore = await cookies();
  let cartId = cookieStore.get("shopify_cart_id")?.value;
  if (!cartId) {
    const cart = await createCart();
    if (cart?.id) {
      cartId = cart.id;
      cookieStore.set("shopify_cart_id", cartId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }
  }
  return cartId;
}

export async function GET() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("shopify_cart_id")?.value;
  if (!cartId) return Response.json({ cart: null });
  const cart = await getCart(cartId);
  return Response.json({ cart });
}

export async function POST(request) {
  try {
    const { lines } = await request.json();
    let cartId = await getOrCreateCartId();
    if (!cartId) return Response.json({ error: "Could not create cart" }, { status: 500 });
    
    try {
      const result = await addCartLines(cartId, lines);
      return Response.json(result || { cart: null });
    } catch (graphQLError) {
      const cart = await createCart();
      if (cart?.id) {
        const cookieStore = await cookies();
        cookieStore.set("shopify_cart_id", cart.id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });
        const result = await addCartLines(cart.id, lines);
        return Response.json(result || { cart: null });
      }
      return Response.json({ error: "Could not recreate cart" }, { status: 500 });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { lines } = await request.json();
    const cookieStore = await cookies();
    const cartId = cookieStore.get("shopify_cart_id")?.value;
    if (!cartId) return Response.json({ error: "Cart not found" }, { status: 404 });
    const result = await updateCartLines(cartId, lines);
    return Response.json(result || { cart: null });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { lineIds } = await request.json();
    const cookieStore = await cookies();
    const cartId = cookieStore.get("shopify_cart_id")?.value;
    if (!cartId) return Response.json({ error: "Cart not found" }, { status: 404 });
    const result = await removeCartLines(cartId, lineIds);
    return Response.json(result || { cart: null });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
