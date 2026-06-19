"use client";

import React, { useState } from "react";
import { Sparkles, Calendar, BadgePercent } from "lucide-react";

export default function SavingsCalculator() {
  const [jarsCount, setJarsCount] = useState(1);
  const averagePrice = 28.50; // Average cost of Peteora Bites
  const autoshipDiscount = 0.15; // 15% Autoship discount

  // Calculation details
  const monthlyCostOneTime = averagePrice * jarsCount;
  const monthlyCostAutoship = monthlyCostOneTime * (1 - autoshipDiscount);
  
  const annualCostOneTime = monthlyCostOneTime * 12;
  const annualCostAutoship = monthlyCostAutoship * 12;
  const annualSavings = annualCostOneTime - annualCostAutoship;

  return (
    <div className="card rounded-card shadow-sm border p-4 text-start bg-white my-4">
      <div className="d-flex align-items-center gap-2 mb-3">
        <div className="p-2 bg-warning bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center">
          <Calendar size={20} className="text-zesty-orange" />
        </div>
        <h5 className="font-heading mb-0 fw-bold">Autoship Savings Calculator</h5>
      </div>

      <p className="small text-muted mb-4 font-body">
        Pet supplements work best when given consistently daily. Save 15% on every shipment, unlock free US shipping, and ensure Fido never runs out of chews!
      </p>

      {/* Slider */}
      <div className="mb-4 bg-light p-3 rounded">
        <label htmlFor="jars-range" className="form-label d-flex justify-content-between font-body fw-bold mb-2">
          <span>Jars consumed per month:</span>
          <span className="text-zesty-orange fs-5">{jarsCount} {jarsCount === 1 ? "Jar" : "Jars"}</span>
        </label>
        <input
          type="range"
          className="form-range"
          id="jars-range"
          min="1"
          max="5"
          value={jarsCount}
          onChange={(e) => setJarsCount(parseInt(e.target.value))}
        />
        <div className="d-flex justify-content-between text-muted small" style={{ fontSize: "0.75rem" }}>
          <span>1 Jar (Small Dog/Cat)</span>
          <span>3 Jars (Multiple Pets)</span>
          <span>5 Jars (Giant Breeds)</span>
        </div>
      </div>

      {/* Comparisons */}
      <div className="row g-3 text-center mb-4">
        {/* Regular buying */}
        <div className="col-6">
          <div className="p-3 border rounded bg-light">
            <span className="small text-muted d-block font-body">Annual Buying</span>
            <span className="fs-5 fw-bold text-decoration-line-through text-muted">
              ${annualCostOneTime.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Autoship buying */}
        <div className="col-6">
          <div className="p-3 border rounded bg-soft-sand" style={{ borderColor: "var(--zesty-orange)" }}>
            <span className="small text-zesty-orange fw-bold d-block font-body">Annual Autoship</span>
            <span className="fs-5 fw-bold text-dark">
              ${annualCostAutoship.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Result highlights */}
      <div className="p-3 bg-forest-green bg-opacity-10 border border-success rounded text-center mb-1">
        <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
          <Sparkles size={18} className="text-forest-green" />
          <span className="fw-bold text-forest-green font-body">TOTAL ANNUAL SAVINGS</span>
        </div>
        <h3 className="font-heading fw-bold text-forest-green m-0">
          ${annualSavings.toFixed(2)} <span className="fs-6 fw-normal font-body">USD</span>
        </h3>
      </div>

      {/* Discount badge */}
      <div className="d-flex align-items-center gap-2 justify-content-center mt-3 text-muted" style={{ fontSize: "0.8rem" }}>
        <BadgePercent size={14} className="text-active-green" />
        <span>15% off applied automatically to all recurring deliveries. Cancel anytime.</span>
      </div>
    </div>
  );
}
