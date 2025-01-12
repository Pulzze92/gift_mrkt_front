import { useAppStore } from '../store';

export const useLoading = () => useAppStore((state) => state.isLoading); 