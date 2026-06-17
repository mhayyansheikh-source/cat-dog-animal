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
    // Basic recommendation logic based on products.json
    let recommendedHandle = "ancient-elements-calming-bites"; // Default
    let dosage = "1 Chew daily";

    if (petType === "cat") {
      recommendedHandle = "hairball-calming-allergy-immune-bundle-for-cats";
      dosage = "1-2 Chews daily";
    } else {
      // Dogs
      if (concern === "calming" || concern === "behavior") {
        recommendedHandle = "ancient-elements-calming-bites";
        if (petWeight < 10) dosage = "1/2 Chew daily";
        else if (petWeight <= 25) dosage = "1 Chew daily";
        else if (petWeight <= 75) dosage = "2 Chews daily";
        else dosage = "3 Chews daily";
      } else if (concern === "allergy" || concern === "immune") {
        recommendedHandle = "puppy-aller-immune-bites";
        if (petWeight < 10) dosage = "1 Chew daily";
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
            <div className="badge bg-forest-green text-white mb-2 py-2 px-3 rounded-pill fw-bold">
              🐾 DIAGNOSTIC DOSAGE CALCULATOR
            </div>
            <h2 className="font-heading mb-4">Find the Perfect Wellness Plan</h2>
            <p className="text-muted mb-5">
              Answer 3 simple questions about your pet's lifestyle to receive veterinarian-grade supplement dosage recommendations and target solutions.
            </p>

            <div className="bg-white p-4 p-md-5 rounded shadow-sm border text-start">
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
                        className="p-4 border rounded text-center cursor-pointer hover-scale bg-light"
                        style={{ cursor: "pointer", border: petType === "dog" ? "3px solid var(--zesty-orange)" : "1px solid var(--pale-gray)" }}
                      >
                        <span className="fs-1 d-block mb-2">🐕</span>
                        <span className="fw-bold">My Dog</span>
                      </div>
                    </div>
                    <div className="col-sm-5">
                      <div
                        onClick={() => {
                          setPetType("cat");
                          setStep(3); // Skip weight for cats usually
                        }}
                        className="p-4 border rounded text-center cursor-pointer hover-scale bg-light"
                        style={{ cursor: "pointer", border: petType === "cat" ? "3px solid var(--zesty-orange)" : "1px solid var(--pale-gray)" }}
                      >
                        <span className="fs-1 d-block mb-2">🐈</span>
                        <span className="fw-bold">My Cat</span>
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
                    <span className="fs-2 fw-bold text-zesty-orange">{petWeight} lbs</span>
                    <span className="text-muted d-block small">
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
                      aria-label="Dog weight adjustment"
                    />
                    <div className="d-flex justify-content-between text-muted small mt-2">
                      <span>3 lbs (Puppy)</span>
                      <span>50 lbs</span>
                      <span>120+ lbs</span>
                    </div>
                  </div>

                  <div className="text-center mt-5">
                    <button
                      onClick={() => setStep(3)}
                      className="rounded-pill-cta btn-zesty-secondary d-inline-flex align-items-center gap-2"
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
                      { id: "calming", label: "Stress & Anxiety", icon: "🧘" },
                      { id: "allergy", label: "Skin & Seasonal Allergies", icon: "🌱" },
                      { id: "gut", label: "Digestive & Gut Health", icon: "🥬" },
                      { id: "joint", label: "Joint & Mobility Support", icon: "🦴" },
                      { id: "multi", label: "Daily General Wellness", icon: "🌟" },
                    ].map((item) => (
                      <div key={item.id} className="col-md-4 col-6">
                        <div
                          onClick={() => {
                            setConcern(item.id);
                            setStep(4);
                          }}
                          className="p-3 border rounded text-center cursor-pointer hover-scale bg-light h-100 d-flex flex-column justify-content-center"
                          style={{ cursor: "pointer" }}
                        >
                          <span className="fs-3 d-block mb-1">{item.icon}</span>
                          <span className="small fw-semibold">{item.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Results */}
              {step === 4 && recommendation.product && (
                <div className="text-center">
                  <div className="alert alert-success d-inline-flex align-items-center gap-2 mb-4 mx-auto py-2 px-3 small">
                    <Check size={16} /> Diagnostic complete! Recommended daily dosage calculated.
                  </div>

                  <h3 className="font-heading mb-2">Recommended Supplement Plan</h3>
                  <p className="text-muted small mb-4">
                    Based on your {petType}'s profile, we advise the following targeted solution:
                  </p>

                  <div className="row align-items-center justify-content-center g-4 border rounded p-4 mb-4 bg-light">
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
                      <h5 className="fw-bold mb-1">{recommendation.product.title}</h5>
                      <p className="small text-muted mb-3">
                        {recommendation.product.product_type} Wellness Supplement
                      </p>

                      {/* Dosage Guidance Seal */}
                      <div className="p-3 bg-white border rounded mb-3 d-flex align-items-center gap-3">
                        <Award size={24} className="text-forest-green flex-shrink-0" />
                        <div>
                          <span className="d-block small text-muted font-body">DAILY SUGGESTED DOSAGE</span>
                          <strong className="text-forest-green fs-6 font-heading">{recommendation.dosage}</strong>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-3">
                        <span className="fs-4 fw-bold text-zesty-orange">${recommendation.product.price}</span>
                        <button
                          onClick={() => addToCart(recommendation.product, recommendation.product.variants[0])}
                          className="rounded-pill-cta btn-zesty-primary py-2 px-4"
                        >
                          Add Plan To Cart
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="btn btn-sm btn-link text-muted d-inline-flex align-items-center gap-2 text-decoration-none"
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
