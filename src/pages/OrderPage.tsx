import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TopContextMenu from '../components/TopContextMenu';
import StoreGrid from '../components/StoreGrid';
import { useOrders, useAppStore } from '../store';

const OrderPage: React.FC = () => {
  const orders = useOrders();
  const fetchOrders = useAppStore(state => state.fetchOrders);
  const location = useLocation();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, location]);

  console.log(orders)

  return (
    <div>
      <TopContextMenu title="My Orders" deposit={false} />
      <StoreGrid orders={orders} />
    </div>
  );
};

export default OrderPage;
