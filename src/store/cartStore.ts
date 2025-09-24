import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  deliveryPartnerId: string;
  deliveryPartnerName: string;
  deliveryFee: number;  
  farmerName: string;
  farmerPhone: string;
  total: number; // product price * quantity + delivery fee
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id' | 'total'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const id = Date.now().toString();
        const total = (item.price * item.quantity) + item.deliveryFee;
        const newItem: CartItem = { ...item, id, total };
        
        set((state) => ({
          items: [...state.items, newItem]
        }));
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        }));  
      },
      
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map(item => 
            item.id === id 
              ? { ...item, quantity, total: (item.price * quantity) + item.deliveryFee }
              : item
          )
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalAmount: () => {
        return get().items.reduce((total, item) => total + item.total, 0);
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'agro-mart-cart'
    }
  )
);