import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './style.module.scss';
import BuyModal from './BuyModal';
import { Order } from '../api/Router';
import TgsPlayer from './TgsPlayer';
import BackgroundPattern from './BackgroundPattern';
import tonImage from '../../public/ton.svg';
import Router from '../api/Router';
import { showToast } from '../utils/toast';

interface StoreGridProps {
  orders: Order[];
}

const StoreGrid: React.FC<StoreGridProps> = ({ orders }) => {
  const [selectedGift, setSelectedGift] = useState<any>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const location = useLocation();
  const isOrderPage = location.pathname === '/order';

  const symbolPositions = useMemo(() => 
    Array.from({ length: 9 }).map(() => ({
      x: Math.random() * 20 - 10,
      y: Math.random() * 20 - 10,
      rotate: Math.random() * 40 - 20,
    })), []
  );

  const handleDeactivateOrder = async (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;

    try {
      setIsLoading(true);
      await Router.deactivateOrder(orderId);
      showToast('Order successfully deactivated', 'success');
    } catch (error) {
      console.error('Deactivation error:', error);
      showToast(error instanceof Error ? error.message : 'Failed to deactivate order', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.storeGrid}>
      {orders.map((order) => {
        const gift = order.gift;
        if (!gift) return null;
        
        return (
          <div
            key={order.id}
            className={styles.itemCard}
            onClick={() => setSelectedGift(gift)}
          >
            <div className={styles.itemHeader}>
              <span className={styles.itemId}>#{gift.number}</span>
            </div>

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
              <span className={styles.itemName}>
                {gift.collection_name}
              </span>
              <button
                className={`${styles.buyButton} ${isOrderPage ? styles.cancelButton : ''}`}
                onClick={(e) => 
                  isOrderPage 
                    ? handleDeactivateOrder(order.id, e)
                    : setSelectedGift(gift)
                }
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingOutlined />
                ) : isOrderPage ? (
                  'Cancel'
                ) : (
                  <>
                    Buy
                    <span className={styles.price}>
                      <img src={tonImage} alt="ton" className={styles.tonIcon} />
                      {order.price}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}

      {showBuyModal && selectedGift && (
        <BuyModal
          isClosing={isClosing}
          onClose={() => {
            setShowBuyModal(false);
            setSelectedGift(null);
          }}
          gift={{
            ...selectedGift,
            price: selectedItem?.price || 0
          }}
          isShop={true}
        />
      )}
    </div>
  );
};

export default StoreGrid;
