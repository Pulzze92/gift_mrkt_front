import React, { useState, useEffect } from 'react';
import TopContextMenu from '../components/TopContextMenu';
import StoreGrid from '../components/StoreGrid';
import {
  useOrders,
  useFilteredOrders,
  useLoading,
  useAppStore,
} from '../store';
import Router from '../api/Router';
import { FilterValues } from '../components/FilterModal';
import styles from './style.module.scss';
import { LoadingOutlined } from '@ant-design/icons';
import LoadMore from '../components/LoadMore';

const parsePrice = (priceStr: string): number => {
  const cleanPrice = priceStr.replace(/[^\d.]/g, '');
  return Number(cleanPrice) || 0;
};

const StorePage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const orders = useOrders();
  const filteredOrders = useFilteredOrders();
  const isLoading = useLoading();
  const setOrders = useAppStore((state) => state.setOrders);
  const setFilteredOrders = useAppStore((state) => state.setFilteredOrders);
  const [currentFilters, setCurrentFilters] = useState<FilterValues>({
    priceFrom: '0.05',
    priceTo: '1000',
  });
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async (filters?: FilterValues) => {
    try {
      setIsLoading(true);
      console.log('Fetching orders with filters:', filters);
      
      const data = await Router.getOrders({
        order_by: filters?.orderBy,
        collection_name: filters?.collectionName,
      });
      
      console.log('Raw orders from backend:', data);
      console.log('Number of orders from backend:', data?.length);
      
      if (Array.isArray(data)) {
        data.forEach((order, index) => {
          console.log(`Order ${index}:`, {
            id: order.id,
            price: order.price,
            currency: order.currency,
            gift: order.gift ? 'present' : 'missing'
          });
        });
        
        setOrders(data);
        setFilteredOrders(data);
        
        setError(null);
      } else {
        console.log('Data is not an array:', data);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Effect triggered with filters:', currentFilters);
    fetchOrders(currentFilters);
    const interval = setInterval(() => fetchOrders(currentFilters), 30000);
    return () => clearInterval(interval);
  }, [currentFilters]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchOrders({ ...currentFilters, page: nextPage });
    }
  };

  const handleApplyFilters = (filters: FilterValues) => {
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
      {isLoading && page === 1 ? (
        <div className={styles.loadingOverlay}>
          <LoadingOutlined className={styles.spinner} />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No gifts found with these filters</p>
          <p>Try adjusting your filter settings</p>
        </div>
      ) : (
        <>
          <div style={{ color: 'white', padding: '10px' }}>
            Debug: Orders count: {orders.length}, Filtered orders count: {filteredOrders.length}
          </div>
          <StoreGrid orders={filteredOrders} />
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

export default StorePage;
