import React from 'react';
import styles from './style.module.scss';
import { useGifts } from '../store';

const GiftContextBox: React.FC = () => {
  const gifts = useGifts();

  return (
    <div className={styles.giftContextBox}>
      <div className={styles.giftTitle}>
        My Gifts ({gifts.length})
      </div>
      <button className={styles.depositButton}>Deposit Gift</button>
    </div>
  );
};

export default GiftContextBox;
