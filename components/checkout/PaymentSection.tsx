"use client";

import { useCheckoutStepStore } from "@/store/checkoutStepStore";
import { useCheckoutStore } from "@/store/checkoutStore";
import { useCartStore } from "@/store/useCartStore"; 
import BuyNowButton from "@/components/checkout/BuyNowButton"; 

import { 
  HiOutlineBanknotes, 
  HiOutlineCreditCard, 
  HiArrowLeft, 
  HiLockClosed 
} from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { useEffect } from "react"; // Import useEffect

export default function PaymentSection() {
  const router = useRouter();
  const { paymentMethod, setPaymentMethod } = useCheckoutStore();
  const { prevStep } = useCheckoutStepStore();
  
  // 1. Get Total Price
  const { totalPrice } = useCartStore(); 

  // 2. DEBUGGING: Check the console to see what the price actually is
  useEffect(() => {
    console.log("CURRENT PAYMENT METHOD:", paymentMethod);
    console.log("CART TOTAL PRICE:", totalPrice);
  }, [paymentMethod, totalPrice]);

  const handleCODOrder = async () => {
    alert("COD Order Placed! Redirecting...");
   router.replace("/checkout/success");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-10">
      
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
          className={`relative flex items-center gap-5 p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 group ${
            paymentMethod === "COD"
              ? "border-black bg-gray-50"
              : "border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className={`p-3 rounded-full ${paymentMethod === "COD" ? "bg-black text-white" : "bg-gray-100 text-gray-500"}`}>
             <HiOutlineBanknotes className="text-xl" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">Cash on Delivery</h3>
            <p className="text-sm text-gray-500">Pay locally when the order arrives.</p>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
             paymentMethod === "COD" ? "border-black" : "border-gray-300"
          }`}>
             {paymentMethod === "COD" && <div className="w-3 h-3 rounded-full bg-black" />}
          </div>
        </div>

        {/* OPTION 2: RAZORPAY */}
        <div
          onClick={() => setPaymentMethod("Razorpay")}
          className={`relative flex items-center gap-5 p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 group ${
            paymentMethod === "Razorpay"
              ? "border-black bg-gray-50"
              : "border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className={`p-3 rounded-full ${paymentMethod === "Razorpay" ? "bg-black text-white" : "bg-gray-100 text-gray-500"}`}>
             <HiOutlineCreditCard className="text-xl" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">Online Payment</h3>
            <p className="text-sm text-gray-500">UPI, Cards, Wallets (Razorpay)</p>
          </div>
           <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
             paymentMethod === "Razorpay" ? "border-black" : "border-gray-300"
          }`}>
             {paymentMethod === "Razorpay" && <div className="w-3 h-3 rounded-full bg-black" />}
          </div>
        </div>

      </div>

      {/* --- Footer / Actions --- */}
      <div className="pt-6 border-t border-gray-100">
        
        <div className="flex items-center justify-center gap-2 mb-6 text-xs text-gray-400">
           <HiLockClosed />
           <span>Payments are secure and encrypted</span>
        </div>

        <div className="flex items-center justify-between gap-4">
            <button
              onClick={prevStep}
              className="flex items-center gap-2 text-gray-500 hover:text-black font-medium transition-colors px-2 py-2"
            >
              <HiArrowLeft />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="w-full max-w-xs">
              {paymentMethod === "Razorpay" ? (
                // Pass totalPrice to the button
                <BuyNowButton amount={totalPrice} />
              ) : (
                <button 
                  onClick={handleCODOrder}
                  className="w-full flex items-center justify-center gap-2 bg-black text-white py-4 px-6 rounded-none text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors shadow-lg"
                >
                  Confirm Order
                </button>
              )}
            </div>

        </div>
      </div>

    </div>
  );
}