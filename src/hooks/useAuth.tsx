import { useEffect } from 'react';
import { useAppStore } from '../store';
import Router from '../api/Router';

export const useAuth = () => {
  const { setUser, setGifts, setLoading, setError } = useAppStore();

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!mounted) return;
      
      try {
        setLoading(true);
        console.log('Starting initialization...');

        const userResponse = await Router.validateUser();
        console.log('User validation response:', userResponse);
        
        if (!mounted) return;
        
        if (userResponse.ok) {
          setUser(userResponse.data);
          
          const giftsData = await Router.getUserGifts();
          
          if (mounted) {
            setGifts(giftsData || []);
          }
        } else {
          setError(userResponse.message);
        }
      } catch (error) {
        if (mounted) {
          console.error('Initialization error:', error);
          setError(error instanceof Error ? error.message : 'Initialization failed');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);
};