"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";

export default function Header() {
  const { setIsCartOpen, cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.header 
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="premium-header border-bottom position-sticky top-0 z-3"
      style={{ background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)" }}
    >
      {/* Peteora Announcement Bar */}
      <div 
        className="d-flex justify-content-center align-items-center py-2 px-3 gap-2" 
        style={{ 
          backgroundColor: "var(--zesty-orange, #F5761A)", 
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

      <nav className="navbar navbar-expand-lg navbar-light py-3">
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
                    backgroundColor: "var(--zesty-orange, #F5761A)",
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
              className="btn p-2 border-0 z-3"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="collapse navbar-collapse d-none d-lg-block" id="navbarNav">
            <ul className="navbar-nav mx-auto mb-3 mb-lg-0 fw-semibold">
              <li className="nav-item px-2"><Link href="/" className="nav-link premium-nav-link">Home</Link></li>
              <li className="nav-item px-2"><Link href="/collections/dogs" className="nav-link premium-nav-link">🐶 Dogs</Link></li>
              <li className="nav-item px-2"><Link href="/collections/cats" className="nav-link premium-nav-link">🐱 Cats</Link></li>
              <li className="nav-item px-2"><Link href="/collections/accessories" className="nav-link premium-nav-link">Accessories</Link></li>
              <li className="nav-item px-2"><Link href="/collections/bundles" className="nav-link premium-nav-link">Bundles</Link></li>
            </ul>

            {/* Right Side Tools matched to design */}
            <div className="d-flex align-items-center gap-4 text-dark fs-5">
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
                      fontSize: "0.625rem", width: "18px", height: "18px", 
                      backgroundColor: "var(--zesty-orange, #F5761A)", marginTop: "-2px", marginLeft: "-2px"
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

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="position-fixed top-0 start-0 h-100 bg-white shadow-lg z-2"
            style={{ width: "80%", maxWidth: "300px", paddingTop: "80px" }}
          >
            <ul className="list-unstyled p-4 fs-5 fw-semibold d-flex flex-column gap-3">
              <li><Link href="/" onClick={() => setIsMenuOpen(false)} className="text-dark text-decoration-none d-block">Home</Link></li>
              <li><Link href="/collections/dogs" onClick={() => setIsMenuOpen(false)} className="text-dark text-decoration-none d-block">🐶 Dogs</Link></li>
              <li><Link href="/collections/cats" onClick={() => setIsMenuOpen(false)} className="text-dark text-decoration-none d-block">🐱 Cats</Link></li>
              <li><Link href="/collections/accessories" onClick={() => setIsMenuOpen(false)} className="text-dark text-decoration-none d-block">Accessories</Link></li>
              <li><Link href="/collections/bundles" onClick={() => setIsMenuOpen(false)} className="text-dark text-decoration-none d-block">Bundles</Link></li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark z-1"
            style={{ pointerEvents: "auto" }}
          />
        )}
      </AnimatePresence>

    </motion.header>
  );
}
