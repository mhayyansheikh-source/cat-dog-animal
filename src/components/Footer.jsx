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
        <div className="row g-4 mb-5 justify-content-between">
          {/* SHOP CATEGORIES Column */}
          <div className="col-lg-4 col-md-4">
            <h6 className="fw-bold mb-4 text-uppercase text-white letter-spacing-wide">Shop Categories</h6>
            <ul className="list-unstyled mb-0 font-body fs-6">
              <li className="mb-3">
                <Link href="/collections/dogs" className="footer-link text-white-50">
                  For Dogs
                </Link>
              </li>
              <li className="mb-3">
                <Link href="/collections/cats" className="footer-link text-white-50">
                  For Cats
                </Link>
              </li>
              <li className="mb-3">
                <Link href="/collections/accessories" className="footer-link text-white-50">
                  Accessories
                </Link>
              </li>
              <li className="mb-3">
                <Link href="/collections/bundles" className="footer-link text-white-50">
                  Bundles
                </Link>
              </li>
              <li className="mb-3">
                <Link href="/collections/replacement-parts" className="footer-link text-white-50">
                  Replacement Parts
                </Link>
              </li>
            </ul>
          </div>

          {/* CUSTOMER CARE Column */}
          <div className="col-lg-4 col-md-4">
            <h6 className="fw-bold mb-4 text-uppercase text-white letter-spacing-wide">Customer Care</h6>
            <ul className="list-unstyled mb-0 font-body fs-6 text-white-50">
              <li className="mb-3 d-flex align-items-start gap-2">
                <span style={{ color: "var(--zesty-orange, #F5761A)", fontWeight: "bold" }}>→</span>
                <span>US Tracked Delivery (5-12 Days)</span>
              </li>
              <li className="mb-3 d-flex align-items-start gap-2">
                <span style={{ color: "var(--zesty-orange, #F5761A)", fontWeight: "bold" }}>→</span>
                <span>30-Day Happiness Guarantee</span>
              </li>
              <li className="mb-3 d-flex align-items-start gap-2">
                <span style={{ color: "var(--zesty-orange, #F5761A)", fontWeight: "bold" }}>→</span>
                <span>Direct Sourcing Slashes Costs</span>
              </li>
              <li className="mb-3 d-flex align-items-start gap-2">
                <span style={{ color: "var(--zesty-orange, #F5761A)", fontWeight: "bold" }}>→</span>
                <span>Support:<br/>shoppingmaniaglobalstore@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* POLICIES & LEGAL Column */}
          <div className="col-lg-4 col-md-4">
            <h6 className="fw-bold mb-4 text-uppercase text-white letter-spacing-wide">Policies &amp; Legal</h6>
            <ul className="list-unstyled mb-0 font-body fs-6">
              <li className="mb-3">
                <Link href="/policies/refund-policy" className="footer-link text-white-50">
                  Return and refund policy
                </Link>
              </li>
              <li className="mb-3">
                <Link href="/policies/privacy-policy" className="footer-link text-white-50">
                  Privacy policy
                </Link>
              </li>
              <li className="mb-3">
                <Link href="/policies/terms-of-service" className="footer-link text-white-50">
                  Terms of service
                </Link>
              </li>
              <li className="mb-3">
                <Link href="/policies/shipping-policy" className="footer-link text-white-50">
                  Shipping policy
                </Link>
              </li>
              <li className="mb-3">
                <Link href="/policies/contact-information" className="footer-link text-white-50">
                  Contact information
                </Link>
              </li>
              <li className="mb-3">
                <Link href="/policies/legal-notice" className="footer-link text-white-50">
                  Legal notice
                </Link>
              </li>
            </ul>
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
