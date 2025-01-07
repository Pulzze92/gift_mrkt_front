import React from 'react';
import TopMenu from '../../components/TopMenu';
import TopContextMenu from '../../components/TopContextMenu';
import BottomMenu from '../../components/BottomMenu';
import StoreGrid from '../../components/StoreGrid';

import styles from './style.module.scss';

const StorePage: React.FC = () => {
  return (
    <div className={styles.storePageContainer}>
      <TopMenu />
      <TopContextMenu title="Store" deposit={false} />
      <div className={styles.storeContent}>
        <StoreGrid />
      </div>
      <BottomMenu />
    </div>
  );
};

export default StorePage;
