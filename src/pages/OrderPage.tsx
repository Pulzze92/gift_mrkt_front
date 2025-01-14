import React, { useState, useEffect } from 'react';
import TopContextMenu from '../components/TopContextMenu';
import StoreGrid from '../components/StoreGrid';
import { useUserOrders, useFilteredUserOrders, useLoading, useAppStore } from '../store';
import Router from '../api/Router';
import { FilterValues } from '../components/FilterModal';

const OrderPage: React.FC = () => {
  const userOrders = useUserOrders();
  const filteredOrders = useFilteredUserOrders();
  const isLoading = useLoading();
  const setUserOrders = useAppStore(state => state.setUserOrders);
  const setFilteredUserOrders = useAppStore(state => state.setFilteredUserOrders);
  const [currentFilters, setCurrentFilters] = useState<FilterValues>({
    priceFrom: '0.05',
    priceTo: '1000'
  });

  useEffect(() => {
    if (userOrders.length === 0) {
      const loadOrders = async () => {
        try {
          const response = await Router.getUserOrders();
          setUserOrders(response);
        } catch (error) {
          console.error('Failed to load user orders:', error);
        }
      };
      loadOrders();
    }
  }, [userOrders.length, setUserOrders]);

  const handleApplyFilters = (filters: FilterValues) => {
    setCurrentFilters(filters);
    const filtered = userOrders.filter(order => {
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

    setFilteredUserOrders(filtered);
  };

  return (
    <div>
      <TopContextMenu 
        title="My Orders" 
        deposit={false} 
        onApplyFilters={handleApplyFilters}
        currentFilters={currentFilters}
      />
      {isLoading ? (
        <div>Loading orders...</div>
      ) : !filteredOrders ? (
        <div>Error loading orders</div>
      ) : filteredOrders.length === 0 ? (
        <div>No orders found</div>
      ) : (
        <StoreGrid orders={filteredOrders} />
      )}
    </div>
  );
};

export default OrderPage;
