import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CustomizationOptions {
  isGift: boolean;
  giftMessage?: string;
  engravingText?: string;
  engravingFont?: string;
  hoopFinish?: string;
}

export interface CartItem {
  id: string; // Unique cart item ID (product ID + customization hash or uuid)
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  customization?: CustomizationOptions;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateCustomization: (id: string, customization: CustomizationOptions) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      
      setCartOpen: (open) => set({ isCartOpen: open }),

      addItem: (item) => set((state) => {
        const existingItemIndex = state.items.findIndex(i => i.id === item.id);
        if (existingItemIndex >= 0) {
          const updatedItems = [...state.items];
          updatedItems[existingItemIndex].quantity += item.quantity;
          return { items: updatedItems, isCartOpen: true };
        }
        return { items: [...state.items, item], isCartOpen: true };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id)
      })),

      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((item) => 
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      })),

      updateCustomization: (id, customization) => set((state) => ({
        items: state.items.map((item) => 
          item.id === id ? { ...item, customization } : item
        )
      })),

      clearCart: () => set({ items: [] }),

      getCartTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'twothreads-cart-storage',
      storage: createJSONStorage(() => localStorage),
      // We don't want to persist the open state of the cart
      partialize: (state) => ({ items: state.items }),
    }
  )
);
