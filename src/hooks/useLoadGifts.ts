import { useEffect } from 'react';
import { useAppStore } from '../store';
import Router from '../api/Router';

export const useLoadGifts = () => {
  const { setGifts, setLoading, setError } = useAppStore();

  useEffect(() => {
    let mounted = true;

    const loadGifts = async () => {
      if (!mounted) return;

      try {
        setLoading(true);
        const giftsData = await Router.getUserGifts();
        if (!mounted) return;
        setGifts(giftsData || []);
      } catch (error) {
        if (!mounted) return;
        console.error('Failed to load gifts:', error);
        setError(error instanceof Error ? error.message : 'Failed to load gifts');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadGifts();

    return () => {
      mounted = false;
    };
  }, [setGifts, setLoading, setError]);
}; 