import type { Metadata } from "next";
import { Poppins } from 'next/font/google'; 
import ClientLayout from "@/components/layout/ClientLayout"; // 👈 This handles the Nav & Footer now
import "./globals.css";

// Configure the font
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-poppins',
});

// Updated Metadata
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
        
       
        <ClientLayout>
           {children}
        </ClientLayout>
        
      </body>
    </html>
  );
}