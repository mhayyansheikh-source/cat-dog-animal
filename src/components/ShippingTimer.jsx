"use client";

import React, { useState, useEffect } from "react";
import { Truck, Clock } from "lucide-react";

export default function ShippingTimer() {
  const [timeLeft, setTimeLeft] = useState("");
  const [deliveryRange, setDeliveryRange] = useState("");

  useEffect(() => {
    // 1. Calculate Countdown to Cut-off time (Daily at 4 PM / 16:00 local)
    const updateCountdown = () => {
      const now = new Date();
      const cutoff = new Date();
      cutoff.setHours(16, 0, 0, 0); // 4 PM

      if (now.getHours() >= 16) {
        // Cut-off passed, countdown to tomorrow's 4 PM
        cutoff.setDate(cutoff.getDate() + 1);
      }

      const diffMs = cutoff - now;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours}h ${mins.toString().padStart(2, "0")}m ${secs
          .toString()
          .padStart(2, "0")}s`
      );
    };

    // 2. Calculate dynamic 5-12 day delivery dates (US tracked shipping)
    const calculateDelivery = () => {
      const now = new Date();
      
      const startDeliv = new Date();
      startDeliv.setDate(now.getDate() + 5);

      const endDeliv = new Date();
      endDeliv.setDate(now.getDate() + 12);

      const formatOption = { month: "short", day: "numeric", weekday: "short" };
      const startStr = startDeliv.toLocaleDateString("en-US", formatOption);
      const endStr = endDeliv.toLocaleDateString("en-US", formatOption);

      setDeliveryRange(`${startStr} - ${endStr}`);
    };

    updateCountdown();
    calculateDelivery();
    
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="shipping-alert-box d-flex flex-column gap-2 mt-3 mb-2 shadow-sm text-start">
      <div className="d-flex align-items-center gap-2">
        <Clock size={16} className="text-zesty-orange" />
        <span className="small text-muted font-body">
          Order in the next <strong className="text-zesty-orange">{timeLeft}</strong> for dispatch today!
        </span>
      </div>
      <div className="d-flex align-items-center gap-2">
        <Truck size={16} className="text-forest-green" />
        <span className="small text-muted font-body">
          🇺🇸 Est. Tracked US Delivery: <strong className="text-forest-green">{deliveryRange}</strong>
        </span>
      </div>
    </div>
  );
}
