import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TopContextMenu from '../components/TopContextMenu';
import StoreGrid from '../components/StoreGrid';
import { FilterValues } from '../components/FilterModal';
import { Order } from '../api/Router';
import styles from './style.module.scss';
import LoadMore from '../components/LoadMore';
import Router from '../api/Router';
import { LoadingOutlined } from '@ant-design/icons';

const ITEMS_PER_PAGE = 10;

const OrderPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [displayedOrders, setDisplayedOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [currentFilters, setCurrentFilters] = useState<FilterValues>({
    priceFrom: '0.05',
    priceTo: '1000',
  });

  const fetchOrders = async (filters?: FilterValues, pageNum: number = 1) => {
    try {
      setIsLoading(true);
      const data = await Router.getUserOrders({
        page: pageNum,
        page_size: ITEMS_PER_PAGE,
        price_from: Number(filters?.priceFrom),
        price_to: Number(filters?.priceTo),
        order_by: filters?.orderBy,
        collection_name: filters?.collectionName,
        currencies: filters?.currencies,
      });
      
      if (Array.isArray(data)) {
        if (pageNum === 1) {
          setDisplayedOrders(data);
        } else {
          setDisplayedOrders(prev => [...prev, ...data]);
        }
        setHasMore(data.length === ITEMS_PER_PAGE);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchOrders(currentFilters, 1);
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
    setCurrentFilters(filters);
    setPage(1);
    setHasMore(true);
  };

  return (
    <div>
      <TopContextMenu
        title="My Orders"
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
          <StoreGrid 
            orders={displayedOrders} 
            mode="orders"
          />
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

export default OrderPage;
