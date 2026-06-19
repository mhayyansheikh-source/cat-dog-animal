"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Undo2, Lock, FileText, Truck, Mail, Scale } from "lucide-react";

export default function PoliciesLayout({ children }) {
  const pathname = usePathname();

  const links = [
    { href: "/policies/refund-policy", label: "Return and refund policy", icon: Undo2 },
    { href: "/policies/privacy-policy", label: "Privacy policy", icon: Lock },
    { href: "/policies/terms-of-service", label: "Terms of service", icon: FileText },
    { href: "/policies/shipping-policy", label: "Shipping policy", icon: Truck },
    { href: "/policies/contact-information", label: "Contact information", icon: Mail },
    { href: "/policies/legal-notice", label: "Legal notice", icon: Scale },
  ];

  return (
    <div className="bg-soft-sand py-5 min-vh-100">
      <div className="container">
        {/* Page Title Header */}
        <div className="text-center mb-5">
          <span className="badge bg-forest-green text-white px-3 py-2 mb-2 rounded-pill small fw-bold tracking-wide">
            CUSTOMER TRUST & COMPLIANCE
          </span>
          <h1 className="font-heading display-6 fw-bold text-charcoal-dark">
            Store Policies & Legal Terms
          </h1>
          <p className="text-muted col-lg-6 mx-auto small font-body">
            Review our official terms, shipping commitments, and refund policies. Certified to meet US E-Commerce and international standards.
          </p>
        </div>

        <div className="row g-4">
          {/* Sticky Sidebar Navigation */}
          <div className="col-lg-4 col-md-5">
            <div className="card border-0 rounded-card shadow-sm p-3 sticky-top" style={{ top: "100px", zIndex: 10 }}>
              <h5 className="font-heading fs-6 text-muted text-uppercase fw-bold mb-3 px-2">
                Policy Directory
              </h5>
              <div className="nav flex-column nav-pills gap-1">
                {links.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded transition-all hover-scale ${
                        isActive
                          ? "text-white fw-bold shadow-sm"
                          : "text-charcoal-dark hover-bg-light"
                      }`}
                      style={{
                        backgroundColor: isActive ? "var(--forest-green)" : "transparent",
                        color: isActive ? "var(--white)" : "var(--charcoal-dark)",
                      }}
                    >
                      <Icon size={18} className={isActive ? "text-white" : "text-muted"} />
                      <span className="small font-body">{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Policy Document Content Area */}
          <div className="col-lg-8 col-md-7">
            <div className="card border-0 rounded-card shadow-sm p-4 p-md-5 bg-white">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
