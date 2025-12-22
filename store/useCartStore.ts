import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  uniqueId: string;
  productId: string; // String to match MongoDB
  name: string;
  price: number;
  quantity: number;
  img: string;
  size: string;
  color: string;
  slug?: string;
  stock?: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'uniqueId'>) => void;
  removeItem: (uniqueId: string) => void;
  updateQuantity: (uniqueId: string, action: 'increase' | 'decrease') => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const currentItems = get().items || [];
        const uniqueId = `${newItem.productId}-${newItem.size}-${newItem.color}`;

        const existingItemIndex = currentItems.findIndex(
          (item) => item.uniqueId === uniqueId
        );

        let updatedItems = [...currentItems];

        if (existingItemIndex > -1) {
          updatedItems[existingItemIndex].quantity += newItem.quantity;
        } else {
          updatedItems.push({ ...newItem, uniqueId });
        }

        set({ items: updatedItems });
      },

      removeItem: (uniqueId) => {
        set({ items: get().items.filter((item) => item.uniqueId !== uniqueId) });
      },

      updateQuantity: (uniqueId, action) => {
        const updatedItems = get().items.map((item) => {
          if (item.uniqueId === uniqueId) {
            const newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
            return { ...item, quantity: Math.max(1, newQuantity) };
          }
          return item;
        });
        set({ items: updatedItems });
      },

      clearCart: () => set({ items: [] }),

      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'lucidrip-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);