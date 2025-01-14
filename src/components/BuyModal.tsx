import React, { useState, useMemo } from 'react';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import styles from './style.module.scss';
import TgsPlayer from './TgsPlayer';
import BackgroundPattern from './BackgroundPattern';
import Router, { Gift } from '../api/Router';
import { showToast } from '../utils/toast';
import tonImage from '../../public/ton.svg';
import axios from 'axios';
import SellModal from './SellModal';
import WithdrawModal from './WithdrawModal';

interface BuyModalProps {
  isClosing: boolean;
  onClose: () => void;
  gift: Gift;
  isShop?: boolean;
}

const BuyModal: React.FC<BuyModalProps> = ({ isClosing, onClose, gift, isShop = false }) => {
  const [isClosingState, setIsClosingState] = useState(isClosing);
  const [isLoading, setIsLoading] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [withdrawResponse, setWithdrawResponse] = useState<{
    ok: boolean;
    message: string;
    invoice?: {
      amount: number;
      currency: string;
      url: string;
      payment_method: string;
    };
  } | null>(null);

  const symbolPositions = useMemo(() => 
    Array.from({ length: 9 }).map(() => ({
      x: Math.random() * 20 - 10,
      y: Math.random() * 20 - 10,
      rotate: Math.random() * 40 - 20,
    })), []
  );

  const handleClose = () => {
    setIsClosingState(true);
    setTimeout(onClose, 300);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleBuy = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await Router.createOrder(gift.id, gift.price || 0);
      
      if (response) {
        showToast('Order created successfully', 'success');
        handleClose();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        showToast(error.response.data.message, 'error');
      } else {
        showToast('Failed to create order', 'error');
      }
      handleClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      const response = await Router.withdrawGift(gift.id);
      setWithdrawResponse(response);
    } catch (error) {
      console.error('Withdraw error:', error);
      showToast(error instanceof Error ? error.message : 'Failed to withdraw gift', 'error');
    }
  };

  return (
    <div
      className={`${styles.modalOverlay} ${isClosingState ? styles.fadeOut : ''}`}
      onClick={handleOverlayClick}
    >
      <div className={`${styles.modalCard} ${isClosingState ? styles.slideDown : ''}`}>
        <button className={styles.closeButton} onClick={handleClose}>
          <CloseOutlined />
        </button>

        <div className={styles.itemPreview}>
          <div className={styles.itemImage}>
            <div
              className={styles.itemBackground}
              style={{
                background: `radial-gradient(
                  circle at center,
                  #${gift.attributes?.backdrop?.center_color?.toString(16) || '000'} 0%,
                  #${gift.attributes?.backdrop?.edge_color?.toString(16) || '000'} 100%
                )`,
              }}
            />
            {gift.attributes?.symbol?.sticker_url && (
              <BackgroundPattern
                stickerUrl={gift.attributes.symbol.sticker_url}
                positions={symbolPositions}
              />
            )}
            {gift.attributes?.model?.sticker_url && (
              <div className={styles.stickerWrapper}>
                <TgsPlayer
                  src={gift.attributes.model.sticker_url}
                  className={styles.tgsPlayer}
                />
              </div>
            )}
          </div>
        </div>

        <div className={styles.itemInfo}>
          <h2>{gift.collection_name || gift.name}</h2>
          <p>#{gift.number}</p>
        </div>

        <div className={styles.actions}>
          {isShop ? (
            <button
              className={styles.buyButtonModal}
              onClick={handleBuy}
              disabled={isLoading}
            >
              {isLoading ? <LoadingOutlined /> : (
                <div className={styles.buyButtonContent}>
                  <span className={styles.buyButtonText}>Buy</span>
                  <div className={styles.price}>
                    <img src={tonImage} alt="ton" className={styles.tonIcon} />
                    <span>{gift.price}</span>
                  </div>
                </div>
              )}
            </button>
          ) : (
            <>
              <button
                className={styles.withdrawButton}
                onClick={handleWithdraw}
                disabled={isLoading}
              >
                {isLoading ? <LoadingOutlined /> : 'Withdraw'}
              </button>
              <button 
                className={styles.sellButton}
                onClick={() => setShowSellModal(true)}
              >
                Sell
              </button>
            </>
          )}
        </div>
      </div>

      {showSellModal && (
        <SellModal
          isClosing={false}
          onClose={() => setShowSellModal(false)}
          gift={gift}
        />
      )}

      {withdrawResponse?.invoice && (
        <WithdrawModal
          isClosing={isClosing}
          onClose={onClose}
          invoice={withdrawResponse.invoice}
          message={withdrawResponse.message}
        />
      )}
    </div>
  );
};

export default BuyModal;
