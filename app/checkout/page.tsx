"use client";

import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import CartReview from "@/components/checkout/CartReview";
import ShippingForm from "@/components/checkout/ShippingForm";
import PaymentSection from "@/components/checkout/PaymentSection";
import { useCheckoutStepStore } from "@/store/checkoutStepStore";

export default function CheckoutPage() {
  const { step } = useCheckoutStepStore();

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <CheckoutSteps />

      {step === 1 && <CartReview />}
      {step === 2 && <ShippingForm />}
      {step === 3 && <PaymentSection />}
    </div>
  );
}
