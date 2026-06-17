"use client";

import React from "react";
import { motion } from "framer-motion";

const concerns = [
  {
    id: "joint",
    title: "Joint & Mobility",
    desc: "Glucosamine and Chondroitin for running, jumping, and flexibility.",
    emoji: "🦴",
    color: "#FF7A00",
    bg: "rgba(255, 122, 0, 0.05)",
    svgPath: "M50 20C40 20 30 25 30 35C30 45 40 45 45 45L45 55C40 55 30 55 30 65C30 75 40 80 50 80C60 80 70 75 70 65C70 55 60 55 55 55L55 45C60 45 70 45 70 35C70 25 60 20 50 20Z"
  },
  {
    id: "calming",
    title: "Stress & Calmness",
    desc: "L-Theanine and Ashwagandha to ease hyperactive and anxious behavior.",
    emoji: "🧘",
    color: "#F7BE00",
    bg: "rgba(247, 190, 0, 0.05)",
    svgPath: "M50 15C55 15 60 20 60 25C60 30 55 35 50 35C45 35 40 30 40 25C40 20 45 15 50 15ZM30 50C30 40 40 37 50 37C60 37 70 40 70 50L70 80L30 80L30 50Z"
  },
  {
    id: "gut",
    title: "Digestive & Gut",
    desc: "Clinically studied Probiotics to balance microflora and soothe bloating.",
    emoji: "🥬",
    color: "#00653B",
    bg: "rgba(0, 101, 59, 0.05)",
    svgPath: "M35 30C35 30 40 20 50 20C60 20 65 30 65 30C65 30 70 45 60 60C50 75 50 80 50 80C50 80 50 75 40 60C30 45 35 30 35 30Z"
  },
  {
    id: "skin",
    title: "Skin & Seasonal",
    desc: "Wild Alaskan Omega-3 Salmon Oil for itch relief and shiny coats.",
    emoji: "🌱",
    color: "#217B37",
    bg: "rgba(33, 123, 55, 0.05)",
    svgPath: "M25 50C25 35 35 25 50 25C65 25 75 35 75 50C75 65 65 75 50 75C35 75 25 65 25 50Z"
  }
];

export default function ConcernGrid() {
  return (
    <section id="concern-grid" className="py-5 bg-white">
      <div className="container">
        <div className="text-center mb-5">
          <span className="text-zesty-orange fw-bold text-uppercase small tracking-wider font-body">
            Targeted Pet Solutions
          </span>
          <h2 className="font-heading display-6 fw-bold mt-2">
            Shop supplements by health concern
          </h2>
          <p className="text-muted font-body max-w-lg mx-auto">
            Each formula features targeted active ingredients clinically backed to solve common puppy and kitten wellness issues.
          </p>
        </div>

        <div className="row g-4">
          {concerns.map((item, index) => (
            <div key={item.id} className="col-lg-3 col-sm-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-card p-4 text-center h-100 d-flex flex-column align-items-center justify-content-between hover-scale shadow-sm"
                style={{ backgroundColor: "var(--white)", borderColor: "var(--pale-gray)" }}
              >
                {/* SVG Icon Container with custom background */}
                <div
                  className="rounded-circle p-3 mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: item.bg,
                  }}
                >
                  <svg
                    width="44"
                    height="44"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d={item.svgPath}
                      fill={item.color}
                      stroke={item.color}
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                <div className="flex-grow-1 text-center">
                  <h5 className="font-heading fw-bold mb-2">{item.title}</h5>
                  <p className="small text-muted font-body mb-4">{item.desc}</p>
                </div>

                {/* Styled text action link */}
                <a
                  href={`#catalog-section`}
                  className="small fw-bold text-decoration-none d-inline-flex align-items-center gap-1 font-body"
                  style={{ color: item.color }}
                >
                  View Solutions <span className="fs-6">→</span>
                </a>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
