"use client";

import React from "react";
import { Award, ShieldAlert, BadgeCheck, RotateCcw } from "lucide-react";

export default function TrustBadges() {
  return (
    <div className="py-4 border-top border-bottom my-4">
      <div className="row g-3 text-center">
        {/* Badge 1: Quality Audit */}
        <div className="col-6 col-md-3 d-flex flex-column align-items-center">
          <div className="p-3 bg-light rounded-circle mb-2 d-flex justify-content-center align-items-center" style={{ width: "60px", height: "60px" }}>
            <Award size={28} className="text-forest-green" />
          </div>
          <span className="fw-bold small mb-1 text-charcoal-dark font-body">NASC Audited Member</span>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>Highest pet safety rating</span>
        </div>

        {/* Badge 2: Sourcing Guarantee */}
        <div className="col-6 col-md-3 d-flex flex-column align-items-center">
          <div className="p-3 bg-light rounded-circle mb-2 d-flex justify-content-center align-items-center" style={{ width: "60px", height: "60px" }}>
            <BadgeCheck size={28} className="text-zesty-orange" />
          </div>
          <span className="fw-bold small mb-1 text-charcoal-dark font-body">Made in the USA</span>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>US-sourced ingredients</span>
        </div>

        {/* Badge 3: Slashed Costs */}
        <div className="col-6 col-md-3 d-flex flex-column align-items-center">
          <div className="p-3 bg-light rounded-circle mb-2 d-flex justify-content-center align-items-center" style={{ width: "60px", height: "60px" }}>
            <ShieldAlert size={28} className="text-active-green" />
          </div>
          <span className="fw-bold small mb-1 text-charcoal-dark font-body">Direct Sourced Savings</span>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>Bypasses retail markup</span>
        </div>

        {/* Badge 4: Refund Guarantee */}
        <div className="col-6 col-md-3 d-flex flex-column align-items-center">
          <div className="p-3 bg-light rounded-circle mb-2 d-flex justify-content-center align-items-center" style={{ width: "60px", height: "60px" }}>
            <RotateCcw size={28} style={{ color: "var(--charcoal-dark)" }} />
          </div>
          <span className="fw-bold small mb-1 text-charcoal-dark font-body">30-Day Refund Policy</span>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>100% satisfaction guarantee</span>
        </div>
      </div>
    </div>
  );
}
