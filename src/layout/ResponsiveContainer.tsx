import React from 'react';
import { useAdaptive } from '../hooks/useAdaptive';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
}) => {
  const { isMobile, isTablet } = useAdaptive();

  return (
    <div
      className={`
      w-full 
      px-4 
      ${isMobile ? 'max-w-full' : ''}
      ${isTablet ? 'max-w-2xl' : ''}
      mx-auto
      ${className}
    `}
    >
      {children}
    </div>
  );
};
