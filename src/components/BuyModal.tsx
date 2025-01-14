import React, { useState, useMemo } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import styles from './style.module.scss';
import TgsPlayer from './TgsPlayer';
import BackgroundPattern from './BackgroundPattern';
import SellModal from './SellModal';
import Router from '../api/Router';
import SuccessToast from './Toast/SuccessToast';
import ErrorToast from './Toast/ErrorToast';

interface BuyModalProps {
  item: {
    id: string;
    number: string;
    name: string;
    image: string;
    price: number;
    attributes?: {
      model: { rarity: number; sticker_url: string };
      backdrop: { rarity: number; center_color: number; edge_color: number };
      symbol: { rarity: number; sticker_url: string };
    };
  };
  onClose: () => void;
  isProfile?: boolean;
  isClosing?: boolean;
}

const BuyModal: React.FC<BuyModalProps> = ({ item, onClose, isProfile = false, isClosing = false }) => {
  const [isClosingState, setIsClosing] = useState(isClosing);
  const [showSellModal, setShowSellModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const symbolPositions = useMemo(() => 
    Array.from({ length: 9 }).map(() => ({
      x: Math.random() * 20 - 10,
      y: Math.random() * 20 - 10,
      rotate: Math.random() * 40 - 20,
    })), []
  );

  const handleWithdraw = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await Router.withdrawGiftBalance(item.id);
      
      if (response.success) {
        SuccessToast({ message: response.message });
        onClose();
      } else {
        ErrorToast({ message: response.message || 'Failed to withdraw gift' });
      }
    } catch (error) {
      ErrorToast({ 
        message: error instanceof Error ? error.message : 'Failed to withdraw gift'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className={`${styles.modalOverlay} ${isClosingState ? styles.fadeOut : ''}`}
        onClick={handleOverlayClick}
      >
        <div
          className={`${styles.modalCard} ${isClosingState ? styles.slideDown : ''}`}
        >
          <button className={styles.closeButton} onClick={handleClose}>
            <CloseOutlined />
          </button>

          <div className={styles.itemPreview}>
            <div className={styles.itemImage}>
              <div
                className={styles.itemBackground}
                style={{
                  background: `radial-gradient(
                    circle at center,
                    #${item.attributes.backdrop?.center_color?.toString(16)} 0%,
                    #${item.attributes.backdrop?.edge_color?.toString(16)} 100%
                  )`,
                }}
              />
              {item.attributes.symbol?.sticker_url && (
                <BackgroundPattern
                  stickerUrl={item.attributes.symbol.sticker_url}
                  positions={symbolPositions}
                />
              )}
              {item.attributes.model?.sticker_url && (
                <div className={styles.stickerWrapper}>
                  <TgsPlayer
                    src={item.attributes.model.sticker_url}
                    className={styles.tgsPlayer}
                  />
                </div>
              )}
            </div>
          </div>

          <h2 className={styles.modalTitle}>{item.name}</h2>
          <div className={styles.modalSubtitle}>
            Collector's gift #{item.id}
          </div>

          <div className={styles.propertyList}>
            <div className={styles.modalActions}>
              <button onClick={handleWithdraw} className={styles.secondary}>Withdraw</button>
              <button onClick={() => setShowSellModal(true)}>Sell</button>
            </div>
            {!isProfile && (
              <div className={styles.propertyItem}>
                <button className={styles.buyButton}>
                  Buy
                  <span className={styles.price}>◊ {item.price}</span>
                </button>
              </div>
            )}
          </div>

          {!isProfile && (
            <div className={styles.propertyItem}>
              <span>Seller</span>
              <span className={styles.propertyValue}>Gifts_seller</span>
            </div>
          )}
        </div>
      </div>

      {showSellModal && (
        <SellModal
          gift={{
            id: item.id,
            name: item.name,
            attributes: item.attributes
          }}
          onClose={() => setShowSellModal(false)}
          symbolPositions={symbolPositions}
        />
      )}
    </>
  );
};

export default BuyModal;
