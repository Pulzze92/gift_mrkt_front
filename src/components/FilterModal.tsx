import React, { useState, useEffect } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import styles from './style.module.scss';
import { usePreventScroll } from '../hooks/usePreventScroll';
import Router, { Currency } from '../api/Router';
import tonImage from '../assets/ton.svg';
import tetherImage from '../assets/tether.svg';
import trumpImage from '../assets/trump.png';
import notImage from '../assets/not.jpg';
import boltImage from '../assets/bolt.png';

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
  currencies?: string[];
}

const getCurrencyIcon = (currencyId: string) => {
  switch (currencyId.toLowerCase()) {
    case 'ton':
      return tonImage;
    case 'usdt':
      return tetherImage;
    case 'trump':
      return trumpImage;
    case 'not':
      return notImage;
    case 'bolt':
      return boltImage;
      
    default:
      return tonImage;
  }
};

const FilterModal: React.FC<FilterModalProps> = ({
  onClose,
  isClosing,
  onApplyFilters,
  initialValues,
}) => {
  usePreventScroll();
  const [availableCurrencies, setAvailableCurrencies] = useState<Currency[]>([]);
  const [filters, setFilters] = useState<FilterValues>(
    initialValues || {
      priceFrom: '0.05',
      priceTo: '1000',
      orderBy: undefined,
      collectionName: undefined,
      currencies: [],
    }
  );

  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const currencies = await Router.getCurrencies();
        setAvailableCurrencies(currencies);
        if (!filters.currencies?.length) {
          setFilters(prev => ({
            ...prev,
            currencies: currencies.map(c => c.currency_id)
          }));
        }
      } catch (error) {
        console.error('Failed to load currencies:', error);
      }
    };
    loadCurrencies();
  }, []);

  const handleCurrencyToggle = (currencyId: string) => {
    setFilters(prev => {
      const currentCurrencies = prev.currencies || [];
      const newCurrencies = currentCurrencies.includes(currencyId)
        ? currentCurrencies.filter(id => id !== currencyId)
        : [...currentCurrencies, currencyId];
      return {
        ...prev,
        currencies: newCurrencies.length > 0 ? newCurrencies : undefined
      };
    });
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  return (
    <div
      className={`${styles.filterModalOverlay} ${isClosing ? styles.fadeOut : ''}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`${styles.filterModal} ${isClosing ? styles.slideDown : ''}`}
      >
        <button className={styles.closeButtonFilterModal} onClick={onClose}>
          <CloseOutlined />
        </button>

        <h2 className={styles.filterTitle}>Filters</h2>

        <div className={styles.filterSection}>
          <h3>SORT BY</h3>
          <div className={styles.sortOptions}>
            <select
              value={filters.orderBy || ''}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  orderBy: e.target.value as FilterValues['orderBy'],
                }))
              }
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
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, priceFrom: e.target.value }))
                }
                min="0"
                step="0.01"
              />
            </div>
            <div className={styles.priceInput}>
              <label>TO</label>
              <input
                type="number"
                value={filters.priceTo}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, priceTo: e.target.value }))
                }
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <h3>CURRENCY</h3>
          <div className={styles.currencyOptions}>
            {availableCurrencies.map((currency) => (
              <div
                key={currency.currency_id}
                className={`${styles.currencyOption} ${
                  filters.currencies?.includes(currency.currency_id) ? styles.selected : ''
                }`}
                onClick={() => handleCurrencyToggle(currency.currency_id)}
              >
                <img 
                  src={getCurrencyIcon(currency.currency_id)} 
                  alt={currency.currency_symbol}
                  className={styles.currencyIcon} 
                />
                <span className={styles.currencySymbol}>{currency.currency_symbol}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.filterSection}>
          <h3>COLLECTION</h3>
          <input
            type="text"
            placeholder="Enter collection name"
            value={filters.collectionName || ''}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                collectionName: e.target.value,
              }))
            }
            className={styles.collectionInput}
          />
        </div>

        <button
          className={styles.createOrderButton}
          onClick={handleApplyFilters}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterModal;
