"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { HiArrowRight, HiSparkles, HiGlobeAlt, HiHeart } from "react-icons/hi2";

const values = [
  {
    icon: HiSparkles,
    title: "Quality First",
    description: "We never compromise on fabric. Every stitch is inspected to ensure lasting elegance."
  },
  {
    icon: HiGlobeAlt,
    title: "Sustainability",
    description: "Biodegradable packaging and carbon-neutral shipping for a better tomorrow."
  },
  {
    icon: HiHeart,
    title: "Community",
    description: "We support local artisans and donate 1% of profits to creative education."
  }
];

const stats = [
  { value: "15K+", label: "Customers" },
  { value: "100%", label: "Ethical" },
  { value: "25+", label: "Countries" },
];

export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0"
        >
          <Image
            src="/Hero/About.avif" 
            alt="About LUCIDRIP"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-neutral-900/40" />
        </motion.div>
        
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/70 mb-6">
              Established 2024
            </p>
            <h1 className="text-4xl md:text-7xl font-extralight text-white tracking-wide mb-6">
              Redefining Modern
              <br />
              <span className="italic">Elegance</span>
            </h1>
            <p className="text-sm md:text-base font-light text-white/80 max-w-md mx-auto">
              Timeless fashion for the contemporary soul
            </p>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <div className="w-[1px] h-16 bg-white/30 relative overflow-hidden">
              <motion.div 
                animate={{ y: [0, 64, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-8 bg-white/80"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24 md:py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-8">
              Our Philosophy
            </p>
            <blockquote className="text-2xl md:text-4xl font-extralight text-neutral-900 leading-relaxed mb-8">
              "Style is a way to say who you are
              <br />
              <span className="italic">without having to speak.</span>"
            </blockquote>
            <p className="text-sm md:text-base font-light text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              At LUCIDRIP, we don't just sell clothes; we curate confidence. Our mission is to bridge 
              the gap between high-end fashion and everyday wearability, creating timeless pieces that 
              empower you to look and feel your absolute best.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-16 md:py-24 px-4 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/5] overflow-hidden"
            >
              <Image
                src="/Hero/About@.avif" 
                alt="Design Process"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-neutral-900/80 to-transparent">
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/70 mb-2">
                  The Origin Story
                </p>
                <p className="text-xl font-extralight text-white">
                  Crafted with <span className="italic">Conscience</span>
                </p>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-4">
                  Our Story
                </p>
                <h2 className="text-3xl md:text-4xl font-extralight text-neutral-900 mb-6">
                  From a simple <span className="italic">sketch</span>
                  <br />
                  to a global movement
                </h2>
              </div>
              
              <div className="space-y-4 text-sm md:text-base font-light text-neutral-600 leading-relaxed">
                <p>
                  It started with a simple sketch in a small apartment. Our founder wanted a hoodie 
                  that felt luxurious but could handle the grit of city life.
                </p>
                <p>
                  Today, LUCIDRIP represents a movement towards conscious consumption. We reject 
                  fast fashion trends in favor of durable materials and timeless designs.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-neutral-200">
                {stats.map((stat, i) => (
                  <div key={i}>
                    <p className="text-2xl md:text-3xl font-extralight text-neutral-900">
                      {stat.value}
                    </p>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 md:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-4">
              Our DNA
            </p>
            <h2 className="text-3xl md:text-4xl font-extralight text-neutral-900">
              Core <span className="italic">Values</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="border border-neutral-200 p-8 md:p-10 hover:border-neutral-400 transition-colors"
                >
                  <div className="w-12 h-12 border border-neutral-200 flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-neutral-600" />
                  </div>
                  <h3 className="text-lg font-light text-neutral-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-sm font-light text-neutral-500 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 px-4 bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-6">
              Join the Movement
            </p>
            <h2 className="text-3xl md:text-5xl font-extralight mb-6">
              Ready to elevate your <span className="italic">style</span>?
            </h2>
            <p className="text-sm md:text-base font-light text-white/70 max-w-lg mx-auto mb-10">
              Explore our latest collection and discover pieces designed to last a lifetime.
            </p>
            <Link href="/products">
              <button className="group inline-flex items-center gap-3 bg-white text-neutral-900 px-10 py-4 text-xs tracking-[0.1em] uppercase hover:bg-neutral-100 transition">
                Shop Collection
                <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
