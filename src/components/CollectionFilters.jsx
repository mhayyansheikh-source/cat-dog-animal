"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

export default function CollectionFilters({ filters }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = useCallback(
    (inputObj) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      
      // Parse Shopify filter input string back to key=value
      // Shopify input looks like {"price":{"min":10,"max":50}} or {"productMetafield":{"namespace":"custom","key":"color","value":"red"}}
      // For simplicity in this demo, let's pass a flat parameter. 
      // A full implementation requires deep parsing of the Storefront Filter Input.
      // We will just do a basic implementation of Price if it's the price filter:
      
      try {
        const parsed = JSON.parse(inputObj);
        if (parsed.price) {
          const value = `${parsed.price.min || 0}-${parsed.price.max || 9999}`;
          if (current.get("price") === value) {
            current.delete("price");
          } else {
            current.set("price", value);
          }
        }
      } catch (e) {
        console.error("Advanced filtering object parsing not implemented", e);
      }

      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`${pathname}${query}`);
    },
    [pathname, router, searchParams]
  );

  if (!filters || filters.length === 0) {
    return <p className="text-muted small">No filters available.</p>;
  }

  return (
    <>
      {filters.map((filterGroup) => (
        <div key={filterGroup.id} className="mb-4">
          <h6 className="fw-bold fs-6 mb-3">{filterGroup.label}</h6>
          <ul className="list-unstyled">
            {filterGroup.values.map((val) => {
              // Check if currently active (simplified for price)
              let isActive = false;
              try {
                const parsed = JSON.parse(val.input);
                if (parsed.price) {
                  const value = `${parsed.price.min || 0}-${parsed.price.max || 9999}`;
                  isActive = searchParams.get("price") === value;
                }
              } catch (e) {}

              return (
                <li key={val.id} className="mb-2">
                  <label className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      className="form-check-input mt-0"
                      checked={isActive}
                      onChange={() => handleFilterChange(val.input)}
                    />
                    <span className={isActive ? "text-dark fw-bold" : "text-secondary"}>
                      {val.label}
                    </span>
                    <span className="text-muted ms-auto" style={{ fontSize: "12px" }}>
                      ({val.count})
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );
}
