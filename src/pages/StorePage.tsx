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

  const loadOrders = async (pageNum: number) => {
    try {
      setIsLoadingMore(true);
      const response = await Router.getOrders({
        order_by: currentFilters.orderBy,
        collection_name: currentFilters.collectionName,
        page: pageNum,
        page_size: 10,
      });

      if (Array.isArray(response)) {
        if (response.length < 10) {
          setHasMore(false);
        }
        if (pageNum === 1) {
          setOrders(response);
          setFilteredOrders(response);
        } else {
          setOrders([...orders, ...response]);
          setFilteredOrders([...filteredOrders, ...response]);
        }
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadOrders(1);
  }, [currentFilters]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadOrders(nextPage);
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
