// store/useCheckoutStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware"; // 👈 Added persist to save data on refresh

interface ShippingInfo {
  // Contact Info
  name: string;
  email: string;
  phone: string;
  
  // Address Info
  address: string;
  city: string;
  state: string;
  pincode: string;
  addressType: "home" | "work";
}

interface CheckoutState {
  shipping: ShippingInfo;
  paymentMethod: string;

  setShipping: (data: Partial<ShippingInfo>) => void;
  setPaymentMethod: (method: string) => void;
  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      shipping: {
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        addressType: "home",
      },

      paymentMethod: "",

      setShipping: (data) =>
        set((state) => ({
          shipping: { ...state.shipping, ...data },
        })),

      setPaymentMethod: (method) =>
        set(() => ({ paymentMethod: method })),

      resetCheckout: () =>
        set({
          shipping: {
            name: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
            addressType: "home",
          },
          paymentMethod: "",
        }),
    }),
    {
      name: "checkout-storage", // Key for localStorage
    }
  )
);