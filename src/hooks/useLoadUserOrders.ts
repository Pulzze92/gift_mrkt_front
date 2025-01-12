import { useEffect } from 'react';
import { useAppStore } from '../store';
import Router from '../api/Router';

export const useLoadUserOrders = () => {
  const { setOrders, setLoading, setError } = useAppStore();

  useEffect(() => {
    let mounted = true;

    const loadUserOrders = async () => {
      if (!mounted) return;

      try {
        setLoading(true);
        console.log('Loading user orders...');
        const ordersData = await Router.getUserOrders();
        console.log('User orders data:', ordersData);

        if (!mounted) return;
        
        if (Array.isArray(ordersData)) {
          setOrders(ordersData);
        } else {
          setOrders([]);
          console.warn('Received non-array user orders data:', ordersData);
        }
      } catch (error) {
        if (!mounted) return;
        console.error('Failed to load user orders:', error);
        setError(error instanceof Error ? error.message : 'Failed to load user orders');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadUserOrders();

    return () => {
      mounted = false;
    };
  }, [setOrders, setLoading, setError]);
}; 