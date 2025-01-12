import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import styles from './style.module.scss';

interface FilterModalProps {
  onClose: () => void;
  isClosing: boolean;
}

const FilterModal: React.FC<FilterModalProps> = ({ onClose, isClosing }) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`${styles.modalOverlay} ${isClosing ? styles.fadeOut : ''}`}
      onClick={handleOverlayClick}
    >
      <div
        className={`${styles.filterModal} ${isClosing ? styles.slideDown : ''}`}
      >
        <button className={styles.closeButton} onClick={onClose}>
          <CloseOutlined />
        </button>

        <h2 className={styles.filterTitle}>Filters</h2>

        <div className={styles.filterSection}>
          <h3>PRICE</h3>
          <div className={styles.priceInputs}>
            <div className={styles.priceInput}>
              <label>FROM</label>
              <input type="number" defaultValue="0.05" min="0" step="0.01" />
            </div>
            <div className={styles.priceInput}>
              <label>TO</label>
              <input type="number" defaultValue="1000" min="0" step="0.01" />
            </div>
          </div>
        </div>

        <div className={styles.filterSection}>
          <h3>TYPE RARE</h3>
          <div className={styles.checkboxList}>
            <label className={styles.checkboxItem}>
              <input type="checkbox" /> Common
            </label>
            <label className={styles.checkboxItem}>
              <input type="checkbox" /> Rare
            </label>
            <label className={styles.checkboxItem}>
              <input type="checkbox" /> Mythical
            </label>
            <label className={styles.checkboxItem}>
              <input type="checkbox" /> Legend
            </label>
          </div>
        </div>

        <div className={styles.filterSection}>
          <h3>TYPE GIFT</h3>
          <div className={styles.checkboxList}>
            <label className={styles.checkboxItem}>
              <input type="checkbox" /> Durov's Cap
            </label>
            <label className={styles.checkboxItem}>
              <input type="checkbox" /> Signet Ring
            </label>
            <label className={styles.checkboxItem}>
              <input type="checkbox" /> Plush Pepe
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
