"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    text: "I love the variety of styles and the high-quality clothing on this fashion site.",
    author: "Maria Chen",
    role: "Fashion Editor, Vogue",
  },
  {
    id: 2,
    text: "The best online shopping experience I've ever had. Fast shipping and amazing quality.",
    author: "James Morrison",
    role: "Creative Director",
  },
  {
    id: 3,
    text: "Outstanding customer service and the products always exceed my expectations.",
    author: "Sophie Laurent",
    role: "Style Consultant",
  },
];

const featuredLogos = [
  "VOGUE", "ELLE", "HARPER'S BAZAAR", "GQ", "ESQUIRE", "COSMOPOLITAN"
];

const TestimonialSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative bg-white py-32 md:py-48 overflow-hidden"
    >
      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.span 
          style={{ opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.03, 0]) }}
          className="text-[20vw] font-extralight text-gray-900 whitespace-nowrap"
        >
          TESTIMONIALS
        </motion.span>
      </div>

      <motion.div 
        style={{ opacity }}
        className="relative max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16"
      >
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-gray-400 text-xs tracking-[0.3em] uppercase">
            What They Say
          </span>
        </motion.div>

        {/* Testimonial Content */}
        <div className="relative min-h-[300px] md:min-h-[400px]">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: activeIndex === index ? 1 : 0,
                scale: activeIndex === index ? 1 : 0.95,
              }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className={`absolute inset-0 flex flex-col items-center justify-center text-center ${
                activeIndex === index ? 'pointer-events-auto' : 'pointer-events-none'
              }`}
            >
              {/* Quote Mark */}
              <motion.span 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: activeIndex === index ? 0.1 : 0, y: 0 }}
                className="text-9xl md:text-[200px] font-serif text-gray-900 absolute -top-10 md:-top-20 left-1/2 -translate-x-1/2"
              >
                &ldquo;
              </motion.span>

              {/* Quote Text */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extralight text-gray-900 leading-tight max-w-4xl px-4">
                <span className="italic">{testimonial.text}</span>
              </h2>

              {/* Author */}
              <div className="mt-12 md:mt-16">
                <p className="text-gray-900 text-lg md:text-xl font-normal tracking-wide">
                  {testimonial.author}
                </p>
                <p className="text-gray-400 text-sm tracking-widest uppercase mt-2">
                  {testimonial.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-6 mt-16">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className="group relative py-4"
              aria-label={`Go to testimonial ${index + 1}`}
            >
              <span className={`block h-px w-12 transition-all duration-500 ${
                activeIndex === index 
                  ? 'bg-gray-900' 
                  : 'bg-gray-200 group-hover:bg-gray-400'
              }`} />
              <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs transition-opacity duration-300 ${
                activeIndex === index ? 'opacity-100' : 'opacity-0'
              }`}>
                0{index + 1}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Featured In Logos */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-32 md:mt-48 border-t border-gray-100 pt-16"
      >
        <p className="text-center text-gray-400 text-xs tracking-[0.3em] uppercase mb-12">
          As Featured In
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 px-6">
          {featuredLogos.map((logo, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-gray-300 text-sm md:text-base font-light tracking-[0.2em] hover:text-gray-900 transition-colors duration-500 cursor-default"
            >
              {logo}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default TestimonialSection;