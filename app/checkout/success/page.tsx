"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore"; // 1. Import Store
import { HiCheckCircle, HiArrowLongRight, HiOutlinePrinter } from "react-icons/hi2";

export default function SuccessPage() {
  // 2. Get the clearCart action
  const clearCart = useCartStore((state) => state.clearCart);

  // 3. Clear the cart as soon as this page loads
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-zinc-200 shadow-xl p-8 relative overflow-hidden">
        
        {/* Top Decorative Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-black" />

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white rounded-full mb-6">
            <HiCheckCircle className="text-3xl" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter mb-2">Order Confirmed</h1>
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
            Thank you for your purchase.
          </p>
        </div>

        {/* Receipt Details */}
        <div className="border-t border-b border-dashed border-zinc-300 py-6 mb-8 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="font-mono text-zinc-500 uppercase">Order Status</span>
            <span className="font-bold text-zinc-900 font-mono">Processing</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-mono text-zinc-500 uppercase">Date</span>
            <span className="font-bold text-zinc-900 font-mono">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-sm pt-2">
            <span className="font-bold text-zinc-900 uppercase">Email Sent To</span>
            <span className="text-zinc-900 font-mono text-right">user@example.com</span>
          </div>
        </div>

        <div className="space-y-3">
          <Link 
            href="/"
            className="block w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest text-center hover:bg-zinc-800 transition-colors"
          >
            Continue Shopping
          </Link>
          
          <button 
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 w-full py-4 border border-zinc-200 text-zinc-900 text-xs font-bold uppercase tracking-widest hover:bg-zinc-50 transition-colors"
          >
            <HiOutlinePrinter className="text-lg" /> Print Receipt
          </button>
        </div>

        <p className="text-[10px] text-zinc-400 text-center mt-8 font-mono uppercase">
          A confirmation email has been sent to your inbox.
        </p>

      </div>
    </div>
  );
}