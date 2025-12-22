"use client";

import { motion } from "framer-motion";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import CartReview from "@/components/checkout/CartReview";
import ShippingForm from "@/components/checkout/ShippingForm";
import PaymentSection from "@/components/checkout/PaymentSection";
import { useCheckoutStepStore } from "@/store/checkoutStepStore";
import { HiArrowLeft } from "react-icons/hi2";
import Link from "next/link";

export default function CheckoutPage() {
  const { step } = useCheckoutStepStore();

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/cart"
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors group"
            >
              <HiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-light">Return to Bag</span>
            </Link>

            <h1 className="text-2xl md:text-3xl font-extralight tracking-wide">
              <span className="italic">Checkout</span>
            </h1>

            <div className="w-20" />
          </div>
        </div>
      </div>

      {/* Steps Indicator */}
      <CheckoutSteps />

      {/* Main Content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto px-4 py-8 md:py-12"
      >
        {step === 1 && <CartReview />}
        {step === 2 && <ShippingForm />}
        {step === 3 && <PaymentSection />}
      </motion.div>

      {/* Footer Trust Section */}
      <div className="bg-white border-t border-neutral-200 py-8 mt-auto">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-1">
                Secure Checkout
              </p>
              <p className="text-xs font-light text-neutral-600">
                256-bit SSL Encryption
              </p>
            </div>
            <div className="h-8 w-px bg-neutral-200 hidden md:block" />
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-1">
                Free Shipping
              </p>
              <p className="text-xs font-light text-neutral-600">
                On orders over ₹2,500
              </p>
            </div>
            <div className="h-8 w-px bg-neutral-200 hidden md:block" />
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-1">
                Easy Returns
              </p>
              <p className="text-xs font-light text-neutral-600">
                30-day return policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
