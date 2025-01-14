import { create } from 'zustand';
import Router from '../api/Router';
import { Gift, Order } from '../api/Router';

interface AppState {
  gifts: Gift[];
  orders: Order[];
  filteredGifts: Gift[];
  filteredOrders: Order[];
  isLoading: boolean;
  error: string | null;
  
  // Добавляем новые actions
  fetchGifts: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  setGifts: (gifts: Gift[]) => void;
  setOrders: (orders: Order[]) => void;
  setFilteredGifts: (gifts: Gift[]) => void;
  setFilteredOrders: (orders: Order[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  gifts: [],
  orders: [],
  filteredGifts: [],
  filteredOrders: [],
  isLoading: false,
  error: null,

  // Реализуем функции
  fetchGifts: async () => {
    try {
      set({ isLoading: true, error: null });
      const gifts = await Router.getGifts();
      set({ gifts, filteredGifts: gifts });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch gifts';
      set({ error: errorMessage });
      console.error('Error fetching gifts:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchOrders: async () => {
    try {
      set({ isLoading: true, error: null });
      const orders = await Router.getUserOrders();
      set({ orders, filteredOrders: orders });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch orders';
      set({ error: errorMessage });
      console.error('Error fetching orders:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  setGifts: (gifts) => set({ gifts }),
  setOrders: (orders) => set({ orders }),
  setFilteredGifts: (filteredGifts) => set({ filteredGifts }),
  setFilteredOrders: (filteredOrders) => set({ filteredOrders }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

// Селекторы
export const useGifts = () => useAppStore((state) => state.gifts);
export const useOrders = () => useAppStore((state) => state.orders);
export const useFilteredGifts = () => useAppStore((state) => state.filteredGifts);
export const useFilteredOrders = () => useAppStore((state) => state.filteredOrders);
export const useLoading = () => useAppStore((state) => state.isLoading);
export const useError = () => useAppStore((state) => state.error);
