import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import styles from './style.module.scss';
import { usePreventScroll } from '../hooks/usePreventScroll';
import TgsPlayer from './TgsPlayer';
import depositSticker from '../assets/deposit.tgs';

interface DepositModalProps {
  onClose: () => void;
  isClosing: boolean;
}

const DepositModal: React.FC<DepositModalProps> = ({ onClose, isClosing }) => {
  usePreventScroll();

  const handleOpenChat = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink('https://t.me/tg_giftmarket_userbot');
    }
  };

  return (
    <div className={`${styles.modalOverlay} ${isClosing ? styles.fadeOut : ''}`}>
      <div className={`${styles.modalContent} ${isClosing ? styles.slideDown : ''}`}>
        <button className={styles.closeButtonBuyModal} onClick={onClose}>
          <CloseOutlined />
        </button>

        <div className={styles.depositContent}>
          <div className={styles.stickerContainer}>
            <TgsPlayer 
              src={depositSticker}
              className={styles.depositSticker}
              loop={true}
            />
          </div>

          <div className={styles.instructionsList}>
            <div className={styles.instructionItem}>
              <span className={styles.stepNumber}>1</span>
              <span>Open chat with @tg_giftmarket_userbot</span>
            </div>
            <div className={styles.instructionItem}>
              <span className={styles.stepNumber}>2</span>
              <span>Sent a gift that you want to deposit to @tg_giftmarket_userbot</span>
            </div>
            <div className={styles.instructionItem}>
              <span className={styles.stepNumber}>3</span>
              <span>Return to the app and you will see your deposited gift in your profile</span>
            </div>
          </div>

          <button className={styles.chatButton} onClick={handleOpenChat}>
            Go to @tg_giftmarket_userbot
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositModal; 