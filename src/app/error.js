"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw } from "lucide-react";
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
        className="mb-4 text-warning"
      >
        <AlertTriangle size={80} strokeWidth={1.5} />
      </motion.div>
      <h1 className="font-heading fw-bold mb-3 display-4">Oops! Something went wrong.</h1>
      <p className="text-muted lead mb-5 max-w-md mx-auto">
        We hit a little snag on our end. Don't worry, our team has been notified and we're on it!
      </p>
      
      <div className="d-flex gap-3 justify-content-center flex-wrap">
        <button
          onClick={() => reset()}
          className="btn btn-outline-dark rounded-pill px-4 py-2 d-flex align-items-center gap-2 fw-bold"
        >
          <RefreshCcw size={18} />
          Try Again
        </button>
        <Link href="/" className="btn btn-zesty-primary rounded-pill px-4 py-2 fw-bold">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
