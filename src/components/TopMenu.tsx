import React from 'react';
import styles from './style.module.scss';

interface TopMenuProps {
  backButton?: boolean;
}

const TopMenu: React.FC<TopMenuProps> = () => {
  return (
    <div className={styles.topMenu}>
      <div className={styles.logo}>
        <span className={styles.logoText}>Gift</span>
        <span className={styles.beta}>Market</span>
      </div>
    </div>
  );
};

export default TopMenu;
