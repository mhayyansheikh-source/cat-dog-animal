import { createCart, getCart, addCartLines, updateCartLines, removeCartLines } from "@/utils/shopify";
import { cookies } from "next/headers";

export const runtime = "edge";

function createJsonResponse(data, cartId = null) {
  const headers = new Headers({
    "Content-Type": "application/json",
  });
  if (cartId) {
    headers.append(
      "Set-Cookie",
      `shopify_cart_id=${encodeURIComponent(cartId)}; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`
    );
  }
  return new Response(JSON.stringify(data), { status: 200, headers });
}

export async function GET() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("shopify_cart_id")?.value;
  if (!cartId) return createJsonResponse({ cart: null });
  const cart = await getCart(cartId);
  return createJsonResponse({ cart }, cartId);
}

export async function POST(request) {
  try {
    const { lines } = await request.json();
    const cookieStore = await cookies();
    let cartId = cookieStore.get("shopify_cart_id")?.value;

    let result = null;

    if (cartId) {
      // Try to add lines to existing cart
      try {
        result = await addCartLines(cartId, lines);
      } catch (err) {
        // Cart likely expired — will create a fresh one below
        result = null;
      }
    }

    // [S2-FIX] If no cart or it expired, create first THEN add lines (single path, no retry race)
    if (!result?.cart?.id) {
      const newCart = await createCart();
      if (!newCart?.id) {
        return createJsonResponse({ error: "Failed to create cart" });
      }
      cartId = newCart.id;
      // Create empty cart successfully — now add the lines
      result = await addCartLines(cartId, lines);
    }

    const finalCartId = result?.cart?.id || cartId;
    return createJsonResponse(result || { cart: null }, finalCartId);
  } catch (error) {
    console.error("POST /api/cart error:", error);
    return createJsonResponse({ error: error.message });
  }
}


export async function PUT(request) {
  try {
    const { lines } = await request.json();
    const cookieStore = await cookies();
    const cartId = cookieStore.get("shopify_cart_id")?.value;

    if (!cartId) {
      return createJsonResponse({ cart: null });
    }

    let result = null;
    try {
      result = await updateCartLines(cartId, lines);
    } catch (err) {
      console.error("updateCartLines error:", err);
    }

    // If Shopify rejected the update (e.g. invalid line ID), return cart:null
    // so the client keeps its optimistic state and re-syncs on next page load.
    // Do NOT fall back to addCartLines — that would add duplicate items.
    return createJsonResponse(result || { cart: null }, cartId);
  } catch (error) {
    return createJsonResponse({ error: error.message });
  }
}

export async function DELETE(request) {
  try {
    const { lineIds } = await request.json();
    const cookieStore = await cookies();
    let cartId = cookieStore.get("shopify_cart_id")?.value;
    
    if (!cartId) {
      return createJsonResponse({ cart: null });
    }
    
    let result = null;
    try {
      result = await removeCartLines(cartId, lineIds);
    } catch (err) {
      result = null;
    }
    
    return createJsonResponse(result || { cart: null }, cartId);
  } catch (error) {
    return createJsonResponse({ error: error.message });
  }
}
