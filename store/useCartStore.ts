import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartItem {
  productId: number; 
  name: string;
  price: number;
  quantity: number;
  img: string;
  size: string;
  color: string;
}

interface CartState {
  items: CartItem[];
  totalPrice: number;
  
  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (productId: number, size: string, color: string) => void;
  updateQuantity: (productId: number, size: string, color: string, action: 'increase' | 'decrease') => void;
  clearCart: () => void;
  

  getCartTotal: () => number; 
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalPrice: 0,

      addItem: (newItem) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(
          (item) => item.productId === newItem.productId && item.size === newItem.size && item.color === newItem.color
        );

        let updatedItems = [...currentItems];

        if (existingItemIndex > -1) {
          updatedItems[existingItemIndex].quantity += newItem.quantity;
        } else {
          updatedItems.push(newItem);
        }

        // Auto-calculate total
        const newTotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        set({ items: updatedItems, totalPrice: newTotal });
      },

      removeItem: (id, size, color) => {
        const updatedItems = get().items.filter(
          (item) => !(item.productId === id && item.size === size && item.color === color)
        );
        
        const newTotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        set({ items: updatedItems, totalPrice: newTotal });
      },

      updateQuantity: (id, size, color, action) => {
        const currentItems = get().items;
        
        const updatedItems = currentItems.map((item) => {
          if (item.productId === id && item.size === size && item.color === color) {
            const newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
            return { ...item, quantity: Math.max(1, newQuantity) }; // Prevent 0 quantity
          }
          return item;
        });

        const newTotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        set({ items: updatedItems, totalPrice: newTotal });
      },

      clearCart: () => set({ items: [], totalPrice: 0 }),

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