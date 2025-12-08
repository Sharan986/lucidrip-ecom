"use client";

import Link from "next/link";
import Image from "next/image";
import { HiArrowRight, HiOutlineHome } from "react-icons/hi2";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 md:px-10 bg-white py-20">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* --- LEFT: Text Content --- */}
        <div className="order-2 lg:order-1 flex flex-col items-start text-left">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
            Error 404
          </p>
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-black mb-6 tracking-tight leading-[0.9]">
            Lost in <br/> Style?
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-md leading-relaxed">
            The page you are looking for might have been moved, deleted, or possibly never existed. Let s get you back on trend.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Primary Button */}
            <Link 
              href="/" 
              className="flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-xl font-medium transition-all hover:bg-gray-900 hover:shadow-xl hover:-translate-y-1"
            >
              <HiOutlineHome className="text-xl" />
              <span>Back to Home</span>
            </Link>
            
            {/* Secondary Button */}
            <Link 
              href="/products" 
              className="flex items-center justify-center gap-2 bg-white text-black border border-gray-200 px-8 py-4 rounded-xl font-medium transition-all hover:border-black hover:bg-gray-50"
            >
              <span>View Collections</span>
              <HiArrowRight />
            </Link>
          </div>
        </div>

        {/* --- RIGHT: Visual --- */}
        <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-gray-100 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 ease-out cursor-pointer group">
             
             {/* Replace this src with any stylish portrait from your assets */}
             <Image
               src="/Hero/Product1.avif" 
               alt="Page not found"
               fill
               className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
             />
             
             {/* Overlay Text */}
             <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-transparent transition-colors">
                <span className="text-white/80 font-serif text-9xl font-bold opacity-0 group-hover:opacity-20 transition-opacity duration-500 select-none">
                  404
                </span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}