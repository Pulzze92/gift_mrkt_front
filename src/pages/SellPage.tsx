import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TopContextMenu from '../components/TopContextMenu';
import { useGifts, useFilteredGifts, useLoading, useAppStore } from '../store';
import { FilterValues } from '../components/FilterModal';
import GiftGrid from '../components/GiftGrid';
import LoadingOverlay from '../components/LoadingOverlay';
import styles from './style.module.scss';
import Router from '../api/Router';

const SellPage: React.FC = () => {
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
      } catch (error) {
        console.error('Failed to fetch gifts:', error);
      }
    };

    fetchGiftsToSell();
  }, [setGifts, setFilteredGifts, location]);

  const handleApplyFilters = (filters: FilterValues) => {
    setCurrentFilters(filters);
    const filtered = gifts.filter((gift) => {
      if (!filters.collectionName) return true;
      return gift.collection_name
        .toLowerCase()
        .includes(filters.collectionName.toLowerCase());
    });

    if (filters.orderBy) {
      filtered.sort((a, b) => {
        switch (filters.orderBy) {
          case 'number_asc':
            return a.number - b.number;
          case 'number_desc':
            return b.number - a.number;
          default:
            return 0;
        }
      });
    }

    setFilteredGifts(filtered);
  };

  return (
    <div>
      <TopContextMenu
        title="Sell Gifts"
        deposit={false}
        onApplyFilters={handleApplyFilters}
        currentFilters={currentFilters}
      />
      {isLoading ? (
        <LoadingOverlay />
      ) : filteredGifts.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No gifts found with these filters</p>
          <p>Try adjusting your filter settings</p>
        </div>
      ) : (
        <GiftGrid gifts={filteredGifts} mode="sell" />
      )}
    </div>
  );
};

export default SellPage;
