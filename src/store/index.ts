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
  userOrders: Order[];
  filteredOrders: Order[];
  filteredUserOrders: Order[];
  filteredGifts: Gift[];
  isLoading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setGifts: (gifts: Gift[]) => void;
  setOrders: (orders: Order[]) => void;
  setUserOrders: (orders: Order[]) => void;
  setFilteredOrders: (orders: Order[]) => void;
  setFilteredUserOrders: (orders: Order[]) => void;
  setFilteredGifts: (gifts: Gift[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  user: null,
  gifts: [],
  orders: [],
  userOrders: [],
  filteredOrders: [],
  filteredUserOrders: [],
  filteredGifts: [],
  isLoading: false,
  error: null,
};

export const useAppStore = create<AppState>()(
  devtools((set) => ({
    ...initialState,
    setUser: (user) => set(() => ({ user })),
    setGifts: (gifts) => set(() => ({ gifts, filteredGifts: gifts })),
    setOrders: (orders) => set(() => ({ orders, filteredOrders: orders })),
    setUserOrders: (userOrders) => set(() => ({ userOrders, filteredUserOrders: userOrders })),
    setFilteredOrders: (filteredOrders) => set(() => ({ filteredOrders })),
    setFilteredUserOrders: (filteredUserOrders) => set(() => ({ filteredUserOrders })),
    setFilteredGifts: (filteredGifts) => set(() => ({ filteredGifts })),
    setLoading: (isLoading) => set(() => ({ isLoading })),
    setError: (error) => set(() => ({ error })),
    reset: () => set(initialState),
  }))
);

export const useUser = () => useAppStore((state) => state.user);
export const useGifts = () => useAppStore((state) => state.gifts);
export const useOrders = () => useAppStore((state) => state.orders);
export const useUserOrders = () => useAppStore((state) => state.userOrders);
export const useFilteredOrders = () => useAppStore((state) => state.filteredOrders);
export const useFilteredUserOrders = () => useAppStore((state) => state.filteredUserOrders);
export const useFilteredGifts = () => useAppStore((state) => state.filteredGifts);
export const useLoading = () => useAppStore((state) => state.isLoading);
export const useError = () => useAppStore((state) => state.error);
