import React, { useState, useEffect, useRef } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import styles from './style.module.scss';
import TgsPlayer from './TgsPlayer';
import BackgroundPattern from './BackgroundPattern';
import Router from '../api/Router';
import { showToast } from '../utils/toast';
import { usePreventScroll } from '../hooks/usePreventScroll';

interface SellModalProps {
  gift: {
    id: string;
    name: string;
    number: string;
    collection_name: string;
    attributes: {
      model: {
        sticker_url: string;
        rarity?: number;
      };
      backdrop: {
        center_color: number;
        edge_color: number;
        rarity?: number;
      };
      symbol: {
        sticker_url: string;
        rarity?: number;
      };
    };
    grade?: string;
  };
  onClose: () => void;
  isClosing: boolean;
  symbolPositions: Array<{ x: number; y: number; rotate: number }>;
}

const SellModal: React.FC<SellModalProps> = ({
  gift,
  onClose,
  isClosing,
  symbolPositions,
}) => {
  usePreventScroll();
  const [price, setPrice] = useState<string>('');
  const MIN_PRICE = 0.1;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleFocus = () => {
      document.body.classList.add('input-focused');
      setTimeout(() => {
        window.scrollTo({
          top: inputRef.current?.offsetTop || 0,
          behavior: 'smooth'
        });
      }, 100);
    };

    const handleBlur = () => {
      document.body.classList.remove('input-focused');
      window.scrollTo({ top: 0 });
    };

    const input = inputRef.current;
    input?.addEventListener('focus', handleFocus);
    input?.addEventListener('blur', handleBlur);

    return () => {
      input?.removeEventListener('focus', handleFocus);
      input?.removeEventListener('blur', handleBlur);
    };
  }, []);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (
      value === '' ||
      value === '0' ||
      (!isNaN(Number(value)) &&
        (value.startsWith('0.') || Number(value) >= MIN_PRICE))
    ) {
      setPrice(value);
    }
  };

  const handleCreateOrder = async () => {
    try {
      if (Number(price) < MIN_PRICE) {
        showToast(`Minimum price is ${MIN_PRICE} TON`, 'error');
        return;
      }
      const response = await Router.createOrder(gift.id, Number(price));
      onClose();
      showToast('Order successfully created', 'success');
    } catch (error) {
      console.error('Failed to create order:', error);
      onClose();
      showToast(
        error instanceof Error ? error.message : 'Failed to create order',
        'error'
      );
    }
  };

  return (
    <div
      className={`${styles.modalOverlay} ${isClosing ? styles.fadeOut : ''}`}
    >
      <div
        className={`${styles.sellModal} ${isClosing ? styles.slideDown : ''}`}
      >
        <button className={styles.closeButtonSellModal} onClick={onClose}>
          <CloseOutlined />
        </button>

        <div className={styles.giftDetails}>
          <h2>{gift.collection_name}</h2>
          <p className={styles.giftNumber}>Collector's gift #{gift.number}</p>

          <div className={styles.itemPreview}>
            <div className={styles.itemImage}>
              <div
                className={styles.itemBackground}
                style={{
                  background: `radial-gradient(
                    circle at center,
                    #${gift.attributes.backdrop.center_color.toString(16)} 0%,
                    #${gift.attributes.backdrop.edge_color.toString(16)} 100%
                  )`,
                }}
              />
              {gift.attributes.symbol.sticker_url && (
                <BackgroundPattern
                  stickerUrl={gift.attributes.symbol.sticker_url}
                  positions={symbolPositions}
                />
              )}
              {gift.attributes.model.sticker_url && (
                <div className={styles.stickerWrapper}>
                  <TgsPlayer
                    src={gift.attributes.model.sticker_url}
                    className={styles.tgsPlayer}
                  />
                </div>
              )}
            </div>
          </div>

          <div className={styles.attributesList}>
            <div className={styles.attributeItem}>
              <span className={styles.attributeLabel}>Model</span>
              <span className={styles.attributeValue}>
                {gift.attributes.model?.rarity || 0}%
              </span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeLabel}>Pattern</span>
              <span className={styles.attributeValue}>
                {gift.attributes.symbol?.rarity || 0}%
              </span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeLabel}>Background</span>
              <span className={styles.attributeValue}>
                {gift.attributes.backdrop?.rarity || 0}%
              </span>
            </div>
            {gift.grade && (
              <div className={styles.attributeItem}>
                <span className={styles.attributeLabel}>Rarity</span>
                <span
                  className={`${styles.attributeValue} ${styles[gift.grade.toLowerCase()]}`}
                >
                  {gift.grade}
                </span>
              </div>
            )}
          </div>

          <div className={styles.sellForm}>
            <input
              ref={inputRef}
              type="number"
              placeholder={`Enter TON amount (min ${MIN_PRICE})`}
              value={price}
              onChange={handlePriceChange}
              min={MIN_PRICE}
              step="0.1"
              className={styles.priceInput}
              pattern="[0-9]*"
              inputMode="decimal"
            />
            <button
              className={styles.createOrderButton}
              onClick={handleCreateOrder}
              disabled={!price || Number(price) < MIN_PRICE}
            >
              Create order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellModal;
