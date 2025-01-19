declare global {
  interface TelegramWebAppInitData {
    auth_date: string;
    chat_instance: string;
    chat_type: string;
    hash: string;
    signature: string;
    start_param?: string;
    user?: TelegramWebAppUser;
  }

  interface TelegramWebAppUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
  }

  interface BackButton {
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  }

  interface TelegramWebApp {
    initDataUnsafe: {
      user?: TelegramWebAppUser;
      start_param: string;
    };
    telegramIniData: {
      start_param: string;
    };
    initData: TelegramWebAppUser;
    BackButton: BackButton;
    openTelegramLink: (url: string) => void;
    vibrate: (pattern: number[]) => void;
    HapticFeedback?: {
      impactOccurred: (
        style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
      ) => void;
    };
  }

  interface Telegram {
    WebApp: TelegramWebApp;
  }

  interface Window {
    Telegram?: Telegram;
  }

  namespace NodeJS {
    interface ProcessEnv {
      VITE_TRANSACTIONS_WALLET: string;
      VITE_TON_API: string;
    }
  }
}

export {};
