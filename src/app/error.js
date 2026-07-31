"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCcw, Wrench } from "lucide-react";
import { motion } from "framer-motion";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Next.js Error Boundary caught an error:", error);
  }, [error]);

  return (
    <div className="container py-5 d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: "70vh" }}>
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="mb-4 text-warning"
      >
        <motion.div
          animate={{ rotate: [-15, 15, -15] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <Wrench size={80} strokeWidth={1.5} color="var(--orange)" />
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="font-heading fw-bold mb-3 display-4">Oops! Something went wrong.</h1>
        <p className="text-muted lead mb-5 max-w-md mx-auto" style={{ maxWidth: "500px" }}>
          We hit a little snag on our end. Don't worry, our team has been notified and we're working hard to fix it!
        </p>
      </motion.div>
      
      <motion.div 
        className="d-flex gap-3 justify-content-center flex-wrap"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={() => reset()}
          className="btn btn-outline-dark rounded-pill px-4 py-3 d-flex align-items-center gap-2 fw-bold hover-scale"
        >
          <RefreshCcw size={18} />
          Try Again
        </button>
        <Link href="/" className="btn btn-zesty-primary rounded-pill px-5 py-3 fw-bold text-uppercase hover-scale">
          Return to Home
        </Link>
      </motion.div>
    </div>
  );
}
