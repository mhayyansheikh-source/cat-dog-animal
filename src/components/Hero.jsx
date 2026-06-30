"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Tag, Truck, Calendar, ChevronRight, ShieldCheck, CheckCircle } from "lucide-react";

export default function Hero() {
  return (
    <section className="position-relative overflow-hidden hero-revamped" style={{ backgroundColor: "var(--cream)", minHeight: "80vh", display: "flex", flexDirection: "column" }}>
      
      {/* Background Decorative Shapes */}
      <div className="hero-shape-orange position-absolute top-0 end-0"></div>
      <div className="hero-shape-teal position-absolute bottom-0 start-0"></div>

      <div className="container position-relative flex-grow-1 d-flex flex-column justify-content-center" style={{ paddingTop: "80px", paddingBottom: "40px", zIndex: 2 }}>
        <div className="row align-items-center g-5 flex-grow-1">
          
          {/* Left Content */}
          <div className="col-lg-6 text-center text-lg-start order-2 order-lg-1">
            
            {/* Promo Pill */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="d-inline-flex align-items-center gap-2 rounded-pill px-4 py-2 mb-4 shadow-sm"
              style={{ backgroundColor: "var(--orange)", color: "white", fontWeight: "800", letterSpacing: "1px", border: "2px solid white" }}
            >
              <Tag size={18} strokeWidth={3} />
              <span>FRIDAY OFFER</span>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-4"
            >
              <h1 className="font-heading fw-bold mb-1" style={{ fontSize: "clamp(48px, 6vw, 72px)", color: "var(--teal)", lineHeight: "1" }}>
                SAVE $15
              </h1>
              <h2 className="font-heading fw-bold" style={{ fontSize: "clamp(28px, 4vw, 42px)", color: "var(--charcoal)", lineHeight: "1.2" }}>
                ON EVERY PET PRODUCTS
              </h2>
            </motion.div>

            {/* Value Props */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-5"
            >
              <div className="d-flex align-items-center gap-3 mb-3 justify-content-center justify-content-lg-start">
                <div className="rounded-circle d-flex align-items-center justify-content-center text-white" style={{ backgroundColor: "var(--teal)", width: "48px", height: "48px" }}>
                  <Truck size={24} />
                </div>
                <div className="fw-bold" style={{ fontSize: "20px", color: "var(--charcoal)" }}>
                  PLUS, GET <span style={{ color: "var(--orange)" }}>FREE SHIPPING</span>
                  <span className="ms-2 px-2 py-1 rounded text-white" style={{ backgroundColor: "var(--teal)", fontSize: "14px", verticalAlign: "middle" }}>OVER $50</span>
                </div>
              </div>
              
              <div className="d-flex align-items-center gap-2 justify-content-center justify-content-lg-start" style={{ color: "var(--orange)" }}>
                <Calendar size={22} />
                <span className="fw-bold fs-5">ENDS THIS FRIDAY!</span>
              </div>
            </motion.div>

            {/* CTA & Trust */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="d-flex flex-column align-items-center align-items-lg-start gap-4"
            >
              <Link href="/collections/all" className="text-decoration-none">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn rounded-pill d-inline-flex align-items-center gap-2 shadow-lg"
                  style={{ backgroundColor: "var(--orange)", color: "white", padding: "16px 40px", fontSize: "22px", fontWeight: "800", border: "none" }}
                >
                  SHOP NOW
                  <span className="bg-white text-orange rounded-circle d-flex align-items-center justify-content-center ms-2" style={{ width: "32px", height: "32px", color: "var(--orange)" }}>
                    <ChevronRight size={20} strokeWidth={3} />
                  </span>
                </motion.button>
              </Link>

              <div className="bg-white rounded p-3 d-inline-flex align-items-center gap-3 shadow-sm border" style={{ borderColor: "var(--teal-light) !important" }}>
                <div className="text-teal" style={{ color: "var(--teal)" }}>
                  <ShieldCheck size={40} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="fw-bold text-uppercase" style={{ fontSize: "14px", color: "var(--charcoal)", letterSpacing: "0.5px" }}>Trusted By Pet Parents</div>
                  <div className="d-flex align-items-center gap-2">
                    <div className="d-flex text-warning">
                      {[1, 2, 3, 4, 5].map((i) => <span key={i}>⭐</span>)}
                    </div>
                    <strong className="text-teal" style={{ color: "var(--teal)", fontSize: "18px" }}>4.9/5</strong>
                  </div>
                  <div className="text-muted" style={{ fontSize: "12px" }}>Based on 2,500+ Reviews</div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right Content - Hero Image */}
          <div className="col-lg-6 position-relative mt-5 mt-lg-0 order-1 order-lg-2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="position-relative w-100 mx-auto"
              style={{ aspectRatio: "4/3", zIndex: 5, maxWidth: "600px" }}
            >
              <Image 
                src="/hero-section-peteora.png" 
                alt="Happy Dogs and Cats" 
                fill 
                priority
                sizes="(max-width: 991px) 100vw, 50vw"
                style={{ objectFit: "contain", objectPosition: "bottom" }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Bar Features */}
      <div className="w-100 position-relative z-3" style={{ borderTop: "1px solid rgba(0,0,0,0.05)", backgroundColor: "white" }}>
        <div className="container py-3">
          <div className="d-flex flex-wrap justify-content-center justify-content-lg-between align-items-center gap-4">
            
            <div className="d-flex align-items-center gap-2">
              <CheckCircle className="text-teal" style={{ color: "var(--teal)" }} size={24} />
              <div style={{ lineHeight: "1.2" }}>
                <div className="fw-bold" style={{ color: "var(--charcoal)", fontSize: "14px" }}>HIGH QUALITY</div>
                <div className="text-muted" style={{ fontSize: "14px" }}>Products</div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <CheckCircle className="text-teal" style={{ color: "var(--teal)" }} size={24} />
              <div style={{ lineHeight: "1.2" }}>
                <div className="fw-bold" style={{ color: "var(--charcoal)", fontSize: "14px" }}>SAFE & PET</div>
                <div className="text-muted" style={{ fontSize: "14px" }}>Friendly</div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <div className="rounded-circle text-white d-flex align-items-center justify-content-center" style={{ backgroundColor: "var(--teal)", width: "24px", height: "24px" }}>
                 <ShieldCheck size={14} strokeWidth={3} />
              </div>
              <div style={{ lineHeight: "1.2" }}>
                <div className="fw-bold" style={{ color: "var(--charcoal)", fontSize: "14px" }}>SATISFACTION</div>
                <div className="text-muted" style={{ fontSize: "14px" }}>Guaranteed</div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}
