"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, ExternalLink, ShieldCheck } from "lucide-react";

export default function Footer({ menu, shop }) {
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
              {menu?.items && menu.items.map((column) => (
              <div className="col-lg-4 col-md-4" key={column.id}>
                <h6 className="fw-bold mb-4 text-uppercase text-white letter-spacing-wide">{column.title}</h6>
                <ul className="list-unstyled mb-0 font-body fs-6">
                  {column.items && column.items.map((link) => (
                    <li className="mb-3" key={link.id}>
                      <Link href={new URL(link.url, "https://peteora.com").pathname} className="footer-link text-white-50">
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
