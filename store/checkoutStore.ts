// store/checkoutStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";
import { CartItem } from "./useCartStore";

export interface ShippingInfo {
  // Contact Info
  name: string;
  email: string;
  phone: string;
  
  // Address Info
  street: string;
  city: string;
  state: string;
  zip: string;
  addressType: "home" | "work";
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image: string;
}

export interface CreatedOrder {
  _id: string;
  orderNumber: string;
  shippingAddress: ShippingInfo;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

interface CheckoutState {
  shipping: ShippingInfo;
  paymentMethod: "COD" | "Razorpay" | "";
  currentOrder: CreatedOrder | null;
  isProcessing: boolean;
  error: string | null;

  // Actions
  setShipping: (data: Partial<ShippingInfo>) => void;
  setPaymentMethod: (method: "COD" | "Razorpay") => void;
  
  // Order Operations
  createOrder: (items: CartItem[], subtotal: number, shippingCost: number, tax: number) => Promise<CreatedOrder | null>;
  createRazorpayOrder: (amount: number, orderId?: string) => Promise<{ id: string; amount: number } | null>;
  verifyPayment: (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    orderId: string;
  }) => Promise<boolean>;
  
  // Reset
  resetCheckout: () => void;
  setCurrentOrder: (order: CreatedOrder | null) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const initialShipping: ShippingInfo = {
  name: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  addressType: "home",
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      shipping: initialShipping,
      paymentMethod: "",
      currentOrder: null,
      isProcessing: false,
      error: null,

      setShipping: (data) =>
        set((state) => ({
          shipping: { ...state.shipping, ...data },
        })),

      setPaymentMethod: (method) => set({ paymentMethod: method }),

      createOrder: async (items, subtotal, shippingCost, tax) => {
        const token = useAuthStore.getState().token;
        if (!token) {
          set({ error: "Please login to place order" });
          return null;
        }

        const shipping = get().shipping;
        const paymentMethod = get().paymentMethod;

        if (!shipping.name || !shipping.street || !shipping.city) {
          set({ error: "Please complete shipping information" });
          return null;
        }

        set({ isProcessing: true, error: null });

        try {
          const orderData = {
            shippingAddress: shipping,
            items: items.map((item) => ({
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              size: item.size,
              color: item.color,
              image: item.img,
            })),
            subtotal,
            shippingCost,
            tax,
            totalAmount: subtotal + shippingCost + tax,
            paymentMethod: paymentMethod || "Razorpay",
          };

          console.log("Creating order with data:", JSON.stringify(orderData, null, 2));
          console.log("API URL:", `${API_URL}/orders`);
          console.log("Token present:", !!token);

          const response = await fetch(`${API_URL}/orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(orderData),
          });

          console.log("Response status:", response.status);
          const data = await response.json();
          console.log("Response data:", data);

          if (response.ok && data.success) {
            set({ currentOrder: data.order, isProcessing: false });
            return data.order;
          } else {
            set({ error: data.message || "Failed to create order", isProcessing: false });
            return null;
          }
        } catch (error) {
          console.error("Create Order Error:", error);
          set({ error: "Failed to create order", isProcessing: false });
          return null;
        }
      },

      createRazorpayOrder: async (amount, orderId) => {
        const token = useAuthStore.getState().token;
        if (!token) {
          set({ error: "Please login to continue" });
          return null;
        }

        try {
          const response = await fetch(`${API_URL}/payment/create-order`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ amount, orderId }),
          });

          const data = await response.json();

          if (response.ok && data.success) {
            return { id: data.id, amount: data.amount };
          } else {
            set({ error: data.message || "Failed to create payment order" });
            return null;
          }
        } catch (error) {
          console.error("Razorpay Order Error:", error);
          set({ error: "Failed to initiate payment" });
          return null;
        }
      },

      verifyPayment: async (paymentData) => {
        const token = useAuthStore.getState().token;
        if (!token) return false;

        try {
          const response = await fetch(`${API_URL}/payment/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(paymentData),
          });

          const data = await response.json();

          if (response.ok && data.success) {
            // Update current order payment status
            const currentOrder = get().currentOrder;
            if (currentOrder) {
              set({
                currentOrder: {
                  ...currentOrder,
                  paymentStatus: "Paid",
                },
              });
            }
            return true;
          }
          return false;
        } catch (error) {
          console.error("Verify Payment Error:", error);
          return false;
        }
      },

      resetCheckout: () =>
        set({
          shipping: initialShipping,
          paymentMethod: "",
          currentOrder: null,
          isProcessing: false,
          error: null,
        }),

      setCurrentOrder: (order) => set({ currentOrder: order }),
    }),
    {
      name: "checkout-storage",
      partialize: (state) => ({
        shipping: state.shipping,
        paymentMethod: state.paymentMethod,
        currentOrder: state.currentOrder,
      }),
    }
  )
);