
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
  guaranteedSponsor?: boolean; // Legacy flag, now replaced by sponsorLuck logic
  sponsorLuck: number; // 0 to 100
  activeRestaurant?: 'kfc' | 'popeyes' | 'bk' | 'wendys' | 'hd-iskender' | 'kudo-kudo' | 'dominos' | 'starbucks' | 'subway' | 'doyuyo' | 'mcdonalds' | 'bursa-kebap-evi' | 'planets-pizza' | 'little-caesars' | 'maydonoz-doner' | 'nebras' | 'taco-bell' | 'tavuk-dunyasi' | null;
  isElonModeUnlocked?: boolean;
  elonPurchases?: Record<string, number>;
  isBillModeUnlocked?: boolean;
  billPurchases?: Record<string, number>;
  isAdminUnlocked?: boolean;
  isGeminiEnabled?: boolean;
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

export interface ElonItem {
  id: string;
  name: LocalizedString;
  price: number;
  image: string;
}

export interface BillItem {
  id: string;
  name: LocalizedString;
  price: number;
  image: string;
}
