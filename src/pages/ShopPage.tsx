import React, { useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import Router from '../api/Router';
import { Order } from '../api/Router';
import StoreGrid from '../components/StoreGrid';
import styles from '../components/style.module.scss';
import TopContextMenu from '../components/TopContextMenu';
import { FilterValues } from '../components/FilterModal';
import { useAppStore } from '../store';

const ShopPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<FilterValues>({
    priceFrom: '0.05',
    priceTo: '1000',
  });

  const fetchOrders = async (filters?: FilterValues) => {
    try {
      setIsLoading(true);
      const data = await Router.getOrders({
        price_from: filters?.priceFrom,
        price_to: filters?.priceTo,
        order_by: filters?.orderBy,
        collection_name: filters?.collectionName,
      });
      if (Array.isArray(data)) {
        setOrders(data);
        setError(null);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleApplyFilters = (filters: FilterValues) => {
    setCurrentFilters(filters);
    fetchOrders(filters);
  };

  return (
    <div>
      <TopContextMenu
        title="Buy gift"
        deposit={false}
        onApplyFilters={handleApplyFilters}
        currentFilters={currentFilters}
      />
      {isLoading ? (
        <div className={styles.loadingOverlay}>
          <LoadingOutlined className={styles.spinner} />
        </div>
      ) : orders.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No gifts found with these filters</p>
          <p>Try adjusting your filter settings</p>
        </div>
      ) : (
        <StoreGrid orders={orders} />
      )}
    </div>
  );
};

export default ShopPage;
