"use client";

import React, { useState } from "react";


export default function NewsletterSection() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email) {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        
        setLoading(false);
        
        if (!res.ok || data.error) {
          setError(data.error || "Subscription failed.");
        } else {
          setSubscribed(true);
          setEmail("");
        }
      } catch (err) {
        setLoading(false);
        setError("Network error. Please try again later.");
      }
    }
  };

  return (
    <section 
      className="py-5 text-white text-center font-body"
      style={{
        background: "linear-gradient(135deg, var(--orange) 0%, #F59E0B 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.1)"
      }}
    >
      <div className="container-fluid px-3 px-md-4 px-lg-5 py-3">
        <div className="max-width-md mx-auto" style={{ maxWidth: "640px" }}>
          <h2 className="display-6 fw-bold font-heading mb-3 text-white">
            Get 15% Off Your First Order 🐾
          </h2>
          <p className="text-white-50 mb-4 fs-6">
            Join 50,000+ pet parents who get expert tips, new product launches, and exclusive deals delivered to their inbox.
          </p>

          {subscribed ? (
            <div className="alert alert-light py-2.5 mx-auto font-weight-bold" style={{ maxWidth: "480px", color: "var(--orange-dark)" }} role="alert">
              ✓ Welcome to the pack! Check your inbox for your 15% discount code.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="d-flex flex-column flex-sm-row mx-auto mb-3 gap-2" style={{ maxWidth: "480px" }}>
              <input 
                type="email" 
                className="form-control" 
                placeholder="Enter your email address..." 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ 
                  borderRadius: "100px", 
                  paddingLeft: "1.25rem",
                  border: "none",
                  height: "52px",
                  flexGrow: 1
                }} 
              />
              <button 
                type="submit" 
                className="btn text-white px-4"
                disabled={loading}
                style={{ 
                  backgroundColor: "var(--charcoal)", 
                  borderRadius: "100px",
                  fontWeight: "700",
                  border: "none",
                  height: "52px",
                  whiteSpace: "nowrap"
                }}
              >
                {loading ? "..." : "Subscribe"}
              </button>
            </form>
          )}
          {error && <p className="text-white mt-2 small">{error}</p>}
        </div>
      </div>
    </section>
  );
}
