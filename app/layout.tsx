import type { Metadata } from "next";
// 1. Removed unused Geist imports to keep file small
import { Poppins } from 'next/font/google'; 
import "./globals.css";
import NavBar from "@/components/HomePage/NavBar";
import FooterSection from "@/components/HomePage/FooterSection";

// Configure the font
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-poppins',
});

// 2. Updated Metadata for SEO/Browser Tab
export const metadata: Metadata = {
  title: "LUCIDRIP | Modern Streetwear",
  description: "Premium oversized hoodies, knits, and streetwear essentials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <NavBar />
        {children}
        <FooterSection />
      </body>
    </html>
  );
}