import React, { useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import styles from './style.module.scss';

interface FilterModalProps {
  onClose: () => void;
  isClosing: boolean;
  onApplyFilters: (filters: FilterValues) => void;
  initialValues?: FilterValues;
}

export interface FilterValues {
  priceFrom: string;
  priceTo: string;
  orderBy?: 'price_asc' | 'price_desc' | 'number_asc' | 'number_desc';
  collectionName?: string;
}

const FilterModal: React.FC<FilterModalProps> = ({ 
  onClose, 
  isClosing, 
  onApplyFilters,
  initialValues 
}) => {
  const [filters, setFilters] = useState<FilterValues>(initialValues || {
    priceFrom: '0.05',
    priceTo: '1000',
    orderBy: undefined,
    collectionName: undefined
  });

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  return (
    <div
      className={`${styles.modalOverlay} ${isClosing ? styles.fadeOut : ''}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`${styles.filterModal} ${isClosing ? styles.slideDown : ''}`}>
        <button className={styles.closeButton} onClick={onClose}>
          <CloseOutlined />
        </button>

        <h2 className={styles.filterTitle}>Filters</h2>

        <div className={styles.filterSection}>
          <h3>SORT BY</h3>
          <div className={styles.sortOptions}>
            <select
              value={filters.orderBy || ''}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                orderBy: e.target.value as FilterValues['orderBy'] 
              }))}
              className={styles.sortSelect}
            >
              <option value="">Default sorting</option>
              <option value="price_asc">Price ↑</option>
              <option value="price_desc">Price ↓</option>
              <option value="number_asc">Number ↑</option>
              <option value="number_desc">Number ↓</option>
            </select>
          </div>
        </div>

        <div className={styles.filterSection}>
          <h3>PRICE</h3>
          <div className={styles.priceInputs}>
            <div className={styles.priceInput}>
              <label>FROM</label>
              <input
                type="number"
                value={filters.priceFrom}
                onChange={(e) => setFilters(prev => ({ ...prev, priceFrom: e.target.value }))}
                min="0"
                step="0.01"
              />
            </div>
            <div className={styles.priceInput}>
              <label>TO</label>
              <input
                type="number"
                value={filters.priceTo}
                onChange={(e) => setFilters(prev => ({ ...prev, priceTo: e.target.value }))}
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className={styles.filterSection}>
          <h3>COLLECTION</h3>
          <input
            type="text"
            placeholder="Enter collection name"
            value={filters.collectionName || ''}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              collectionName: e.target.value 
            }))}
            className={styles.collectionInput}
          />
        </div>

        <button className={styles.createOrderButton} onClick={handleApplyFilters}>
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterModal;
