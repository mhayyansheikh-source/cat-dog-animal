"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PredictiveSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.products || []);
      } catch (error) {
        console.error("Predictive search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark z-3"
            style={{ pointerEvents: "auto" }}
          />
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="position-fixed top-0 start-0 w-100 bg-white shadow-lg z-3 border-bottom"
            style={{ maxHeight: "80vh", display: "flex", flexDirection: "column" }}
          >
            <div className="container py-4">
              <div className="d-flex align-items-center gap-3 border-bottom pb-3">
                <Search size={24} className="text-muted" />
                <input
                  ref={inputRef}
                  type="text"
                  className="form-control border-0 shadow-none fs-4"
                  placeholder="Search for products, brands and more..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={onClose} className="btn btn-light rounded-circle p-2">
                  <X size={24} />
                </button>
              </div>

              <div className="overflow-auto mt-4" style={{ maxHeight: "60vh" }}>
                {isLoading && (
                  <div className="text-center py-5">
                    <Loader2 size={32} className="text-zesty-orange spin" style={{ animation: "spin 1s linear infinite" }} />
                    <style>{`
                      @keyframes spin { 100% { transform: rotate(360deg); } }
                    `}</style>
                  </div>
                )}

                {!isLoading && query.length >= 2 && results.length === 0 && (
                  <div className="text-center py-5 text-muted">
                    <Search size={48} className="mb-3 opacity-50" />
                    <h5>No results found for "{query}"</h5>
                    <p>Try checking your spelling or using more general terms</p>
                  </div>
                )}

                {!isLoading && results.length > 0 && (
                  <div>
                    <h6 className="text-muted text-uppercase mb-3 font-heading fw-bold">Products</h6>
                    <div className="row g-3">
                      {results.map((product) => (
                        <div key={product.id} className="col-12 col-md-6 col-lg-4">
                          <Link href={`/product/${product.handle}`} onClick={onClose} className="text-decoration-none">
                            <motion.div 
                              whileHover={{ scale: 1.02, backgroundColor: "var(--soft-sand)" }}
                              className="d-flex gap-3 align-items-center p-2 rounded transition-all"
                            >
                              <div className="rounded border bg-white" style={{ width: "60px", height: "60px", position: "relative" }}>
                                {product.image && (
                                  <Image
                                    src={product.image}
                                    alt={product.title}
                                    fill
                                    sizes="60px"
                                    className="object-fit-contain p-1"
                                  />
                                )}
                              </div>
                              <div>
                                <span className="d-block fw-bold text-dark font-body">{product.title}</span>
                                <span className="text-zesty-orange fw-bold">${product.price}</span>
                              </div>
                            </motion.div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!query && (
                  <div className="py-3">
                    <h6 className="text-muted text-uppercase mb-3 font-heading fw-bold">Popular Searches</h6>
                    <div className="d-flex gap-2 flex-wrap">
                      {["Dog Supplements", "Cat Treats", "Travel Beds", "Bundles"].map(term => (
                        <button 
                          key={term} 
                          onClick={() => setQuery(term)}
                          className="btn btn-outline-secondary rounded-pill px-3 py-1 btn-sm"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
