import React, { useEffect, useRef } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './style.module.scss';

interface LoadMoreProps {
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

const LoadMore: React.FC<LoadMoreProps> = ({ onLoadMore, isLoading, hasMore }) => {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [onLoadMore, hasMore, isLoading]);

  return (
    <div ref={observerRef} className={styles.loadMore}>
      {isLoading && <LoadingOutlined className={styles.spinner} />}
    </div>
  );
};

export default LoadMore; 