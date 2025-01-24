import React, { useState, useMemo, useEffect } from 'react';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import styles from './style.module.scss';
import TgsPlayer from './TgsPlayer';
import BackgroundPattern from './BackgroundPattern';
import Router, { Order } from '../api/Router';
import { showToast } from '../utils/toast';
import tonImage from '../assets/ton.svg';
import tetherImage from '../assets/tether.svg';
import trumpImage from '../assets/trump.png';
import notImage from '../assets/not.jpg';
import SellModal from './SellModal';
import PaymentModal from './PaymentModal';
import { usePreventScroll } from '../hooks/usePreventScroll';
import WithdrawInfoModal from './WithdrawInfoModal';
import { useAppStore } from '../store';

interface BuyModalProps {
  gift: {
    id: string;
    name: string;
    number: string;
    price?: number;
    attributes: {
      model: {
        sticker_url: string;
        rarity?: number;
        name?: string;
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
    collection_name: string;
    grade?: string;
  };
  order: Order;
  onClose: () => void;
  isClosing: boolean;
  mode?: string | null;
}

const getCurrencyIcon = (currencyId: string) => {
  switch (currencyId.toUpperCase()) {
    case 'TON':
      return tonImage;
    case 'USDT':
      return tetherImage;
    case 'TRUMP':
      return trumpImage;
    case 'NOT':
      return notImage;
    default:
      return tonImage;
  }
};

const formatPrice = (priceStr: string): string => {
  const cleanPrice = priceStr.replace(/[^\d.]/g, '');
  return cleanPrice || '0';
};

const BuyModal: React.FC<BuyModalProps> = ({
  gift,
  order,
  onClose,
  isClosing,
  mode = 'shop',
}) => {
  usePreventScroll();
  const [showSellModal, setShowSellModal] = useState(false);
  const [showWithdrawInfo, setShowWithdrawInfo] = useState(false);
  const [withdrawResponse, setWithdrawResponse] = useState<any>(null);
  const [paymentResponse, setPaymentResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fetchOrders = useAppStore((state) => state.fetchOrders);

  const symbolPositions = useMemo(
    () =>
      Array.from({ length: 9 }).map(() => ({
        x: Math.random() * 20 - 10,
        y: Math.random() * 20 - 10,
        rotate: Math.random() * 40 - 20,
      })),
    []
  );

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, []);

  const handleWithdraw = async () => {
    try {
      const response = await Router.withdrawGift(gift.id);
      if (response.invoice) {
        return response;
      }
      setShowSellModal(false);
      setShowWithdrawInfo(false);
      onClose();
    } catch (error) {
      setShowSellModal(false);
      setShowWithdrawInfo(false);
      onClose();
    }
  };

  const handleWithdrawClick = () => {
    setShowWithdrawInfo(true);
  };

  const handleSell = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSellModal(true);
  };

  const handleBuy = async () => {
    try {
      setIsLoading(true);
      const response = await Router.generatePaymentUrl(order.id);
      if (response.ok) {
        setPaymentResponse(response);
      } else {
        showToast('Failed to generate payment URL', 'error');
      }
    } catch (error) {
      console.error('Buy error:', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to process payment',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareOrder = async () => {
    const text = `\nI found **${gift.collection_name} #${gift.number}** for **${order.price} TON**.\nCheck it out on **Gift Market!**`;
    const url = `${import.meta.env.VITE_MINIAPP_URL}?startapp=order-${order.id}`;

    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(shareUrl);
    }
  };

  const handleCloseSellModal = () => {
    setShowSellModal(false);
  };

  if (showSellModal) {
    return (
      <SellModal
        gift={gift}
        symbolPositions={symbolPositions}
        onClose={onClose}
      />
    );
  }

  const handleDeactivateOrder = async (
    orderId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (isLoading) return;

    try {
      setIsLoading(true);
      await Router.deactivateOrder(orderId);
      showToast('Order successfully deactivated', 'success');
      await fetchOrders();
      onClose();
    } catch (error) {
      console.error('Deactivation error:', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to deactivate order',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (paymentResponse?.invoice) {
    return (
      <PaymentModal
        isClosing={isClosing}
        onClose={onClose}
        invoice={paymentResponse.invoice}
        message={paymentResponse.message}
      />
    );
  }

  return (
    <div className={`${styles.modalOverlay} ${isClosing ? styles.fadeOut : ''}`}>
      <div
        className={`${styles.modalContent} ${isClosing ? styles.slideDown : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeButtonBuyModal} onClick={onClose}>
          <CloseOutlined />
        </button>

        <div className={styles.giftDetails}>
          <h2>{gift.collection_name}</h2>
          <p className={styles.giftNumber}>Collector's gift #{gift.number}</p>

          <div className={styles.stickerPreview}>
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

          <div className={styles.modalActions}>
            {(mode === 'shop') && gift.price && (
              <>
              <button className={styles.shareOrderButton} onClick={handleShareOrder}>
                Share
              </button>
              <button
                className={styles.buyButton}
                onClick={handleBuy}
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingOutlined />
                ) : (
                  <span className={styles.price}>
                    {gift.price} ${order?.currency.toUpperCase()}
                    <img 
                      src={getCurrencyIcon(order?.currency || 'TON')} 
                      alt={order?.currency_symbol || 'TON'}
                      className={styles.currencyIcon}
                    />
                  </span>
                )}
              </button>
              </>
            )}

            {(mode === 'profile') && (
              <>
                <button
                  className={styles.withdrawButton}
                  onClick={handleWithdrawClick}
                >
                  Withdraw
                </button>
                <button className={styles.sellButton} onClick={handleSell}>
                  Sell
                </button>
              </>
            )}

            {(mode === 'orders') && (
              <>
                <button className={styles.shareOrderButton} onClick={handleShareOrder}>
                  Share
                </button>
                <button
                  className={`${styles.cancelButton}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeactivateOrder(order.id, e);
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoadingOutlined />
                  ) : (
                    'Cancel'
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {showWithdrawInfo && (
        <WithdrawInfoModal
          onClose={() => setShowWithdrawInfo(false)}
          isClosing={isClosing}
          onWithdraw={handleWithdraw}
        />
      )}

      {showSellModal && (
        <SellModal
          gift={gift}
          onClose={() => setShowSellModal(false)}
          isClosing={isClosing}
          onWithdrawClick={() => {
            setShowWithdrawInfo(true);
          }}
          symbolPositions={symbolPositions}
        />
      )}

      {/* {withdrawResponse && (
        <WithdrawModal
          isClosing={isClosing}
          onClose={onClose}
          invoice={withdrawResponse.invoice}
          message={withdrawResponse.message}
        />
      )} */}
    </div>
  );
};

export default BuyModal;
