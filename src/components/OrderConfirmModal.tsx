import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import styles from './style.module.scss';
import tonImage from '../../public/ton.svg';

interface OrderConfirmModalProps {
  orderId: string;
  status: string;
  purchase: string;
  price: number;
  characteristics: {
    model: number;
    pattern: number;
    background: number;
  };
  onClose: () => void;
  isClosing: boolean;
}

const OrderConfirmModal: React.FC<OrderConfirmModalProps> = ({
  orderId,
  status,
  purchase,
  price,
  characteristics,
  onClose,
  isClosing,
}) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`${styles.modalOverlay} ${isClosing ? styles.fadeOut : ''}`}
      onClick={handleOverlayClick}
    >
      <div
        className={`${styles.orderModal} ${isClosing ? styles.slideDown : ''}`}
      >
        <button className={styles.closeButton} onClick={onClose}>
          <CloseOutlined />
        </button>

        <h2 className={styles.orderTitle}>Order #{orderId}</h2>

        <div className={styles.orderInfo}>
          <div className={styles.orderRow}>
            <span>Status</span>
            <span className={styles.statusValue}>{status}</span>
          </div>
          <div className={styles.orderRow}>
            <span>Purchase</span>
            <span>{purchase}</span>
          </div>
          <div className={styles.orderRow}>
            <span>Price</span>
            <span className={styles.priceValue}>
              <img className={styles.currency} src={tonImage} alt="ton"></img>{' '}
              {price}
            </span>
          </div>
        </div>

        <div className={styles.characteristicsSection}>
          <h3>GIFT CHARACTERISTICS</h3>
          <div className={styles.characteristicsGrid}>
            <div className={styles.characteristicRow}>
              <span>Model</span>
              <span className={styles.characteristicValue}>
                {characteristics.model}
              </span>
            </div>
            <div className={styles.characteristicRow}>
              <span>Pattern</span>
              <span className={styles.characteristicValue}>
                {characteristics.pattern}
              </span>
            </div>
            <div className={styles.characteristicRow}>
              <span>Background</span>
              <span className={styles.characteristicValue}>
                {characteristics.background}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.helpSection}>
          <span className={styles.helpText}>Need help</span>
          <p className={styles.helpDescription}>
            Check the receipt and characteristics of the gift!
          </p>
        </div>

        <button className={styles.confirmButton}>
          Confirm receipt
          <span className={styles.arrowIcon}>→</span>
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmModal;
