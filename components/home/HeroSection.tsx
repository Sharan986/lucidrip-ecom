"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { HiArrowLongRight } from "react-icons/hi2";
import { useRef } from "react";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-black">
      {/* Parallax Background Image */}
      <motion.div 
        style={{ y, scale }}
        className="absolute inset-0"
      >
        <Image
          src="/Hero/HeroImg.avif"
          alt="Hero Background"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        {/* Cinematic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between px-6 sm:px-10 lg:px-16 py-8">
        
        {/* Top Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex justify-between items-center"
        >
          <span className="text-white/60 text-xs tracking-[0.3em] uppercase">Winter 2024</span>
          <span className="text-white/60 text-xs tracking-[0.3em] uppercase">New Collection</span>
        </motion.div>

        {/* Main Content - Center */}
        <motion.div 
          style={{ opacity }}
          className="flex-1 flex items-center justify-center"
        >
          <div className="text-center max-w-5xl">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-white/50 text-sm md:text-base tracking-[0.4em] uppercase mb-6"
            >
              Introducing
            </motion.p>
            
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-white text-[12vw] md:text-[10vw] lg:text-[8vw] font-extralight tracking-tight leading-[0.9] mb-8"
            >
              The Art of
              <br />
              <span className="font-medium italic">Expression</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-white/60 text-base md:text-lg max-w-md mx-auto mb-10 font-light"
            >
              Where timeless elegance meets contemporary design
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative px-10 py-4 bg-white text-black text-sm tracking-widest uppercase overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3 justify-center group-hover:text-white transition-colors duration-300">
                    Explore Collection
                    <HiArrowLongRight className="text-xl group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-black origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.button>
              </Link>
              
              <Link href="/about">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-4 border border-white/30 text-white text-sm tracking-widest uppercase hover:border-white transition-all duration-300"
                >
                  Our Story
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex justify-between items-end"
        >
          <div className="hidden md:block">
            <p className="text-white/40 text-xs tracking-widest uppercase mb-2">Scroll</p>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent"
            />
          </div>
          
          <div className="text-right">
            <p className="text-white/40 text-xs tracking-widest uppercase mb-1">Free Shipping</p>
            <p className="text-white/70 text-sm">On orders over ₹2,000</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
