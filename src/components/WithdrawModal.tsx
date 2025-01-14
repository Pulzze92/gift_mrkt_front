import React from 'react';
import styles from './style.module.scss';
import tonImage from '../../public/ton.svg';
import { CloseOutlined } from '@ant-design/icons';

interface WithdrawModalProps {
  isClosing: boolean;
  onClose: () => void;
  invoice: {
    amount: number;
    currency: string;
    url: string;
    payment_method: string;
  };
  message: string;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isClosing,
  onClose,
  invoice,
  message,
}) => {
  const handleWithdraw = () => {
    window.open(invoice.url, '_blank');
  };

  const roundedAmount = Math.floor(invoice.amount * 1000) / 1000;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        className={`${styles.modalContent} ${isClosing ? styles.slideDown : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={onClose}>
          <CloseOutlined />
        </button>
        
        <div className={styles.withdrawInfo}>
          <div className={styles.amountSection}>
            <div className={styles.amount}>
              <img src={tonImage} alt="TON" className={styles.tonIcon} />
              <span>{roundedAmount}</span>
            </div>
          </div>

          <p className={styles.message}>{message}</p>

          <button 
            className={styles.withdrawButton}
            onClick={handleWithdraw}
          >
            Withdraw gift via Xrocket
          </button>
          
          <p className={styles.disclaimer}>
            By clicking this button you will be redirected to Xrocket
          </p>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal; 