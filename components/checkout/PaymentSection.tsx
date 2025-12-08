"use client";

import { useCheckoutStepStore } from "@/store/checkoutStepStore";
import { useCheckoutStore } from "@/store/checkoutStore";
// Icons
import { 
  HiOutlineBanknotes, 
  HiOutlineCreditCard, 
  HiArrowLeft, 
  HiCheckCircle,
  HiLockClosed 
} from "react-icons/hi2";

export default function PaymentSection() {
  const { paymentMethod, setPaymentMethod } = useCheckoutStore();
  const { prevStep } = useCheckoutStepStore();

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
      
      {/* --- Header --- */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Payment Method</h2>
        <p className="text-gray-500 mt-2 text-sm">
          Select how you would like to pay for your order.
        </p>
      </div>

      {/* --- Payment Options --- */}
      <div className="flex flex-col gap-4 mb-10">
        
        {/* OPTION 1: COD */}
        <div
          onClick={() => setPaymentMethod("COD")}
          className={`relative flex items-center gap-5 p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 group ${
            paymentMethod === "COD"
              ? "border-black bg-gray-50"
              : "border-gray-100 hover:border-gray-200"
          }`}
        >
          {/* Icon */}
          <div className={`p-3 rounded-full ${paymentMethod === "COD" ? "bg-black text-white" : "bg-gray-100 text-gray-500"}`}>
             <HiOutlineBanknotes className="text-xl" />
          </div>

          {/* Text */}
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">Cash on Delivery</h3>
            <p className="text-sm text-gray-500">Pay locally when the order arrives.</p>
          </div>

          {/* Radio Indicator */}
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
             paymentMethod === "COD" ? "border-black" : "border-gray-300"
          }`}>
             {paymentMethod === "COD" && <div className="w-3 h-3 rounded-full bg-black" />}
          </div>
        </div>

        {/* OPTION 2: RAZORPAY */}
        <div
          onClick={() => setPaymentMethod("Razorpay")}
          className={`relative flex items-center gap-5 p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 group ${
            paymentMethod === "Razorpay"
              ? "border-black bg-gray-50"
              : "border-gray-100 hover:border-gray-200"
          }`}
        >
          {/* Icon */}
          <div className={`p-3 rounded-full ${paymentMethod === "Razorpay" ? "bg-black text-white" : "bg-gray-100 text-gray-500"}`}>
             <HiOutlineCreditCard className="text-xl" />
          </div>

          {/* Text */}
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">Online Payment</h3>
            <p className="text-sm text-gray-500">UPI, Cards, Wallets, NetBanking (Razorpay)</p>
          </div>

           {/* Radio Indicator */}
           <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
             paymentMethod === "Razorpay" ? "border-black" : "border-gray-300"
          }`}>
             {paymentMethod === "Razorpay" && <div className="w-3 h-3 rounded-full bg-black" />}
          </div>
        </div>

      </div>

      {/* --- Footer / Actions --- */}
      <div className="pt-6 border-t border-gray-100">
        
        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-2 mb-6 text-xs text-gray-400">
           <HiLockClosed />
           <span>Payments are secure and encrypted</span>
        </div>

        <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              className="flex items-center gap-2 text-gray-500 hover:text-black font-medium transition-colors px-2 py-2"
            >
              <HiArrowLeft />
              <span className="hidden sm:inline">Back to Shipping</span>
              <span className="sm:hidden">Back</span>
            </button>

            <button 
              className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl hover:bg-gray-800 transition-all hover:-translate-y-0.5"
            >
              <span>Confirm Order</span>
              <HiCheckCircle className="text-xl" />
            </button>
        </div>
      </div>

    </div>
  );
}