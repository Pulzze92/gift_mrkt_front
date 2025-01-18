import React, { useState, useMemo } from 'react';
import BuyModal from './BuyModal';
import styles from './style.module.scss';
import TgsPlayer from './TgsPlayer';
import { useAppStore } from '../store';
import BackgroundPattern from './BackgroundPattern';

const ProfileGiftGrid: React.FC = () => {
  const [selectedGift, setSelectedGift] = useState<any>(null);
  const { gifts } = useAppStore();

  const symbolPositions = useMemo(
    () =>
      Array.from({ length: 9 }).map(() => ({
        x: Math.random() * 20 - 10,
        y: Math.random() * 20 - 10,
        rotate: Math.random() * 40 - 20,
      })),
    []
  );

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
          gift={{
            name: selectedGift.collection_name,
            image: selectedGift.attributes.model?.sticker_url || '',
            id: selectedGift.id,
            number: selectedGift.number.toString(),
            price: 0,
            attributes: {
              model: {
                rarity: selectedGift.attributes.model?.rarity || 0,
                sticker_url: selectedGift.attributes.model?.sticker_url || '',
              },
              backdrop: {
                rarity: selectedGift.attributes.backdrop?.rarity || 0,
                center_color: selectedGift.attributes.backdrop?.center_color,
                edge_color: selectedGift.attributes.backdrop?.edge_color,
              },
              symbol: {
                rarity: selectedGift.attributes.symbol?.rarity || 0,
                sticker_url: selectedGift.attributes.symbol?.sticker_url || '',
              },
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
