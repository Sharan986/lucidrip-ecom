"use client";

import { motion } from "framer-motion";
import { useCheckoutStepStore } from "@/store/checkoutStepStore";
import { HiCheck } from "react-icons/hi2";

const steps = [
  { number: 1, label: "Review", sublabel: "Your Bag" },
  { number: 2, label: "Shipping", sublabel: "Delivery Details" },
  { number: 3, label: "Payment", sublabel: "Complete Order" },
];

export default function CheckoutSteps() {
  const { step } = useCheckoutStepStore();

  return (
    <div className="w-full border-b border-neutral-200 bg-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Mobile View */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
              Step {step} of 3
            </span>
            <span className="text-sm font-light">
              {steps[step - 1].label}
            </span>
          </div>
          <div className="h-[2px] bg-neutral-100 relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((step) / 3) * 100}%` }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-y-0 left-0 bg-neutral-900"
            />
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex items-center justify-between">
          {steps.map((s, index) => (
            <div key={s.number} className="flex items-center flex-1">
              {/* Step Indicator */}
              <div className="flex items-center">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: step > s.number ? "#171717" : step === s.number ? "#171717" : "#ffffff",
                    borderColor: step >= s.number ? "#171717" : "#d4d4d4",
                  }}
                  className="relative w-10 h-10 border flex items-center justify-center"
                >
                  {step > s.number ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <HiCheck className="w-5 h-5 text-white" />
                    </motion.div>
                  ) : (
                    <span
                      className={`text-sm font-light ${
                        step === s.number ? "text-white" : "text-neutral-400"
                      }`}
                    >
                      {s.number}
                    </span>
                  )}
                </motion.div>

                {/* Step Label */}
                <div className="ml-4">
                  <p
                    className={`text-[10px] tracking-[0.2em] uppercase ${
                      step >= s.number ? "text-neutral-900" : "text-neutral-400"
                    }`}
                  >
                    {s.sublabel}
                  </p>
                  <p
                    className={`text-sm font-light mt-0.5 ${
                      step >= s.number ? "text-neutral-900" : "text-neutral-400"
                    }`}
                  >
                    {s.label}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-[1px] bg-neutral-200 mx-6 relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: step > s.number ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-y-0 left-0 bg-neutral-900"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
