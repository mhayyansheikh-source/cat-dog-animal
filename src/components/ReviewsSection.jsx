"use client";

import React from "react";

const reviews = [
  {
    stars: "★★★★★",
    text: "My golden retriever had terrible joint pain. After 3 weeks on the Hip & Joint chews, he's back to running around like a puppy! I can't believe the difference.",
    avatar: "👩",
    name: "Sarah M.",
    pet: "Dog mom to Max, 9 years old",
  },
  {
    stars: "★★★★★",
    text: "My cats are incredibly picky, but they absolutely love the salmon mousse. Their coats have never looked shinier and one of them actually stopped scratching so much.",
    avatar: "👨",
    name: "David K.",
    pet: "Cat dad to Mochi & Chai",
  },
  {
    stars: "★★★★★",
    text: "The calming diffuser has been a game-changer. Our anxious tabby used to hide during thunderstorms — now he just sleeps through them. Completely transformed our home.",
    avatar: "👩",
    name: "Priya L.",
    pet: "Cat mom to Biscuit, 4 years old",
  },
];

export default function ReviewsSection() {
  return (
    <section
      className="py-5"
      style={{ backgroundColor: "var(--cream, #FDFAF5)", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB" }}
    >
      <div className="container font-body text-start">
        {/* Section Header */}
        <div className="text-center mb-5">
          <span
            className="fw-bold text-uppercase small d-block mb-2"
            style={{ color: "var(--orange)", letterSpacing: "0.12em" }}
          >
            Reviews
          </span>
          <h2
            className="font-heading fw-bold mt-2"
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "clamp(28px, 4vw, 40px)",
              color: "var(--charcoal, #2A2A2A)",
              marginBottom: "14px",
            }}
          >
            Pet Parents Love Peteora
          </h2>
          <p
            className="mx-auto"
            style={{ fontSize: "17px", color: "#6B7280", maxWidth: "560px" }}
          >
            Real stories from real pet families around the world.
          </p>
        </div>

        {/* Review Cards */}
        <div className="row g-4 justify-content-center">
          {reviews.map((r, idx) => (
            <div key={idx} className="col-lg-4 col-md-6">
              <div
                style={{
                  background: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "16px",
                  padding: "28px 24px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "box-shadow 0.25s, transform 0.25s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 40px rgba(0,0,0,0.1)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Stars */}
                <div style={{ color: "#F59E0B", fontSize: "18px", marginBottom: "14px" }}>
                  {r.stars}
                </div>

                {/* Review Text */}
                <p
                  style={{
                    fontSize: "15px",
                    color: "var(--charcoal, #2A2A2A)",
                    lineHeight: "1.65",
                    fontStyle: "italic",
                    marginBottom: "20px",
                    flexGrow: 1,
                  }}
                >
                  "{r.text}"
                </p>

                {/* Reviewer Info */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      backgroundColor: "var(--orange-light, #FEF0E6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      flexShrink: 0,
                    }}
                  >
                    {r.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: "800", fontSize: "14px", color: "var(--charcoal, #2A2A2A)" }}>
                      {r.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6B7280" }}>{r.pet}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
