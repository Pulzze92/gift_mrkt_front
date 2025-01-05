import React from 'react';
import { FilterOutlined } from '@ant-design/icons';
import styles from './style.module.scss';

const TopContextMenu: React.FC = () => {
  return (
    <div className={styles.topContextMenu}>
      <h1 className={styles.title}>Gift store</h1>
      <button className={styles.filterButton}>
        <FilterOutlined />
        <span>Filters</span>
      </button>
    </div>
  );
};

export default TopContextMenu;
