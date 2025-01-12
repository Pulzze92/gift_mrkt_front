import React from 'react';
import styles from './style.module.scss';
import tonImage from '../../public/ton.svg';
import { useUser } from '../store';

const BalanceBox: React.FC = () => {
  const user = useUser();

  return (
    <div className={styles.balanceBox}>
      <div className={styles.balanceInfo}>
        <span className={styles.balanceLabel}>Balance:</span>
        <div className={styles.balanceAmount}>
          <span className={styles.amount}>{user?.balance || '0'}</span>
          <img className={styles.currency} src={tonImage} alt="ton"></img>
        </div>
      </div>
      <button className={styles.withdrawButton}>Withdraw</button>
    </div>
  );
};

export default BalanceBox;
