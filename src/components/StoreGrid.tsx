import React, { useState } from 'react';
import BuyModal from './BuyModal';
import styles from './style.module.scss';
import tonImage from '../../public/ton.svg';
import { Order } from '../api/Router';

interface StoreGridProps {
  orders: Order[];
}

const StoreGrid: React.FC<StoreGridProps> = ({ orders }) => {
  const [selectedItem, setSelectedItem] = useState<Order | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedItem(null);
      setIsClosing(false);
    }, 300);
  };

  return (
    <>
      <div className={styles.storeGrid}>
        {orders.map((order) => (
          <div
            key={order.id}
            className={styles.itemCard}
            onClick={() => setSelectedItem(order)}
          >
            <div className={styles.itemHeader}>
              <span className={styles.itemId}>#{order.gift_id}</span>
            </div>

            <div className={styles.itemInfo}>
              <span className={styles.itemName}>Gift #{order.gift_id}</span>
              <button
                className={styles.buyButton}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedItem(order);
                }}
              >
                Buy
                <span className={styles.price}>
                  <img className={styles.tonIcon} src={tonImage} alt="ton" />
                  {order.price}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <BuyModal
          item={{
            id: selectedItem.gift_id,
            name: `Gift #${selectedItem.gift_id}`,
            price: selectedItem.price,
            image: '', // Здесь нужно добавить изображение из order если оно есть
          }}
          onClose={handleCloseModal}
          isClosing={isClosing}
        />
      )}
    </>
  );
};

export default StoreGrid;
