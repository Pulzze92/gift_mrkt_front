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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setFilteredOrders = useAppStore(state => state.setFilteredOrders);
  const [currentFilters, setCurrentFilters] = useState<FilterValues>({
    priceFrom: '0.05',
    priceTo: '1000'
  });

  const fetchOrders = async () => {
    try {
      const data = await Router.getOrders();
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
    const filtered = orders.filter(order => {
      const price = Number(order.price);
      return price >= Number(filters.priceFrom) && price <= Number(filters.priceTo);
    }).filter(order => {
      if (!filters.collectionName) return true;
      return order.gift.collection_name.toLowerCase().includes(filters.collectionName.toLowerCase());
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

    setFilteredOrders(filtered);
  };

  return (
    <div>
      <TopContextMenu 
        title="Shop" 
        deposit={false} 
        onApplyFilters={handleApplyFilters}
        currentFilters={currentFilters}
      />
      {isLoading ? (
        <div className={styles.loadingOverlay}>
          <LoadingOutlined className={styles.spinner} />
        </div>
      ) : (
        <StoreGrid orders={orders} />
      )}
    </div>
  );
};

export default ShopPage; 