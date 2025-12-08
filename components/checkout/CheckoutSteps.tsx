"use client";

import { useCheckoutStepStore } from "@/store/checkoutStepStore";
import { HiCheck } from "react-icons/hi2";

export default function CheckoutSteps() {
  const { step } = useCheckoutStepStore();

  const steps = [
    { id: 1, name: "Cart" },
    { id: 2, name: "Shipping" },
    { id: 3, name: "Payment" },
  ];

  
  const progressWidth = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto mb-10 px-4">
      <div className="relative flex justify-between items-center">
        
        
        {/* Gray (Empty) Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full -z-10" />
        
        {/* Black (Filled) Line with transition */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-black -translate-y-1/2 rounded-full -z-10 transition-all duration-500 ease-out"
          style={{ width: `${progressWidth}%` }}
        />

        {/* --- 2. Steps --- */}
        {steps.map((s) => {
          const isCompleted = step > s.id;
          const isActive = step === s.id;
          const isPending = step < s.id;

          return (
            <div key={s.id} className="flex flex-col items-center gap-2 group">
              
              {/* Circle Indicator */}
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300 z-10 ${
                  isCompleted
                    ? "bg-black border-black text-white" // Completed
                    : isActive
                    ? "bg-black border-black text-white scale-110 shadow-lg" // Active
                    : "bg-white border-gray-200 text-gray-400" // Pending
                }`}
              >
                {isCompleted ? (
                  <HiCheck className="text-lg font-bold" />
                ) : (
                  <span className="text-sm font-semibold">{s.id}</span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-xs uppercase tracking-wider font-semibold transition-colors duration-300 ${
                  isActive || isCompleted ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {s.name}
              </span>
            </div>
          );
        })}
        
      </div>
    </div>
  );
}