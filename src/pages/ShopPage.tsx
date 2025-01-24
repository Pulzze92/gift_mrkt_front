import React, { useState, useEffect } from 'react';
import TopContextMenu from '../components/TopContextMenu';
import StoreGrid from '../components/StoreGrid';
import { FilterValues } from '../components/FilterModal';
import styles from './style.module.scss';
import { LoadingOutlined } from '@ant-design/icons';
import Router from '../api/Router';
import LoadMore from '../components/LoadMore';

const ITEMS_PER_PAGE = 10;

const ShopPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [currentFilters, setCurrentFilters] = useState<FilterValues>({
    priceFrom: '0.05',
    priceTo: '1000',
    currencies: ['ton', 'usdt', 'trump', 'not'],
  });

  const fetchOrders = async (filters?: FilterValues, pageNum: number = 1) => {
    try {
      if (pageNum === 1) {
        setIsLoading(true);
      }
      
      console.log('Sending filters:', {
        ...filters,
        currencies: filters?.currencies
      });
      
      const data = await Router.getOrders({
        page: pageNum,
        page_size: ITEMS_PER_PAGE,
        price_from: Number(filters?.priceFrom),
        price_to: Number(filters?.priceTo),
        order_by: filters?.orderBy,
        collection_name: filters?.collectionName,
        currencies: filters?.currencies?.length ? filters.currencies : undefined,
      });
      
      console.log('Response data:', data);
      
      if (Array.isArray(data)) {
        if (pageNum === 1) {
          setDisplayedOrders(data);
        } else {
          setDisplayedOrders(prev => [...prev, ...data]);
        }
        setHasMore(data.length === ITEMS_PER_PAGE);
        setError(null);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchOrders(currentFilters, 1);
    const interval = setInterval(() => fetchOrders(currentFilters, 1), 30000);
    return () => clearInterval(interval);
  }, [currentFilters]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchOrders(currentFilters, nextPage);
    }
  };

  const handleApplyFilters = (filters: FilterValues) => {
    console.log('Applying filters:', filters);
    setCurrentFilters(filters);
    setPage(1);
    setHasMore(true);
  };

  return (
    <div className={styles.storePageContainer}>
      <TopContextMenu
        title="Buy gift"
        deposit={false}
        onApplyFilters={handleApplyFilters}
        currentFilters={currentFilters}
      />
      {isLoading && displayedOrders.length === 0 ? (
        <div className={styles.loadingOverlay}>
          <LoadingOutlined className={styles.spinner} />
        </div>
      ) : displayedOrders.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No gifts found with these filters</p>
          <p>Try adjusting your filter settings</p>
        </div>
      ) : (
        <>
          <StoreGrid orders={displayedOrders} />
          <LoadMore
            onLoadMore={handleLoadMore}
            isLoading={isLoadingMore}
            hasMore={hasMore}
          />
        </>
      )}
    </div>
  );
};

export default ShopPage;
