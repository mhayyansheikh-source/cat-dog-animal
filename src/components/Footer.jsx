"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, ExternalLink, ShieldCheck } from "lucide-react";

export default function Footer({ menu, mainMenu, shop, policies, collections }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
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
    <footer className="premium-footer pt-5 pb-4 mt-auto">
      <div className="container">
        <div className="row g-4 mb-5 justify-content-between">
          
          {/* Brand & Newsletter */}
          <div className="col-lg-4 col-md-6">
            <Link href="/" className="d-inline-block mb-4">
              {shop?.brand?.logo?.image?.url ? (
                <img src={shop.brand.logo.image.url} alt={shop?.name || "Logo"} style={{ height: "45px", width: "auto", filter: "brightness(0) invert(1)" }} />
              ) : (
                <img src="/peteora.png" alt="Peteora Logo" style={{ height: "45px", width: "auto" }} />
              )}
            </Link>
            <p className="text-white-50 font-body mb-4" style={{ fontSize: "0.95rem" }}>
              {shop?.description || "Premium supplements, treats, food, and accessories for happy, healthy cats and dogs. Science-backed ingredients, loved by pets worldwide."}
            </p>
            <form onSubmit={handleSubscribe} className="position-relative">
              <input 
                type="email" 
                className="form-control rounded-pill bg-dark border-secondary text-white ps-4 pe-5 py-2" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn position-absolute top-0 end-0 h-100 rounded-pill px-4 text-white fw-bold" style={{ backgroundColor: "var(--zesty-orange)" }}>
                {subscribed ? "Joined!" : "Join"}
              </button>
            </form>
          </div>

          {/* Quick Links (Main Menu) */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="fw-bold mb-4 text-uppercase text-white letter-spacing-wide">Quick Links</h6>
            <ul className="list-unstyled mb-0 font-body fs-6">
              {mainMenu?.items?.map((link) => (
                <li className="mb-3" key={link.id}>
                  <Link href={new URL(link.url, "https://peteora.com").pathname} className="footer-link text-white-50">
                    {link.title}
                  </Link>
                </li>
              ))}
              {!mainMenu?.items?.length && (
                <>
                  <li className="mb-3"><Link href="/" className="footer-link text-white-50">Home</Link></li>
                  <li className="mb-3"><Link href="/collections/all" className="footer-link text-white-50">Shop All</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Collections */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="fw-bold mb-4 text-uppercase text-white letter-spacing-wide">Collections</h6>
            <ul className="list-unstyled mb-0 font-body fs-6">
              {collections?.map((col) => (
                <li className="mb-3" key={col.id}>
                  <Link href={`/collections/${col.handle}`} className="footer-link text-white-50">
                    {col.title}
                  </Link>
                </li>
              ))}
              {!collections?.length && (
                <>
                  <li className="mb-3"><Link href="/collections/dogs" className="footer-link text-white-50">Dogs</Link></li>
                  <li className="mb-3"><Link href="/collections/cats" className="footer-link text-white-50">Cats</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Policies & Customer Care */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-4 text-uppercase text-white letter-spacing-wide">Customer Care</h6>
            <ul className="list-unstyled mb-0 font-body fs-6">
              {policyLinks.map((link, idx) => (
                <li className="mb-3" key={idx}>
                  <Link href={link.url} className="footer-link text-white-50">
                    {link.title}
                  </Link>
                </li>
              ))}
              {/* Fallback extra links if any from footer menu */}
              {menu?.items && menu.items.length > 0 && !menu.items[0]?.items && menu.items.map((link) => {
                if (!policyLinks.some(p => p.title === link.title)) {
                  return (
                    <li className="mb-3" key={link.id}>
                      <Link href={new URL(link.url, "https://peteora.com").pathname} className="footer-link text-white-50">
                        {link.title}
                      </Link>
                    </li>
                  )
                }
                return null;
              })}
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
              © {new Date().getFullYear()} {shop?.name || "Peteora"}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
