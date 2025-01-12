import React from 'react';
import TopContextMenu from '../components/TopContextMenu';
import StoreGrid from '../components/StoreGrid';
import { useOrders, useLoading } from '../store';
import { useLoadOrders } from '../hooks/useLoadOrders';

const StorePage: React.FC = () => {
  const orders = useOrders();
  const isLoading = useLoading();
  useLoadOrders();

  console.log('StorePage render:', { isLoading, ordersCount: orders?.length });

  return (
    <div>
      <TopContextMenu title="Shop" deposit={false} />
      {isLoading ? (
        <div>Loading orders...</div>
      ) : !orders ? (
        <div>Error loading orders</div>
      ) : orders.length === 0 ? (
        <div>No orders available</div>
      ) : (
        <StoreGrid orders={orders} />
      )}
    </div>
  );
};

export default StorePage;
