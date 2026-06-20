"use client";

import React, { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function CollectionSidebar({ sidebarConfig }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handlePriceChange = (range) => {
    // Basic mapping for Shopify price filter
    let priceFilter = "";
    if (range === "Under $20") priceFilter = "0-20";
    if (range === "$20–$40") priceFilter = "20-40";
    if (range === "$40–$60") priceFilter = "40-60";
    if (range === "Over $60") priceFilter = "60-9999";

    const currentPrice = searchParams.get("price");
    if (currentPrice === priceFilter) {
      router.push(pathname + "?" + createQueryString("price", null), { scroll: false });
    } else {
      router.push(pathname + "?" + createQueryString("price", priceFilter), { scroll: false });
    }
  };

  const handleTypeChange = (type) => {
    const currentType = searchParams.get("type");
    if (currentType === type) {
      router.push(pathname + "?" + createQueryString("type", null), { scroll: false });
    } else {
      router.push(pathname + "?" + createQueryString("type", type), { scroll: false });
    }
  };

  return (
    <aside style={{ position: "sticky", top: "90px" }}>
      <div
        style={{
          background: "white",
          border: "1px solid #E5E7EB",
          borderRadius: "16px",
          padding: "28px 24px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}
      >
        {/* Product Type Filter */}
        {sidebarConfig?.categories?.length > 0 && (
          <>
            <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#1F2937", marginBottom: "14px", fontFamily: "var(--font-nunito), 'Nunito', sans-serif" }}>
              Category
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px" }}>
              {sidebarConfig.categories.map((cat, i) => {
                const isActive = searchParams.get("type") === cat.label || (!searchParams.get("type") && i === 0);
                return (
                  <li key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px", fontWeight: isActive ? "700" : "500", color: isActive ? "var(--orange, #F5761A)" : "#374151", flex: 1 }}>
                      <input
                        type="radio"
                        name="category"
                        checked={isActive}
                        onChange={() => handleTypeChange(i === 0 ? null : cat.label)}
                        style={{ accentColor: "var(--orange, #F5761A)", width: "16px", height: "16px", cursor: "pointer", flexShrink: 0 }}
                      />
                      {cat.label}
                    </label>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {/* Price Filter */}
        <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#1F2937", marginBottom: "14px", fontFamily: "var(--font-nunito), 'Nunito', sans-serif" }}>
          Price
        </h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {["Under $20", "$20–$40", "$40–$60", "Over $60"].map((range, i) => {
            let priceVal = "";
            if (range === "Under $20") priceVal = "0-20";
            if (range === "$20–$40") priceVal = "20-40";
            if (range === "$40–$60") priceVal = "40-60";
            if (range === "Over $60") priceVal = "60-9999";
            
            const isActive = searchParams.get("price") === priceVal;
            return (
              <li key={i} style={{ padding: "7px 0" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => handlePriceChange(range)}
                    style={{ accentColor: "var(--orange, #F5761A)", width: "16px", height: "16px", cursor: "pointer", flexShrink: 0 }}
                  />
                  {range}
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
