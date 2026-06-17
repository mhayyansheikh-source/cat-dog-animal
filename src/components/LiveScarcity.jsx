"use client";

import React, { useState, useEffect } from "react";
import { Flame, Eye } from "lucide-react";

export default function LiveScarcity({ variantId }) {
  const [stockLevel, setStockLevel] = useState(6);
  const [viewers, setViewers] = useState(14);

  useEffect(() => {
    // Generate organic-looking variation
    // Stock is low (4 to 8 units)
    const seedStock = (variantId ? (variantId % 5) + 4 : 6);
    setStockLevel(seedStock);

    // Viewers vary between 11 and 24
    const seedViewers = 10 + Math.floor(Math.random() * 15);
    setViewers(seedViewers);

    // Minor updates periodically to look alive
    const interval = setInterval(() => {
      setViewers(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const newVal = prev + delta;
        return newVal > 8 && newVal < 30 ? newVal : prev;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [variantId]);

  // Determine bar color and width percentage
  const percentage = (stockLevel / 20) * 100;

  return (
    <div className="my-3 text-start">
      {/* Live Viewers Indicator */}
      <div className="d-flex align-items-center gap-2 mb-2">
        <span className="d-flex align-items-center justify-content-center p-1 rounded-circle bg-light border">
          <Eye size={14} className="text-muted" />
        </span>
        <span className="small text-muted font-body">
          <strong className="text-dark">{viewers} pet parents</strong> are viewing this item right now
        </span>
      </div>

      {/* Stock alert panel */}
      <div className="p-3 bg-white border rounded shadow-sm">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="small fw-bold text-danger d-flex align-items-center gap-1">
            <Flame size={16} fill="currentColor" /> LOW INVENTORY ALERT
          </span>
          <span className="small text-muted fw-bold">
            Only {stockLevel} jars left in US Warehouse
          </span>
        </div>
        <div className="progress" style={{ height: "6px" }}>
          <div
            className="progress-bar bg-danger"
            role="progressbar"
            style={{ width: `${percentage}%` }}
            aria-valuenow={stockLevel}
            aria-valuemin="0"
            aria-valuemax="20"
            aria-label="Stock level gauge"
          />
        </div>
        <p className="small text-muted mt-2 mb-0 font-body" style={{ fontSize: "0.8rem" }}>
          Due to high social media demand, orders are restricted to a maximum of 6 jars per household.
        </p>
      </div>
    </div>
  );
}
