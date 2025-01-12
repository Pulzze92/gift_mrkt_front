import { useEffect } from 'react';
import { useAppStore } from '../store';
import Router from '../api/Router';

export const useLoadOrders = () => {
  const { setOrders, setLoading, setError } = useAppStore();

  useEffect(() => {
    let mounted = true;

    const loadOrders = async () => {
      if (!mounted) return;

      try {
        setLoading(true);
        console.log('Loading orders...');
        const ordersData = await Router.getOrders();
        console.log('Orders data:', ordersData);

        if (!mounted) return;
        
        if (Array.isArray(ordersData)) {
          setOrders(ordersData);
        } else {
          setOrders([]);
          console.warn('Received non-array orders data:', ordersData);
        }
      } catch (error) {
        if (!mounted) return;
        console.error('Failed to load orders:', error);
        setError(error instanceof Error ? error.message : 'Failed to load orders');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      mounted = false;
    };
  }, [setOrders, setLoading, setError]);
}; 