import React, { useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import styles from './style.module.scss';
import { usePreventScroll } from '../hooks/usePreventScroll';
import TgsPlayer from './TgsPlayer';
import { showToast } from '../utils/toast';
import withdrawSticker from '../assets/withdraw.tgs';
import WithdrawModal from './WithdrawModal';

interface WithdrawInfoModalProps {
  onClose: () => void;
  isClosing: boolean;
  onWithdraw: () => Promise<{
    ok: boolean;
    message: string;
    invoice?: {
      amount: number;
      currency: string;
      url: string;
      payment_method: string;
    };
  }>;
}

const WithdrawInfoModal: React.FC<WithdrawInfoModalProps> = ({ 
  onClose, 
  isClosing,
  onWithdraw
}) => {
  usePreventScroll();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawInvoice, setWithdrawInvoice] = useState('');
  const [withdrawMessage, setWithdrawMessage] = useState('');

  const handleOpenChat = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink('https://t.me/tg_giftmarket_userbot');
    }
  };

  const handleWithdraw = async () => {
    const response = await onWithdraw();
    
    if (response?.invoice) {
      setWithdrawInvoice(response.invoice);
      setWithdrawMessage(response.message || 'Please pay to withdraw your gift');
      setShowWithdrawModal(true);
    }
  };

  return (
    <>
      <div className={`${styles.modalOverlay} ${isClosing ? styles.fadeOut : ''}`}>
        <div className={`${styles.modalContent} ${isClosing ? styles.slideDown : ''}`}>
          <button className={styles.closeButtonBuyModal} onClick={onClose}>
            <CloseOutlined />
          </button>

          <div className={styles.withdrawContent}>
            <div className={styles.stickerContainer}>
              <TgsPlayer 
                src={withdrawSticker}
                className={styles.withdrawSticker} 
              />
            </div>

            <div className={styles.instructionsList}>
              <div className={styles.instructionItem}>
                <span className={styles.stepNumber}>1</span>
                <span>Send "Hello" to @tg_giftmarket_userbot</span>
              </div>
              <div className={styles.instructionItem}>
                <span className={styles.stepNumber}>2</span>
                <span>Press "Withdraw" for the gift you want to withdraw in the app profile</span>
              </div>
              <div className={styles.instructionItem}>
                <span className={styles.stepNumber}>3</span>
                <span>Pay 0.1 $TON for withdraw</span>
              </div>
              <div className={styles.instructionItem}>
                <span className={styles.stepNumber}>4</span>
                <span>Our userbot will send you your gift</span>
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <button className={styles.chatButton} onClick={handleOpenChat}>
                Open chat with @tg_giftmarket_userbot
              </button>
              <button className={styles.withdrawButton} onClick={handleWithdraw}>
                Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>

      {showWithdrawModal && (
        <WithdrawModal
          onClose={() => {
            setShowWithdrawModal(false);
            onClose();
          }}
          isClosing={isClosing}
          invoice={withdrawInvoice}
          message={withdrawMessage}
        />
      )}
    </>
  );
};

export default WithdrawInfoModal; 