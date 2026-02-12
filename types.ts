
export type Language = 'en' | 'tr';

export interface GameState {
  money: number;
  reputation: number;
  subscribers: number;
  videoCount: number;
  day: number;
  isGameOver: boolean;
  gameOverReason: string;
  inventory: string[]; // IDs of items owned
  usedCodes: string[]; // List of promo codes already redeemed
  language: Language;
}

export interface LocalizedString {
  en: string;
  tr: string;
}

export interface ShopItem {
  id: string;
  name: LocalizedString;
  price: number;
  multiplier: number;
  image: string;
  description: LocalizedString;
}

export interface Sponsorship {
  id: string;
  brand: string;
  offer: number;
  repImpact: number;
  isScam: boolean;
  description: LocalizedString;
  url?: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}
