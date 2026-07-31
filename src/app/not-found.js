"use client";

import Link from "next/link";
import { Search, Bone } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="container py-5 d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: "70vh" }}>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <h1 className="font-heading fw-bold mb-3 display-1 text-zesty-orange" style={{ fontSize: "6rem" }}>404</h1>
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
        transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
        className="mb-4 text-forest-green"
      >
        <Bone size={80} strokeWidth={1.5} />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="font-heading fw-bold mb-4">Oops! We dug too deep...</h2>
        <p className="text-muted lead mb-5 max-w-md mx-auto" style={{ maxWidth: "500px" }}>
          We couldn't find the page you were looking for. It might have been moved, deleted, or buried in the backyard.
        </p>
      </motion.div>
      
      <motion.div 
        className="d-flex gap-3 justify-content-center flex-wrap"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Link href="/" className="btn btn-zesty-primary rounded-pill px-5 py-3 fw-bold text-uppercase hover-scale">
          Return to Homepage
        </Link>
        <button 
          className="btn btn-outline-dark rounded-pill px-4 py-3 d-flex align-items-center gap-2 fw-bold hover-scale"
          onClick={() => {
            const searchBtn = document.querySelector('button[title="Search"]');
            if (searchBtn) searchBtn.click();
          }}
        >
          <Search size={18} />
          Search Store
        </button>
      </motion.div>
    </div>
  );
}
