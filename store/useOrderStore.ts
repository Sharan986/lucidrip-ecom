import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image: string;
}

export interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  addressType?: "home" | "work";
}

export interface Order {
  _id: string;
  orderNumber: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
  status: "Processing" | "Shipped" | "Out for Delivery" | "Delivered" | "Cancelled" | "Returned";
  trackingId?: string;
  paymentMethod: string;
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchOrders: () => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<void>;
  createOrder: (orderData: {
    shippingAddress: ShippingAddress;
    items: OrderItem[];
    subtotal: number;
    shippingCost: number;
    tax: number;
    totalAmount: number;
    paymentMethod?: string;
  }) => Promise<Order | null>;
  cancelOrder: (orderId: string) => Promise<boolean>;
  updatePaymentStatus: (orderId: string, status: string) => Promise<boolean>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const useOrderStore = create<OrderState>()((set) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        set({ orders: data.orders, isLoading: false });
      } else {
        set({ error: data.message, isLoading: false });
      }
    } catch {
      set({ error: "Failed to fetch orders", isLoading: false });
    }
  },

  fetchOrderById: async (orderId) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isLoading: true, error: null, currentOrder: null });

    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        set({ currentOrder: data, isLoading: false });
      } else {
        set({ error: data.message, isLoading: false });
      }
    } catch {
      set({ error: "Failed to fetch order", isLoading: false });
    }
  },

  createOrder: async (orderData) => {
    const token = useAuthStore.getState().token;
    if (!token) return null;

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        set((state) => ({
          orders: [data.order, ...state.orders],
          currentOrder: data.order,
          isLoading: false,
        }));
        return data.order;
      } else {
        set({ error: data.message, isLoading: false });
        return null;
      }
    } catch {
      set({ error: "Failed to create order", isLoading: false });
      return null;
    }
  },

  cancelOrder: async (orderId) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        set((state) => ({
          orders: state.orders.map((o) =>
            o._id === orderId ? { ...o, status: "Cancelled" as const } : o
          ),
          isLoading: false,
        }));
        return true;
      } else {
        const data = await response.json();
        set({ error: data.message, isLoading: false });
        return false;
      }
    } catch {
      set({ error: "Failed to cancel order", isLoading: false });
      return false;
    }
  },

  updatePaymentStatus: async (orderId, status) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/payment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentStatus: status }),
      });

      if (response.ok) {
        set((state) => ({
          orders: state.orders.map((o) =>
            o._id === orderId ? { ...o, paymentStatus: status as Order["paymentStatus"] } : o
          ),
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
}));
