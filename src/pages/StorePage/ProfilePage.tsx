import React from 'react';
import styles from './style.module.scss';
import TopMenu from '../../components/TopMenu';
import TopContextMenu from '../../components/TopContextMenu';

const ProfilePage: React.FC = () => {
  return (
    <div className={styles.profilePageContainer}>
      <TopMenu backButton={true} />
      <TopContextMenu title="My gifts" deposit={true} />
      <div className={styles.profileHeader}>
        <h1>Profile</h1>
      </div>
    </div>
  );
};

export default ProfilePage;
