"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function EmbeddedCheckout() {
  const { checkoutUrl, isSyncing, cartCount } = useCart();
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeBlocked, setIframeBlocked] = useState(false);

  useEffect(() => {
    // If the iframe fails to load or Shopify blocks it via X-Frame-Options,
    // we fallback to redirecting the user natively after a short delay.
    const timer = setTimeout(() => {
      if (iframeLoading && checkoutUrl) {
        setIframeBlocked(true);
        window.location.href = checkoutUrl;
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [iframeLoading, checkoutUrl]);

  if (isSyncing || !checkoutUrl) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "60vh" }}>
        <Loader2 size={40} className="animate-spin text-zesty-orange mb-3" />
        <p className="text-muted fw-bold">Preparing your secure checkout...</p>
      </div>
    );
  }

  if (cartCount === 0) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center text-center" style={{ height: "60vh" }}>
        <h2 className="font-heading fw-bold mb-3">Your cart is empty</h2>
        <p className="text-muted mb-4">Add some items before proceeding to checkout.</p>
        <Link href="/collections/all" className="btn btn-zesty-primary rounded-pill px-4 py-2 fw-bold">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-container w-100 h-100 position-relative">
      {iframeLoading && !iframeBlocked && (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-white z-1">
          <Loader2 size={40} className="animate-spin text-zesty-orange mb-3" />
          <p className="text-muted fw-bold">Connecting to Secure Server...</p>
        </div>
      )}
      
      {iframeBlocked && (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-white z-2">
          <Loader2 size={40} className="animate-spin text-zesty-orange mb-3" />
          <p className="text-muted fw-bold mb-2">Redirecting to Secure Checkout...</p>
          <small className="text-muted">If you are not redirected automatically, <a href={checkoutUrl}>click here</a>.</small>
        </div>
      )}

      {!iframeBlocked && (
        <iframe 
          src={checkoutUrl}
          className="w-100 border-0"
          style={{ height: "85vh" }}
          onLoad={() => setIframeLoading(false)}
          title="Secure Checkout"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
        />
      )}
    </div>
  );
}
