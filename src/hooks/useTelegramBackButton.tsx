import { useEffect } from 'react';

const useTelegramBackButton = (onBack: () => void): void => {
  useEffect(() => {
    if (window.Telegram?.WebApp?.initDataUnsafe.user) {
      const tg = window.Telegram.WebApp;
      tg.BackButton.show();

      tg.BackButton.onClick(onBack);

      return () => {
        tg.BackButton.hide();
        tg.BackButton.offClick(onBack);
      };
    }
  }, [onBack]);
};

export default useTelegramBackButton;
