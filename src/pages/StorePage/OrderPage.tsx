import React from 'react'
import styles from './style.module.scss';
import TopMenu from '../../components/TopMenu';
import TopContextMenu from '../../components/TopContextMenu';

function OrderPage() {
  return (
    <div className={styles.orderPageContainer}>
      <TopMenu backButton={true} />
      <TopContextMenu title="My gifts" deposit={true} />
      <div className={styles.profileHeader}>
        <h1>OrderPage</h1>
      </div>
    </div>
  )
}

export default OrderPage