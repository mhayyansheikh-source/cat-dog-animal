"use client";

import React, { useState } from "react";

export default function NewsletterSection() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
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
      <div className="container py-3">
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
            <form onSubmit={handleSubmit} className="input-group mx-auto mb-3" style={{ maxWidth: "480px" }}>
              <input 
                type="email" 
                className="form-control" 
                placeholder="Enter your email address..." 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ 
                  borderRadius: "100px 0 0 100px", 
                  paddingLeft: "1.25rem",
                  border: "none",
                  height: "50px"
                }} 
              />
              <button 
                type="submit" 
                className="btn text-white" 
                style={{ 
                  backgroundColor: "var(--charcoal)", 
                  borderRadius: "0 100px 100px 0",
                  fontWeight: "700",
                  padding: "0.5rem 1.75rem",
                  border: "none"
                }}
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
