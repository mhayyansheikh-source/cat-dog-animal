"use client";

import React from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

export default function DirectCheckoutBar({ product, activeVariant }) {
  const { addToCart } = useCart();

  if (!product || !activeVariant) return null;

  const handleAddToCart = () => {
    addToCart(product, activeVariant, 1);
  };

  return (
    <div
      className="d-md-none position-fixed bottom-0 start-0 w-100 bg-white border-top shadow-lg z-3"
      style={{ boxShadow: "0 -4px 16px rgba(0,0,0,0.1)", paddingBottom: "env(safe-area-inset-bottom)", padding: "12px 16px" }}
    >
      <div className="container d-flex align-items-center justify-content-between gap-3">
        <div className="d-flex flex-column align-items-start">
          <span className="text-muted font-body" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Price</span>
          <span className="text-zesty-orange fw-bold font-body" style={{ fontSize: "22px", lineHeight: "1" }}>
            ${activeVariant.price}
          </span>
        </div>

        {/* Add to Cart Button - Condensed for Mobile Target */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleAddToCart}
          disabled={!activeVariant.available}
          className={`rounded-pill-cta flex-grow-1 d-flex align-items-center justify-content-center gap-2 font-heading shadow-sm m-0 ${
            !activeVariant.available ? "btn-secondary" : "btn-zesty-primary"
          }`}
          style={{ height: "48px", fontSize: "16px", textTransform: "uppercase" }}
        >
          <ShoppingCart size={18} />
          {activeVariant.available ? "Add to Cart" : "Out of Stock"}
        </motion.button>
      </div>
    </div>
  );
}
