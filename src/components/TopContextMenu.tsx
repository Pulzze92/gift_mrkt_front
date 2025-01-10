import React, { useState } from 'react';
import { FilterOutlined } from '@ant-design/icons';
import styles from './style.module.scss';
import FilterModal from './FilterModal';

const TopContextMenu: React.FC<{ title: string; deposit: boolean }> = ({
  title,
  deposit,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleOpenFilters = () => {
    setShowFilters(true);
  };

  const handleCloseFilters = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowFilters(false);
      setIsClosing(false);
    }, 300);
  };

  return (
    <>
      <div className={styles.topContextMenu}>
        <h1 className={styles.title}>{title}</h1>
        {deposit ? (
          <button>Deposit Gift</button>
        ) : (
          <button className={styles.filterButton} onClick={handleOpenFilters}>
            <FilterOutlined />
            <span>Filters</span>
          </button>
        )}
      </div>

      {showFilters && (
        <FilterModal onClose={handleCloseFilters} isClosing={isClosing} />
      )}
    </>
  );
};

export default TopContextMenu;
