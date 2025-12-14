"use client";

import  { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { HiOutlineCreditCard, HiLockClosed } from "react-icons/hi2";

declare global {
  interface Window {
    Razorpay: unknown;
  }
}

interface BuyBtnProps {
  amount: number; 
}

export default function BuyNowButton({ amount = 0 }: BuyBtnProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  // Debug: Check console to see if amount is 0
  // console.log("BuyNowButton Received Amount:", amount);

  const isValidAmount = amount > 0;

  const handlePayment = async () => {
    if (!isValidAmount) {
      alert("Cannot process payment. Cart amount is 0.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create Order
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        body: JSON.stringify({ amount: amount }),
      });
      
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      if (!data.id) throw new Error("Order ID missing from response");

      // 2. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: data.amount,
        currency: "INR",
        name: "LUCIDRIP",
        description: "Streetwear Collection Payment",
        order_id: data.id,
        
        handler: async function (response: any) {
          try {
            // 3. Verify Payment
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
        
            const verifyData = await verifyRes.json();
        
            if (verifyData.success) {
             router.replace("/checkout/success");
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error(err);
            alert("Payment verified but error redirecting.");
          }
        },
        
        prefill: {
          name: "User Name", 
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#000000", 
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
    } catch (error) {
      console.error("Payment Start Error:", error);
      alert("Could not initiate payment. Check console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      <button
        onClick={handlePayment}
        disabled={isProcessing || !isValidAmount}
        className={`w-full py-4 px-6 text-sm font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-3 
          ${!isValidAmount 
             ? "bg-gray-300 text-gray-500 cursor-not-allowed" // Grey if 0
             : "bg-black text-white hover:bg-zinc-800 shadow-lg hover:shadow-xl" // Black if valid
          }`}
      >
        {isProcessing ? (
          "Processing..."
        ) : !isValidAmount ? (
          "Cart Empty (₹0)" 
        ) : (
          <>
            <HiOutlineCreditCard className="text-lg" />
            {/* Safe rendering to prevent "undefined" crash */}
            Pay ₹{(amount || 0).toLocaleString()}
          </>
        )}
      </button>
      
      <div className="flex items-center justify-center gap-2 mt-3 text-[10px] text-zinc-400 uppercase font-mono">
        <HiLockClosed />
        Secure Encrypted Payment
      </div>
    </>
  );
}