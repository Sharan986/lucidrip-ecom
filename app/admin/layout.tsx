"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ADMIN_NAV_ITEMS } from "@/config/admin-nav";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { 
  HiArrowRightOnRectangle, 
  HiBars3, 
  HiXMark,
  HiOutlineBell,
  HiMagnifyingGlass
} from "react-icons/hi2";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdminAuthenticated, adminUsername, adminLogout } = useAdminAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Skip login page from auth check
    if (pathname === "/admin/login") return;
    
    // Redirect to admin login if not authenticated
    if (mounted && !isAdminAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAdminAuthenticated, pathname, router, mounted]);

  const handleLogout = () => {
    adminLogout();
    router.push("/admin/login");
  };

  // Show nothing while checking auth (prevents flash)
  if (!mounted) {
    return null;
  }

  // Don't show layout on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Show loading or redirect if not authenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-white text-sm">Redirecting to login...</div>
      </div>
    );
  }

  const currentPage = ADMIN_NAV_ITEMS.find(i => i.href === pathname)?.name || "Overview";

  return (
    <div className="min-h-screen bg-white">
      
      {/* --- SIDEBAR (Desktop) --- */}
      <aside className="w-64 bg-neutral-950 fixed h-full z-30 hidden lg:flex flex-col">
        
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-neutral-800">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white flex items-center justify-center">
              <span className="text-neutral-950 text-xs font-bold">L</span>
            </div>
            <div>
              <span className="text-white text-sm font-light tracking-[0.2em] uppercase">LuciDrip</span>
              <span className="block text-[9px] tracking-[0.15em] uppercase text-neutral-500">Admin</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-600 px-3 mb-4">
            Navigation
          </p>
          <div className="space-y-1">
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 text-xs tracking-wide transition-all ${
                    isActive 
                      ? "bg-white text-neutral-900" 
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                  }`}
                >
                  <Icon className="text-base" />
                  <span className="font-light">{item.name}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className="ml-auto w-1 h-1 bg-neutral-900"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-neutral-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-neutral-800 flex items-center justify-center">
              <span className="text-white text-xs font-light">
                {adminUsername?.charAt(0).toUpperCase() || "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white font-light truncate">
                {adminUsername || "Admin"}
              </p>
              <p className="text-[10px] text-neutral-500 truncate">
                admin@lucidrip.com
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-neutral-900 transition"
          >
            <HiArrowRightOnRectangle className="text-base" />
            <span className="font-light">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* --- MOBILE HEADER --- */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-neutral-950 z-40 flex items-center justify-between px-4">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white flex items-center justify-center">
            <span className="text-neutral-950 text-[10px] font-bold">L</span>
          </div>
          <span className="text-white text-xs tracking-[0.15em] uppercase">Admin</span>
        </Link>
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-white"
        >
          <HiBars3 className="text-xl" />
        </button>
      </header>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-neutral-950 z-50 lg:hidden flex flex-col"
            >
              <div className="h-14 flex items-center justify-between px-4 border-b border-neutral-800">
                <span className="text-white text-xs tracking-[0.15em] uppercase">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white">
                  <HiXMark className="text-xl" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4 px-3">
                {ADMIN_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link 
                      key={item.name} 
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 text-xs tracking-wide transition-all ${
                        isActive 
                          ? "bg-white text-neutral-900" 
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      <Icon className="text-base" />
                      <span className="font-light">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-neutral-800">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2 text-xs text-red-400"
                >
                  <HiArrowRightOnRectangle className="text-base" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* --- MAIN CONTENT --- */}
      <main className="lg:ml-64 min-h-screen">
        
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-neutral-200 sticky top-0 z-20 px-6 lg:px-8 flex items-center justify-between mt-14 lg:mt-0">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400">
                Admin Panel
              </p>
              <h1 className="text-sm font-light text-neutral-900">{currentPage}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search Toggle */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 border border-neutral-200 hover:border-neutral-400 transition"
            >
              <HiMagnifyingGlass className="w-4 h-4 text-neutral-500" />
            </button>
            
            {/* Notifications */}
            <button className="p-2 border border-neutral-200 hover:border-neutral-400 transition relative">
              <HiOutlineBell className="w-4 h-4 text-neutral-500" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500" />
            </button>
            
            {/* Status */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-neutral-200">
              <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" />
              <span className="text-[10px] tracking-[0.1em] uppercase text-neutral-500">Online</span>
            </div>
          </div>
        </header>

        {/* Search Bar (Expandable) */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-neutral-50 border-b border-neutral-200 overflow-hidden"
            >
              <div className="px-6 lg:px-8 py-4">
                <div className="relative max-w-xl">
                  <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search orders, products, customers..."
                    className="w-full pl-12 pr-4 py-3 border border-neutral-200 text-sm font-light focus:outline-none focus:border-neutral-900 transition"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
