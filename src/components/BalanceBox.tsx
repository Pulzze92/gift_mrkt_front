import React from 'react';
import styles from './style.module.scss';
import tonImage from '../../public/ton.svg';

const BalanceBox: React.FC = () => {
  return (
    <div className={styles.balanceBox}>
      <div className={styles.balanceInfo}>
        <span className={styles.balanceLabel}>Balance:</span>
        <div className={styles.balanceAmount}>
          <span className={styles.amount}>1.34</span>
          <img className={styles.currency} src={tonImage} alt="ton"></img>
        </div>
      </div>
      <button className={styles.withdrawButton}>Withdraw</button>
    </div>
  );
};

export default BalanceBox;
