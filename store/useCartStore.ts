import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 1. Updated Interface: Added 'uniqueId'
export interface CartItem {
  uniqueId: string; // The specific combo of ID + Size + Color
  productId: number; 
  name: string;
  price: number;
  quantity: number;
  img: string;
  size: string;
  color: string;
  slug?: string; // Optional: good for linking back to product page
  stock?: number; // Optional: for max quantity limits
}

interface CartState {
  items: CartItem[];
  
  // 2. Simplified Actions (Now they only need uniqueId)
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
        const currentItems = get().items;
        
        // Generate a unique ID for this specific variation
        const uniqueId = `${newItem.productId}-${newItem.size}-${newItem.color}`;

        const existingItemIndex = currentItems.findIndex(
          (item) => item.uniqueId === uniqueId
        );

        let updatedItems = [...currentItems];

        if (existingItemIndex > -1) {
          // If exists, just add quantity
          updatedItems[existingItemIndex].quantity += newItem.quantity;
        } else {
          // If new, add the full object WITH the uniqueId
          updatedItems.push({ ...newItem, uniqueId });
        }

        set({ items: updatedItems });
      },

      // ✅ Fixed: Only needs uniqueId now
      removeItem: (uniqueId) => {
        const updatedItems = get().items.filter(
          (item) => item.uniqueId !== uniqueId
        );
        set({ items: updatedItems });
      },

      // ✅ Fixed: Only needs uniqueId now
      updateQuantity: (uniqueId, action) => {
        const currentItems = get().items;
        
        const updatedItems = currentItems.map((item) => {
          if (item.uniqueId === uniqueId) {
            const newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
            // Ensure quantity doesn't drop below 1
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