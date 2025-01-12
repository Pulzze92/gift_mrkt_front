import React, { useState } from 'react';
import BuyModal from './BuyModal';
import styles from './style.module.scss';
import TgsPlayer from './TgsPlayer';
import { useAppStore } from '../store';

const ProfileGiftGrid: React.FC = () => {
  const [selectedGift, setSelectedGift] = useState<any>(null);
  const { gifts } = useAppStore();

  console.log('ProfileGiftGrid render:', { giftsCount: gifts.length });

  const getRarityClass = (grade: string): string => {
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
    <>
      <div className={styles.profileGiftGrid}>
        {gifts.length === 0 ? (
          <div>No gifts found</div>
        ) : (
          gifts.map((gift) => {
            const rarityClass = getRarityClass(gift.grade);

            return (
              <div
                key={gift.id}
                className={styles.itemCard}
                onClick={() => setSelectedGift(gift)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.itemHeader}>
                  <span className={`${styles.rarity} ${styles[rarityClass]}`}>
                    {gift.grade}
                  </span>
                  <span className={styles.itemId}>#{gift.number}</span>
                </div>

                <div className={styles.itemImage}>
                  {/* Если у вас есть фоновые изображения или паттерны, добавьте их здесь */}
                  <TgsPlayer
                    src={gift.attributes.sticker_url || ''}
                    className={styles.tgsPlayer}
                  />
                </div>

                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{gift.collection_name}</span>
                  <div className={styles.availabilityInfo}>
                    <span className={styles.availabilityText}>
                      Status: {gift.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedGift && (
        <BuyModal
          item={{
            name: selectedGift.collection_name,
            image: selectedGift.attributes.sticker_url || '',
            id: selectedGift.number.toString(),
            price: 0,
            attributes: {
              model: { rarity: 0 },
              backdrop: { rarity: 0 },
              symbol: { rarity: 0 },
              ...selectedGift.attributes,
            },
          }}
          onClose={() => setSelectedGift(null)}
          isProfile={true}
          isClosing={false}
        />
      )}
    </>
  );
};

export default ProfileGiftGrid;
