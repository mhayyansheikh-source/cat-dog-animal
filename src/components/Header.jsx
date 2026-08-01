"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Search, Menu, X, PawPrint, ChevronRight } from "lucide-react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import PredictiveSearch from "@/components/PredictiveSearch";
import MarqueeTopBar from "@/components/MarqueeTopBar";

export default function Header({ menu, shop, collections, products }) {
  // 🔴 Fix: pull setIsCartOpen so the cart icon opens CartSheet, not /cart
  const { cartCount, setIsCartOpen } = useCart();

  const [isMenuOpen, setIsMenuOpen]   = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled]       = useState(false);

  // 🟢 Enhancement: shake state + prev-count tracker
  const [shake, setShake]   = useState(false);
  const prevCountRef        = useRef(cartCount);

  const { scrollY } = useScroll();

  // Body scroll lock while mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow    = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow    = "unset";
      document.body.style.touchAction = "auto";
    }
    return () => {
      document.body.style.overflow    = "unset";
      document.body.style.touchAction = "auto";
    };
  }, [isMenuOpen]);

  // 🟢 Enhancement: shake the cart icon whenever cartCount goes UP (item added)
  useEffect(() => {
    if (cartCount > prevCountRef.current) {
      setShake(true);
      const t = setTimeout(() => setShake(false), 650);
      return () => clearTimeout(t);
    }
    prevCountRef.current = cartCount;
  }, [cartCount]);

  const getPath = (url) => {
    if (!url) return "#";
    try {
      if (url.startsWith("/")) return url;
      return new URL(url, "https://peteora.com").pathname;
    } catch {
      return url;
    }
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  // 🟢 Capped display: never overflow the badge circle
  const badgeLabel = cartCount > 9 ? "9+" : cartCount;

  return (
    <header
      className="premium-header position-sticky top-0"
      style={{
        background: scrolled
          ? "rgba(255, 255, 255, 0.88)"
          : "rgba(255, 255, 255, 0.98)",
        backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "blur(0px)",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "blur(0px)",
        boxShadow: scrolled
          ? "0 4px 30px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.6) inset"
          : "0 1px 0 rgba(0,0,0,0.06)",
        transition: "background 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease",
        zIndex: 1000,
      }}
    >
      {/* 🟢 Pulse ring + shake keyframes (injected once, no external CSS needed) */}
      <style>{`
        @keyframes cart-badge-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245, 118, 26, 0.55); }
          60%       { box-shadow: 0 0 0 5px rgba(245, 118, 26, 0);   }
        }
        .cart-badge-pulse {
          animation: cart-badge-pulse 1.8s ease-in-out 3;
        }
      `}</style>

      {/* Animated Marquee Announcement Bar */}
      <MarqueeTopBar products={products} collections={collections} />

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

          {/* Logo (Center on Mobile, Left on Desktop) */}
          <Link
            href="/"
            className="navbar-brand d-flex align-items-center text-decoration-none mx-lg-0 mx-auto"
            style={{ maxWidth: "50%" }}
          >
            {shop?.brand?.logo?.image?.url ? (
              <img
                src={shop.brand.logo.image.url}
                alt={shop?.name || "Logo"}
                style={{ maxHeight: "38px", width: "auto", objectFit: "contain" }}
                fetchPriority="high"
                decoding="async"
              />
            ) : (
              <img
                src="/peteora.png"
                alt="Peteora Logo"
                style={{ maxHeight: "38px", width: "auto", objectFit: "contain" }}
                fetchPriority="high"
                decoding="async"
              />
            )}
          </Link>

          {/* ── Mobile Right Icons (Search & Cart) ── */}
          <div className="d-flex align-items-center gap-3 d-lg-none">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="btn p-0 border-0 bg-transparent text-charcoal-dark"
              aria-label="Open search"
            >
              <Search size={22} strokeWidth={2.5} />
            </button>

            {/* 🔴 FIX: was <Link href="/cart"> — now opens CartSheet */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="btn p-0 border-0 bg-transparent text-charcoal-dark position-relative"
              aria-label="Open cart"
            >
              {/* 🟢 Shake wrapper */}
              <motion.div
                animate={shake ? { x: [0, -4, 4, -4, 4, 0] } : {}}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                style={{ display: "inline-flex" }}
              >
                <ShoppingCart size={22} strokeWidth={2.5} />
              </motion.div>

              {/* 🟡 Mobile badge — now wrapped in AnimatePresence (same as desktop) */}
              <AnimatePresence mode="popLayout">
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="position-absolute top-0 start-100 translate-middle badge rounded-circle d-flex align-items-center justify-content-center text-white cart-badge-pulse"
                    style={{
                      fontSize: "0.6rem",
                      width: "17px",
                      height: "17px",
                      backgroundColor: "var(--zesty-orange)",
                      marginTop: "4px",
                      marginLeft: "-6px",
                    }}
                  >
                    {/* 🟡 Cap at 9+ to avoid overflow */}
                    {badgeLabel}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* ── Desktop Navigation Links ── */}
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

            {/* Right Side Tools */}
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
                style={{ transition: "transform 0.2s ease-in-out" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1) translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>

              {/* 🔴 FIX: was <Link href="/cart"> — now opens CartSheet */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="btn p-0 border-0 bg-transparent text-charcoal-dark position-relative"
                title="Open cart"
                aria-label="Open shopping cart"
              >
                {/* 🟢 Shake on item add */}
                <motion.div
                  animate={shake ? { x: [0, -4, 4, -4, 4, 0] } : {}}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                  style={{ display: "inline-flex" }}
                >
                  <ShoppingCart size={22} strokeWidth={2.5} />
                </motion.div>

                {/* 🟡 Desktop badge — capped + pulse ring */}
                <AnimatePresence mode="popLayout">
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="position-absolute top-0 start-100 translate-middle badge rounded-circle d-flex align-items-center justify-content-center text-white cart-badge-pulse"
                      style={{
                        fontSize: "0.625rem",
                        width: "18px",
                        height: "18px",
                        backgroundColor: "var(--zesty-orange, #F5761A)",
                        marginTop: "2px",
                        marginLeft: "-4px",
                      }}
                    >
                      {/* 🟡 Cap at 9+ to avoid overflow */}
                      {badgeLabel}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
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
              overflowY: "auto",
            }}
          >
            {/* Drawer Header */}
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
                      backdropFilter: "blur(5px)",
                    }}
                  >
                    <span className="fs-5 fw-bold">{item.title}</span>
                    <ChevronRight size={20} style={{ color: "var(--zesty-orange)" }} />
                  </Link>
                </motion.li>
              ))}
            </ul>

            {/* Bottom Promo */}
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
      <PredictiveSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        collections={collections}
      />
    </header>
  );
}
