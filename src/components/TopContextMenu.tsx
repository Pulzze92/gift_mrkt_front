import React from 'react';
import { FilterOutlined } from '@ant-design/icons';
import styles from './style.module.scss';

const TopContextMenu: React.FC<{ title: string; deposit: boolean }> = ({
  title,
  deposit,
}) => {
  return (
    <div className={styles.topContextMenu}>
      <h1 className={styles.title}>{title}</h1>
      {deposit ? (
        <button>Deposit Gift</button>
      ) : (
        <button className={styles.filterButton}>
          <FilterOutlined />
          <span>Filters</span>
        </button>
      )}
    </div>
  );
};

export default TopContextMenu;
