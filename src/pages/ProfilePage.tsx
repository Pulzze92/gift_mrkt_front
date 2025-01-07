import React from 'react';
import styles from './style.module.scss';
import TopMenu from '../components/TopMenu';
import BottomMenu from '../components/BottomMenu';
import BalanceBox from '../components/BalanceBox';
import GiftContextBox from '../components/GiftContextBox';
import ProfileGiftGrid from '../components/ProfileGiftGrid';

const ProfilePage: React.FC = () => {
  return (
    <div className={styles.profilePageContainer}>
      <TopMenu backButton={true} />
      <BalanceBox />
      <GiftContextBox />
      <ProfileGiftGrid />
      <BottomMenu />
    </div>
  );
};

export default ProfilePage;
