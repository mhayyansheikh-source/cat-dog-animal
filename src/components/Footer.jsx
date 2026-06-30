"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, ExternalLink, ShieldCheck } from "lucide-react";

export default function Footer({ menu, mainMenu, shop, policies, collections }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (email) {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        
        setLoading(false);
        if (!res.ok || data.error) {
          setError(data.error || "Subscription failed.");
        } else {
          setSubscribed(true);
          setEmail("");
        }
      } catch (err) {
        setLoading(false);
        setError("Network error. Please try again.");
      }
    }
  };

  const getPath = (url) => {
    if (!url) return "#";
    try {
      if (url.startsWith('/')) return url;
      return new URL(url, "https://peteora.com").pathname;
    } catch (e) {
      return url;
    }
  };

  const policyLinks = [
    policies?.refundPolicy && { title: policies.refundPolicy.title || "Refund Policy", url: "/policies/refund-policy" },
    policies?.privacyPolicy && { title: policies.privacyPolicy.title || "Privacy Policy", url: "/policies/privacy-policy" },
    policies?.termsOfService && { title: policies.termsOfService.title || "Terms of Service", url: "/policies/terms-of-service" },
    policies?.shippingPolicy && { title: policies.shippingPolicy.title || "Shipping Policy", url: "/policies/shipping-policy" },
    { title: "Contact Information", url: "/policies/contact-information" },
    { title: "Legal Notice", url: "/policies/legal-notice" }
  ].filter(Boolean);

  return (
    <footer className="premium-footer bg-light pt-5 pb-4 mt-auto">
      <div className="container">
        <div className="row g-4 mb-5 justify-content-between">
          
          {/* Brand & Newsletter */}
          <div className="col-lg-4 col-md-6">
            <Link href="/" className="d-inline-block mb-4">
              {shop?.brand?.logo?.image?.url ? (
                <img src={shop.brand.logo.image.url} alt={shop?.name || "Logo"} style={{ height: "45px", width: "auto" }} />
              ) : (
                <img src="/peteora.png" alt="Peteora Logo" style={{ height: "45px", width: "auto" }} />
              )}
            </Link>
            <p className="text-muted font-body mb-4" style={{ fontSize: "0.95rem" }}>
              {shop?.description || "Premium supplements, treats, food, and accessories for happy, healthy cats and dogs. Science-backed ingredients, loved by pets worldwide."}
            </p>
            <form onSubmit={handleSubscribe} className="position-relative mb-2">
              <input 
                type="email" 
                className="form-control rounded-pill bg-white border-light text-dark ps-4 pe-5 py-2" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <button type="submit" disabled={loading} className="btn position-absolute top-0 end-0 h-100 rounded-pill px-4 text-dark fw-bold" style={{ backgroundColor: "var(--zesty-orange)" }}>
                {loading ? "..." : subscribed ? "Joined!" : "Join"}
              </button>
            </form>
            {error && <p className="text-danger small mt-1 mb-0">{error}</p>}
            {subscribed && <p className="text-success small mt-1 mb-0">✓ Welcome to the pack!</p>}
          </div>

          {/* Shop (Main Menu) */}
          <div className="col-lg-2 col-md-3 col-12 mb-2 mb-md-0">
            <details className="d-md-none border-bottom border-light pb-1">
              <summary className="fw-bold text-uppercase text-dark letter-spacing-wide py-3 d-flex justify-content-between align-items-center" style={{ outline: 'none', cursor: 'pointer' }}>
                Shop <span className="text-muted fs-6">▼</span>
              </summary>
              <ul className="list-unstyled mb-0 font-body fs-6 pt-2 pb-2">
                {mainMenu?.items?.map((link) => (
                  <li className="mb-3" key={link.id}>
                    <Link href={getPath(link.url)} className="footer-link text-muted d-block" style={{ minHeight: "44px" }}>
                      {link.title}
                    </Link>
                  </li>
                ))}
                {!mainMenu?.items?.length && (
                  <>
                    <li className="mb-3"><Link href="/" className="footer-link text-muted d-block" style={{ minHeight: "44px" }}>Home</Link></li>
                    <li className="mb-3"><Link href="/collections/all" className="footer-link text-muted d-block" style={{ minHeight: "44px" }}>Shop All</Link></li>
                  </>
                )}
              </ul>
            </details>
            <div className="d-none d-md-block">
              <h6 className="fw-bold mb-4 text-uppercase text-dark letter-spacing-wide">Shop</h6>
              <ul className="list-unstyled mb-0 font-body fs-6">
                {mainMenu?.items?.map((link) => (
                  <li className="mb-3" key={link.id}>
                    <Link href={getPath(link.url)} className="footer-link text-muted">
                      {link.title}
                    </Link>
                  </li>
                ))}
                {!mainMenu?.items?.length && (
                  <>
                    <li className="mb-3"><Link href="/" className="footer-link text-muted">Home</Link></li>
                    <li className="mb-3"><Link href="/collections/all" className="footer-link text-muted">Shop All</Link></li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Explore (Footer Menu) */}
          <div className="col-lg-2 col-md-3 col-12 mb-2 mb-md-0">
            <details className="d-md-none border-bottom border-light pb-1">
              <summary className="fw-bold text-uppercase text-dark letter-spacing-wide py-3 d-flex justify-content-between align-items-center" style={{ outline: 'none', cursor: 'pointer' }}>
                Explore <span className="text-muted fs-6">▼</span>
              </summary>
              <ul className="list-unstyled mb-0 font-body fs-6 pt-2 pb-2">
                {menu?.items?.map((link) => (
                  <li className="mb-3" key={link.id}>
                    <Link href={getPath(link.url)} className="footer-link text-muted d-block" style={{ minHeight: "44px" }}>
                      {link.title}
                    </Link>
                  </li>
                ))}
                {!menu?.items?.length && (
                  <>
                    <li className="mb-3"><Link href="/collections/dogs" className="footer-link text-muted d-block" style={{ minHeight: "44px" }}>Dogs</Link></li>
                    <li className="mb-3"><Link href="/collections/cats" className="footer-link text-muted d-block" style={{ minHeight: "44px" }}>Cats</Link></li>
                  </>
                )}
              </ul>
            </details>
            <div className="d-none d-md-block">
              <h6 className="fw-bold mb-4 text-uppercase text-dark letter-spacing-wide">Explore</h6>
              <ul className="list-unstyled mb-0 font-body fs-6">
                {menu?.items?.map((link) => (
                  <li className="mb-3" key={link.id}>
                    <Link href={getPath(link.url)} className="footer-link text-muted">
                      {link.title}
                    </Link>
                  </li>
                ))}
                {!menu?.items?.length && (
                  <>
                    <li className="mb-3"><Link href="/collections/dogs" className="footer-link text-muted">Dogs</Link></li>
                    <li className="mb-3"><Link href="/collections/cats" className="footer-link text-muted">Cats</Link></li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Policies & Customer Care */}
          <div className="col-lg-3 col-md-6 col-12 mb-2 mb-md-0">
            <details className="d-md-none border-bottom border-light pb-1">
              <summary className="fw-bold text-uppercase text-dark letter-spacing-wide py-3 d-flex justify-content-between align-items-center" style={{ outline: 'none', cursor: 'pointer' }}>
                Customer Care <span className="text-muted fs-6">▼</span>
              </summary>
              <ul className="list-unstyled mb-0 font-body fs-6 pt-2 pb-2">
                {policyLinks.map((link, idx) => (
                  <li className="mb-3" key={idx}>
                    <Link href={link.url} className="footer-link text-muted d-block" style={{ minHeight: "44px" }}>
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
            <div className="d-none d-md-block">
              <h6 className="fw-bold mb-4 text-uppercase text-dark letter-spacing-wide">Customer Care</h6>
              <ul className="list-unstyled mb-0 font-body fs-6">
                {policyLinks.map((link, idx) => (
                  <li className="mb-3" key={idx}>
                    <Link href={link.url} className="footer-link text-muted">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        <hr className="my-4" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

        {/* FDA Compliance & Health disclaimer - Mandatory for Pet wellness niches */}
        <div className="disclaimer-box mb-4">
          <p className="small text-muted mb-0 font-body" style={{ fontSize: "0.785rem", lineHeight: "1.5" }}>
            <strong>* FDA & VETERINARY ADVISORY DISCLAIMER:</strong> The statements made regarding these products have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease. The details presented on this store are for informational purposes only and are not a substitute for advice from your veterinarian. Always consult your veterinarian before starting any wellness program or dietary supplements for your pets.
          </p>
        </div>

        <div className="row align-items-center">
          <div className="col-12 text-center">
            <p className="small text-muted mb-0">
              © {new Date().getFullYear()} {shop?.name || "Peteora"}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
