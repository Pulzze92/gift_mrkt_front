import React, { useState, useEffect, useRef } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import styles from './style.module.scss';
import TgsPlayer from './TgsPlayer';
import BackgroundPattern from './BackgroundPattern';
import Router from '../api/Router';
import { showToast } from '../utils/toast';
import { usePreventScroll } from '../hooks/usePreventScroll';
import { Currency } from '../api/Router';
import tonImage from '../assets/ton.svg';
import tetherImage from '../assets/tether.svg';
import trumpImage from '../assets/trump.png';
import notImage from '../assets/not.jpg';
import boltImage from '../assets/bolt.png';

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
        name: string;
      };
      backdrop: {
        center_color: number;
        edge_color: number;
        rarity?: number;
        name: string;
      };
      symbol: {
        sticker_url: string;
        rarity?: number;
        name: string;
      };
    };
    grade?: string;
  };
  onClose: () => void;
  isClosing: boolean;
  symbolPositions: Array<{ x: number; y: number; rotate: number }>;
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

const SellModal: React.FC<SellModalProps> = ({
  gift,
  onClose,
  isClosing,
  symbolPositions,
}) => {
  usePreventScroll();
  const [price, setPrice] = useState<string>('');
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const currenciesData = await Router.getCurrencies();
        setCurrencies(currenciesData);
        const tonCurrency = currenciesData.find(c => c.currency_id.toLowerCase() === 'ton');
        setSelectedCurrency(tonCurrency || currenciesData[0]);
      } catch (error) {
        console.error('Failed to load currencies:', error);
        showToast('Failed to load currencies', 'error');
      }
    };

    loadCurrencies();
  }, []);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (
      value === '' ||
      value === '0' ||
      (!isNaN(Number(value)) &&
        (value.startsWith('0.') || Number(value) >= (selectedCurrency?.min_amount_processing || 0)))
    ) {
      setPrice(value);
    }
  };

  const handleCreateOrder = async () => {
    if (!price || !selectedCurrency) return;

    try {
      setIsLoading(true);
      await Router.createOrder(
        gift.id,
        Number(price),
        selectedCurrency.currency_id
      );
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
                    loop={true}
                  />
                </div>
              )}
            </div>
          </div>

          <div className={styles.attributesList}>
            <div className={styles.attributeItem}>
              <span className={styles.attributeLabel}>Model: <b>{gift.attributes?.model?.name}</b></span>
              <span className={styles.attributeValue}>
                {(gift.attributes?.model?.rarity ?? 0) / 10}%
              </span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeLabel}>Pattern: <b>{gift.attributes?.symbol?.name}</b></span>
              <span className={styles.attributeValue}>
                {(gift.attributes?.symbol?.rarity ?? 0) / 10}%
              </span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeLabel}>Background: <b>{gift.attributes?.backdrop?.name}</b></span>
              <span className={styles.attributeValue}>
                {(gift.attributes?.backdrop?.rarity ?? 0) / 10}%
              </span>
            </div>
          </div>

          <div className={styles.sellForm}>
            <div className={styles.inputGroup}>
              <input
                ref={inputRef}
                type="number"
                placeholder={`Enter amount (min ${selectedCurrency?.min_amount_processing || 0})`}
                value={price}
                onChange={handlePriceChange}
                className={styles.priceInput}
                pattern="[0-9]*"
                inputMode="decimal"
              />
              <div className={styles.customSelect} ref={dropdownRef}>
                <div 
                  className={styles.selectedCurrency}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {selectedCurrency && (
                    <>
                      <img 
                        src={getCurrencyIcon(selectedCurrency.currency_id)} 
                        alt={selectedCurrency.currency_symbol}
                        width={20}
                        height={20}
                      />
                      {selectedCurrency.currency_symbol}
                    </>
                  )}
                </div>
                {isDropdownOpen && (
                  <div className={styles.dropdownList}>
                    {currencies.map((currency) => (
                      <div
                        key={currency.currency_id}
                        className={styles.dropdownItem}
                        onClick={() => {
                          setSelectedCurrency(currency);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <img 
                          src={getCurrencyIcon(currency.currency_id)} 
                          alt={currency.currency_symbol}
                          width={20}
                          height={20}
                        />
                        {currency.currency_symbol}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              className={styles.createOrderButton}
              onClick={handleCreateOrder}
              disabled={!price || !selectedCurrency || Number(price) < (selectedCurrency?.min_amount_processing || 0)}
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
