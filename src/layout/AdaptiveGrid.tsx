import React from 'react';
import { useAdaptive } from '../hooks/useAdaptive';

interface AdaptiveGridProps {
  children: React.ReactNode;
}

export const AdaptiveGrid: React.FC<AdaptiveGridProps> = ({ children }) => {
  const { isMobile, isTablet } = useAdaptive();

  return (
    <div
      className={`
      grid 
      ${isMobile ? 'grid-cols-1 gap-2' : ''}
      ${isTablet ? 'grid-cols-2 gap-4' : ''}
      ${!isMobile && !isTablet ? 'grid-cols-3 gap-6' : ''}
    `}
    >
      {children}
    </div>
  );
};
