import React, { useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import styles from './style.module.scss';
import TgsPlayer from './TgsPlayer';
import BackgroundPattern from './BackgroundPattern';
import Router from '../api/Router';

interface SellModalProps {
  gift: {
    id: string;
    name: string;
    attributes: {
      model: { sticker_url: string };
      backdrop: { center_color: number; edge_color: number };
      symbol: { sticker_url: string };
    };
  };
  onClose: () => void;
  symbolPositions: Array<{ x: number; y: number; rotate: number }>;
}

const SellModal: React.FC<SellModalProps> = ({ gift, onClose, symbolPositions }) => {
  const [price, setPrice] = useState<string>('');
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const handleCreateOrder = async () => {
    try {
      await Router.createOrder(gift.id, Number(price));
      handleClose();
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  return (
    <div className={`${styles.modalOverlay} ${isClosing ? styles.fadeOut : ''}`}>
      <div className={`${styles.sellModal} ${isClosing ? styles.slideDown : ''}`}>
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
                  #${gift.attributes.backdrop.center_color.toString(16)} 0%,
                  #${gift.attributes.backdrop.edge_color.toString(16)} 100%
                )`,
              }}
            />
            {gift.attributes.symbol.sticker_url && (
              <BackgroundPattern
                stickerUrl={gift.attributes.symbol.sticker_url}
                positions={symbolPositions}
              />
            )}
            {gift.attributes.model.sticker_url && (
              <div className={styles.stickerWrapper}>
                <TgsPlayer
                  src={gift.attributes.model.sticker_url}
                  className={styles.tgsPlayer}
                />
              </div>
            )}
          </div>
        </div>

        <h2 className={styles.modalTitle}>{gift.name}</h2>
        
        <div className={styles.sellForm}>
          <input
            type="number"
            placeholder="Enter TON amount"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={styles.priceInput}
          />
          <button 
            className={styles.createOrderButton}
            onClick={handleCreateOrder}
            disabled={!price || Number(price) <= 0}
          >
            Create order
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellModal; 