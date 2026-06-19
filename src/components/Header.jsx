"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Search, Menu, X, Star } from "lucide-react";

export default function Header() {
  const { setIsCartOpen, cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky-top bg-white border-bottom shadow-sm">
      {/* Dropshipping-Urgency Announcement Bar */}
      <div className="announcement-bar d-flex justify-content-center align-items-center py-2 px-3 gap-2">
        <span className="badge bg-warning text-dark font-weight-bold">⚡ EXCLUSIVE USA DEAL</span>
        <span className="small text-white">Free Tracked 5-12 Day Shipping to the United States on all orders over $35!</span>
      </div>

      <nav className="navbar navbar-expand-lg navbar-light py-3">
        <div className="container">
          {/* Logo Brand Signature */}
          <Link href="/" className="navbar-brand d-flex align-items-center text-decoration-none">
            {/* SVG Custom Logo (Animated Paw + Wordmark) */}
            <svg
              className="me-2"
              width="40"
              height="40"
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
            <span className="font-heading fs-3 fw-bold tracking-wide" style={{ color: "var(--zesty-orange)" }}>
              Pet<span style={{ color: "var(--forest-green)" }}>eora</span>
            </span>
          </Link>

          {/* Toggle buttons for mobile */}
          <div className="d-flex align-items-center gap-2 d-lg-none">
            <button
              onClick={() => setIsCartOpen(true)}
              className="btn position-relative p-2"
              aria-label="Open cart"
            >
              <ShoppingCart size={24} style={{ color: "var(--charcoal-dark)" }} />
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
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
                <Link href="/" className="nav-link hover-scale" style={{ color: "var(--charcoal-dark)" }}>
                  Home
                </Link>
              </li>
              <li className="nav-item px-2">
                <a href="#shop-dogs" className="nav-link hover-scale" style={{ color: "var(--charcoal-dark)" }}>
                  Dog Supplements
                </a>
              </li>
              <li className="nav-item px-2">
                <a href="#shop-cats" className="nav-link hover-scale" style={{ color: "var(--charcoal-dark)" }}>
                  Cat Supplements
                </a>
              </li>
              <li className="nav-item px-2">
                <a href="#science" className="nav-link hover-scale" style={{ color: "var(--charcoal-dark)" }}>
                  Science & Safety
                </a>
              </li>
              <li className="nav-item px-2">
                <a href="#dosage-finder" className="nav-link hover-scale fw-bold text-zesty-orange">
                  Dosage Quiz
                </a>
              </li>
            </ul>

            {/* Right Side Tools */}
            <div className="d-none d-lg-flex align-items-center gap-3">
              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="btn position-relative d-flex align-items-center justify-content-center p-2 rounded-circle hover-scale"
                style={{ backgroundColor: "var(--soft-sand)", border: "1px solid var(--pale-gray)" }}
                aria-label="Open shopping cart"
              >
                <ShoppingCart size={22} style={{ color: "var(--charcoal-dark)" }} />
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
