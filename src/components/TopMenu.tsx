import React from 'react';
import {
  CloseOutlined,
  MoreOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.scss';

interface TopMenuProps {
  backButton?: boolean;
}

const TopMenu: React.FC<TopMenuProps> = ({ backButton = false }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.topMenu}>
      <div className={styles.menuButton}>
        {backButton ? (
          <div className={styles.backButton} onClick={() => navigate('/shop')}>
            <ArrowLeftOutlined />
            <span>Back</span>
          </div>
        ) : (
          <div onClick={() => window.Telegram?.WebApp.close()}>
            <CloseOutlined />
            <span>Close</span>
          </div>
        )}
      </div>
      <div className={styles.logo}>
        <span className={styles.logoText}>Gift</span>
        <span className={styles.beta}>Market</span>
      </div>
      <div className={styles.menuButton}>
        <MoreOutlined />
      </div>
    </div>
  );
};

export default TopMenu;
