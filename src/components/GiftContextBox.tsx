import React from 'react';
import styles from './style.module.scss';

const GiftContextBox: React.FC = () => {
  return (
    <div className={styles.giftContextBox}>
      <div className={styles.giftTitle}>My Gifts</div>
      <button className={styles.depositButton}>Deposit Gift</button>
    </div>
  );
};

export default GiftContextBox;
