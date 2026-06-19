"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section
      className="position-relative overflow-hidden py-5 border-bottom"
      style={{
        background: "linear-gradient(135deg, #FDFAF5 0%, #FEF0E6 50%, #E0F5F2 100%)",
        minHeight: "580px",
        display: "flex",
        alignItems: "center"
      }}
    >
      <div className="container position-relative py-md-5">
        <div className="row align-items-center g-5">
          {/* Left Column: Text Content & CTAs */}
          <div className="col-lg-6 text-center text-lg-start">
            {/* Promo Ribbon */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-4"
              style={{
                backgroundColor: "var(--orange-light)",
                color: "var(--orange-dark)",
                border: "1.5px solid #F5C49A",
                fontSize: "13px",
                fontWeight: "800"
              }}
            >
              <Sparkles size={14} />
              <span>SALE ENDS MONDAY: Save 15% on subscriptions!</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="display-4 fw-bold font-heading mb-3"
              style={{ lineHeight: "1.1", color: "var(--charcoal)" }}
            >
              Keep Your Furry Friends <br />
              <span style={{ color: "var(--orange)" }}>Peteora &amp; Active</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lead text-muted mb-4 font-body"
              style={{ maxWidth: "480px" }}
            >
              Veterinarian-formulated supplement chewable bites that dogs and cats love. Direct-to-consumer sourcing provides premium active ingredients without retail inflation.
            </motion.p>

            {/* Dual CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3 mb-4"
            >
              <a href="#shop-dogs" className="text-decoration-none">
                <button
                  className="rounded-pill-cta btn-zesty-secondary fs-5 py-3 px-4 shadow-sm hover-scale"
                  style={{ backgroundColor: "var(--orange)", borderColor: "var(--orange)" }}
                >
                  🐕 Shop for Dogs
                </button>
              </a>
              <a href="#shop-cats" className="text-decoration-none">
                <button
                  className="rounded-pill-cta btn-zesty-primary fs-5 py-3 px-4 shadow-sm hover-scale"
                  style={{ backgroundColor: "var(--teal)", borderColor: "var(--teal)" }}
                >
                  🐈 Shop for Cats
                </button>
              </a>
            </motion.div>

            {/* Micro Trust points */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3 text-muted small"
            >
              <span className="d-flex align-items-center gap-1">
                <ShieldCheck size={16} style={{ color: "var(--teal)" }} /> 100% NASC Audited Safety
              </span>
              <span>•</span>
              <span>🇺🇸 Free US Shipping Over $35</span>
              <span>•</span>
              <span>📦 Tracked 5-12 Day USPS Delivery</span>
            </motion.div>
          </div>

          {/* Right Column: Collection Category Cards */}
          <div className="col-lg-6">
            <div className="row g-4 align-items-center">
              <div className="col-sm-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  whileHover={{ y: -6, boxShadow: "var(--shadow-hover)" }}
                  className="bg-white p-4 text-center rounded-card border shadow-sm cursor-pointer"
                  style={{ borderRadius: "var(--radius)" }}
                >
                  <span className="display-3 d-block mb-3">🐶</span>
                  <h3 className="h5 fw-bold font-heading mb-2">Dog Supplements</h3>
                  <p className="small text-muted font-body mb-4" style={{ minHeight: "40px" }}>
                    Premium formulas for joints, skin &amp; digestion
                  </p>
                  <a href="#shop-dogs" className="text-decoration-none">
                    <span
                      className="d-inline-block px-3 py-2 rounded-pill fw-bold small transition-all"
                      style={{
                        backgroundColor: "var(--orange-light)",
                        color: "var(--orange-dark)",
                        fontSize: "12px",
                        fontWeight: "800"
                      }}
                    >
                      Shop Dogs
                    </span>
                  </a>
                </motion.div>
              </div>

              <div className="col-sm-6 mt-sm-5">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  whileHover={{ y: -6, boxShadow: "var(--shadow-hover)" }}
                  className="bg-white p-4 text-center rounded-card border shadow-sm cursor-pointer"
                  style={{ borderRadius: "var(--radius)" }}
                >
                  <span className="display-3 d-block mb-3">🐱</span>
                  <h3 className="h5 fw-bold font-heading mb-2">Cat Supplements</h3>
                  <p className="small text-muted font-body mb-4" style={{ minHeight: "40px" }}>
                    Veterinarian-formulated daily support chewables
                  </p>
                  <a href="#shop-cats" className="text-decoration-none">
                    <span
                      className="d-inline-block px-3 py-2 rounded-pill fw-bold small transition-all"
                      style={{
                        backgroundColor: "var(--teal-light)",
                        color: "var(--teal-dark)",
                        fontSize: "12px",
                        fontWeight: "800"
                      }}
                    >
                      Shop Cats
                    </span>
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
