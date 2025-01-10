import React, { useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import styles from './style.module.scss';
import TgsPlayer from './TgsPlayer';
import OrderConfirmModal from './OrderConfirmModal';
import tonImage from '../../public/ton.svg';
interface BuyModalProps {
  item: {
    name: string;
    image: string;
    id: string;
    price: number;
    attributes?: {
      model: { rarity: number };
      backdrop: { rarity: number };
      symbol: { rarity: number };
    };
  };
  onClose: () => void;
  isClosing: boolean;
  isProfile?: boolean;
}

const BuyModal: React.FC<BuyModalProps> = ({
  item,
  onClose,
  isClosing,
  isProfile = false,
}) => {
  const [showOrderConfirm, setShowOrderConfirm] = useState(false);
  const [isOrderClosing, setIsOrderClosing] = useState(false);

  const handleClose = () => {
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleBuyClick = () => {
    setShowOrderConfirm(true);
  };

  const handleCloseOrderConfirm = () => {
    setIsOrderClosing(true);
    setTimeout(() => {
      setShowOrderConfirm(false);
      setIsOrderClosing(false);
    }, 300);
  };

  return (
    <>
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

          <div className={styles.modalImageContainer}>
            <TgsPlayer src={item.image} className={styles.modalImage} />
          </div>
          <h2 className={styles.modalTitle}>{item.name}</h2>
          <div className={styles.modalSubtitle}>
            Collector's gift #{item.id}
          </div>

          <div className={styles.propertyList}>
            {item.attributes && (
              <>
                <div className={styles.propertyItem}>
                  <span>Model</span>
                  <span className={styles.propertyValue}>
                    {item.attributes.model.rarity}
                  </span>
                </div>
                <div className={styles.propertyItem}>
                  <span>Pattern</span>
                  <span className={styles.propertyValue}>
                    {item.attributes.backdrop.rarity}
                  </span>
                </div>
                <div className={styles.propertyItem}>
                  <span>Symbol</span>
                  <span className={styles.propertyValue}>
                    {item.attributes.symbol.rarity}
                  </span>
                </div>
              </>
            )}
            {!isProfile && (
              <div className={styles.propertyItem}>
                <span>Seller</span>
                <span className={styles.propertyValue}>Gifts_seller</span>
              </div>
            )}
          </div>

          {!isProfile && (
            <button className={styles.buyButton} onClick={handleBuyClick}>
              Buy
              <span className={styles.price}>
                <img className={styles.currency} src={tonImage} alt="ton"></img>{' '}
                {item.price}
              </span>
            </button>
          )}
        </div>
      </div>

      {showOrderConfirm && (
        <OrderConfirmModal
          orderId="12991"
          status="Gift sent"
          purchase={item.name}
          price={item.price}
          characteristics={{
            model: 0.02,
            pattern: 0.15,
            background: 0.01,
          }}
          onClose={handleCloseOrderConfirm}
          isClosing={isOrderClosing}
        />
      )}
    </>
  );
};

export default BuyModal;
