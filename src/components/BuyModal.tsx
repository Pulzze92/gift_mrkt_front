import React, { useState, useMemo, useEffect } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import styles from './style.module.scss';
import TgsPlayer from './TgsPlayer';
import BackgroundPattern from './BackgroundPattern';
import Router from '../api/Router';
import { showToast } from '../utils/toast';
import tonImage from '../../public/ton.svg';
import SellModal from './SellModal';
import PaymentModal from './PaymentModal';
import { usePreventScroll } from '../hooks/usePreventScroll';
import WithdrawInfoModal from './WithdrawInfoModal';

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
    collection_name: string;
    grade?: string;
  };
  order: Order;
  onClose: () => void;
  isClosing: boolean;
  isShop?: boolean;
}

const BuyModal: React.FC<BuyModalProps> = ({
  gift,
  order,
  onClose,
  isClosing,
  isShop = false,
}) => {
  usePreventScroll();
  const [showSellModal, setShowSellModal] = useState(false);
  const [showWithdrawInfo, setShowWithdrawInfo] = useState(false);
  const [withdrawResponse, setWithdrawResponse] = useState<any>(null);
  const [paymentResponse, setPaymentResponse] = useState<any>(null);

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
              <span className={styles.attributeLabel}>Model</span>
              <span className={styles.attributeValue}>
                {(gift.attributes?.model?.rarity ?? 0) / 10}%
              </span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeLabel}>Pattern</span>
              <span className={styles.attributeValue}>
                {(gift.attributes?.symbol?.rarity ?? 0) / 10}%
              </span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeLabel}>Background</span>
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
            {isShop && gift.price && (
              <>
              <button className={styles.shareOrderButton} onClick={handleShareOrder}>
                Share
              </button>
              <button className={styles.buyButtonModal} onClick={handleBuy}>
                Buy
                <span className={styles.price}>
                  <img src={tonImage} alt="ton" className={styles.tonIcon} />
                  {gift.price}
                </span>
              </button>
              </>
            )}

            {!isShop && (
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
