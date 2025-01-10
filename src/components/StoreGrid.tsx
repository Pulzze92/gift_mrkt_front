import React, { useState } from 'react';
import BuyModal from './BuyModal';
import styles from './style.module.scss';
import tonImage from '../../public/ton.svg';

interface StoreItem {
  id: string;
  name: string;
  image: string;
  price: number;
  rarity: 'Mythical' | 'Rare' | 'Common' | 'Legend';
}

const StoreGrid: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleItemClick = (item: StoreItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedItem(null);
      setIsClosing(false);
    }, 300);
  };

  const items: StoreItem[] = [
    {
      id: '12400',
      name: "Durov's Cap",
      image: '/items/durov-cap.png',
      price: 15.72,
      rarity: 'Mythical',
    },
    {
      id: '72671',
      name: 'Precious Peach',
      image: '/items/precious-peach.png',
      price: 4.32,
      rarity: 'Rare',
    },
    {
      id: '23448',
      name: 'Signet Ring',
      image: '/items/signet-ring.png',
      price: 0.36,
      rarity: 'Common',
    },
    {
      id: '777',
      name: 'Plush Pepe',
      image: '/items/plush-pepe.png',
      price: 68,
      rarity: 'Legend',
    },
  ];

  return (
    <>
      <div className={styles.storeGrid}>
        {items.map((item) => (
          <div
            key={item.id}
            className={styles.itemCard}
            onClick={() => handleItemClick(item)}
          >
            <div className={styles.itemHeader}>
              <span
                className={`${styles.rarity} ${styles[item.rarity.toLowerCase()]}`}
              >
                {item.rarity}
              </span>
              <span className={styles.itemId}>#{item.id}</span>
            </div>
            <div className={styles.itemImage}>
              <img src={item.image} alt={item.name} />
            </div>
            <div className={styles.itemInfo}>
              <span className={styles.itemName}>{item.name}</span>
              <button
                className={styles.buyButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleItemClick(item);
                }}
              >
                Buy
                <span className={styles.price}>
                  <img
                    className={styles.tonIcon}
                    src={tonImage}
                    alt="ton"
                  ></img>{' '}
                  {item.price}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <BuyModal
          item={selectedItem}
          onClose={handleCloseModal}
          isClosing={isClosing}
        />
      )}
    </>
  );
};

export default StoreGrid;
