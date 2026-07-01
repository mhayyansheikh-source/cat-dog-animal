"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Tag, Truck, Calendar, ArrowRight, ShieldCheck, Award, Heart, Lock } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full bg-[#FDFBF7] overflow-hidden pt-8 pb-16 sm:pt-12 md:pt-16 lg:pt-24 xl:pt-32 lg:pb-24 z-0" style={{ fontFamily: "var(--font-nunito)" }}>
      
      {/* Background Organic Light Green Blob (Matches the curve visible under the image in the design) */}
      <div className="absolute bottom-0 right-0 w-full md:w-3/4 lg:w-1/2 h-[80%] bg-[#E8EFE9] rounded-tl-[40%] -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* ======================= */}
          {/* LEFT COLUMN: TEXT & CTA */}
          {/* ======================= */}
          <div className="flex flex-col items-start space-y-6 sm:space-y-8 w-full max-w-2xl mx-auto lg:mx-0">
            
            {/* Offer Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-[#F97316] text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wide uppercase shadow-sm"
            >
              <Tag size={16} className="rotate-90" />
              Friday Offer
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-bold leading-[1.05] text-[#1F2937] tracking-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              <span className="text-[#1F8A70]">Save $15</span>
              <br />
              on every pet
              <br />
              product
            </motion.h1>

            {/* Subheading */}
            <motion.p 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="text-base sm:text-lg md:text-xl text-[#1F2937] font-medium max-w-lg"
            >
              Plus, get <span className="text-[#F97316] font-bold">FREE SHIPPING</span> on orders over $50
            </motion.p>

            {/* Features Row - With the subtle vertical divider added */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 w-full pt-2"
            >
              {/* Feature 1 */}
              <div className="flex items-center gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-[#E6F2EF] flex items-center justify-center text-[#1F8A70]">
                  <Truck size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-[#1F2937] text-[13px] sm:text-sm uppercase tracking-wide">Free Shipping</h4>
                  <p className="text-[#6B7280] text-sm mt-0.5">On orders over $50</p>
                </div>
              </div>
              
              {/* Subtle Vertical Divider (Hidden on Mobile) */}
              <div className="hidden sm:block w-px h-12 bg-gray-200"></div>

              {/* Feature 2 */}
              <div className="flex items-center gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-[#E6F2EF] flex items-center justify-center text-[#1F8A70]">
                  <Calendar size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-[#1F2937] text-[13px] sm:text-sm uppercase tracking-wide">Ends This Friday!</h4>
                  <p className="text-[#6B7280] text-sm mt-0.5">Don't miss out</p>
                </div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-4 w-full sm:w-auto"
            >
              <Link href="/collections/all" className="text-decoration-none">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto bg-[#F97316] hover:bg-[#EA580C] transition-colors text-white text-base sm:text-lg font-bold py-4 px-8 rounded-full flex items-center justify-center gap-4 shadow-md shadow-orange-500/20 group border-0"
                >
                  SHOP NOW
                  <span className="bg-white text-[#F97316] rounded-full p-1.5 group-hover:translate-x-1 transition-transform">
                    <ArrowRight size={18} strokeWidth={3} />
                  </span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 bg-white p-4 sm:p-5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mt-6 w-full max-w-[340px]"
            >
              <div className="text-[#1F8A70] shrink-0">
                <ShieldCheck size={44} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] sm:text-xs font-bold text-[#1F2937] tracking-wider uppercase">Trusted by Pet Parents</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex text-[#FBBF24] text-sm">
                    {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
                  </div>
                  <span className="font-bold text-[#1F8A70] text-sm">4.9/5</span>
                </div>
                <span className="text-[11px] sm:text-xs text-[#6B7280] mt-1 font-medium">Based on 2,500+ Reviews</span>
              </div>
            </motion.div>

          </div>

          {/* ======================= */}
          {/* RIGHT COLUMN: IMAGE     */}
          {/* ======================= */}
          <div className="relative w-full aspect-square lg:aspect-auto lg:h-[600px] mt-12 lg:mt-0 flex items-center justify-center">
            
            {/* Main Image Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-full h-full relative"
            >
              <Image 
                src="/IMG.png"
                alt="Golden Retriever puppy and a grey kitten sitting together"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                className="object-contain lg:scale-110"
                style={{ objectPosition: 'center bottom' }}
              />
            </motion.div>

            {/* Floating Features Pill */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-8 lg:bottom-4 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-auto lg:right-0 bg-[#E6F2EF]/95 backdrop-blur-md px-5 sm:px-8 py-3.5 rounded-full flex items-center justify-between gap-3 sm:gap-6 shadow-sm border border-[#1F8A70]/10 w-max z-20"
            >
              <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 text-[#1F8A70] text-[10px] sm:text-sm font-semibold tracking-wide">
                <Award size={18} className="w-4 h-4 sm:w-5 sm:h-5" /> 
                <span className="hidden sm:inline">Premium Quality</span>
                <span className="sm:hidden text-center leading-tight">Premium<br/>Quality</span>
              </div>
              <div className="w-px h-8 sm:h-5 bg-[#1F8A70]/30"></div>
              <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 text-[#1F8A70] text-[10px] sm:text-sm font-semibold tracking-wide">
                <Heart size={18} className="w-4 h-4 sm:w-5 sm:h-5" /> 
                <span className="hidden sm:inline">Loved by Pets</span>
                <span className="sm:hidden text-center leading-tight">Loved<br/>by Pets</span>
              </div>
              <div className="w-px h-8 sm:h-5 bg-[#1F8A70]/30"></div>
              <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 text-[#1F8A70] text-[10px] sm:text-sm font-semibold tracking-wide">
                <Lock size={18} className="w-4 h-4 sm:w-5 sm:h-5" /> 
                <span className="hidden sm:inline">Secure Checkout</span>
                <span className="sm:hidden text-center leading-tight">Secure<br/>Checkout</span>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
