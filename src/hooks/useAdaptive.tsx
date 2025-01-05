import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '../utils/breakpoints';

export const useAdaptive = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile: screenWidth < BREAKPOINTS.md,
    isTablet: screenWidth >= BREAKPOINTS.md && screenWidth < BREAKPOINTS.lg,
    isDesktop: screenWidth >= BREAKPOINTS.lg,
    screenWidth,
  };
};
