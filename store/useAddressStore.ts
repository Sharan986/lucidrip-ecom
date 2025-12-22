import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

export interface Address {
  _id: string;
  label: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

interface AddressState {
  addresses: Address[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAddresses: () => Promise<void>;
  addAddress: (address: Omit<Address, "_id">) => Promise<boolean>;
  updateAddress: (addressId: string, address: Partial<Address>) => Promise<boolean>;
  deleteAddress: (addressId: string) => Promise<boolean>;
  setDefaultAddress: (addressId: string) => Promise<boolean>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const useAddressStore = create<AddressState>()((set) => ({
  addresses: [],
  isLoading: false,
  error: null,

  fetchAddresses: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/users/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        set({ addresses: data.addresses, isLoading: false });
      } else {
        set({ error: data.message, isLoading: false });
      }
    } catch {
      set({ error: "Failed to fetch addresses", isLoading: false });
    }
  },

  addAddress: async (address) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/users/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(address),
      });

      const data = await response.json();

      if (response.ok) {
        set((state) => ({
          addresses: address.isDefault
            ? [...state.addresses.map((a) => ({ ...a, isDefault: false })), data.address]
            : [...state.addresses, data.address],
          isLoading: false,
        }));
        return true;
      } else {
        set({ error: data.message, isLoading: false });
        return false;
      }
    } catch {
      set({ error: "Failed to add address", isLoading: false });
      return false;
    }
  },

  updateAddress: async (addressId, address) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/users/addresses/${addressId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(address),
      });

      const data = await response.json();

      if (response.ok) {
        set((state) => ({
          addresses: state.addresses.map((a) => {
            if (a._id === addressId) return { ...a, ...address };
            if (address.isDefault) return { ...a, isDefault: false };
            return a;
          }),
          isLoading: false,
        }));
        return true;
      } else {
        set({ error: data.message, isLoading: false });
        return false;
      }
    } catch {
      set({ error: "Failed to update address", isLoading: false });
      return false;
    }
  },

  deleteAddress: async (addressId) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/users/addresses/${addressId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        set((state) => ({
          addresses: state.addresses.filter((a) => a._id !== addressId),
          isLoading: false,
        }));
        return true;
      } else {
        const data = await response.json();
        set({ error: data.message, isLoading: false });
        return false;
      }
    } catch {
      set({ error: "Failed to delete address", isLoading: false });
      return false;
    }
  },

  setDefaultAddress: async (addressId) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/users/addresses/${addressId}/default`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        set((state) => ({
          addresses: state.addresses.map((a) => ({
            ...a,
            isDefault: a._id === addressId,
          })),
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
}));
