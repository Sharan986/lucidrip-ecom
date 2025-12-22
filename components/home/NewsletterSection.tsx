"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HiArrowLongRight } from "react-icons/hi2";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 5000);
    }, 1500);
  };

  return (
    <section 
      ref={sectionRef}
      className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src="/Hero/NZ.avif"
          alt="Newsletter Background"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 max-w-[800px] mx-auto px-6 sm:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Label */}
          <span className="text-white/50 text-xs tracking-[0.3em] uppercase mb-8 block">
            Stay Connected
          </span>

          {/* Heading */}
          <h2 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight leading-tight mb-6">
            Join the <span className="italic font-normal">Inner Circle</span>
          </h2>

          {/* Description */}
          <p className="text-white/60 text-lg md:text-xl font-light max-w-lg mx-auto mb-12">
            Exclusive access to new arrivals, private sales, and curated style guides.
          </p>

          {/* Form */}
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-white/80 text-lg"
            >
              <span className="inline-flex items-center gap-3">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                Thank you. Welcome to the circle.
              </span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-transparent border-b border-white/30 focus:border-white px-0 py-4 text-white text-base placeholder-white/40 outline-none transition-colors duration-300"
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={status === "loading"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative overflow-hidden bg-white text-black px-8 py-4 text-sm tracking-widest uppercase font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {status === "loading" ? (
                      <>
                        <span className="w-4 h-4 border border-black border-t-transparent rounded-full animate-spin" />
                        Wait
                      </>
                    ) : (
                      <>
                        Subscribe
                        <HiArrowLongRight className="text-xl group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  {/* Hover Fill Effect */}
                  <span className="absolute inset-0 bg-gray-900 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  <span className="absolute inset-0 text-white flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    Subscribe
                    <HiArrowLongRight className="text-xl" />
                  </span>
                </motion.button>
              </div>

              <p className="mt-8 text-white/30 text-xs tracking-wider">
                No spam. Unsubscribe anytime.
              </p>
            </form>
          )}
        </motion.div>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  );
}
