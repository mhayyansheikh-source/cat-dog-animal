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
      style={{ boxShadow: "0 -4px 16px rgba(0,0,0,0.1)", paddingBottom: "env(safe-area-inset-bottom)", padding: "16px" }}
    >
      <div className="container d-flex flex-column gap-2">
        {/* Variant Info */}
        <div className="d-flex align-items-center gap-3">
          <div className="position-relative" style={{ width: "48px", height: "48px" }}>
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              sizes="48px"
              className="rounded border object-fit-contain"
            />
          </div>
          <div className="flex-grow-1">
            <span className="fw-bold d-block text-charcoal-dark font-body text-truncate" style={{ fontSize: "14px", maxWidth: "200px" }}>
              {product.title}
            </span>
            <span className="text-zesty-orange fw-bold font-body" style={{ fontSize: "16px" }}>
              ${activeVariant.price}
            </span>
          </div>
        </div>

        {/* Buy Now Button - Full Width for Mobile Target */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleDirectBuy}
          className="rounded-pill-cta btn-zesty-primary w-100 d-flex align-items-center justify-content-center gap-2 font-heading shadow-sm"
          style={{ minHeight: "56px", fontSize: "18px", textTransform: "uppercase" }}
        >
          <CreditCard size={20} />
          Buy Now
        </motion.button>
      </div>
    </div>
  );
}
