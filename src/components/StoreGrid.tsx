import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './style.module.scss';
import BuyModal from './BuyModal';
import { Order } from '../api/Router';
import TgsPlayer from './TgsPlayer';
import BackgroundPattern from './BackgroundPattern';
import tonImage from '../assets/ton.svg';
import tetherImage from '../assets/tether.svg';
import trumpImage from '../assets/trump.png';
import notImage from '../assets/not.jpg';
import boltImage from '../assets/bolt.png';
import Router from '../api/Router';
import { showToast } from '../utils/toast';
import { useAppStore } from '../store';

interface StoreGridProps {
  orders: Order[];
  mode?: 'shop' | 'orders';
}

const getCurrencyIcon = (currencyId: string) => {
  switch (currencyId.toUpperCase()) {
    case 'TON':
      return tonImage;
    case 'USDT':
      return tetherImage;
    case 'TRUMP':
      return trumpImage;
    case 'NOT':
      return notImage;
    case 'BOLT':
      return boltImage;
    default:
      return tonImage;
  }
};

const StoreGrid: React.FC<StoreGridProps> = ({ orders, mode = 'shop' }) => {
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const isOrderPage = location.pathname === '/order';
  const fetchOrders = useAppStore((state) => state.fetchOrders);

  useEffect(() => {
    const start_param = window.Telegram?.WebApp?.initDataUnsafe?.start_param;

    if (start_param?.startsWith('order-')) {
      const orderId = start_param.replace('order-', '');
      Router.getOrder(orderId)
        .then((order) => {
          console.log('Selected order:', order);
          setSelectedOrder(order);
          setSelectedGift({ ...order.gift, price: order.price });
          setShowBuyModal(true);
        })
        .catch((error) => {
          console.error('Failed to fetch order:', error);
          
          showToast(
            'Failed to find order', 'error'
          );
        });
    }
    if (window.Telegram?.WebApp?.initDataUnsafe) {
      window.Telegram.WebApp.initDataUnsafe.start_param = '';
    }
  }, []);
  const symbolPositions = useMemo(
    () =>
      Array.from({ length: 9 }).map(() => ({
        x: Math.random() * 20 - 10,
        y: Math.random() * 20 - 10,
        rotate: Math.random() * 40 - 20,
      })),
    []
  );

  const handleDeactivateOrder = async (
    orderId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (isLoading) return;

    try {
      setIsLoading(true);
      await Router.deactivateOrder(orderId);
      showToast('Order successfully deactivated', 'success');
      await fetchOrders();
    } catch (error) {
      console.error('Deactivation error:', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to deactivate order',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGiftClick = (gift: Gift, order: Order) => {
    if (!isOrderPage) {
      setSelectedGift({ ...gift, price: order.price });
      setSelectedOrder(order);
      setShowBuyModal(true);
    }
  };

  const getRarityClass = (grade?: string): string => {
    if (!grade) return 'common';
    
    switch (grade.toLowerCase()) {
      case 'mythical':
        return 'mythical';
      case 'legend':
        return 'legend';
      case 'rare':
        return 'rare';
      default:
        return 'common';
    }
  };

  return (
    <div className={styles.storeGrid}>
      {orders.map((order) => {
        const gift = order.gift;
        if (!gift) return null;
        const currency_id = order.currency || 'TON';
        const currency_symbol = order.currency_symbol || currency_id.toUpperCase();
        
        const rarityClass = getRarityClass(gift.grade);

        return (
          <div
            key={order.id}
            className={styles.itemCard}
            onClick={() => handleGiftClick(gift, order)}
          >
            <div className={styles.itemImage}>
              <div
                className={styles.itemBackground}
                style={{
                  background: `radial-gradient(
                    circle at center,
                    #${gift.attributes.backdrop?.center_color?.toString(16)} 0%,
                    #${gift.attributes.backdrop?.edge_color?.toString(16)} 100%
                  )`,
                }}
              />
              {gift.attributes.symbol?.sticker_url && (
                <BackgroundPattern
                  stickerUrl={gift.attributes.symbol.sticker_url}
                  positions={symbolPositions}
                />
              )}
              {gift.attributes.model?.sticker_url && (
                <div className={styles.stickerWrapper}>
                  <TgsPlayer
                    src={gift.attributes.model.sticker_url}
                    className={styles.tgsPlayer}
                  />
                </div>
              )}
            </div>

            <div className={styles.itemInfo}>
              <div className={styles.itemHeader}>
                <span className={styles.itemId}>#{gift.number}</span>
              </div>
              <span className={styles.itemName}>{gift.collection_name}</span>
              <span className={styles.orderPrice}>
                {order.price} ${currency_symbol}
                <img
                  src={getCurrencyIcon(currency_id)}
                  alt={currency_symbol}
                  className={styles.currencyIcon}
                />
              </span>
              <button
                className={`${styles.buyButton} ${mode === 'orders' ? styles.cancelButton : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (mode === 'orders') {
                    handleDeactivateOrder(order.id, e);
                  } else {
                    handleGiftClick(gift, order);
                  }
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingOutlined />
                ) : mode === 'orders' ? (
                  'Cancel'
                ) : (
                  <>
                    Buy
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}

      {showBuyModal && selectedGift && selectedOrder && (
        <BuyModal
          gift={selectedGift}
          order={selectedOrder}
          onClose={() => {
            setIsClosing(true);
            setTimeout(() => {
              setShowBuyModal(false);
              setSelectedGift(null);
              setSelectedOrder(null);
              setIsClosing(false);
            }, 300);
          }}
          isClosing={isClosing}
          mode={mode}
        />
      )}
    </div>
  );
};

export default StoreGrid;
