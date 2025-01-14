import React, { useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './style.module.scss';
import Router from '../api/Router';
import { useAppStore } from '../store';
import { showToast } from '../utils/toast';
import tonImage from '../../public/ton.svg';
import ErrorToast from '../components/Toast/ErrorToast';

const BalanceBox: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppStore(state => state.user);

  const handleWithdraw = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await Router.withdrawBalance();
      showToast(response.message, response.success ? 'success' : 'error');
      
      if (response.success) {
        const userResponse = await Router.validateUser();
        if (userResponse.ok) {
          useAppStore.getState().setUser(userResponse.data);
        }
      }
    } catch (error) {
      ErrorToast({ message: error.detail || 'Failed to withdraw balance' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.balanceBox}>
      <div className={styles.balanceInfo}>
        <span className={styles.balanceLabel}>Balance:</span>
        <div className={styles.balanceAmount}>
          <span className={styles.amount}>{user?.balance || '0'}</span>
          <span className={styles.currency}>
            <img src={tonImage} alt="ton" width={25} height={25}/>
          </span>
        </div>
      </div>
      <button 
        type="button"
        className={styles.withdrawButton} 
        onClick={handleWithdraw}
        // disabled={isLoading || !user?.balance || Number(user.balance) <= 0}
      >
        {isLoading ? <LoadingOutlined /> : 'Withdraw'}
      </button>
    </div>
  );
};

export default BalanceBox;