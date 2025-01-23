import React from 'react';
import styles from './style.module.scss';
import { CloseOutlined } from '@ant-design/icons';
import { usePreventScroll } from '../hooks/usePreventScroll';

interface WithdrawModalProps {
  onClose: () => void;
  isClosing: boolean;
  invoice: {
    amount: number;
    currency: string;
    url: string;
    payment_method: string;
  };
  message: string;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  onClose,
  isClosing,
  invoice,
  message
}) => {
  usePreventScroll();

  return (
    <div className={`${styles.modalOverlay} ${isClosing ? styles.fadeOut : ''}`}>
      <div className={`${styles.modalContent} ${isClosing ? styles.slideDown : ''}`}>
        <button className={styles.closeButtonBuyModal} onClick={onClose}>
          <CloseOutlined />
        </button>

        <div className={styles.withdrawContent}>
          <h2>Withdraw Gift</h2>

          <div className={styles.amountInfo}>
            <span>Service Fee 0.1 TON</span>
          </div>

          <button 
            className={styles.payButton} 
            onClick={() => window.Telegram?.WebApp?.openTelegramLink(invoice.url)}
          >
            Pay {invoice.amount} {invoice.currency}
          </button>

          <p className={styles.disclaimer}>
            {message || 'After payment, our bot will send you your gift'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;
