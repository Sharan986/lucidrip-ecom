"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/common/NavBar";
import Footer from "@/components/common/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ErrorBoundary from "@/components/common/ErrorBoundary";

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  // Hide loader after initial mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // List of routes to hide the Header/Footer on
  const noLayoutRoutes = ["/login", "/signup", "/forgot-password"];
  const isAdminRoute = pathname.startsWith("/admin");

  // Check if the current path is in the list
  const hideLayout = noLayoutRoutes.includes(pathname) || isAdminRoute;

  // Initial page loader
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.h1 
            className="font-serif font-bold text-3xl tracking-wide text-black"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            LUCIDRIP
          </motion.h1>
          <div className="w-24 h-0.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-black rounded-full"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ 
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {/* Scroll Progress Indicator */}
      {!hideLayout && <ScrollProgress />}
      
      {/* Navigation */}
      {!hideLayout && <Header />}
      
      {/* Main Content with Page Transitions */}
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial="initial"
          animate="enter"
          exit="exit"
          variants={pageVariants}
          className="min-h-screen"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      
      {/* Footer */}
      {!hideLayout && <Footer />}
    </ErrorBoundary>
  );
}