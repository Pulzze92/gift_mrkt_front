import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TopContextMenu from '../components/TopContextMenu';
import StoreGrid from '../components/StoreGrid';
import { useOrders, useAppStore } from '../store';
import { FilterValues } from '../components/FilterModal';
import { Order } from '../api/Router';
import styles from './style.module.scss';

const OrderPage: React.FC = () => {
  const orders = useOrders();
  const fetchOrders = useAppStore(state => state.fetchOrders);
  const location = useLocation();
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [currentFilters, setCurrentFilters] = useState<FilterValues>({
    priceFrom: '0.05',
    priceTo: '1000'
  });

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, location]);

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

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
        title="My Orders" 
        deposit={false}
        onApplyFilters={handleApplyFilters}
        currentFilters={currentFilters}
      />
      {filteredOrders.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No gifts found with these filters</p>
          <p>Try adjusting your filter settings</p>
        </div>
      ) : (
        <StoreGrid orders={filteredOrders} />
      )}
    </div>
  );
};

export default OrderPage;
