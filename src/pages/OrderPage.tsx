import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TopContextMenu from '../components/TopContextMenu';
import StoreGrid from '../components/StoreGrid';
import { useOrders, useAppStore } from '../store';
import { FilterValues } from '../components/FilterModal';
import { Order } from '../api/Router';
import styles from './style.module.scss';
import LoadMore from '../components/LoadMore';
import { LoadingOutlined } from '@ant-design/icons';

const ITEMS_PER_PAGE = 10;

const OrderPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [displayedOrders, setDisplayedOrders] = useState<Order[]>([]);
  
  const orders = useOrders();
  const fetchOrders = useAppStore((state) => state.fetchOrders);
  const location = useLocation();
  const [currentFilters, setCurrentFilters] = useState<FilterValues>({
    priceFrom: '0.05',
    priceTo: '1000',
  });

  useEffect(() => {
    const loadInitialOrders = async () => {
      await fetchOrders();
      setDisplayedOrders(orders.slice(0, ITEMS_PER_PAGE));
      setHasMore(orders.length > ITEMS_PER_PAGE);
    };
    
    loadInitialOrders();
  }, [fetchOrders, location]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const start = (nextPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      
      const nextOrders = orders.slice(0, end);
      setDisplayedOrders(nextOrders);
      setPage(nextPage);
      
      setHasMore(orders.length > end);
      setIsLoadingMore(false);
    }
  };

  const handleApplyFilters = (filters: FilterValues) => {
    setCurrentFilters(filters);
    setPage(1);
    setHasMore(true);
    const filtered = orders
      .filter((order) => {
        const price = Number(order.price);
        return price >= Number(filters.priceFrom) && price <= Number(filters.priceTo);
      })
      .filter((order) => {
        if (!filters.collectionName) return true;
        return order.gift.collection_name
          .toLowerCase()
          .includes(filters.collectionName.toLowerCase());
      });

    if (filters.orderBy) {
      filtered.sort((a, b) => {
        switch (filters.orderBy) {
          case 'price_asc': return a.price - b.price;
          case 'price_desc': return b.price - a.price;
          case 'number_asc': return a.gift.number - b.gift.number;
          case 'number_desc': return b.gift.number - a.gift.number;
          default: return 0;
        }
      });
    }

    setDisplayedOrders(filtered.slice(0, ITEMS_PER_PAGE));
    setHasMore(filtered.length > ITEMS_PER_PAGE);
  };

  return (
    <div>
      <TopContextMenu
        title="My Orders"
        deposit={false}
        onApplyFilters={handleApplyFilters}
        currentFilters={currentFilters}
      />
      {displayedOrders.length === 0 ? (
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

export default OrderPage;
