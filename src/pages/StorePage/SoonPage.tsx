import React from 'react'
import TopContextMenu from '../../components/TopContextMenu'
import TopMenu from '../../components/TopMenu'
import styles from './style.module.scss'

function SoonPage() {
  return (
    <div className={styles.soonPageContainer}>
      <TopMenu backButton={true} />
      <TopContextMenu title="My gifts" deposit={true} />
      <div className={styles.profileHeader}>
        <h1>SoonPage</h1>
      </div>
    </div>
  )
}

export default SoonPage