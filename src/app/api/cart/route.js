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
      try {
        result = await addCartLines(cartId, lines);
      } catch (err) {
        result = null;
      }
    }
    
    // If cart doesn't exist or adding lines failed, create a new cart
    if (!result?.cart?.id) {
      const newCart = await createCart();
      if (newCart?.id) {
        cartId = newCart.id;
        result = await addCartLines(cartId, lines);
      }
    }

    const finalCartId = result?.cart?.id || cartId;
    return createJsonResponse(result || { cart: null }, finalCartId);
  } catch (error) {
    return createJsonResponse({ error: error.message });
  }
}

export async function PUT(request) {
  try {
    const { lines } = await request.json();
    const cookieStore = await cookies();
    let cartId = cookieStore.get("shopify_cart_id")?.value;
    
    if (!cartId) {
      return createJsonResponse({ cart: null });
    }
    
    const result = await updateCartLines(cartId, lines);
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
    
    const result = await removeCartLines(cartId, lineIds);
    return createJsonResponse(result || { cart: null }, cartId);
  } catch (error) {
    return createJsonResponse({ error: error.message });
  }
}
