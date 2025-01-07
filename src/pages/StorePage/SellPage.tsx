import React from 'react'
import styles from './style.module.scss';
import TopMenu from '../../components/TopMenu';
import TopContextMenu from '../../components/TopContextMenu';

function SellPage() {
  return (
    <div className={styles.sellPageContainer}>
      <TopMenu backButton={true} />
      <TopContextMenu title="My gifts" deposit={true} />
      <div className={styles.profileHeader}>
        <h1>SellPage</h1>
      </div>
    </div>
  )
}

export default SellPage