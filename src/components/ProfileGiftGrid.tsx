import React, { useState } from 'react';
import BuyModal from './BuyModal';
import styles from './style.module.scss';
import TgsPlayer from './TgsPlayer';

interface GiftAttribute {
  name: string;
  rarity: number;
  sticker_url?: string;
  center_color?: number;
  edge_color?: number;
  pattern_color?: number;
  text_color?: number;
}

interface Gift {
  title: string;
  number: number;
  available_amount: number;
  total_amount: number;
  attributes: {
    model: GiftAttribute;
    backdrop: GiftAttribute;
    symbol: GiftAttribute;
  };
}

const ProfileGiftGrid: React.FC = () => {
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);

  const gifts: Gift[] = [
    {
      title: 'Spy Agaric',
      number: 5598,
      available_amount: 40698,
      total_amount: 89638,
      attributes: {
        model: {
          name: 'Sour Gummy',
          rarity: 20,
          sticker_url: '/cdn/model.tgs',
        },
        backdrop: {
          name: 'Silver Blue',
          rarity: 20,
          center_color: 8430776,
          edge_color: 6323345,
          pattern_color: 1390411,
          text_color: 13231348,
        },
        symbol: {
          name: 'Coffin',
          rarity: 18,
          sticker_url: '/cdn/symbol.tgs',
        },
      },
    },
  ];

  const getRarityClass = (totalRarity: number): string => {
    const avgRarity = totalRarity / 3;
    if (avgRarity >= 20) return 'mythical';
    if (avgRarity >= 15) return 'legend';
    if (avgRarity >= 10) return 'rare';
    return 'common';
  };

  return (
    <>
      <div className={styles.profileGiftGrid}>
        {gifts.map((gift) => {
          const totalRarity =
            gift.attributes.model.rarity +
            gift.attributes.backdrop.rarity +
            gift.attributes.symbol.rarity;

          const rarityClass = getRarityClass(totalRarity);

          return (
            <div 
              key={gift.number} 
              className={styles.itemCard}
              onClick={() => setSelectedGift(gift)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.itemHeader}>
                <span 
                  className={`${styles.rarity} ${styles[rarityClass]}`}
                  style={{
                    color: `#${gift.attributes.backdrop.text_color?.toString(16)}`
                  }}
                >
                  {rarityClass.charAt(0).toUpperCase() + rarityClass.slice(1)}
                </span>
                <span className={styles.itemId}>#{gift.number}</span>
              </div>
              
              <div className={styles.itemImage}>
                <div 
                  className={styles.itemBackground}
                  style={{
                    background: `radial-gradient(
                      circle at center,
                      #${gift.attributes.backdrop.center_color?.toString(16)} 0%,
                      #${gift.attributes.backdrop.edge_color?.toString(16)} 100%
                    )`,
                  }}
                />
                <div 
                  className={styles.symbolPattern}
                  style={{
                    backgroundColor: `#${gift.attributes.backdrop.pattern_color?.toString(16)}`,
                  }}
                >
                  {Array.from({ length: 9 }).map((_, index) => (
                    <TgsPlayer
                      key={index}
                      src={gift.attributes.symbol.sticker_url || ''}
                      className={styles.backgroundSymbol}
                    />
                  ))}
                </div>
                <TgsPlayer
                  src={gift.attributes.model.sticker_url || ''}
                  className={styles.tgsPlayer}
                />
              </div>

              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{gift.title}</span>
                <div className={styles.availabilityInfo}>
                  <span className={styles.availabilityText}>
                    {gift.available_amount} / {gift.total_amount}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedGift && (
        <BuyModal
          item={{
            name: selectedGift.title,
            image: '/cdn/model.tgs',
            id: selectedGift.number.toString(),
            price: 0,
            attributes: selectedGift.attributes,
          }}
          onClose={() => setSelectedGift(null)}
          isProfile={true}
        />
      )}
    </>
  );
};

export default ProfileGiftGrid;
