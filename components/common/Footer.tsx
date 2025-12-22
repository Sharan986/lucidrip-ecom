"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiArrowUpRight } from "react-icons/hi2";
import { FaFacebookF, FaInstagram, FaTwitter, FaPinterestP } from "react-icons/fa6";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: "New Arrivals", href: "/products?sort=newest" },
      { name: "Bestsellers", href: "/products?sort=popular" },
      { name: "Women", href: "/products?category=women" },
      { name: "Men", href: "/products?category=men" },
      { name: "Accessories", href: "/products?category=accessories" },
    ],
    help: [
      { name: "Customer Care", href: "/contact" },
      { name: "Shipping Info", href: "/shipping" },
      { name: "Returns", href: "/returns" },
      { name: "Size Guide", href: "/size-guide" },
      { name: "Track Order", href: "/orders" },
    ],
    about: [
      { name: "Our Story", href: "/about" },
      { name: "Sustainability", href: "/sustainability" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
    ],
  };

  const socialLinks = [
    { icon: <FaInstagram />, href: "#", label: "Instagram" },
    { icon: <FaFacebookF />, href: "#", label: "Facebook" },
    { icon: <FaTwitter />, href: "#", label: "Twitter" },
    { icon: <FaPinterestP />, href: "#", label: "Pinterest" },
  ];

  return (
    <footer className="bg-[#0a0a0a] text-white">
      {/* Main Footer Content */}
      <div className="max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Top Section */}
        <div className="py-20 md:py-32 border-b border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
            
            {/* Brand Column */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5"
            >
              <h2 className="text-5xl md:text-7xl font-extralight tracking-tight mb-8">
                LUCIDRIP
              </h2>
              <p className="text-white/40 text-base leading-relaxed max-w-md mb-10">
                Curated fashion for the modern individual. Timeless pieces designed for those who appreciate understated elegance.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social, idx) => (
                  <motion.a
                    key={idx}
                    href={social.href}
                    aria-label={social.label}
                    className="w-12 h-12 flex items-center justify-center border border-white/20 text-white/60 hover:border-white hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-sm">{social.icon}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Links Columns */}
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-8">
              
              {/* Shop Column */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <h4 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-8">
                  Shop
                </h4>
                <ul className="space-y-4">
                  {footerLinks.shop.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-white/60 hover:text-white text-sm tracking-wide transition-colors duration-300 inline-block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Help Column */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-8">
                  Help
                </h4>
                <ul className="space-y-4">
                  {footerLinks.help.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-white/60 hover:text-white text-sm tracking-wide transition-colors duration-300 inline-block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* About Column */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-8">
                  About
                </h4>
                <ul className="space-y-4">
                  {footerLinks.about.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-white/60 hover:text-white text-sm tracking-wide transition-colors duration-300 inline-block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Contact Row */}
        <div className="py-12 border-b border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-white/40 mb-2">Email</p>
                <a 
                  href="mailto:hello@lucidrip.com" 
                  className="text-white text-lg font-light hover:opacity-60 transition-opacity inline-flex items-center gap-2 group"
                >
                  hello@lucidrip.com
                  <HiArrowUpRight className="text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-white/40 mb-2">Phone</p>
                <a 
                  href="tel:+11234567890" 
                  className="text-white text-lg font-light hover:opacity-60 transition-opacity"
                >
                  +1 (123) 456-7890
                </a>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs tracking-[0.2em] uppercase text-white/40 mb-2">Location</p>
              <p className="text-white/60 text-sm">
                New York, NY
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-white/30 text-xs tracking-wider">
              © {currentYear} LUCIDRIP. All rights reserved.
            </p>
            <div className="flex items-center gap-8 text-xs text-white/30">
              <Link href="/privacy" className="hover:text-white transition-colors tracking-wider">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors tracking-wider">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors tracking-wider">
                Cookie Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
