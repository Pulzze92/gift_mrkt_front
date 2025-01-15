import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TopContextMenu from '../components/TopContextMenu';
import GiftGrid from '../components/GiftGrid';
import LoadingOverlay from '../components/LoadingOverlay';
import { useGifts, useAppStore, useLoading, useError } from '../store';
import BalanceBox from '../components/BalanceBox';
import GiftContextBox from '../components/GiftContextBox';

const ProfilePage: React.FC = () => {
  const gifts = useGifts();
  const isLoading = useLoading();
  const error = useError();
  const fetchGifts = useAppStore(state => state.fetchGifts);
  const location = useLocation();

  useEffect(() => {
    fetchGifts();
  }, [fetchGifts, location]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {isLoading && <LoadingOverlay />}
      <BalanceBox />
      <GiftContextBox />
      <TopContextMenu title="My Gifts" deposit={true} />
      <GiftGrid gifts={gifts} mode="profile" />
    </div>
  );
};

export default ProfilePage;
