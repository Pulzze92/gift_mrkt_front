import React, { useState, useMemo } from 'react';
import BuyModal from './BuyModal';
import styles from './style.module.scss';
import tonImage from '../../public/ton.svg';
import { Order } from '../api/Router';
import TgsPlayer from './TgsPlayer';
import BackgroundPattern from './BackgroundPattern';

interface StoreGridProps {
  orders: Order[];
}

const StoreGrid: React.FC<StoreGridProps> = ({ orders }) => {
  const [selectedItem, setSelectedItem] = useState<Order | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const symbolPositions = useMemo(() => 
    Array.from({ length: 9 }).map(() => ({
      x: Math.random() * 20 - 10,
      y: Math.random() * 20 - 10,
      rotate: Math.random() * 40 - 20,
    })), []
  );

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
        {orders.map((order) => {
          const gift = (order as any).gift;
          if (!gift) return null;
          
          return (
            <div
              key={order.id}
              className={styles.itemCard}
              onClick={() => setSelectedItem(order)}
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
          );
        })}
      </div>

      {selectedItem && (selectedItem as any).gift && (
        <BuyModal
          item={{
            id: selectedItem.gift_id,
            name: (selectedItem as any).gift.collection_name,
            number: (selectedItem as any).gift.number.toString(),
            price: selectedItem.price,
            image: '',
            attributes: (selectedItem as any).gift.attributes
          }}
          onClose={handleCloseModal}
          isClosing={isClosing}
        />
      )}
    </>
  );
};

export default StoreGrid;
