"use client";

import { HiOutlineBars2, HiXMark, HiOutlineUser, HiArrowLongRight, HiOutlineHeart } from "react-icons/hi2";
import { PiShoppingBagLight } from "react-icons/pi";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

// Safe hydration hook using useSyncExternalStore
const emptySubscribe = () => () => {};
const useHydrated = () => useSyncExternalStore(emptySubscribe, () => true, () => false);

const NavBar = () => {
  const { items } = useCartStore();
  const { items: wishlistItems, fetchWishlist } = useWishlistStore();
  const { token } = useAuthStore();
  const isMounted = useHydrated();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const prevPathnameRef = useRef(pathname);

  // Fetch wishlist when user is logged in
  useEffect(() => {
    if (token && isMounted) {
      fetchWishlist();
    }
  }, [token, isMounted, fetchWishlist]);

  // Smart hide on scroll down, show on scroll up
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
    setIsScrolled(latest > 50);
  });

  // Close mobile menu on route change using event-based pattern
  useEffect(() => {
    const handleRouteChange = () => {
      if (prevPathnameRef.current !== pathname && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
      prevPathnameRef.current = pathname;
    };
    handleRouteChange();
  }, [pathname, isMobileMenuOpen]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

  const cartCount = isMounted 
    ? items.reduce((total, item) => total + item.quantity, 0) 
    : 0;

  const wishlistCount = isMounted ? wishlistItems.length : 0;

  const navLinks = [
    { name: "Shop", href: "/products" },
    { name: "Collections", href: "/products?view=collections" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <motion.nav 
        initial={{ y: 0 }}
        animate={{ y: isHidden ? -100 : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "bg-white/90 backdrop-blur-xl border-b border-gray-100" 
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="h-20 md:h-24 flex items-center justify-between">
            
            {/* Left: Menu Button (Mobile) + Links (Desktop) */}
            <div className="flex-1 flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className={`md:hidden p-2 -ml-2 transition-colors ${
                  isScrolled ? "text-gray-900" : "text-gray-900"
                }`}
              >
                <HiOutlineBars2 size={24} strokeWidth={1} />
              </button>

              <div className="hidden md:flex items-center gap-10">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    className={`relative text-[13px] tracking-widest uppercase transition-colors duration-300 ${
                      isScrolled 
                        ? isActive(link.href) ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
                        : isActive(link.href) ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {link.name}
                    {isActive(link.href) && (
                      <motion.span 
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 right-0 h-px bg-gray-900"
                      />
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Center: Logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <motion.h1 
                className={`text-xl md:text-2xl font-extralight tracking-[0.25em] transition-colors duration-300 ${
                  isScrolled ? "text-gray-900" : "text-gray-900"
                }`}
                whileHover={{ letterSpacing: "0.3em" }}
                transition={{ duration: 0.3 }}
              >
                LUCIDRIP
              </motion.h1>
            </Link>

            {/* Right: Wishlist, Cart & Account */}
            <div className="flex-1 flex items-center justify-end gap-6">
              
              {/* Wishlist */}
              <Link href="/account/wishlist" className="relative group">
                <motion.div
                  className={`flex items-center gap-2 transition-colors duration-300 ${
                    isScrolled ? "text-gray-900" : "text-gray-900"
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <HiOutlineHeart size={22} strokeWidth={1.5} />
                  <AnimatePresence mode="wait">
                    {wishlistCount > 0 && (
                      <motion.span 
                        key={wishlistCount}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="text-[11px] tracking-wider"
                      >
                        ({wishlistCount})
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>

              {/* Account */}
              <Link 
                href="/account"
                className={`hidden md:block text-[13px] tracking-widest uppercase transition-colors duration-300 ${
                  isScrolled ? "text-gray-500 hover:text-gray-900" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Account
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative group">
                <motion.div
                  className={`flex items-center gap-2 transition-colors duration-300 ${
                    isScrolled ? "text-gray-900" : "text-gray-900"
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <PiShoppingBagLight size={22} strokeWidth={1} />
                  <AnimatePresence mode="wait">
                    {cartCount > 0 && (
                      <motion.span 
                        key={cartCount}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="text-[11px] tracking-wider"
                      >
                        ({cartCount})
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>

            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-full max-w-md bg-white"
            >
              <div className="flex flex-col h-full">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <span className="text-lg font-extralight tracking-[0.2em]">MENU</span>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 -mr-2 text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    <HiXMark size={24} />
                  </button>
                </div>

                {/* Links */}
                <div className="flex-1 p-6">
                  <div className="space-y-1">
                    {navLinks.map((link, i) => (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                      >
                        <Link 
                          href={link.href}
                          className={`group flex items-center justify-between py-5 border-b border-gray-100 transition-colors ${
                            isActive(link.href) ? "text-gray-900" : "text-gray-500"
                          }`}
                        >
                          <span className="text-2xl font-extralight tracking-wide">{link.name}</span>
                          <HiArrowLongRight className="text-2xl text-gray-300 group-hover:text-gray-900 group-hover:translate-x-2 transition-all" />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 space-y-6">
                  <div className="flex items-center gap-6 flex-wrap">
                    <Link href="/account" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                      <HiOutlineUser size={18} />
                      <span className="text-sm tracking-wider">Account</span>
                    </Link>
                    <Link href="/account/wishlist" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                      <HiOutlineHeart size={18} />
                      <span className="text-sm tracking-wider">Wishlist ({wishlistCount})</span>
                    </Link>
                    <Link href="/cart" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                      <PiShoppingBagLight size={18} />
                      <span className="text-sm tracking-wider">Bag ({cartCount})</span>
                    </Link>
                  </div>
                  <p className="text-xs text-gray-300 tracking-wider">
                    © 2024 LUCIDRIP
                  </p>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;
