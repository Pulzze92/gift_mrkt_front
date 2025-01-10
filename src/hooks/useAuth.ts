import { useEffect } from 'react';
import { useAppStore } from '../store';
import Router from '../api/Router';

export const useAuth = () => {
  const { setUser, setLoading, setError } = useAppStore();

  useEffect(() => {
    const validateUser = async () => {
      try {
        setLoading(true);
        const response = await Router.validateUser();
        if (response.ok) {
          setUser(response.data);
        } else {
          setError(response.message);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to validate user'
        );
      } finally {
        setLoading(false);
      }
    };

    validateUser();
  }, []);
};
