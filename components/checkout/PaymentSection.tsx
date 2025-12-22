"use client";

import { useCheckoutStepStore } from "@/store/checkoutStepStore";
import { useCheckoutStore } from "@/store/checkoutStore";
import { useCartStore } from "@/store/useCartStore"; 
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";

import { 
  HiOutlineBanknotes, 
  HiOutlineCreditCard, 
  HiArrowLeft, 
  HiOutlineLockClosed,
  HiOutlineShieldCheck,
  HiCheck
} from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentSection() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    paymentMethod, 
    setPaymentMethod, 
    shipping,
    createOrder, 
    createRazorpayOrder,
    verifyPayment,
    isProcessing,
    error
  } = useCheckoutStore();
  const { prevStep } = useCheckoutStepStore();
  const { items, getCartTotal, clearCart } = useCartStore();
  
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const subtotal = getCartTotal();
  const shippingCost = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + shippingCost + tax;

  const handleCODOrder = async () => {
    if (!user) {
      setPaymentError("Please login to place order");
      router.push("/login?redirect=/checkout");
      return;
    }

    setIsPaymentProcessing(true);
    setPaymentError(null);

    try {
      const order = await createOrder(items, subtotal, shippingCost, tax);
      
      if (order) {
        clearCart();
        router.replace("/checkout/success");
      } else {
        setPaymentError("Failed to create order. Please try again.");
      }
    } catch (err) {
      console.error("COD Order Error:", err);
      setPaymentError("Something went wrong. Please try again.");
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  const handleRazorpayPayment = async () => {
    if (!user) {
      setPaymentError("Please login to place order");
      router.push("/login?redirect=/checkout");
      return;
    }

    if (totalAmount <= 0) {
      setPaymentError("Invalid cart amount");
      return;
    }

    setIsPaymentProcessing(true);
    setPaymentError(null);

    try {
      const order = await createOrder(items, subtotal, shippingCost, tax);
      
      if (!order) {
        setPaymentError("Failed to create order");
        setIsPaymentProcessing(false);
        return;
      }

      const razorpayOrder = await createRazorpayOrder(totalAmount, order._id);
      
      if (!razorpayOrder) {
        setPaymentError("Failed to initiate payment");
        setIsPaymentProcessing(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "LUCIDRIP",
        description: `Order #${order.orderNumber}`,
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          try {
            const verified = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id,
            });

            if (verified) {
              clearCart();
              router.replace("/checkout/success");
            } else {
              setPaymentError("Payment verification failed");
            }
          } catch (err) {
            console.error("Payment Handler Error:", err);
            setPaymentError("Payment verification failed");
          }
          setIsPaymentProcessing(false);
        },
        prefill: {
          name: shipping.name || user?.username,
          email: shipping.email || user?.email,
          contact: shipping.phone,
        },
        theme: {
          color: "#000000",
        },
        modal: {
          ondismiss: function () {
            setIsPaymentProcessing(false);
            setPaymentError("Payment was cancelled");
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Razorpay Error:", err);
      setPaymentError("Failed to process payment");
      setIsPaymentProcessing(false);
    }
  };

  const isButtonDisabled = isPaymentProcessing || isProcessing || !paymentMethod || items.length === 0;

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border border-neutral-100"
      >
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-neutral-100">
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-2">Step 3</p>
          <h2 className="text-2xl font-extralight tracking-tight">
            Payment <span className="italic">Method</span>
          </h2>
        </div>

        <div className="p-6 md:p-8">
          {/* Error Message */}
          {(paymentError || error) && (
            <div className="mb-6 p-4 border border-red-200 bg-red-50">
              <p className="text-red-600 text-sm">{paymentError || error}</p>
            </div>
          )}

          {/* Payment Options */}
          <div className="space-y-3 mb-8">
            
            {/* COD Option */}
            <button
              type="button"
              onClick={() => setPaymentMethod("COD")}
              className={`w-full flex items-center gap-5 p-6 border transition-all text-left ${
                paymentMethod === "COD"
                  ? "border-black bg-neutral-50"
                  : "border-neutral-200 hover:border-neutral-400"
              }`}
            >
              <div className={`w-12 h-12 flex items-center justify-center transition-colors ${
                paymentMethod === "COD" ? "bg-black text-white" : "bg-neutral-100 text-neutral-400"
              }`}>
                <HiOutlineBanknotes className="text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-neutral-900">Cash on Delivery</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Pay when your order arrives</p>
              </div>
              <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${
                paymentMethod === "COD" ? "border-black bg-black" : "border-neutral-300"
              }`}>
                {paymentMethod === "COD" && <HiCheck className="text-white text-xs" />}
              </div>
            </button>

            {/* Razorpay Option */}
            <button
              type="button"
              onClick={() => setPaymentMethod("Razorpay")}
              className={`w-full flex items-center gap-5 p-6 border transition-all text-left ${
                paymentMethod === "Razorpay"
                  ? "border-black bg-neutral-50"
                  : "border-neutral-200 hover:border-neutral-400"
              }`}
            >
              <div className={`w-12 h-12 flex items-center justify-center transition-colors ${
                paymentMethod === "Razorpay" ? "bg-black text-white" : "bg-neutral-100 text-neutral-400"
              }`}>
                <HiOutlineCreditCard className="text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-neutral-900">Online Payment</h3>
                <p className="text-xs text-neutral-500 mt-0.5">UPI, Cards, Wallets via Razorpay</p>
              </div>
              <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${
                paymentMethod === "Razorpay" ? "border-black bg-black" : "border-neutral-300"
              }`}>
                {paymentMethod === "Razorpay" && <HiCheck className="text-white text-xs" />}
              </div>
            </button>
          </div>

          {/* Order Summary */}
          <div className="p-6 bg-neutral-50 border border-neutral-100 mb-8">
            <h4 className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-4">Order Total</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal ({items.length} items)</span>
                <span className="text-neutral-900">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Shipping</span>
                <span className={shippingCost === 0 ? "text-emerald-600" : "text-neutral-900"}>
                  {shippingCost === 0 ? "Complimentary" : `₹${shippingCost}`}
                </span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Tax (5%)</span>
                <span className="text-neutral-900">₹{tax.toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                <span className="text-sm tracking-wide text-neutral-900">Total</span>
                <span className="text-xl font-extralight text-neutral-900">₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 mb-6">
            <HiOutlineLockClosed />
            <span>Payments are secure and encrypted</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 border-t border-neutral-100 flex items-center justify-between">
          <button
            onClick={prevStep}
            className="flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition-colors"
          >
            <HiArrowLeft className="text-sm" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <button 
            onClick={paymentMethod === "Razorpay" ? handleRazorpayPayment : handleCODOrder}
            disabled={isButtonDisabled}
            className={`flex items-center justify-center gap-2 px-8 py-4 text-xs tracking-[0.2em] uppercase transition-all min-w-[200px] ${
              isButtonDisabled 
                ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-neutral-800"
            }`}
          >
            {isPaymentProcessing || isProcessing ? (
              <>
                <div className="w-4 h-4 border border-current border-t-transparent animate-spin" />
                Processing...
              </>
            ) : (
              paymentMethod === "Razorpay" ? `Pay ₹${totalAmount.toLocaleString()}` : "Place Order"
            )}
          </button>
        </div>

        {/* Trust Badges */}
        <div className="p-6 md:p-8 border-t border-neutral-100 bg-neutral-50">
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-neutral-400">
              <HiOutlineShieldCheck className="text-lg" />
              <span className="text-xs tracking-wide">Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <HiOutlineLockClosed className="text-lg" />
              <span className="text-xs tracking-wide">SSL Encrypted</span>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
