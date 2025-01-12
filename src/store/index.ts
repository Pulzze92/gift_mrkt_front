import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { User, Gift, Order } from '../api/Router';

export interface Gift {
  id: string;
  owner_id: string;
  collection_name: string;
  collection_id: string;
  status: 'active' | 'withdrew';
  number: number;
  attributes: Record<string, string>;
  grade: string;
  message_id: number;
  created_at: string;
  updated_at: string;
}

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
  devtools((set) => ({
    ...initialState,
    setUser: (user) => {
      console.log('Setting user:', user);
      set(() => ({ user }));
    },
    setGifts: (gifts) => {
      console.log('Setting gifts:', gifts);
      set(() => ({ gifts }));
    },
    setOrders: (orders) => set(() => ({ orders })),
    setLoading: (isLoading) => {
      console.log('Setting loading:', isLoading);
      set(() => ({ isLoading }));
    },
    setError: (error) => {
      console.log('Setting error:', error);
      set(() => ({ error }));
    },
    reset: () => set(initialState),
  }))
);

export const useUser = () => useAppStore((state) => state.user);
export const useGifts = () => useAppStore((state) => state.gifts);
export const useOrders = () => useAppStore((state) => state.orders);
export const useLoading = () => useAppStore((state) => state.isLoading);
export const useError = () => useAppStore((state) => state.error);
