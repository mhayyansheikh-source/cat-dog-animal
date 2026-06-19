"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Search, Menu, X } from "lucide-react";

export default function Header() {
  const { setIsCartOpen, cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="premium-header border-bottom">
      {/* Peteora Announcement Bar */}
      <div 
        className="d-flex justify-content-center align-items-center py-2 px-3 gap-2" 
        style={{ 
          backgroundColor: "var(--orange)", 
          color: "white",
          fontSize: "14px",
          fontWeight: "700"
        }}
      >
        <span>🐾 Free Shipping on Orders Over $50 · Subscribe & Save 20% · </span>
        <Link href="/collections/cats" className="text-white text-decoration-underline ms-1">
          Shop Now
        </Link>
      </div>

      <nav className="navbar navbar-expand-lg navbar-light py-3 bg-white">
        <div className="container">
          {/* Logo Brand Signature */}
          <Link href="/" className="navbar-brand d-flex align-items-center text-decoration-none">
            <img src="/peteora.png" alt="Peteora Logo" style={{ height: "45px", width: "auto" }} />
          </Link>

          {/* Toggle buttons for mobile */}
          <div className="d-flex align-items-center gap-2 d-lg-none">
            <button
              onClick={() => setIsCartOpen(true)}
              className="btn p-2 border-0 position-relative"
              aria-label="Open cart"
            >
              <span style={{ fontSize: "22px" }}>🛒</span>
              {cartCount > 0 && (
                <span 
                  className="position-absolute top-0 start-100 translate-middle badge rounded-circle d-flex align-items-center justify-content-center text-white" 
                  style={{ 
                    fontSize: "0.625rem", 
                    width: "18px", 
                    height: "18px", 
                    backgroundColor: "var(--orange)",
                    marginTop: "8px",
                    marginLeft: "-6px"
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="btn p-2 border-0"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

          {/* Navigation Links & Search */}
          <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`} id="navbarNav">
            <ul className="navbar-nav mx-auto mb-3 mb-lg-0 fw-semibold">
              <li className="nav-item px-2">
                <Link href="/" className="nav-link premium-nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item px-2">
                <Link href="/collections/dogs" className="nav-link premium-nav-link">
                  🐶 Dogs
                </Link>
              </li>
              <li className="nav-item px-2">
                <Link href="/collections/cats" className="nav-link premium-nav-link">
                  🐱 Cats
                </Link>
              </li>
              <li className="nav-item px-2">
                <Link href="/collections/accessories" className="nav-link premium-nav-link">
                  Accessories
                </Link>
              </li>
              <li className="nav-item px-2">
                <Link href="/collections/bundles" className="nav-link premium-nav-link">
                  Bundles
                </Link>
              </li>
            </ul>

            {/* Right Side Tools matched to design */}
            <div className="d-none d-lg-flex align-items-center gap-4 text-dark fs-5">
              <span className="cursor-pointer hover-scale" style={{ cursor: "pointer" }} title="Search">🔍</span>
              <span className="cursor-pointer hover-scale" style={{ cursor: "pointer" }} title="Account">👤</span>
              <span 
                className="cursor-pointer hover-scale position-relative" 
                onClick={() => setIsCartOpen(true)}
                title="Cart"
                style={{ userSelect: "none", cursor: "pointer" }}
              >
                🛒
                {cartCount > 0 && (
                  <span 
                    className="position-absolute top-0 start-100 translate-middle badge rounded-circle d-flex align-items-center justify-content-center text-white" 
                    style={{ 
                      fontSize: "0.625rem", 
                      width: "18px", 
                      height: "18px", 
                      backgroundColor: "var(--orange)",
                      marginTop: "-2px",
                      marginLeft: "-2px"
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
