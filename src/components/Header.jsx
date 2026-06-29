"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Search, Menu, X, PawPrint, ChevronRight } from "lucide-react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import PredictiveSearch from "@/components/PredictiveSearch";

export default function Header({ menu, shop, collections }) {
  const { setIsCartOpen, cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
    };
  }, [isMenuOpen]);

  const getPath = (url) => {
    if (!url) return "#";
    try {
      if (url.startsWith('/')) return url;
      return new URL(url, "https://peteora.com").pathname;
    } catch (e) {
      return url;
    }
  };

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
      className="premium-header border-bottom position-sticky top-0"
      style={{ background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)" }}
    >
      {/* Peteora Announcement Bar */}
      <div 
        className="d-flex justify-content-center align-items-center py-2 px-3 gap-1 overflow-hidden" 
        style={{ 
          backgroundColor: "#198e7a", 
          color: "white",
          fontSize: "13px",
          fontWeight: "700",
          whiteSpace: "nowrap"
        }}
      >
        <span className="text-truncate">🐾 Free Shipping Over $50 <span className="d-none d-md-inline">· Subscribe & Save 20% ·</span></span>
        <Link href={collections?.length > 0 ? `/collections/${collections[0].handle}` : "/collections/all"} className="text-white text-decoration-underline ms-1 flex-shrink-0">
          Shop Now
        </Link>
      </div>

      <nav className="navbar navbar-expand-lg navbar-light py-3">
        <div className="container d-flex align-items-center justify-content-between">
          
          {/* Mobile Menu Toggle (Left) */}
          <div className="d-lg-none">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="btn p-2 border-0 d-flex flex-column align-items-center justify-content-center"
              aria-label="Toggle navigation menu"
              style={{ color: "var(--forest-green)" }}
            >
              {isMenuOpen ? <X size={28} /> : (
                <div className="d-flex flex-column align-items-center">
                  <Menu size={26} strokeWidth={2.5} />
                </div>
              )}
            </button>
          </div>

          {/* Logo Brand Signature (Center on Mobile, Left on Desktop) */}
          <Link href="/" className="navbar-brand d-flex align-items-center text-decoration-none mx-lg-0 mx-auto" style={{ maxWidth: "50%" }}>
            {shop?.brand?.logo?.image?.url ? (
              <img src={shop.brand.logo.image.url} alt={shop?.name || "Logo"} style={{ maxHeight: "38px", width: "auto", objectFit: "contain" }} fetchPriority="high" decoding="async" />
            ) : (
              <img src="/peteora.png" alt="Peteora Logo" style={{ maxHeight: "38px", width: "auto", objectFit: "contain" }} fetchPriority="high" decoding="async" />
            )}
          </Link>

          {/* Mobile Right Icons (Search & Cart) */}
          <div className="d-flex align-items-center gap-3 d-lg-none">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="btn p-0 border-0 bg-transparent text-charcoal-dark"
            >
              <Search size={22} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="btn p-0 border-0 position-relative text-charcoal-dark"
              aria-label="Open cart"
            >
              <ShoppingCart size={22} strokeWidth={2.5} />
              {cartCount > 0 && (
                <span 
                  className="position-absolute top-0 start-100 translate-middle badge rounded-circle d-flex align-items-center justify-content-center text-white" 
                  style={{ 
                    fontSize: "0.6rem", 
                    width: "16px", 
                    height: "16px", 
                    backgroundColor: "var(--zesty-orange)",
                    marginTop: "4px",
                    marginLeft: "-6px"
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="collapse navbar-collapse d-none d-lg-block" id="navbarNav">
            <ul className="navbar-nav mx-auto mb-3 mb-lg-0 fw-semibold">
                {menu?.items && menu.items.map((item) => (
                  <li className="nav-item px-2" key={item.id}>
                    <Link href={getPath(item.url)} className="nav-link premium-nav-link">
                      {item.title}
                    </Link>
                  </li>
                ))}
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
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="position-fixed top-0 start-0 shadow-lg"
            style={{ 
              height: "100vh",
              width: "85%", 
              maxWidth: "360px", 
              paddingTop: "80px",
              background: "linear-gradient(145deg, var(--forest-green) 0%, #1a6b58 100%)",
              zIndex: 1040,
              overflowY: "auto"
            }}
          >
            {/* Drawer Header with Logo Area (Optional, but looks premium) */}
            <div className="px-4 pb-4 border-bottom border-light border-opacity-25 mb-4">
               <h5 className="text-white font-heading fw-bold letter-spacing-wide mb-0 d-flex align-items-center gap-2">
                 <PawPrint size={24} style={{ color: "var(--zesty-orange)" }} /> 
                 EXPLORE PETEORA
               </h5>
            </div>

            {/* Mobile Navigation Links */}
            <ul className="list-unstyled mb-0 font-body px-3">
              {menu?.items && menu.items.map((item) => (
                  <motion.li 
                    whileHover={{ x: 10 }}
                    whileTap={{ scale: 0.98 }}
                    className="mb-3" 
                    key={item.id}
                  >
                    <Link 
                      href={new URL(item.url, "https://peteora.com").pathname} 
                      onClick={() => setIsMenuOpen(false)} 
                      className="d-flex align-items-center justify-content-between text-decoration-none text-white p-3 rounded-4"
                      style={{ 
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(5px)"
                      }}
                    >
                      <span className="fs-5 fw-bold">{item.title}</span>
                      <ChevronRight size={20} style={{ color: "var(--zesty-orange)" }} />
                    </Link>
                  </motion.li>
                ))}
            </ul>

            {/* Bottom Promo/Action in Menu */}
            <div className="position-absolute bottom-0 w-100 p-4">
              <div 
                className="rounded-4 p-3 text-center"
                style={{ backgroundColor: "rgba(245, 118, 26, 0.15)", border: "1px solid var(--zesty-orange)" }}
              >
                <p className="text-white small fw-bold mb-2">🐾 Join the Peteora Family!</p>
                <Link 
                  href="/collections/bundles" 
                  onClick={() => setIsMenuOpen(false)}
                  className="btn btn-sm w-100 text-white fw-bold rounded-pill"
                  style={{ backgroundColor: "var(--zesty-orange)" }}
                >
                  Shop Bundles & Save
                </Link>
              </div>
            </div>
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
            className="position-fixed top-0 start-0 w-100 bg-dark"
            style={{ height: "100vh", zIndex: 1030, pointerEvents: "auto" }}
          />
        )}
      </AnimatePresence>

      {/* Predictive Search Overlay */}
      <PredictiveSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

    </motion.header>
  );
}
