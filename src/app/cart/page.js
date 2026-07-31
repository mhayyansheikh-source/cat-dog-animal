import React from "react";
import CartPageClient from "@/components/CartPageClient";

export const runtime = "edge";

export const metadata = {
  title: "Your Cart - Peteora",
  description: "Review your pet wellness products, supplements, and accessories. Fast US shipping and secure checkout.",
};

export default function CartPage() {
  return <CartPageClient />;
}
