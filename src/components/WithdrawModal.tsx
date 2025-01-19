import React from 'react';
import styles from './style.module.scss';
import tonImage from '../../public/ton.svg';
import { CloseOutlined } from '@ant-design/icons';
import { usePreventScroll } from '../hooks/usePreventScroll';

interface WithdrawModalProps {
  onClose: () => void;
  isClosing: boolean;
  invoice: string;
  message: string;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  onClose,
  isClosing,
  invoice,
  message
}) => {
  usePreventScroll();

  const handlePay = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openInvoice(invoice);
    }
  };

  return (
    <div className={`${styles.modalOverlay} ${isClosing ? styles.fadeOut : ''}`}>
      <div className={`${styles.modalContent} ${isClosing ? styles.slideDown : ''}`}>
        <button className={styles.closeButtonBuyModal} onClick={onClose}>
          <CloseOutlined />
        </button>

        <div className={styles.withdrawContent}>
          <h2>Withdraw Gift</h2>

          <div className={styles.amountInfo}>
            <span>Service Fee</span>
            <span>0.1 TON</span>
          </div>

          <button className={styles.payButton} onClick={handlePay}>
            Pay 0.1 TON
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
