"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  HiOutlineTruck, 
  HiOutlineBanknotes, 
  HiOutlinePhone, 
  HiOutlineLockClosed,
  HiCheckCircle,
  HiOutlineEnvelope
} from "react-icons/hi2";

export default function NewsletterSection() {
  // --- STATE FOR INTERACTION ---
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1500);
  };


  const features = [
    {
      id: 1,
      icon: <HiOutlineTruck />,
      title: "Free Shipping",
      subtitle: "Orders above $200",
    },
    {
      id: 2,
      icon: <HiOutlineBanknotes />,
      title: "Money-back",
      subtitle: "30 day Guarantee",
    },
    {
      id: 3,
      icon: <HiOutlinePhone />,
      title: "Premium Support",
      subtitle: "Phone and email support",
    },
    {
      id: 4,
      icon: <HiOutlineLockClosed />,
      title: "Secure Payments",
      subtitle: "Secured by Stripe",
    },
  ];

  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* --- PART 1: Newsletter Card (Split Layout) --- */}
        <div className="bg-gray-100 rounded-xl overflow-hidden flex flex-col lg:flex-row mb-20 shadow-sm">
          
          {/* Left: Text & Form */}
          <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-5xl font-medium text-gray-900 leading-tight">
                Join our newsletter. <br className="hidden md:block" />
                Enjoy big discounts.
              </h2>
              <p className="mt-6 text-lg text-gray-500">
                Sign up for exclusive offers, original stories, activism, events and more.
              </p>
            </div>

            {/* Interactive Form */}
            <div className="mt-10 max-w-lg">
              {status === "success" ? (
                <div className="flex items-center gap-3 p-4 bg-green-100 text-green-800 rounded-2xl animate-fade-in">
                  <HiCheckCircle className="text-2xl" />
                  <span className="font-medium">Thanks for subscribing! Check your inbox.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                  <div className="relative grow">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <HiOutlineEnvelope className="text-gray-400 text-xl" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      required
                      className="w-full h-full bg-[#EBEBEB] focus:bg-white border border-transparent focus:border-gray-200 rounded-xl pl-12 pr-6 py-4 text-lg text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-black transition-all"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className={`bg-black text-white text-lg font-medium rounded-xl px-10 py-4 transition-all whitespace-nowrap shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${
                      status === "loading" ? "opacity-70 cursor-wait" : "hover:bg-gray-900"
                    }`}
                  >
                    {status === "loading" ? "Joining..." : "Signup"}
                  </button>
                </form>
              )}
              <p className="mt-4 text-xs text-gray-400">
                By signing up, you agree to our Terms and Privacy Policy.
              </p>
            </div>
          </div>

          {/* Right: Image (Full Height Cover) */}
          <div className="w-full lg:w-1/2 relative h-64 lg:h-auto min-h-[300px] lg:min-h-full">
            <Image
              src="/Hero/NZ.avif" 
              alt="Clothing rack with neutral tones"
              fill
              className="object-cover object-center"
            />
            {/* Gradient Overlay for style */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100/50 via-transparent to-transparent lg:from-gray-100/20" />
          </div>
        </div>

     

      </div>
    </section>
  );
}