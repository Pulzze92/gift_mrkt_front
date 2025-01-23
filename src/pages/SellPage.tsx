import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TopContextMenu from '../components/TopContextMenu';
import { useGifts, useFilteredGifts, useLoading, useAppStore } from '../store';
import { FilterValues } from '../components/FilterModal';
import GiftGrid from '../components/GiftGrid';
import LoadingOverlay from '../components/LoadingOverlay';
import styles from './style.module.scss';
import Router from '../api/Router';
import LoadMore from '../components/LoadMore';

const ITEMS_PER_PAGE = 10;

const SellPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [displayedGifts, setDisplayedGifts] = useState<Gift[]>([]);
  
  const gifts = useGifts();
  const filteredGifts = useFilteredGifts();
  const isLoading = useLoading();
  const setGifts = useAppStore((state) => state.setGifts);
  const setFilteredGifts = useAppStore((state) => state.setFilteredGifts);
  const location = useLocation();
  const [currentFilters, setCurrentFilters] = useState<FilterValues>({
    priceFrom: '0.05',
    priceTo: '1000',
  });

  useEffect(() => {
    const fetchGiftsToSell = async () => {
      try {
        const giftsData = await Router.getGiftsToSell();
        setGifts(giftsData || []);
        setFilteredGifts(giftsData || []);
        setDisplayedGifts((giftsData || []).slice(0, ITEMS_PER_PAGE));
        setHasMore((giftsData || []).length > ITEMS_PER_PAGE);
      } catch (error) {
        console.error('Failed to fetch gifts:', error);
      }
    };

    fetchGiftsToSell();
  }, [setGifts, setFilteredGifts, location]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const start = (nextPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      
      const nextGifts = filteredGifts.slice(0, end);
      setDisplayedGifts(nextGifts);
      setPage(nextPage);
      
      setHasMore(filteredGifts.length > end);
      setIsLoadingMore(false);
    }
  };

  const handleApplyFilters = (filters: FilterValues) => {
    setCurrentFilters(filters);
    setPage(1);
    setHasMore(true);
    
    const filtered = gifts.filter((gift) => {
      if (!filters.collectionName) return true;
      return gift.collection_name
        .toLowerCase()
        .includes(filters.collectionName.toLowerCase());
    });

    if (filters.orderBy) {
      filtered.sort((a, b) => {
        switch (filters.orderBy) {
          case 'number_asc': return a.number - b.number;
          case 'number_desc': return b.number - a.number;
          default: return 0;
        }
      });
    }

    setFilteredGifts(filtered);
    setDisplayedGifts(filtered.slice(0, ITEMS_PER_PAGE));
    setHasMore(filtered.length > ITEMS_PER_PAGE);
  };

  return (
    <div>
      <TopContextMenu
        title="Select gift to sell"
        deposit={false}
        onApplyFilters={handleApplyFilters}
        currentFilters={currentFilters}
      />
      {isLoading && page === 1 ? (
        <LoadingOverlay />
      ) : displayedGifts.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No gifts found with these filters</p>
          <p>Try adjusting your filter settings</p>
        </div>
      ) : (
        <>
          <GiftGrid gifts={displayedGifts} mode="sell" />
          <LoadMore
            onLoadMore={handleLoadMore}
            isLoading={isLoadingMore}
            hasMore={hasMore}
          />
        </>
      )}
    </div>
  );
};

export default SellPage;
