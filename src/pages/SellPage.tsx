import React, { useState } from 'react';
import TopContextMenu from '../components/TopContextMenu';
import { useGifts, useFilteredGifts, useLoading, useAppStore } from '../store';
import { FilterValues } from '../components/FilterModal';
import GiftGrid from '../components/GiftGrid';

const SellPage: React.FC = () => {
  const gifts = useGifts();
  const filteredGifts = useFilteredGifts();
  const isLoading = useLoading();
  const setFilteredGifts = useAppStore(state => state.setFilteredGifts);
  const [currentFilters, setCurrentFilters] = useState<FilterValues>({
    priceFrom: '0.05',
    priceTo: '1000'
  });

  const handleApplyFilters = (filters: FilterValues) => {
    setCurrentFilters(filters);
    const filtered = gifts.filter(gift => {
      if (!filters.collectionName) return true;
      return gift.collection_name.toLowerCase().includes(filters.collectionName.toLowerCase());
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
        <div>Loading gifts...</div>
      ) : !filteredGifts ? (
        <div>Error loading gifts</div>
      ) : filteredGifts.length === 0 ? (
        <div>No gifts found</div>
      ) : (
        <GiftGrid gifts={filteredGifts} mode="sell" />
      )}
    </div>
  );
};

export default SellPage;
