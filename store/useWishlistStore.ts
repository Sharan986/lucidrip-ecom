import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

export interface WishlistItem {
  _id: string;
  productId: string;
  name: string;
  price: number;
  img: string;
  slug: string;
  size?: string;
  color?: string;
  addedAt: string;
  inStock?: boolean;
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchWishlist: () => Promise<void>;
  addToWishlist: (item: Omit<WishlistItem, "_id" | "addedAt">) => Promise<boolean>;
  removeFromWishlist: (itemId: string) => Promise<boolean>;
  clearWishlist: () => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const useWishlistStore = create<WishlistState>()((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchWishlist: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/users/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        set({ items: data.wishlist, isLoading: false });
      } else {
        set({ error: data.message, isLoading: false });
      }
    } catch {
      set({ error: "Failed to fetch wishlist", isLoading: false });
    }
  },

  addToWishlist: async (item) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/users/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(item),
      });

      const data = await response.json();

      if (response.ok) {
        set((state) => ({
          items: [...state.items, data.item],
          isLoading: false,
        }));
        return true;
      } else {
        set({ error: data.message, isLoading: false });
        return false;
      }
    } catch {
      set({ error: "Failed to add to wishlist", isLoading: false });
      return false;
    }
  },

  removeFromWishlist: async (itemId) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/users/wishlist/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        set((state) => ({
          items: state.items.filter((i) => i._id !== itemId && i.productId !== itemId),
          isLoading: false,
        }));
        return true;
      } else {
        const data = await response.json();
        set({ error: data.message, isLoading: false });
        return false;
      }
    } catch {
      set({ error: "Failed to remove from wishlist", isLoading: false });
      return false;
    }
  },

  clearWishlist: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return false;

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/users/wishlist`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        set({ items: [], isLoading: false });
        return true;
      } else {
        const data = await response.json();
        set({ error: data.message, isLoading: false });
        return false;
      }
    } catch {
      set({ error: "Failed to clear wishlist", isLoading: false });
      return false;
    }
  },

  isInWishlist: (productId) => {
    return get().items.some((item) => item.productId === productId);
  },
}));
