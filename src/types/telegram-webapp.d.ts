interface TelegramWebApp {
  close(): void;
  openTelegramLink(url: string): void;
}

interface Window {
  Telegram?: {
    WebApp: TelegramWebApp;
  };
}
