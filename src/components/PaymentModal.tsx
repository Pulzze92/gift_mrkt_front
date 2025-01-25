import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import styles from './style.module.scss';
import { usePreventScroll } from '../hooks/usePreventScroll';

interface PaymentModalProps {
  onClose: () => void;
  isClosing: boolean;
  invoice: {
    amount: number;
    currency: string;
    url: string;
  };
  message: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  onClose,
  isClosing,
  invoice,
  message,
}) => {
  usePreventScroll();
  return (
    <div
      className={`${styles.modalOverlay} ${isClosing ? styles.fadeOut : ''}`}
    >
      <div
        className={`${styles.modalContent} ${isClosing ? styles.slideDown : ''}`}
      >
        <button className={styles.closeButtonBuyModal} onClick={onClose}>
          <CloseOutlined />
        </button>

        <div className={styles.withdrawContent}>
          <h2>Payment Details</h2>
          <p>{message}</p>
          <div className={styles.amountInfo}>
            <span>Amount:</span>
            <span>
              {invoice.amount} {invoice.currency.toUpperCase()}
            </span>
          </div>
          <button
            className={styles.payButton}
            // onClick={() => window.open(invoice.url, '_blank')}
            onClick={() => {window.Telegram?.WebApp?.openTelegramLink(invoice.url); onClose()}}
          >
            Pay the invoice
          </button>
          <p className={styles.disclaimer}>
            After successful payment, the gift will be transferred to your
            account
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
