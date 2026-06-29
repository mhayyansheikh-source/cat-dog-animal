"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Clock, Tag, X } from "lucide-react";
import { useRouter } from "next/navigation";

const SALE_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours
const STORAGE_KEY = "peteora_flash_sale_end";
const PROMO_CODE = "SAVE20";

export default function FlashSaleBar() {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const { scrollY } = useScroll();
  const router = useRouter();

  // Handle Timer and LocalStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    let endTime = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (!endTime || parseInt(endTime, 10) < now) {
      // Set new end time
      endTime = now + SALE_DURATION_MS;
      localStorage.setItem(STORAGE_KEY, endTime.toString());
    } else {
      endTime = parseInt(endTime, 10);
    }

    const interval = setInterval(() => {
      const current = Date.now();
      const diff = endTime - current;

      if (diff <= 0) {
        // Reset timer
        const newEndTime = current + SALE_DURATION_MS;
        localStorage.setItem(STORAGE_KEY, newEndTime.toString());
        setTimeRemaining(SALE_DURATION_MS);
      } else {
        setTimeRemaining(diff);
      }
    }, 1000);

    // Initial set
    setTimeRemaining(endTime - now);

    return () => clearInterval(interval);
  }, []);

  // Handle Scroll Direction
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsAtTop(latest < 50);
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 50) {
      // Scrolling down
      setIsVisible(false);
    } else {
      // Scrolling up
      setIsVisible(true);
    }
  });

  const handleApplyPromo = () => {
    // In a real Shopify headless app, you would apply the discount to the cart via Storefront API.
    // For now, we can route with a discount parameter or just show a success message.
    alert(`Promo code ${PROMO_CODE} applied! 20% off your order.`);
  };

  if (isDismissed || timeRemaining === null) return null;

  const seconds = Math.floor((timeRemaining / 1000) % 60);
  const minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
  const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);

  const isEndingSoon = timeRemaining <= 5 * 60 * 1000; // Last 5 minutes

  return (
    <>
      {/* Spacer to push the sticky Header down when at the top of the page */}
      <div 
        style={{ 
          height: isAtTop && isVisible ? '54px' : '0px', 
          transition: 'height 0.3s ease-in-out' 
        }} 
      />

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="position-fixed top-0 start-0 w-100"
          style={{ zIndex: 1050 }} // Above header
        >
          <motion.div
            animate={
              isEndingSoon
                ? { boxShadow: ["0px 0px 0px rgba(245, 118, 26, 0)", "0px 0px 20px rgba(245, 118, 26, 0.8)", "0px 0px 0px rgba(245, 118, 26, 0)"] }
                : {}
            }
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="d-flex align-items-center justify-content-center py-2 px-3 text-white text-center position-relative shadow-sm"
            style={{ 
              backgroundColor: "var(--charcoal-dark, #1c1c1c)",
              borderBottom: "2px solid var(--zesty-orange, #F5761A)"
            }}
          >
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-2 gap-md-4 w-100 pe-4">
              
              {/* Message */}
              <div className="d-flex align-items-center fw-bold fs-6">
                <Tag size={16} className="me-2" style={{ color: "var(--zesty-orange)" }} />
                FLASH SALE: 20% OFF EVERYTHING
              </div>

              {/* Timer */}
              <div className="d-flex align-items-center fw-bold fs-5 font-heading" style={{ color: isEndingSoon ? "var(--zesty-orange)" : "inherit" }}>
                <Clock size={18} className="me-2" />
                <span className="font-monospace">
                  {hours.toString().padStart(2, '0')}:
                  {minutes.toString().padStart(2, '0')}:
                  {seconds.toString().padStart(2, '0')}
                </span>
              </div>

              {/* CTA */}
              <button 
                onClick={handleApplyPromo}
                className="btn btn-sm text-white fw-bold px-3 py-1 rounded-pill"
                style={{ backgroundColor: "var(--zesty-orange)", border: "none" }}
              >
                Claim {PROMO_CODE}
              </button>
            </div>

            {/* Dismiss Button */}
            <button 
              onClick={() => setIsDismissed(true)}
              className="position-absolute end-0 top-50 translate-middle-y btn btn-link text-white-50 p-2"
              aria-label="Dismiss"
            >
              <X size={18} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
