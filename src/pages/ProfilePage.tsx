import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import TopContextMenu from '../components/TopContextMenu';
import GiftGrid from '../components/GiftGrid';
import LoadingOverlay from '../components/LoadingOverlay';
import { useGifts, useAppStore, useLoading, useError } from '../store';
import BalanceBox from '../components/BalanceBox';
import GiftContextBox from '../components/GiftContextBox';
import { FilterValues } from '../components/FilterModal';
import styles from './style.module.scss';
import ReferralBox from '../components/ReferralBox';
import SupportModal from '../components/SupportModal';

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
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [isClosingSupport, setIsClosingSupport] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const wasModalClosed = sessionStorage.getItem('supportModalClosed');
    const shouldOpenModal = searchParams.get('support') === 'open' && !wasModalClosed;
    
    if (shouldOpenModal) {
      setShowSupportModal(true);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchGifts();
  }, [fetchGifts, location]);

  const handleApplyFilters = (filters: FilterValues) => {
    setCurrentFilters(filters);
  };

  const handleOpenSupport = () => {
    setShowSupportModal(true);
  };

  const handleCloseSupport = () => {
    setIsClosingSupport(true);
    sessionStorage.setItem('supportModalClosed', 'true');
    
    setTimeout(() => {
      setShowSupportModal(false);
      setIsClosingSupport(false);
    }, 300);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.profilePageContainer}>
      {isLoading && <LoadingOverlay />}
      {/* <TopContextMenu
        title="Profile"
        deposit={false}
        onApplyFilters={handleApplyFilters}
        currentFilters={currentFilters}
      /> */}
      <BalanceBox />
      <ReferralBox />
      
      <div className={styles.supportBox}>
        <div className={styles.supportInfo}>
          <span className={styles.supportLabel}>Support</span>
        </div>
        <button className={styles.supportButton} onClick={handleOpenSupport}>
          Contact Support
        </button>
      </div>

      <GiftContextBox />

      {gifts.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No gifts found</p>
          <p>Deposit your first gift to start trading</p>
        </div>
      ) : (
        <GiftGrid gifts={gifts} mode="profile" />
      )}

      {showSupportModal && (
        <SupportModal
          onClose={handleCloseSupport}
          isClosing={isClosingSupport}
        />
      )}
    </div>
  );
};

export default ProfilePage;
