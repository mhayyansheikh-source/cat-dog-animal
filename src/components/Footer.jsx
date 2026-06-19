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
    <footer className="bg-light border-top pt-5 pb-3 mt-auto">
      <div className="container">
        <div className="row g-4 mb-5">
          {/* Brand & Mission column */}
          <div className="col-lg-3 col-md-6">
            <h5 className="font-heading mb-3" style={{ color: "var(--zesty-orange)" }}>
              Peteora
            </h5>
            <p className="small text-muted mb-4">
              Our mission is to keep your pet feeling zesty from head to tail. We partner directly with premium veterinary ingredient suppliers to provide delicious, clinical-grade supplements at direct-to-consumer prices.
            </p>
            <div className="d-flex align-items-center gap-2 mb-3">
              <ShieldCheck size={20} className="text-forest-green" />
              <span className="small fw-bold text-forest-green">100% Quality Audited & Approved</span>
            </div>
            {/* NASC quality badge text simulation */}
            <div className="p-2 border rounded d-inline-block bg-white shadow-sm" style={{ borderStyle: "dashed" }}>
              <span className="font-heading fs-6 text-dark me-2">★ NASC</span>
              <span className="small text-muted font-body">Audited Quality Member</span>
            </div>
          </div>

          {/* Useful Links Column */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3 text-uppercase small text-muted">Shop Categories</h6>
            <ul className="list-unstyled mb-0 small">
              <li className="mb-2">
                <a href="#shop-dogs" className="text-dark text-decoration-none hover-scale d-inline-block">
                  Dog Supplements
                </a>
              </li>
              <li className="mb-2">
                <a href="#shop-cats" className="text-dark text-decoration-none hover-scale d-inline-block">
                  Cat Supplements
                </a>
              </li>
              <li className="mb-2">
                <a href="#concern-grid" className="text-dark text-decoration-none hover-scale d-inline-block">
                  Shop by Health Concern
                </a>
              </li>
              <li className="mb-2">
                <a href="#science" className="text-dark text-decoration-none hover-scale d-inline-block">
                  Active Ingredients
                </a>
              </li>
            </ul>
          </div>

          {/* Quick links support Column */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3 text-uppercase small text-muted">Customer Care</h6>
            <ul className="list-unstyled mb-0 small">
              <li className="mb-2">
                <span className="text-dark">US Tracked Delivery (5-12 Days)</span>
              </li>
              <li className="mb-2">
                <span className="text-dark">30-Day Happiness Guarantee</span>
              </li>
              <li className="mb-2">
                <span className="text-dark">Direct Sourcing Slashes Costs</span>
              </li>
              <li className="mb-2">
                <span className="text-dark">Support: shoppingmaniaglobalstore@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Policies & Legal Column */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3 text-uppercase small text-muted">Policies &amp; Legal</h6>
            <ul className="list-unstyled mb-0 small font-body">
              <li className="mb-2">
                <Link href="/policies/refund-policy" className="text-dark text-decoration-none hover-scale d-inline-block">
                  Return and refund policy
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/policies/privacy-policy" className="text-dark text-decoration-none hover-scale d-inline-block">
                  Privacy policy
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/policies/terms-of-service" className="text-dark text-decoration-none hover-scale d-inline-block">
                  Terms of service
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/policies/shipping-policy" className="text-dark text-decoration-none hover-scale d-inline-block">
                  Shipping policy
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/policies/contact-information" className="text-dark text-decoration-none hover-scale d-inline-block">
                  Contact information
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/policies/legal-notice" className="text-dark text-decoration-none hover-scale d-inline-block">
                  Legal notice
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3 text-uppercase small text-muted">Join the Peteora Pack</h6>
            <p className="small text-muted mb-3">
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
                  className="form-control"
                  placeholder="Your pet's email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email subscription list"
                />
                <button className="btn btn-zesty-primary" type="submit">
                  Join
                </button>
              </form>
            )}
            
            {/* Payment Trust Marks column */}
            <div className="mt-4">
              <p className="small text-muted mb-2">100% Secure Checkout Guaranteed</p>
              <div className="d-flex gap-2 flex-wrap fs-4 text-muted">
                {/* Simulated payment badges */}
                <span className="badge bg-white border text-dark font-body px-2 py-1">💳 Visa</span>
                <span className="badge bg-white border text-dark font-body px-2 py-1">💳 Mastercard</span>
                <span className="badge bg-white border text-dark font-body px-2 py-1">💳 ShopPay</span>
                <span className="badge bg-white border text-dark font-body px-2 py-1">💳 PayPal</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        {/* FDA Compliance & Health disclaimer - Mandatory for Pet wellness niches */}
        <div className="p-3 bg-white border rounded mb-4" style={{ borderColor: "var(--pale-gray)" }}>
          <p className="small text-muted mb-0 font-body" style={{ fontSize: "0.785rem", lineHeight: "1.4" }}>
            <strong>* FDA & VETERINARY ADVISORY DISCLAIMER:</strong> The statements made regarding these products have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease. The details presented on this store are for informational purposes only and are not a substitute for advice from your veterinarian. Always consult your veterinarian before starting any wellness program or dietary supplements for your pets.
          </p>
        </div>

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="small text-muted mb-0">
              © {new Date().getFullYear()} Peteora. All rights reserved. Target US Market.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end mt-2 mt-md-0">
            <span className="small text-muted">
              Developed as a Headless Shopify Front-End Demo
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
