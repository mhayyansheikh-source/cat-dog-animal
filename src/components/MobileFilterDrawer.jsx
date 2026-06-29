"use client";

import React, { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CollectionFilters from "./CollectionFilters";

export default function MobileFilterDrawer({ filters, productCount }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!filters || filters.length === 0) return null;

  return (
    <div className="d-lg-none w-100 mb-4">
      {/* Sticky Mobile Filter Button */}
      <div 
        className="position-sticky bg-white py-3" 
        style={{ top: "54px", zIndex: 1020, borderBottom: "1px solid #E5E7EB", margin: "-24px -24px 24px -24px", padding: "0 24px" }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Showing <strong style={{ color: "#2A2A2A" }}>{productCount}</strong> products</p>
          <button 
            className="btn btn-outline-dark d-flex align-items-center gap-2 rounded-pill px-4"
            onClick={() => setIsOpen(true)}
            style={{ fontWeight: "600", fontSize: "14px" }}
          >
            <SlidersHorizontal size={16} />
            Filter & Sort
          </button>
        </div>
      </div>

      {/* Full-Screen Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: "fixed",
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 1040
              }}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                position: "fixed",
                top: 0, right: 0, bottom: 0,
                width: "85%",
                maxWidth: "360px",
                backgroundColor: "white",
                zIndex: 1050,
                boxShadow: "-10px 0 40px rgba(0,0,0,0.15)",
                display: "flex",
                flexDirection: "column"
              }}
            >
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
                <h5 className="fw-bold mb-0" style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif" }}>Filter & Sort</h5>
                <button className="btn-close" onClick={() => setIsOpen(false)}></button>
              </div>

              {/* Body */}
              <div className="flex-grow-1 p-4" style={{ overflowY: "auto" }}>
                <CollectionFilters filters={filters} />
              </div>

              {/* Footer */}
              <div className="p-4 border-top bg-light">
                <button 
                  className="btn w-100 py-3 fw-bold rounded-pill text-white" 
                  style={{ backgroundColor: "var(--charcoal, #2A2A2A)" }}
                  onClick={() => setIsOpen(false)}
                >
                  View Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
