"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/HomePage/NavBar";
import Footer from "@/components/HomePage/FooterSection";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // List of routes to hide the Header/Footer on
  const noLayoutRoutes = ["/login", "/signup", "/forgot-password"];

  // Check if the current path is in the list
  const hideLayout = noLayoutRoutes.includes(pathname);

  return (
    <>
      {!hideLayout && <Header />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}