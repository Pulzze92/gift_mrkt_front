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
import LoadMore from '../components/LoadMore';
import Router from '../api/Router';

const ITEMS_PER_PAGE = 10;

const ProfilePage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [displayedGifts, setDisplayedGifts] = useState<Gift[]>([]);
  
  const gifts = useGifts();
  const isLoading = useLoading();
  const error = useError();
  const fetchGifts = useAppStore((state) => state.fetchGifts);
  const setGifts = useAppStore((state) => state.setGifts);
  const location = useLocation();
  const [currentFilters, setCurrentFilters] = useState<FilterValues>({
    priceFrom: '0.05',
    priceTo: '1000',
  });
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [isClosingSupport, setIsClosingSupport] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const loadAllGifts = async () => {
      try {
        const response = await Router.getGifts();
        if (Array.isArray(response)) {
          setGifts(response);
          setDisplayedGifts(response.slice(0, ITEMS_PER_PAGE));
          setHasMore(response.length > ITEMS_PER_PAGE);
        }
      } catch (error) {
        console.error('Failed to load gifts:', error);
      }
    };

    loadAllGifts();
  }, [location]);

  useEffect(() => {
    const wasModalClosed = sessionStorage.getItem('supportModalClosed');
    const shouldOpenModal = searchParams.get('support') === 'open' && !wasModalClosed;
    
    if (shouldOpenModal) {
      setShowSupportModal(true);
    }
  }, [searchParams]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const start = (nextPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      
      const nextGifts = gifts.slice(0, end);
      setDisplayedGifts(nextGifts);
      setPage(nextPage);
      
      setHasMore(gifts.length > end);
      setIsLoadingMore(false);
    }
  };

  const handleApplyFilters = (filters: FilterValues) => {
    setCurrentFilters(filters);
    setPage(1);
    setHasMore(true);
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
      {isLoading && page === 1 && <LoadingOverlay />}
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
        <div className={styles.buttonsContainer}>
          <button 
            className={styles.faqButton} 
            onClick={() => {
              if (window.Telegram?.WebApp) {
                window.open('https://telegra.ph/How-to-use-Gift-Market-01-21-2', '_blank');
              }
            }}
          >
            FAQ
          </button>
          <button className={styles.supportButton} onClick={handleOpenSupport}>
            Contact Support
          </button>
        </div>
      </div>

      <GiftContextBox />

      {displayedGifts.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No gifts found</p>
          <p>Deposit your first gift to start trading</p>
        </div>
      ) : (
        <>
          <GiftGrid gifts={displayedGifts} mode="profile" />
          <LoadMore
            onLoadMore={handleLoadMore}
            isLoading={isLoadingMore}
            hasMore={hasMore}
          />
        </>
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
