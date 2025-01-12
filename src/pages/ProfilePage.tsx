import React from 'react';
import BalanceBox from '../components/BalanceBox';
import GiftContextBox from '../components/GiftContextBox';
import ProfileGiftGrid from '../components/ProfileGiftGrid';
import { useUser, useLoading, useError } from '../store';

const ProfilePage: React.FC = () => {
  const user = useUser();
  const isLoading = useLoading();
  const error = useError();

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <BalanceBox />
      <GiftContextBox />
      <ProfileGiftGrid />
    </div>
  );
};

export default ProfilePage;
