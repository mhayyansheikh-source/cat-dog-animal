"use client";

import React from "react";
import { ShieldCheck, BrainCircuit, Activity, HeartHandshake } from "lucide-react";

export default function IngredientsSpotlight() {
  return (
    <section id="science" className="py-5 bg-white border-top border-bottom">
      <div className="container">
        <div className="text-center mb-5">
          <span className="text-zesty-orange fw-bold text-uppercase small tracking-wider font-body">
            Premium Structural Standards
          </span>
          <h2 className="font-heading display-6 fw-bold mt-2">
            Engineered Materials with Proven Safety
          </h2>
          <p className="text-muted font-body max-w-lg mx-auto">
            We select robust, non-toxic materials built to withstand intense scratching and play sessions while protecting your home.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {/* Material 1 */}
          <div className="col-md-4 col-sm-10">
            <div className="p-4 border rounded h-100 bg-light shadow-sm text-start">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="p-2 bg-warning bg-opacity-25 rounded text-zesty-orange">
                  <Activity size={24} />
                </div>
                <h5 className="font-heading fw-bold m-0">Double-Corrugated Paper</h5>
              </div>
              <span className="badge bg-warning text-dark mb-3">High-Density Resilience</span>
              <p className="small text-muted font-body mb-0">
                Engineered from multi-layered heavy-duty corrugated paper to withstand aggressive claws. The high-density honeycomb structure provides maximum friction without collapsing or shedding excessive paper bits.
              </p>
            </div>
          </div>

          {/* Material 2 */}
          <div className="col-md-4 col-sm-10">
            <div className="p-4 border rounded h-100 bg-light shadow-sm text-start">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="p-2 bg-success bg-opacity-10 rounded text-forest-green">
                  <BrainCircuit size={24} />
                </div>
                <h5 className="font-heading fw-bold m-0">Magnetic Endpoints</h5>
              </div>
              <span className="badge bg-success text-white mb-3">Modular Chain Play</span>
              <p className="small text-muted font-body mb-0">
                Fitted with secure, high-strength industrial magnets on each closing side. Snaps multiple modular tracks together instantly to construct giant custom loops and climbing scratch arenas for multi-cat play.
              </p>
            </div>
          </div>

          {/* Material 3 */}
          <div className="col-md-4 col-sm-10">
            <div className="p-4 border rounded h-100 bg-light shadow-sm text-start">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="p-2 bg-dark bg-opacity-10 rounded text-dark">
                  <HeartHandshake size={24} />
                </div>
                <h5 className="font-heading fw-bold m-0">Cornstarch Adhesive</h5>
              </div>
              <span className="badge bg-dark text-white mb-3">100% Odorless &amp; Safe</span>
              <p className="small text-muted font-body mb-0">
                Bonded with natural organic cornstarch starch glue instead of industrial chemical solvents or formaldehyde. Completely odorless, lick-safe, and non-toxic, giving your cat a safe environment to sleep and scratch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
