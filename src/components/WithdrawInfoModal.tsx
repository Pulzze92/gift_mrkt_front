import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import styles from './style.module.scss';
import { usePreventScroll } from '../hooks/usePreventScroll';
import TgsPlayer from './TgsPlayer';
import { showToast } from '../utils/toast';
import withdrawSticker from '../assets/withdraw.tgs';

interface WithdrawInfoModalProps {
  onClose: () => void;
  isClosing: boolean;
  onWithdraw: () => void;
}

const WithdrawInfoModal: React.FC<WithdrawInfoModalProps> = ({ 
  onClose, 
  isClosing,
  onWithdraw
}) => {
  usePreventScroll();

  const handleOpenChat = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink('https://t.me/tg_giftmarket_userbot');
    }
  };

  const handleWithdraw = () => {
    onWithdraw();
    onClose();
    showToast('Your gift is withdrawing', 'success');
  };

  return (
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
  );
};

export default WithdrawInfoModal; 