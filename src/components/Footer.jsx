"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, ExternalLink, ShieldCheck } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="premium-footer pt-5 pb-4 mt-auto">
      <div className="container">
        <div className="row g-4 mb-5">
          {/* Brand & Mission column */}
          <div className="col-lg-3 col-md-6">
            <div className="d-flex align-items-center mb-3">
              <svg
                className="me-2"
                width="34"
                height="34"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="50" cy="50" r="45" fill="#FF7A00" fillOpacity="0.1" />
                <path
                  d="M50 35C45 35 41 39 41 44C41 49 45 53 50 53C55 53 59 49 59 44C59 39 55 35 50 35Z"
                  fill="#FF7A00"
                />
                <circle cx="33" cy="30" r="7" fill="#F7BE00" />
                <circle cx="67" cy="30" r="7" fill="#F7BE00" />
                <circle cx="23" cy="45" r="7" fill="#FF7A00" />
                <circle cx="77" cy="45" r="7" fill="#FF7A00" />
                <path
                  d="M30 65C38 75 62 75 70 65C62 60 38 60 30 65Z"
                  fill="#00653B"
                />
              </svg>
              <span className="font-heading fs-4 fw-bold tracking-wide" style={{ color: "var(--zesty-orange)" }}>
                Pet<span style={{ color: "var(--white)" }}>eora</span>
              </span>
            </div>
            <p className="small mb-4 text-white-50" style={{ lineHeight: "1.6" }}>
              Our mission is to keep your pet active, happy, and feeling zesty. We partner directly with premium suppliers to offer clinical-grade pet care products at direct-to-consumer prices.
            </p>
            <div className="d-flex align-items-center gap-2 mb-3">
              <ShieldCheck size={20} style={{ color: "var(--orange)" }} />
              <span className="small fw-semibold text-white-50">100% Quality Audited & Approved</span>
            </div>
            {/* NASC quality badge text simulation */}
            <div className="p-2 border rounded d-inline-block shadow-sm" style={{ borderStyle: "dashed", borderColor: "rgba(255, 255, 255, 0.15)", backgroundColor: "rgba(255, 255, 255, 0.03)" }}>
              <span className="font-heading fs-6 text-white me-2">★ NASC</span>
              <span className="small text-white-50 font-body">Audited Quality Member</span>
            </div>
          </div>

          {/* Useful Links Column */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3 text-uppercase small text-white-50">Shop Categories</h6>
            <ul className="list-unstyled mb-0 small">
              <li className="mb-2">
                <a href="#catalog-section" className="footer-link">
                  Cat Supplements
                </a>
              </li>
              <li className="mb-2">
                <a href="#catalog-section" className="footer-link">
                  Standard Edition
                </a>
              </li>
              <li className="mb-2">
                <a href="#catalog-section" className="footer-link">
                  Top Cat Edition
                </a>
              </li>
              <li className="mb-2">
                <a href="#catalog-section" className="footer-link">
                  Cardboard Scratchers
                </a>
              </li>
              <li className="mb-2">
                <a href="#catalog-section" className="footer-link">
                  Replacement Parts
                </a>
              </li>
            </ul>
          </div>

          {/* Quick links support Column */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3 text-uppercase small text-white-50">Customer Care</h6>
            <ul className="list-unstyled mb-0 small text-white-50">
              <li className="mb-2 d-flex align-items-start gap-2">
                <span style={{ color: "var(--orange)", fontSize: "0.8rem", marginTop: "3px" }}>➔</span>
                <span>US Tracked Delivery (5-12 Days)</span>
              </li>
              <li className="mb-2 d-flex align-items-start gap-2">
                <span style={{ color: "var(--orange)", fontSize: "0.8rem", marginTop: "3px" }}>➔</span>
                <span>30-Day Happiness Guarantee</span>
              </li>
              <li className="mb-2 d-flex align-items-start gap-2">
                <span style={{ color: "var(--orange)", fontSize: "0.8rem", marginTop: "3px" }}>➔</span>
                <span>Direct Sourcing Slashes Costs</span>
              </li>
              <li className="mb-2 d-flex align-items-start gap-2">
                <span style={{ color: "var(--orange)", fontSize: "0.8rem", marginTop: "3px" }}>➔</span>
                <span>Support: shoppingmaniaglobalstore@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Policies & Legal Column */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3 text-uppercase small text-white-50">Policies &amp; Legal</h6>
            <ul className="list-unstyled mb-0 small font-body">
              <li className="mb-2">
                <Link href="/policies/refund-policy" className="footer-link">
                  Return and refund policy
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/policies/privacy-policy" className="footer-link">
                  Privacy policy
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/policies/terms-of-service" className="footer-link">
                  Terms of service
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/policies/shipping-policy" className="footer-link">
                  Shipping policy
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/policies/contact-information" className="footer-link">
                  Contact information
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/policies/legal-notice" className="footer-link">
                  Legal notice
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3 text-uppercase small text-white-50">Join the Peteora Pack</h6>
            <p className="small text-white-50 mb-3" style={{ lineHeight: "1.5" }}>
              Subscribe to unlock 10% off your first order, access secret flash sales, and get veterinary pet care tips.
            </p>
            {subscribed ? (
              <div className="alert alert-success py-2 small" role="alert">
                ✓ Welcome to the pack! Check your inbox for 10% off!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="input-group mb-3">
                <input
                  type="email"
                  className="form-control footer-input"
                  placeholder="Your pet's email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email subscription list"
                />
                <button className="btn footer-btn" type="submit">
                  Join
                </button>
              </form>
            )}
            
            {/* Payment Trust Marks column */}
            <div className="mt-4">
              <p className="small text-white-50 mb-2">100% Secure Checkout Guaranteed</p>
              <div className="d-flex gap-2 flex-wrap fs-4">
                <span className="payment-badge">💳 Visa</span>
                <span className="payment-badge">💳 Mastercard</span>
                <span className="payment-badge">💳 ShopPay</span>
                <span className="payment-badge">💳 PayPal</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-4" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

        {/* FDA Compliance & Health disclaimer - Mandatory for Pet wellness niches */}
        <div className="disclaimer-box mb-4">
          <p className="small text-white-50 mb-0 font-body" style={{ fontSize: "0.785rem", lineHeight: "1.5" }}>
            <strong>* FDA & VETERINARY ADVISORY DISCLAIMER:</strong> The statements made regarding these products have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease. The details presented on this store are for informational purposes only and are not a substitute for advice from your veterinarian. Always consult your veterinarian before starting any wellness program or dietary supplements for your pets.
          </p>
        </div>

        <div className="row align-items-center">
          <div className="col-12 text-center">
            <p className="small text-white-50 mb-0">
              © {new Date().getFullYear()} Peteora. All rights reserved. Target US Market.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
