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

const StorePage: React.FC = () => {
  const orders = useOrders();
  const filteredOrders = useFilteredOrders();
  const isLoading = useLoading();
  const setOrders = useAppStore((state) => state.setOrders);
  const setFilteredOrders = useAppStore((state) => state.setFilteredOrders);
  const [currentFilters, setCurrentFilters] = useState<FilterValues>({
    priceFrom: '0.05',
    priceTo: '1000',
  });

  useEffect(() => {
    if (orders.length === 0) {
      const loadOrders = async () => {
        try {
          const response = await Router.getOrders({
            order_by: currentFilters.orderBy,
            collection_name: currentFilters.collectionName,
            page: 1,
            page_size: 10,
          });
          setOrders(response);
        } catch (error) {
          console.error('Failed to load orders:', error);
        }
      };
      loadOrders();
    }
  }, [orders.length, setOrders]);

  const handleApplyFilters = (filters: FilterValues) => {
    setCurrentFilters(filters);
    const filtered = orders
      .filter((order) => {
        const price = Number(order.price);
        return (
          price >= Number(filters.priceFrom) && price <= Number(filters.priceTo)
        );
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
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'number_asc':
            return a.gift.number - b.gift.number;
          case 'number_desc':
            return b.gift.number - a.gift.number;
          default:
            return 0;
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
        <div>Loading orders...</div>
      ) : !filteredOrders ? (
        <div>Error loading orders</div>
      ) : filteredOrders.length === 0 ? (
        <div>No orders available</div>
      ) : (
        <StoreGrid orders={filteredOrders} />
      )}
    </div>
  );
};

export default StorePage;
