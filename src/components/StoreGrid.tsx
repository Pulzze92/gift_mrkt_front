import React, { useState } from 'react';
import BuyModal from './BuyModal';
import styles from './style.module.scss';

interface StoreItem {
  id: string;
  name: string;
  image: string;
  price: number;
  rarity: 'Mythical' | 'Rare' | 'Common' | 'Legend';
}

const StoreGrid: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);

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
          <div key={item.id} className={styles.itemCard}>
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
                onClick={() => setSelectedItem(item)}
              >
                Buy
                <span className={styles.price}>◊ {item.price}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <BuyModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </>
  );
};

export default StoreGrid;
