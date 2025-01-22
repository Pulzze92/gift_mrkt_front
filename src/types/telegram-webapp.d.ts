interface TelegramWebApp {
  close(): void;
  openTelegramLink(url: string): void;
  openLink(url: string): void;
  initDataUnsafe: {
    start_param?: string;
    [key: string]: any;
  };
  initData: string;
  ready(): void;
}

interface Window {
  Telegram?: {
    WebApp: TelegramWebApp;
  };
}
