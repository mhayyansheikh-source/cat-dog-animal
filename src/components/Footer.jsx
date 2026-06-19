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
              <img src="/peteora.png" alt="Peteora Logo" style={{ height: "40px", width: "auto", filter: "brightness(0) invert(1)" }} />
            </div>
            <p className="small mb-4 text-white-50" style={{ lineHeight: "1.6" }}>
              Our mission is to keep your pet active, happy, and feeling healthy. We partner directly with premium suppliers to offer clinical-grade pet care products at direct-to-consumer prices.
            </p>
            <div className="d-flex align-items-center gap-2 mb-3">
              <ShieldCheck size={20} style={{ color: "var(--orange)" }} />
              <span className="small fw-semibold text-white-50">100% Quality Audited & Approved</span>
            </div>
            {/* quality badge text simulation */}
            <div className="p-2 border rounded d-inline-block shadow-sm" style={{ borderStyle: "dashed", borderColor: "rgba(255, 255, 255, 0.15)", backgroundColor: "rgba(255, 255, 255, 0.03)" }}>
              <span className="font-heading fs-6 text-white me-2">★ Peteora</span>
              <span className="small text-white-50 font-body font-semibold">Audited Quality Standard</span>
            </div>
          </div>

          {/* Useful Links Column */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3 text-uppercase small text-white-50">Shop Categories</h6>
            <ul className="list-unstyled mb-0 small">
              <li className="mb-2">
                <Link href="/collections/dogs" className="footer-link">
                  For Dogs
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/collections/cats" className="footer-link">
                  For Cats
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/collections/accessories" className="footer-link">
                  Accessories
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/collections/bundles" className="footer-link">
                  Bundles
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/collections/replacement-parts" className="footer-link">
                  Replacement Parts
                </Link>
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
