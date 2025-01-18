import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TopContextMenu from '../components/TopContextMenu';
import GiftGrid from '../components/GiftGrid';
import LoadingOverlay from '../components/LoadingOverlay';
import { useGifts, useAppStore, useLoading, useError } from '../store';
import BalanceBox from '../components/BalanceBox';
import GiftContextBox from '../components/GiftContextBox';
import { FilterValues } from '../components/FilterModal';
import styles from './style.module.scss';
import ReferralBox from '../components/ReferralBox';

const ProfilePage: React.FC = () => {
  const gifts = useGifts();
  const isLoading = useLoading();
  const error = useError();
  const fetchGifts = useAppStore((state) => state.fetchGifts);
  const location = useLocation();
  const [currentFilters, setCurrentFilters] = useState<FilterValues>({
    priceFrom: '0.05',
    priceTo: '1000',
  });

  useEffect(() => {
    fetchGifts();
  }, [fetchGifts, location]);

  const handleApplyFilters = (filters: FilterValues) => {
    setCurrentFilters(filters);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {isLoading && <LoadingOverlay />}
      <BalanceBox />
      <GiftContextBox />
      <ReferralBox />
      <TopContextMenu
        title="Profile"
        deposit={false}
        onApplyFilters={handleApplyFilters}
        currentFilters={currentFilters}
      />
      {gifts.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No gifts found with these filters</p>
          <p>Try adjusting your filter settings</p>
        </div>
      ) : (
        <GiftGrid gifts={gifts} mode="profile" />
      )}
    </div>
  );
};

export default ProfilePage;
