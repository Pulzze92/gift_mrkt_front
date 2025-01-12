import React from 'react';
import TopContextMenu from '../components/TopContextMenu';
import StoreGrid from '../components/StoreGrid';
import { useOrders, useLoading } from '../store';
import { useLoadUserOrders } from '../hooks/useLoadUserOrders';

const OrderPage: React.FC = () => {
  const orders = useOrders();
  const isLoading = useLoading();
  useLoadUserOrders();

  console.log('OrderPage render:', { isLoading, ordersCount: orders?.length });

  return (
    <div>
      <TopContextMenu title="My Orders" deposit={false} />
      {isLoading ? (
        <div>Loading orders...</div>
      ) : !orders ? (
        <div>Error loading orders</div>
      ) : orders.length === 0 ? (
        <div>No orders found</div>
      ) : (
        <StoreGrid orders={orders} />
      )}
    </div>
  );
};

export default OrderPage;
