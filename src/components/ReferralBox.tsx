import React from 'react';
import styles from './style.module.scss';
import Router from '../api/Router';
import { showToast } from '../utils/toast';
import arrowRef from '../assets/arrowRef.svg';
import { InfoCircleOutlined } from '@ant-design/icons';

const ReferralBox: React.FC = () => {
  const handleGetReferral = async () => {
    try {
      const { ok, data } = await Router.getReferralInfo();
      if (ok && data) {
        const text = `👤 Invite people and get rewarded for their purchases!

You will receive 1.25% of your referral's purchase/sale if their counterparty is also referred by someone else, or 2.5% if they register with the bot without a referral link

⛓️ Your referral links:
\`${data.miniapp_url}\`
\`${data.bot_url}\`

💰 Your balance: 0 TON`;

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
        <img
          className={styles.referralArrow}
          src={arrowRef}
          alt="referral arrow"
        />
      </button>
    </div>
  );
};

export default ReferralBox;
