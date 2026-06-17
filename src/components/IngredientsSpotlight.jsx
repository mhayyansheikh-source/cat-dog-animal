"use client";

import React from "react";
import { ShieldCheck, BrainCircuit, Activity, HeartHandshake } from "lucide-react";

export default function IngredientsSpotlight() {
  return (
    <section id="science" className="py-5 bg-white border-top border-bottom">
      <div className="container">
        <div className="text-center mb-5">
          <span className="text-zesty-orange fw-bold text-uppercase small tracking-wider font-body">
            Premium Scientific Standards
          </span>
          <h2 className="font-heading display-6 fw-bold mt-2">
            Active Ingredients with Proven Power
          </h2>
          <p className="text-muted font-body max-w-lg mx-auto">
            We bypass basic filler powders in favor of clinical-grade, trademarked bio-actives that deliver visible therapeutic results.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {/* Ingredient 1 */}
          <div className="col-md-4 col-sm-10">
            <div className="p-4 border rounded h-100 bg-light shadow-sm text-start">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="p-2 bg-warning bg-opacity-25 rounded text-zesty-orange">
                  <Activity size={24} />
                </div>
                <h5 className="font-heading fw-bold m-0">AlaskOmega®</h5>
              </div>
              <span className="badge bg-warning text-dark mb-3">Concentrated EPA & DHA</span>
              <p className="small text-muted font-body mb-0">
                Sustainably wild-caught in Alaska's Bering Sea, this ultra-pure marine oil delivers concentrated Omega-3 fatty acids. Provides itch relief, reduces seasonal shedding, and supports skin cell membranes.
              </p>
            </div>
          </div>

          {/* Ingredient 2 */}
          <div className="col-md-4 col-sm-10">
            <div className="p-4 border rounded h-100 bg-light shadow-sm text-start">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="p-2 bg-success bg-opacity-10 rounded text-forest-green">
                  <BrainCircuit size={24} />
                </div>
                <h5 className="font-heading fw-bold m-0">DE111® Probiotic</h5>
              </div>
              <span className="badge bg-success text-white mb-3">Spore-Forming Bacillus subtilis</span>
              <p className="small text-muted font-body mb-0">
                A clinically researched probiotic strain that survives stomach acids to colonize the gut. Optimizes immune cell health, supports nutrient absorption, and balances digestion in small and large breeds.
              </p>
            </div>
          </div>

          {/* Ingredient 3 */}
          <div className="col-md-4 col-sm-10">
            <div className="p-4 border rounded h-100 bg-light shadow-sm text-start">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="p-2 bg-dark bg-opacity-10 rounded text-dark">
                  <HeartHandshake size={24} />
                </div>
                <h5 className="font-heading fw-bold m-0">OptiMSM®</h5>
              </div>
              <span className="badge bg-dark text-white mb-3">Purified Joint Methylsulfonylmethane</span>
              <p className="small text-muted font-body mb-0">
                The gold standard in joint health, OptiMSM is purified through a four-stage distillation process to guarantee 99.9% purity. Fosters joint cartilage collagen production, easing arthritis joint pain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
