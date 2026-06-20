"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import PredictiveSearch from "@/components/PredictiveSearch";

export default function Header({ menu }) {
  const { setIsCartOpen, cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
              <ShoppingCart size={24} strokeWidth={2.5} />
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
              {menu?.items ? (
                menu.items.map((item) => (
                  <li className="nav-item px-2" key={item.id}>
                    <Link href={new URL(item.url, "http://localhost").pathname} className="nav-link premium-nav-link">
                      {item.title}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li className="nav-item px-2"><Link href="/" className="nav-link premium-nav-link">Home</Link></li>
                  <li className="nav-item px-2"><Link href="/collections/dogs" className="nav-link premium-nav-link">🐶 Dogs</Link></li>
                  <li className="nav-item px-2"><Link href="/collections/cats" className="nav-link premium-nav-link">🐱 Cats</Link></li>
                  <li className="nav-item px-2"><Link href="/collections/accessories" className="nav-link premium-nav-link">Accessories</Link></li>
                  <li className="nav-item px-2"><Link href="/collections/bundles" className="nav-link premium-nav-link">Bundles</Link></li>
                  <li className="nav-item px-2"><Link href="/collections/replacement-parts" className="nav-link premium-nav-link">Parts</Link></li>
                </>
              )}
            </ul>

            {/* Right Side Tools matched to design */}
            <div className="d-flex align-items-center gap-4 text-dark fs-5">
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className="btn p-0 border-0 bg-transparent text-charcoal-dark"
                title="Search"
                aria-label="Open search"
              >
                <Search size={22} strokeWidth={2.5} />
              </motion.button>

              <Link 
                href="/account"
                className="btn p-0 border-0 bg-transparent text-charcoal-dark d-flex align-items-center justify-content-center transition-transform hover-scale"
                title="Account"
                aria-label="User account"
                style={{ transition: 'transform 0.2s ease-in-out' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </Link>

              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="btn p-0 border-0 bg-transparent text-charcoal-dark position-relative" 
                onClick={() => setIsCartOpen(true)}
                title="Cart"
                aria-label="Shopping cart"
              >
                <ShoppingCart size={22} strokeWidth={2.5} />
                <AnimatePresence mode="popLayout">
                  {cartCount > 0 && (
                    <motion.span 
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="position-absolute top-0 start-100 translate-middle badge rounded-circle d-flex align-items-center justify-content-center text-white" 
                      style={{ 
                        fontSize: "0.625rem", width: "18px", height: "18px", 
                        backgroundColor: "var(--zesty-orange, #F5761A)", marginTop: "2px", marginLeft: "-4px"
                      }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
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
            {/* Mobile Navigation Links */}
            <ul className="list-unstyled mb-0 font-body fs-5 p-4">
              {menu?.items ? (
                menu.items.map((item) => (
                  <li className="mb-4" key={item.id}>
                    <Link href={new URL(item.url, "http://localhost").pathname} onClick={() => setIsMenuOpen(false)} className="text-decoration-none text-charcoal-dark d-block">
                      {item.title}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li className="mb-4"><Link href="/" onClick={() => setIsMenuOpen(false)} className="text-decoration-none text-charcoal-dark d-block">Home</Link></li>
                  <li className="mb-4"><Link href="/collections/dogs" onClick={() => setIsMenuOpen(false)} className="text-decoration-none text-charcoal-dark d-block">🐶 For Dogs</Link></li>
                  <li className="mb-4"><Link href="/collections/cats" onClick={() => setIsMenuOpen(false)} className="text-decoration-none text-charcoal-dark d-block">🐱 For Cats</Link></li>
                  <li className="mb-4"><Link href="/collections/accessories" onClick={() => setIsMenuOpen(false)} className="text-decoration-none text-charcoal-dark d-block">Accessories</Link></li>
                  <li className="mb-4"><Link href="/collections/bundles" onClick={() => setIsMenuOpen(false)} className="text-decoration-none text-charcoal-dark d-block">Value Bundles</Link></li>
                  <li className="mb-4"><Link href="/collections/replacement-parts" onClick={() => setIsMenuOpen(false)} className="text-decoration-none text-charcoal-dark d-block">Replacement Parts</Link></li>
                </>
              )}
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

      {/* Predictive Search Overlay */}
      <PredictiveSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

    </motion.header>
  );
}
