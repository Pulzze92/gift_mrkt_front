import React from 'react';
import styles from './style.module.scss';

const BalanceBox: React.FC = () => {
  return (
    <div className={styles.balanceBox}>
      <div className={styles.balanceInfo}>
        <span className={styles.balanceLabel}>Balance:</span>
        <div className={styles.balanceAmount}>
          <span className={styles.amount}>1.34</span>
          <span className={styles.currency}>◊</span>
        </div>
      </div>
      <button className={styles.withdrawButton}>Withdraw</button>
    </div>
  );
};

export default BalanceBox;
