import React, { useState } from 'react';
import styles from './style.module.scss';
import { useGifts } from '../store';
import DepositModal from './DepositModal';

const GiftContextBox: React.FC = () => {
  const gifts = useGifts();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleOpenDepositModal = () => {
    setShowDepositModal(true);
  };

  const handleCloseDepositModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowDepositModal(false);
      setIsClosing(false);
    }, 300);
  };

  return (
    <>
      <div className={styles.giftContextBox}>
        <div className={styles.giftTitle}>My Gifts ({gifts.length})</div>
        <button className={styles.depositButton} onClick={handleOpenDepositModal}>
          Deposit Gift
        </button>
      </div>

      {showDepositModal && (
        <DepositModal
          onClose={handleCloseDepositModal}
          isClosing={isClosing}
        />
      )}
    </>
  );
};

export default GiftContextBox;
