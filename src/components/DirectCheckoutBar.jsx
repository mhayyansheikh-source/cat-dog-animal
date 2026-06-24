"use client";

import React from "react";
import Image from "next/image";
import { CreditCard } from "lucide-react";
import { checkoutAction } from "@/app/actions";
import { motion } from "framer-motion";

export default function DirectCheckoutBar({ product, activeVariant }) {
  if (!product || !activeVariant) return null;

  const handleDirectBuy = async () => {
    try {
      const lineItems = [{
        variantId: activeVariant.id,
        quantity: 1
      }];
      
      const checkoutUrl = await checkoutAction(lineItems);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        alert("Failed to build a direct checkout session.");
      }
    } catch (e) {
      console.error("Direct buy redirect error:", e);
    }
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

        {/* Buy Now Button - Condensed for Mobile Target */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleDirectBuy}
          className="rounded-pill-cta btn-zesty-primary flex-grow-1 d-flex align-items-center justify-content-center gap-2 font-heading shadow-sm m-0"
          style={{ height: "48px", fontSize: "16px", textTransform: "uppercase" }}
        >
          <CreditCard size={18} />
          Buy Now
        </motion.button>
      </div>
    </div>
  );
}
