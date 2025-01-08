import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import styles from './style.module.scss';

const TopMenu: React.FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
    }
  };

  return (
    <div className={styles.topMenu}>
      <div className={styles.backButton} onClick={handleClose}>
        <ArrowLeftOutlined />
        <span>Close</span>
      </div>
      <div className={styles.logo}>
        <span className={styles.logoText}>Gift Market</span>
        <span className={styles.beta}>beta</span>
      </div>
    </div>
  );
};

export default TopMenu;
