"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Check, ArrowRight, RotateCcw, Award } from "lucide-react";

export default function DosageFinder({ products = [] }) {
  const { addToCart } = useCart();
  const [step, setStep] = useState(1);
  const [petType, setPetType] = useState("");
  const [petWeight, setPetWeight] = useState(25);
  const [concern, setConcern] = useState("");

  const handleReset = () => {
    setStep(1);
    setPetType("");
    setPetWeight(25);
    setConcern("");
  };

  // Determine recommend product
  const getRecommendation = () => {
    let recommendedHandle = "ancient-elements-calming-bites"; // Default
    let dosage = "1 Chew daily";

    if (petType === "cat") {
      recommendedHandle = "hairball-calming-allergy-immune-bundle-for-cats";
      dosage = "1-2 Chews daily";
    } else {
      // Dogs
      if (concern === "calming") {
        recommendedHandle = "ancient-elements-calming-bites";
        if (petWeight < 10) dosage = "1/2 Chew daily";
        else if (petWeight <= 25) dosage = "1 Chew daily";
        else if (petWeight <= 75) dosage = "2 Chews daily";
        else dosage = "3 Chews daily";
      } else if (concern === "skin") {
        recommendedHandle = "puppy-aller-immune-bites";
        if (petWeight < 10) dosage = "1 Chew daily";
        else if (petWeight <= 39) dosage = "2 Chews daily";
        else dosage = "3 Chews daily";
      } else if (concern === "gut") {
        recommendedHandle = "gut-immune-bundle-for-dogs";
        if (petWeight < 15) dosage = "1 Chew daily";
        else if (petWeight <= 39) dosage = "2 Chews daily";
        else dosage = "3 Chews daily";
      } else if (concern === "joint") {
        recommendedHandle = "probiotics-hip-joint-bundle-for-dogs";
        if (petWeight < 15) dosage = "1 Chew daily";
        else if (petWeight <= 39) dosage = "2 Chews daily";
        else dosage = "3 Chews daily";
      } else {
        recommendedHandle = "zesty-paws-solid-gold-wellness-boost-bundle-for-dogs";
        dosage = "1 Pump of Oil / 1/4 cup Broth daily";
      }
    }

    const matchedProduct = products.find(p => p.handle === recommendedHandle) || products[0];
    return { product: matchedProduct, dosage };
  };

  const recommendation = getRecommendation();

  return (
    <div id="dosage-finder" className="py-5 bg-soft-sand rounded-card my-5 shadow-sm">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10 text-center">
            <div 
              className="d-inline-flex align-items-center gap-2 mb-3 px-3 py-2 rounded-pill fw-bold text-uppercase"
              style={{
                backgroundColor: "var(--orange-light)",
                color: "var(--orange-dark)",
                border: "1.5px solid #F5C49A",
                fontSize: "12px"
              }}
            >
              🐾 DIAGNOSTIC DOSAGE CALCULATOR
            </div>
            <h2 className="font-heading mb-3 display-6 fw-bold" style={{ color: "var(--charcoal)" }}>Find the Perfect Wellness Plan</h2>
            <p className="text-muted mb-5 font-body">
              Answer 3 simple questions about your pet's lifestyle to receive veterinarian-grade supplement dosage recommendations and target solutions.
            </p>

            <div className="bg-white p-4 p-md-5 border text-start" style={{ borderRadius: "var(--radius)", boxShadow: "var(--shadow)" }}>
              {/* Step 1: Pet Type */}
              {step === 1 && (
                <div>
                  <h4 className="font-heading mb-4 text-center">1. What type of pet are you shopping for?</h4>
                  <div className="row g-3 justify-content-center">
                    <div className="col-sm-5">
                      <div
                        onClick={() => {
                          setPetType("dog");
                          setStep(2);
                        }}
                        className="p-4 border text-center cursor-pointer hover-scale bg-light"
                        style={{
                          cursor: "pointer",
                          border: petType === "dog" ? "3px solid var(--orange)" : "1px solid var(--border)",
                          borderRadius: "var(--radius)"
                        }}
                      >
                        <span className="fs-1 d-block mb-2">🐕</span>
                        <span className="fw-bold font-body">My Dog</span>
                      </div>
                    </div>
                    <div className="col-sm-5">
                      <div
                        onClick={() => {
                          setPetType("cat");
                          setStep(3); // Skip weight for cats usually
                        }}
                        className="p-4 border text-center cursor-pointer hover-scale bg-light"
                        style={{
                          cursor: "pointer",
                          border: petType === "cat" ? "3px solid var(--orange)" : "1px solid var(--border)",
                          borderRadius: "var(--radius)"
                        }}
                      >
                        <span className="fs-1 d-block mb-2">🐈</span>
                        <span className="fw-bold font-body">My Cat</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Dog Weight */}
              {step === 2 && (
                <div>
                  <h4 className="font-heading mb-3 text-center">2. How much does your dog weigh?</h4>
                  <div className="text-center mb-4">
                    <span className="fs-2 fw-bold" style={{ color: "var(--orange)" }}>{petWeight} lbs</span>
                    <span className="text-muted d-block small font-body">
                      {petWeight < 15 ? "(Toy / Small Breed)" : petWeight < 40 ? "(Medium Breed)" : petWeight < 80 ? "(Large Breed)" : "(Giant Breed)"}
                    </span>
                  </div>

                  <div className="px-3">
                    <input
                      type="range"
                      className="form-range"
                      min="3"
                      max="120"
                      value={petWeight}
                      onChange={(e) => setPetWeight(parseInt(e.target.value))}
                      style={{ accentColor: "var(--orange)" }}
                      aria-label="Dog weight adjustment"
                    />
                    <div className="d-flex justify-content-between text-muted small mt-2 font-body">
                      <span>3 lbs (Puppy)</span>
                      <span>50 lbs</span>
                      <span>120+ lbs</span>
                    </div>
                  </div>

                  <div className="text-center mt-5">
                    <button
                      onClick={() => setStep(3)}
                      className="rounded-pill-cta d-inline-flex align-items-center gap-2 text-white border-0"
                      style={{
                        backgroundColor: "var(--orange)",
                        transition: "all 0.2s ease"
                      }}
                    >
                      Next Step <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Health Concerns */}
              {step === 3 && (
                <div>
                  <h4 className="font-heading mb-4 text-center">
                    {petType === "cat" ? "2." : "3."} What is your pet's primary health concern?
                  </h4>
                  <div className="row g-3 justify-content-center">
                    {[
                      {
                        id: "joint",
                        label: "Joint & Mobility",
                        ingredients: "Glucosamine & Chondroitin",
                        desc: "For running, jumping, and flexibility.",
                        icon: "🦴"
                      },
                      {
                        id: "calming",
                        label: "Stress & Calmness",
                        ingredients: "L-Theanine & Ashwagandha",
                        desc: "To ease hyperactive and anxious behavior.",
                        icon: "🧘"
                      },
                      {
                        id: "gut",
                        label: "Digestive & Gut",
                        ingredients: "Clinically studied Probiotics",
                        desc: "To balance microflora and soothe bloating.",
                        icon: "🥬"
                      },
                      {
                        id: "skin",
                        label: "Skin & Seasonal",
                        ingredients: "Wild Alaskan Omega-3 Salmon Oil",
                        desc: "For itch relief and shiny coats.",
                        icon: "🌱"
                      }
                    ].map((item) => (
                      <div key={item.id} className="col-md-6 col-12">
                        <div
                          onClick={() => {
                            setConcern(item.id);
                            setStep(4);
                          }}
                          className="p-4 border text-center cursor-pointer hover-scale bg-light h-100 d-flex flex-column justify-content-center"
                          style={{
                            cursor: "pointer",
                            borderColor: "var(--border)",
                            borderRadius: "var(--radius)",
                            transition: "all 0.2s ease"
                          }}
                        >
                          <span className="fs-2 d-block mb-2">{item.icon}</span>
                          <h5 className="fw-bold mb-1 font-heading" style={{ fontSize: "1.1rem" }}>{item.label}</h5>
                          <span className="small d-block font-body mb-2 fw-semibold" style={{ color: "var(--orange)" }}>
                            {item.ingredients}
                          </span>
                          <p className="small text-muted mb-0 font-body">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Results */}
              {step === 4 && recommendation.product && (
                <div className="text-center">
                  <div
                    className="alert d-inline-flex align-items-center gap-2 mb-4 mx-auto py-2 px-3 small border-0 fw-bold"
                    style={{
                      backgroundColor: "var(--teal-light)",
                      color: "var(--teal-dark)",
                      borderRadius: "100px"
                    }}
                  >
                    <Check size={16} /> Diagnostic complete! Recommended daily dosage calculated.
                  </div>

                  <h3 className="font-heading mb-2">Recommended Supplement Plan</h3>
                  <p className="text-muted small mb-4 font-body">
                    Based on your {petType}'s profile, we advise the following targeted solution:
                  </p>

                  <div
                    className="row align-items-center justify-content-center g-4 border p-4 mb-4"
                    style={{
                      backgroundColor: "var(--cream)",
                      borderRadius: "var(--radius)",
                      borderColor: "var(--border)"
                    }}
                  >
                    <div className="col-md-4">
                      <img
                        src={recommendation.product.images[0]}
                        alt={recommendation.product.title}
                        className="img-fluid rounded border bg-white"
                        style={{ maxHeight: "150px", objectFit: "contain" }}
                      />
                    </div>
                    <div className="col-md-8 text-start">
                      <div className="d-flex align-items-center gap-1 mb-2 text-warning star-rating">
                        ★ ★ ★ ★ ★ <span className="text-muted small font-body">(4.9/5 stars)</span>
                      </div>
                      <h5 className="fw-bold mb-1 font-heading">{recommendation.product.title}</h5>
                      <p className="small text-muted mb-3 font-body">
                        {recommendation.product.product_type} Wellness Supplement
                      </p>

                      {/* Dosage Guidance Seal */}
                      <div
                        className="p-3 bg-white border d-flex align-items-center gap-3 mb-3"
                        style={{ borderRadius: "var(--radius-sm)", borderColor: "var(--border)" }}
                      >
                        <Award size={24} style={{ color: "var(--teal)", flexShrink: 0 }} />
                        <div>
                          <span className="d-block small text-muted font-body" style={{ fontSize: "11px", fontWeight: "700" }}>DAILY SUGGESTED DOSAGE</span>
                          <strong className="fs-6 font-heading" style={{ color: "var(--teal)" }}>{recommendation.dosage}</strong>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-3">
                        <span className="fs-4 fw-bold" style={{ color: "var(--orange)" }}>
                          ${recommendation.product.price}
                        </span>
                        <button
                          onClick={() => addToCart(recommendation.product, recommendation.product.variants[0])}
                          className="rounded-pill-cta text-white py-2.5 px-4 border-0 hover-scale"
                          style={{ backgroundColor: "var(--orange)", fontWeight: "700" }}
                        >
                          Add Plan To Cart
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="btn btn-sm btn-link d-inline-flex align-items-center gap-2 text-decoration-none"
                    style={{ color: "var(--gray)" }}
                  >
                    <RotateCcw size={14} /> Start Quiz Over
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
