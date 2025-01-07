import React, { useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import styles from './style.module.scss';

interface BuyModalProps {
  item: {
    name: string;
    image: string;
    id: string;
    price: number;
  };
  onClose: () => void;
}

const BuyModal: React.FC<BuyModalProps> = ({ item, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      className={`${styles.modalOverlay} ${isClosing ? styles.fadeOut : ''}`}
      onClick={handleOverlayClick}
    >
      <div
        className={`${styles.modalCard} ${isClosing ? styles.slideDown : ''}`}
      >
        <button className={styles.closeButton} onClick={handleClose}>
          <CloseOutlined />
        </button>

        <img src={item.image} alt={item.name} className={styles.modalImage} />
        <h2 className={styles.modalTitle}>{item.name}</h2>
        <div className={styles.modalSubtitle}>Collector's gift #{item.id}</div>

        <div className={styles.propertyList}>
          <div className={styles.propertyItem}>
            <span>Model</span>
            <span className={styles.propertyValue}>0.02</span>
          </div>
          <div className={styles.propertyItem}>
            <span>Pattern</span>
            <span className={styles.propertyValue}>0.15</span>
          </div>
          <div className={styles.propertyItem}>
            <span>Background</span>
            <span className={styles.propertyValue}>0.01</span>
          </div>
          <div className={styles.propertyItem}>
            <span>Grade</span>
            <span className={styles.propertyValue}>Mythical</span>
          </div>
          <div className={styles.propertyItem}>
            <span>Seller</span>
            <span className={styles.propertyValue}>Gifts_seller</span>
          </div>
        </div>

        <button className={styles.buyButton}>
          Buy
          <span className={styles.price}>◊ {item.price}</span>
        </button>
      </div>
    </div>
  );
};

export default BuyModal;
