import React, { useState, useMemo } from 'react';
import styles from './style.module.scss';
import TgsPlayer from './TgsPlayer';
import BackgroundPattern from './BackgroundPattern';
import SellModal from './SellModal';
import BuyModal from './BuyModal';
import { Gift } from '../api/Router';

interface GiftGridProps {
  gifts: Gift[];
  mode: 'sell' | 'profile';
}

const GiftGrid: React.FC<GiftGridProps> = ({ gifts, mode }) => {
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const symbolPositions = useMemo(
    () =>
      Array.from({ length: 9 }).map(() => ({
        x: Math.random() * 20 - 10,
        y: Math.random() * 20 - 10,
        rotate: Math.random() * 40 - 20,
      })),
    []
  );

  const handleGiftClick = (gift: Gift) => {
    setSelectedGift(gift);
    if (mode === 'sell') {
      setShowSellModal(true);
    } else {
      setShowBuyModal(true);
    }
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowBuyModal(false);
      setShowSellModal(false);
      setSelectedGift(null);
      setIsClosing(false);
    }, 300);
  };

  return (
    <div className={styles.storeGrid}>
      {gifts.map((gift) => (
        <div
          key={gift.id}
          className={styles.itemCard}
          onClick={() => handleGiftClick(gift)}
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
            {mode === 'sell' && (
              <button
                className={`${styles.buyButton} ${styles.sellButton}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleGiftClick(gift);
                }}
              >
                Sell
              </button>
            )}
          </div>
        </div>
      ))}

      {showBuyModal && selectedGift && (
        <BuyModal
          gift={selectedGift}
          isClosing={isClosing}
          onClose={handleCloseModal}
          mode={mode}
        />
      )}

      {showSellModal && selectedGift && (
        <SellModal
          gift={selectedGift}
          isClosing={isClosing}
          onClose={handleCloseModal}
          symbolPositions={symbolPositions}
        />
      )}
    </div>
  );
};

export default GiftGrid;
