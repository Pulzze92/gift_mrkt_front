import React from 'react';
import { CloseOutlined, MoreOutlined } from '@ant-design/icons';
import styles from './style.module.scss';

const TopMenu: React.FC = () => {
  return (
    <div className={styles.topMenu}>
      <div className={styles.menuButton}>
        <CloseOutlined />
        <span>Close</span>
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
