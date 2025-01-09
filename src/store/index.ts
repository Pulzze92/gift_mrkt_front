import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { User, Gift, Order } from '../api/Router';

interface AppState {
  user: User | null;
  gifts: Gift[];
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  
  setUser: (user: User | null) => void;
  setGifts: (gifts: Gift[]) => void;
  setOrders: (orders: Order[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  reset: () => void;
}

const initialState = {
  user: null,
  gifts: [],
  orders: [],
  isLoading: false,
  error: null,
};

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      ...initialState,

      setUser: (user) => set({ user }),
      setGifts: (gifts) => set({ gifts }),
      setOrders: (orders) => set({ orders }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      reset: () => set(initialState),
    }),
    {
      name: 'app-store',
    }
  )
);

export const useUser = () => useAppStore((state) => state.user);
export const useGifts = () => useAppStore((state) => state.gifts);
export const useOrders = () => useAppStore((state) => state.orders);
export const useLoading = () => useAppStore((state) => state.isLoading);
export const useError = () => useAppStore((state) => state.error); 