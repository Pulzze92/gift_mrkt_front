import React from 'react';
import styles from './style.module.scss';
import Router from '../api/Router';
import { showToast } from '../utils/toast';
import { InfoCircleOutlined } from '@ant-design/icons';

const ReferralBox: React.FC = () => {
  const handleGetReferral = async () => {
    try {
      const { ok, data } = await Router.getReferralInfo();
      if (ok && data) {
        const text = `\nI use 🎁 GiftMarket - a multi-currency gift marketplace.\n\n🎁 GiftMarket takes 5% commission from the seller, if you invite friends you can get up to 2.5% from each of their purchases or sells.
Join using link above and start trading gifts.`;

        if (window.Telegram?.WebApp) {
          const encodedText = encodeURIComponent(text);
          const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(data.miniapp_url)}&text=${encodedText}`;
          window.Telegram.WebApp.openTelegramLink(shareUrl);
        }
      }
    } catch (error) {
      console.error('Failed to get referral link:', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to get referral link',
        'error'
      );
    }
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    showToast('Get rewards for inviting friends', 'info');
  };

  return (
    <div className={styles.referralBox}>
      <div className={styles.referralInfo}>
        <div className={styles.referralLabelWrapper}>
          <span className={styles.referralLabel}>Invite Friends</span>
          {/* <InfoCircleOutlined 
            className={styles.infoIcon} 
            onClick={handleInfoClick}
          /> */}
        </div>
      </div>
      <button className={styles.referralButton} onClick={handleGetReferral}>
        Share Referral Link
      </button>
    </div>
  );
};

export default ReferralBox;
