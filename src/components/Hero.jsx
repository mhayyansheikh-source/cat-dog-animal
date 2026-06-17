"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Calendar, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="position-relative overflow-hidden py-5 bg-soft-sand border-bottom">
      {/* Dynamic background shapes */}
      <div
        className="position-absolute rounded-circle opacity-10"
        style={{
          width: "300px",
          height: "300px",
          backgroundColor: "var(--zesty-orange)",
          top: "-50px",
          right: "-50px",
          filter: "blur(50px)",
        }}
      />
      <div
        className="position-absolute rounded-circle opacity-10"
        style={{
          width: "250px",
          height: "250px",
          backgroundColor: "var(--primary-gold)",
          bottom: "-50px",
          left: "-50px",
          filter: "blur(50px)",
        }}
      />

      <div className="container position-relative py-md-5">
        <div className="row align-items-center g-5">
          {/* Left Column: Text Content & CTAs */}
          <div className="col-lg-6 text-center text-lg-start">
            {/* Promo Ribbon */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill bg-white border shadow-sm mb-4"
            >
              <Sparkles size={16} className="text-zesty-orange" />
              <span className="small fw-bold text-charcoal-dark font-body">
                SALE ENDS MONDAY: Save 15% on subscriptions!
              </span>
            </motion.div>

            {/* Typewriter Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="display-4 fw-bold font-heading mb-3"
              style={{ lineHeight: "1.15" }}
            >
              Keep Your Furry Friends <br />
              <span style={{ color: "var(--zesty-orange)" }}>Zesty & Active</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lead text-muted mb-4 font-body"
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
                <button className="rounded-pill-cta btn-zesty-primary fs-5 py-3 px-4 shadow-sm hover-scale">
                  🐕 Shop for Dogs
                </button>
              </a>
              <a href="#shop-cats" className="text-decoration-none">
                <button className="rounded-pill-cta btn-zesty-secondary fs-5 py-3 px-4 shadow-sm hover-scale">
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
                <ShieldCheck size={16} className="text-forest-green" /> 100% NASC Audited Safety
              </span>
              <span>•</span>
              <span>🇺🇸 Free US Shipping Over $35</span>
              <span>•</span>
              <span>📦 Tracked 5-12 Day USPS Delivery</span>
            </motion.div>
          </div>

          {/* Right Column: Dynamic Animations */}
          <div className="col-lg-6 d-flex justify-content-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="position-relative"
              style={{ width: "100%", maxWidth: "450px" }}
            >
              {/* Playful Floating SVG Pet Graphic */}
              <motion.svg
                animate={{
                  y: [0, -12, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                viewBox="0 0 500 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-100 h-auto"
              >
                {/* Background Blob */}
                <path
                  d="M450 250C450 360.457 360.457 450 250 450C139.543 450 50 360.457 50 250C50 139.543 139.543 50 250 50C360.457 50 450 139.543 450 250Z"
                  fill="url(#paint0_linear_hero)"
                />
                
                {/* Dog Illustration Silhouette */}
                <path
                  d="M170 300C170 240 210 200 250 200C290 200 330 240 330 300C330 360 290 400 250 400C210 400 170 360 170 300Z"
                  fill="#FF7A00"
                />
                {/* Dog Ears */}
                <path d="M185 220C170 200 160 170 170 160C180 150 200 170 205 195Z" fill="#F7BE00" />
                <path d="M315 220C330 200 340 170 330 160C320 150 300 170 295 195Z" fill="#F7BE00" />
                
                {/* Cat Illustration Silhouette */}
                <path
                  d="M270 340C270 300 290 270 310 270C330 270 350 300 350 340C350 380 330 400 310 400C290 400 270 380 270 340Z"
                  fill="#00653B"
                />
                {/* Cat Ears */}
                <path d="M290 280L280 250L300 265Z" fill="#F7BE00" />
                <path d="M330 280L340 250L320 265Z" fill="#F7BE00" />

                {/* Paw Print Badge */}
                <g transform="translate(180, 310)">
                  <circle cx="50" cy="50" r="25" fill="white" />
                  <circle cx="50" cy="45" r="10" fill="#FF7A00" />
                  <circle cx="36" cy="35" r="5" fill="#F7BE00" />
                  <circle cx="64" cy="35" r="5" fill="#F7BE00" />
                  <circle cx="30" cy="48" r="5" fill="#FF7A00" />
                  <circle cx="70" cy="48" r="5" fill="#FF7A00" />
                </g>

                {/* SVG Definitions */}
                <defs>
                  <linearGradient
                    id="paint0_linear_hero"
                    x1="250"
                    y1="50"
                    x2="250"
                    y2="450"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#FF7A00" stopOpacity="0.15" />
                    <stop offset="1" stopColor="#F7BE00" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
