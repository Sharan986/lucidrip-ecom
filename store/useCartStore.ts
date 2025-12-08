// store/useCartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // Saves cart to localStorage automatically

// 1. Define the Cart Item Type
export interface CartItem {
  uniqueId: string; // Helper ID (productId + size + color) to distinguish variants
  productId: number;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  img: string;
}

// 2. Define the Store Actions
interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'uniqueId'>) => void;
  removeItem: (uniqueId: string) => void;
  updateQuantity: (uniqueId: string, action: 'increase' | 'decrease') => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

// 3. Create the Store
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          // Create a unique ID so "Small Black" is different from "Large Blue"
          const uniqueId = `${newItem.productId}-${newItem.size}-${newItem.color}`;
          
          const existingItem = state.items.find((item) => item.uniqueId === uniqueId);

          if (existingItem) {
            // If item exists, just increase quantity
            return {
              items: state.items.map((item) =>
                item.uniqueId === uniqueId
                  ? { ...item, quantity: item.quantity + newItem.quantity }
                  : item
              ),
            };
          } else {
            // If new, add to array
            return { items: [...state.items, { ...newItem, uniqueId }] };
          }
        });
      },

      removeItem: (uniqueId) => {
        set((state) => ({
          items: state.items.filter((item) => item.uniqueId !== uniqueId),
        }));
      },

      updateQuantity: (uniqueId, action) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.uniqueId === uniqueId) {
              const newQuantity =
                action === 'increase' ? item.quantity + 1 : item.quantity - 1;
              // Prevent quantity from going below 1
              return { ...item, quantity: Math.max(1, newQuantity) };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ items: [] }),

      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'shopping-cart-storage', // Key name in localStorage
    }
  )
);