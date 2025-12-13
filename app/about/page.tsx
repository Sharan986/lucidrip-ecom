"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HiArrowLongRight, HiSparkles, HiGlobeAlt, HiHeart } from "react-icons/hi2";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen font-sans">
      
      {/* --- HERO SECTION --- */}
      {/* Fixed: min-h-[500px] ensures it looks tall enough on mobile */}
      <div className="relative h-[80vh] min-h-[500px] w-full overflow-hidden">
        <Image
          src="/Hero/About.avif" 
          alt="About LUCIDRIP Studio"
          fill
          className="object-cover object-center brightness-75"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-white/90 font-bold uppercase tracking-[0.2em] text-xs md:text-sm mb-4 animate-fade-in-up">
            Est. 2024
          </p>
          <h1 className="text-4xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-lg max-w-4xl leading-[1.1]">
            Redefining Modern <br/> Elegance.
          </h1>
          <p className="text-white/80 text-base md:text-xl max-w-lg hidden md:block">
             Timeless fashion for the contemporary soul.
          </p>
        </div>
      </div>

      {/* --- MISSION STATEMENT --- */}
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-16 md:py-24 text-center">
        <h2 className="text-2xl md:text-4xl font-serif font-medium text-gray-900 mb-6 leading-relaxed">
          "We believe style is a way to say who you are without having to speak."
        </h2>
        <p className="text-gray-500 text-base md:text-lg leading-loose">
          At LUCIDRIP, we don't just sell clothes; we curate confidence. Our mission is to bridge the gap between high-end fashion and everyday wearability, creating timeless pieces that empower you to look and feel your absolute best.
        </p>
      </div>

      {/* --- SPLIT SECTION: THE ORIGIN --- */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          
          {/* Image (Mobile: Full width, nice rounded corners) */}
          <div className="relative h-[400px] md:h-[700px] w-full rounded-xl overflow-hidden shadow-xl order-1">
            <Image
              src="/Hero/About@.avif" 
              alt="Design Process"
              fill
              className="object-cover object-center"
            />
            {/* Badge positioned better for mobile */}
            <div className="absolute bottom-6 left-6 bg-[#D2B49F] text-black px-5 py-2 md:px-6 md:py-3 rounded-full font-bold shadow-lg text-sm md:text-base">
              The Origin Story
            </div>
          </div>

          {/* Text Content (Order 2 on mobile) */}
          <div className="space-y-6 md:space-y-8 order-2">
            <h3 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
              Crafted with <br className="hidden md:block"/> Conscience.
            </h3>
            <div className="space-y-4 text-gray-500 text-base md:text-lg leading-relaxed">
              <p>
                It started with a simple sketch in a small apartment. Our founder wanted a hoodie that felt luxurious but could handle the grit of city life. 
              </p>
              <p>
                Today, LUCIDRIP represents a movement towards conscious consumption. We reject fast fashion trends in favor of durable materials.
              </p>
            </div>
            
            {/* Stats - Mobile optimized grid */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 border-t border-gray-100 pt-8">
              <div className="text-center md:text-left">
                <span className="block text-2xl md:text-3xl font-bold text-black">15k+</span>
                <span className="text-xs md:text-sm text-gray-400 uppercase tracking-wide">Customers</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block text-2xl md:text-3xl font-bold text-black">100%</span>
                <span className="text-xs md:text-sm text-gray-400 uppercase tracking-wide">Ethical</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block text-2xl md:text-3xl font-bold text-black">25+</span>
                <span className="text-xs md:text-sm text-gray-400 uppercase tracking-wide">Countries</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- CORE VALUES --- */}
      <div className="py-16 md:py-24 px-5 md:px-10 bg-[#FAFAFA] border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#D2B49F] font-bold tracking-widest uppercase text-xs md:text-sm mb-3 block">
              Our DNA
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900">
              Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: <HiSparkles className="text-2xl md:text-3xl" />,
                title: "Quality First",
                desc: "We never compromise on fabric. Every stitch is inspected."
              },
              {
                icon: <HiGlobeAlt className="text-2xl md:text-3xl" />,
                title: "Sustainability",
                desc: "Biodegradable packaging and carbon-neutral shipping."
              },
              {
                icon: <HiHeart className="text-2xl md:text-3xl" />,
                title: "Community",
                desc: "We support local artisans and donate 1% of profits."
              }
            ].map((value, idx) => (
              <div 
                key={idx} 
                className="bg-white p-6 md:p-10 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-4 md:mb-6 p-3 md:p-4 bg-[#F3F0EB] w-fit rounded-full text-black">
                  {value.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">{value.title}</h3>
                <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- CTA SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-16 md:py-20">
        <div className="bg-white rounded-xl md:rounded-xl p-8 md:p-20 text-center flex flex-col items-center border border-gray-100 shadow-xl">
          <h2 className="text-2xl md:text-5xl font-serif font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
            Ready to elevate your style?
          </h2>
          <p className="text-gray-600 max-w-lg mb-8 md:mb-10 text-base md:text-lg">
            Join the thousands of trendsetters who have found their signature look with LUCIDRIP.
          </p>
          <Link 
            href="/products" 
            className="w-full md:w-auto bg-black text-white px-8 py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-3 hover:bg-gray-800 transition-all hover:scale-105 active:scale-95"
          >
            <span>Shop Collection</span>
            <HiArrowLongRight className="text-2xl" />
          </Link>
        </div>
      </div>

    </div>
  );
}