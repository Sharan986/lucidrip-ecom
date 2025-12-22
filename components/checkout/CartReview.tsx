"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useCheckoutStepStore } from "@/store/checkoutStepStore";
import { motion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi2";

export default function CartReview() {
  const { items, getCartTotal } = useCartStore();
  const { nextStep } = useCheckoutStepStore();

  const subtotal = getCartTotal();
  const shippingCost = subtotal > 2500 ? 0 : 150;
  const total = subtotal + shippingCost;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border border-neutral-100"
    >
      {/* Header */}
      <div className="p-6 md:p-8 border-b border-neutral-100">
        <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-2">Step 1</p>
        <h2 className="text-2xl font-extralight tracking-tight">
          Order <span className="italic">Summary</span>
        </h2>
      </div>

      {/* Items List */}
      <div className="max-h-[400px] overflow-y-auto">
        {items.map((item, index) => (
          <motion.div
            key={item.uniqueId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-4 p-6 md:p-8 border-b border-neutral-50 last:border-0"
          >
            {/* Image */}
            <Link 
              href={`/product/${item.slug || '#'}`}
              className="relative w-20 h-24 flex-shrink-0 bg-neutral-50 overflow-hidden group"
            >
              <Image 
                src={item.img} 
                alt={item.name} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            </Link>

            {/* Details */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <Link href={`/product/${item.slug || '#'}`}>
                  <h3 className="text-sm tracking-wide text-neutral-900 hover:underline underline-offset-4 decoration-neutral-300 truncate">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-xs tracking-[0.1em] text-neutral-400 mt-1 uppercase">
                  {item.size} · {item.color}
                </p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-neutral-400">Qty: {item.quantity}</span>
                <span className="text-sm font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cost Breakdown */}
      <div className="p-6 md:p-8 bg-neutral-50 border-t border-neutral-100">
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Subtotal</span>
            <span className="text-neutral-900">₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Shipping</span>
            <span className={shippingCost === 0 ? "text-emerald-600" : "text-neutral-900"}>
              {shippingCost === 0 ? "Complimentary" : `₹${shippingCost}`}
            </span>
          </div>
        </div>
        <div className="pt-4 border-t border-neutral-200 flex justify-between items-baseline">
          <span className="text-sm tracking-wide">Total</span>
          <span className="text-xl font-extralight">₹{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-6 md:p-8 border-t border-neutral-100">
        <button
          onClick={nextStep}
          className="group w-full flex items-center justify-center gap-3 py-4 bg-black text-white text-xs tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
        >
          <span>Continue to Shipping</span>
          <HiArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}
