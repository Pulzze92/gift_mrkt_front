import React, { useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import styles from './style.module.scss';
import { usePreventScroll } from '../hooks/usePreventScroll';
import Router from '../api/Router';
import { showToast } from '../utils/toast';

interface SupportModalProps {
  onClose: () => void;
  isClosing: boolean;
}

const SupportModal: React.FC<SupportModalProps> = ({ onClose, isClosing }) => {
  usePreventScroll();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      showToast('Please enter your message', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await Router.supportRequest({ message });
      showToast('Your message has been sent', 'success');
      onClose();
    } catch (error) {
      showToast('Failed to send message', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.modalOverlay} ${isClosing ? styles.fadeOut : ''}`}>
      <div className={`${styles.modalContent} ${isClosing ? styles.slideDown : ''}`}>
        <button className={styles.closeButtonBuyModal} onClick={onClose}>
          <CloseOutlined />
        </button>

        <div className={styles.supportContent}>
          <h2>Contact Support</h2>
          <textarea
            className={styles.supportInput}
            placeholder="Enter your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
          />
          <button 
            className={styles.sendButton}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportModal; 