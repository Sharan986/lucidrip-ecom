"use client";

import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { useCheckoutStepStore } from "@/store/checkoutStepStore";
// Icons
import { HiArrowRight, HiOutlineShoppingBag } from "react-icons/hi2";

export default function CartReview() {
  const { items, getCartTotal } = useCartStore();
  const { nextStep } = useCheckoutStepStore();

  // Calculate Totals Logic (Same as Cart Page)
  const subtotal = getCartTotal();
  const shippingCost = subtotal > 200 ? 0 : 15; // Free shipping over $200
  const total = subtotal + shippingCost;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-10">
      
      {/* --- Header --- */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-gray-100 rounded-full">
           <HiOutlineShoppingBag className="text-xl text-gray-700" />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
            <p className="text-sm text-gray-500">Review your items before shipping</p>
        </div>
      </div>

      {/* --- Items List --- */}
      <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
        {items.map((item) => (
          <div
            key={item.uniqueId}
            className="flex gap-4 items-start border-b border-gray-50 pb-6 last:border-0 last:pb-0"
          >
            {/* Image Thumbnail */}
            <div className="relative w-20 h-24 shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
              <Image 
                src={item.img} 
                alt={item.name} 
                fill 
                className="object-cover" 
              />
            </div>

            {/* Details */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.size} <span className="text-gray-300 mx-1">|</span> {item.color}
                    </p>
                    <div className="mt-2 inline-flex items-center px-2 py-1 bg-gray-50 rounded-md text-xs font-medium text-gray-600 border border-gray-100">
                        Qty: {item.quantity}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                       ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                       ₹{item.price} each
                    </p>
                  </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Cost Breakdown --- */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-3 text-gray-600 text-sm">
             <span>Subtotal</span>
             <span className="font-medium text-gray-900">₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mb-4 text-gray-600 text-sm">
             <span>Shipping</span>
             <span className={shippingCost === 0 ? "text-green-600 font-medium" : "font-medium text-gray-900"}>
                {shippingCost === 0 ? "Free" : `₹${shippingCost}`}
             </span>
          </div>
          <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
             <span className="font-bold text-lg text-gray-900">Total</span>
             <span className="font-bold text-xl text-gray-900">₹{total.toLocaleString()}</span>
          </div>
      </div>

      {/* --- Action Button --- */}
      <button
        onClick={nextStep}
        className="w-full flex items-center justify-center gap-2 bg-black text-white py-4 rounded-xl font-medium text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
      >
        <span>Continue to Shipping</span>
        <HiArrowRight />
      </button>
      
    </div>
  );
}