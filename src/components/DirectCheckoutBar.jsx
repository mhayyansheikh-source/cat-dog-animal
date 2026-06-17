"use client";

import React from "react";
import { CreditCard } from "lucide-react";
import { createShopifyCheckout } from "@/utils/shopify";

export default function DirectCheckoutBar({ product, activeVariant }) {
  if (!product || !activeVariant) return null;

  const handleDirectBuy = async () => {
    try {
      const lineItems = [{
        variantId: activeVariant.id,
        quantity: 1
      }];
      
      const checkoutUrl = await createShopifyCheckout(lineItems);
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
      className="d-md-none position-fixed bottom-0 start-0 w-100 bg-white border-top p-3 shadow-lg z-3"
      style={{ boxShadow: "0 -4px 12px rgba(0,0,0,0.08)" }}
    >
      <div className="container d-flex align-items-center justify-content-between">
        {/* Variant Info */}
        <div className="d-flex align-items-center gap-2 text-start">
          <img
            src={product.images[0]}
            alt={product.title}
            className="rounded border"
            style={{ width: "40px", height: "40px", objectFit: "contain" }}
          />
          <div>
            <span className="fw-bold d-block text-charcoal-dark font-body" style={{ fontSize: "0.85rem", lineHeight: "1.2" }}>
              {product.title}
            </span>
            <span className="text-zesty-orange fw-bold font-body" style={{ fontSize: "0.9rem" }}>
              ${activeVariant.price}
            </span>
          </div>
        </div>

        {/* Buy Now Button */}
        <button
          onClick={handleDirectBuy}
          className="rounded-pill-cta btn-zesty-primary py-2 px-3 small d-flex align-items-center gap-2"
          style={{ fontSize: "0.85rem", textTransform: "none" }}
        >
          <CreditCard size={16} />
          Buy Now
        </button>
      </div>
    </div>
  );
}
