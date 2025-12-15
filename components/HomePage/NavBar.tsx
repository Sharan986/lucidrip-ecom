"use client";

import { FaGripLines } from "react-icons/fa6";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { HiXMark, HiChevronRight, HiOutlineUser } from "react-icons/hi2"; // 1. Imported User Icon
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const { items } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close mobile menu whenever the route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const cartCount = isMounted 
    ? items.reduce((total, item) => total + item.quantity, 0) 
    : 0;

  const navLinks = [
    { name: "Shop", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
          
          {/* --- LEFT SECTION --- */}
          <div className="flex-1 flex items-center justify-start">
            
            {/* Mobile: Hamburger Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-gray-800 hover:text-black focus:outline-none"
            >
              <FaGripLines size={22} />
            </button>

            {/* Desktop: Navigation Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="hover:text-black transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* --- CENTER SECTION: LOGO --- */}
          <div className="shrink-0">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
              <h1 className="font-serif font-bold text-2xl md:text-3xl tracking-wide text-black">
                LUCIDRIP
              </h1>
            </Link>
          </div>

          {/* --- RIGHT SECTION: CART & PROFILE --- */}
          <div className="flex-1 flex items-center justify-end gap-3 sm:gap-4">
            
            {/* Cart Icon */}
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-black transition-colors">
              <PiShoppingCartSimpleBold size={24} className="cursor-pointer hover:scale-105 transition-transform" />
              
              {/* Badge */}
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white transform translate-x-1 -translate-y-1">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* ✅ NEW: Circular Avatar Button */}
            <Link 
              href="/account"
              className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-black hover:text-white hover:border-black transition-all duration-300 shadow-sm"
              title="My Account"
            >
              <HiOutlineUser size={18} />
            </Link>

          </div>

        </div>
      </nav>

      {/* --- MOBILE MENU OVERLAY --- */}
      <div 
        className={`fixed inset-0 z-50 bg-white transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          
          {/* Header: Close Button & Logo */}
          <div className="flex items-center justify-between mb-12">
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 -ml-2 text-gray-500 hover:text-black transition-colors"
            >
              <HiXMark size={28} />
            </button>
            <span className="font-serif font-bold text-xl tracking-wide">LUCIDRIP</span>
            <div className="w-8" />
          </div>

          {/* Links List */}
          <div className="flex flex-col space-y-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="group flex items-center justify-between text-3xl font-medium text-gray-900 border-b border-gray-100 pb-4"
              >
                <span>{link.name}</span>
                <HiChevronRight className="text-gray-300 group-hover:text-black transition-colors text-xl" />
              </Link>
            ))}
          </div>

          {/* Bottom Footer Area */}
          <div className="mt-auto space-y-6 text-sm text-gray-500">
            <div className="flex flex-col gap-2">
              <Link href="/account" className="hover:text-black font-semibold flex items-center gap-2">
                 <HiOutlineUser size={16} /> My Account
              </Link>
              <Link href="/orders" className="hover:text-black">Track Order</Link>
            </div>
            <p className="text-xs text-gray-300 pt-4 border-t border-gray-100">
              © 2024 LUCIDRIP Store
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default NavBar;