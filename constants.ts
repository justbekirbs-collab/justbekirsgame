
import { Sponsorship, ShopItem, LocalizedString } from './types';

export const TRANSLATIONS = {
  en: {
    money: "Money",
    reputation: "Reputation",
    subscribers: "Subscribers",
    videos: "Videos",
    day: "Day",
    uploadVideo: "Upload Video",
    uploadCheat: "Upload Cheat",
    brandPromo: "Brand Promotion",
    newProject: "Big Software Project",
    shop: "Shop",
    main: "Home",
    inventory: "Inventory",
    settings: "Settings",
    redeem: "Redeem",
    enterCode: "Enter code...",
    owned: "OWNED",
    buy: "BUY",
    boost: "BOOST",
    strategy: "Strategy Guide",
    strategyDesc: "Sponsorship offers only come when you upload normal videos. Cheat videos provide quick resources! Be careful with suspicious URLs in sponsorships.",
    gameOver: "GAME OVER!",
    restart: "Start New Career",
    noItems: "No equipment yet.",
    goToShop: "Go to Shop",
    langTr: "Turkish",
    langEn: "English",
    scamWarning: "Suspicious Source",
    accept: "Accept",
    reject: "Reject",
    sponsorshipTitle: "New Offer!",
    brand: "Brand",
    offerPrice: "Offer",
    details: "Details",
    website: "Website",
    bonusMultiplier: "Bonus Multiplier",
    totalVideos: "Total Videos",
    subGoal: "Sub Goal",
    footerText: "DevTube Tycoon",
    itemsOwned: "ITEMS OWNED",
    codeUsed: "Code already used!",
    invalidCode: "Invalid code!",
    codeSuccess: "Code redeemed!",
    langSwitched: "Language switched!",
    saveLoaded: "Progress loaded!",
    scamGameOver: "Fraudulent sponsorship accepted. Channel hacked. Game over!",
    deleteSave: "Delete Local Save",
    confirmWipe: "Wipe save data? All progress will be lost.",
    langHeader: "Language",
    // Action Descriptions
    videoBtnDesc: "Coding tutorial. (Reward: ~50 Sub, ~100₺, +2 Rep)",
    promoBtnDesc: "Brand showcase. (Reward: 100 Sub, 10,000₺, +10 Rep)",
    projectBtnDesc: "Massive SAAS. (Reward: 5,000 Sub, 25,000₺, +100 Rep | Cost: 10,000₺)",
    cheatBtnDesc: "Quick growth. (Reward: ~3k Sub, ~10k₺)",
    uploadedMsg: "uploaded successfully!",
    gained: "Gained"
  },
  tr: {
    money: "Para",
    reputation: "İtibar",
    subscribers: "Abone",
    videos: "Videolar",
    day: "Gün",
    uploadVideo: "Video Yükle",
    uploadCheat: "Hileli İçerik",
    brandPromo: "Marka Ürün Tanıtımı",
    newProject: "Büyük Yazılım Projesi",
    shop: "Mağaza",
    main: "Ana Sayfa",
    inventory: "Envanter",
    settings: "Ayarlar",
    redeem: "Kullan",
    enterCode: "Kodu buraya yaz...",
    owned: "ALINDI",
    buy: "SATIN AL",
    boost: "ÇARPAN",
    strategy: "Strateji Rehberi",
    strategyDesc: "Sponsorluk teklifleri sadece normal videolar attığında gelir. Hileli içerik hızlı kaynak sağlar! Şüpheli URL'lere dikkat et.",
    gameOver: "ELENDİN!",
    restart: "Yeni Kariyer Başlat",
    noItems: "Henüz ekipman yok.",
    goToShop: "Mağazaya Git",
    langTr: "Türkçe",
    langEn: "İngilizce",
    scamWarning: "Şüpheli Kaynak",
    accept: "Kabul Et",
    reject: "Reddet",
    sponsorshipTitle: "Yeni Teklif!",
    brand: "Marka",
    offerPrice: "Teklif",
    details: "Detaylar",
    website: "Web Sitesi",
    bonusMultiplier: "Bonus Çarpanı",
    totalVideos: "Toplam Video",
    subGoal: "Abone Hedefi",
    footerText: "DevTube Tycoon",
    itemsOwned: "EŞYA SAHİBİSİN",
    codeUsed: "Bu kod zaten kullanıldı!",
    invalidCode: "Geçersiz kod!",
    codeSuccess: "Kod kullanıldı!",
    langSwitched: "Dil değiştirildi!",
    saveLoaded: "Kayıt yüklendi!",
    scamGameOver: "Dolandırıcılık sponsorluğu kabul edildi. Kanal hacklendi. Oyun bitti!",
    deleteSave: "Kaydı Sil",
    confirmWipe: "Kaydı silmek istediğine emin misin? Tüm ilerleme kaybolacak.",
    langHeader: "Dil",
    // Action Descriptions
    videoBtnDesc: "Kodlama dersi. (Ödül: ~50 Abone, ~100₺, +2 İtibar)",
    promoBtnDesc: "Ürün tanıtımı. (Ödül: 100 Abone, 10.000₺, +10 İtibar)",
    projectBtnDesc: "Büyük proje. (Ödül: 5.000 Abone, 25.000₺, +100 İtibar | Maliyet: 10.000₺)",
    cheatBtnDesc: "Hızlı büyüme. (Ödül: ~3k Abone, ~10k₺)",
    uploadedMsg: "başarıyla yüklendi!",
    gained: "Kazanç"
  }
};

export const REAL_BRANDS = [
  "MSI", "Sony", "Razer", "Logitech", "JetBrains", "AWS", "DigitalOcean", 
  "Intel", "NVIDIA", "AMD", "ASUS", "Corsair", "SteelSeries", "HyperX", "Elgato", "Shure"
];

export const SCAM_DOMAINS = [
  "xxx.dolandiricilik.com",
  "bedava-para-kazan.net",
  "kumar-777.xyz",
  "hizli-zengin-ol.biz",
  "win-free-money.claim"
];

export const VIDEO_TITLES: LocalizedString[] = [
    { en: "Legendary HTML & CSS Project", tr: "HTML ve CSS ile Efsane Proje" },
    { en: "Why You Should Learn React", tr: "Neden React Öğrenmelisiniz?" },
    { en: "JavaScript vs TypeScript", tr: "JavaScript vs TypeScript" },
    { en: "Developer Routine VLOG", tr: "Bir Günlük Yazılımcı Rutinim" },
    { en: "Music for Coding", tr: "Kod Yazarken Dinlediğim Müzikler" },
    { en: "New Setup Tour!", tr: "Yeni Setup Turu!" },
    { en: "Starting a Huge Project", tr: "Büyük Bir Projeye Başladık" },
    { en: "Where to start coding?", tr: "Yazılıma Nereden Başlamalıyım?" },
    { en: "My VS Code Extensions", tr: "VS Code Eklentilerim" },
    { en: "Salary Reveal!", tr: "Maaşımı Açıklıyorum!" }
];

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: "rtx5090",
    name: { en: "NVIDIA RTX 5090", tr: "NVIDIA RTX 5090" },
    price: 50000,
    multiplier: 2.0,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=600",
    description: { en: "World's most powerful GPU. 2x multiplier!", tr: "Dünyanın en güçlü ekran kartı. 2x Kazanç Çarpanı!" }
  },
  {
    id: "razer_monitor",
    name: { en: "Razer Monitor", tr: "Razer Monitör" },
    price: 15000,
    multiplier: 1.2,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600",
    description: { en: "High refresh rate. 1.2x multiplier!", tr: "Yüksek yenileme hızı. 1.2x Kazanç Çarpanı!" }
  },
  {
    id: "macbook_pro",
    name: { en: "MacBook Pro M4 Max", tr: "MacBook Pro M4 Max" },
    price: 120000,
    multiplier: 3.5,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600",
    description: { en: "The dream machine for devs. 3.5x multiplier!", tr: "Yazılımcının rüyası. 3.5x Kazanç Çarpanı!" }
  },
  {
    id: "sony_a7siii",
    name: { en: "Sony A7S III", tr: "Sony A7S III" },
    price: 85000,
    multiplier: 2.5,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600",
    description: { en: "4K 120 FPS quality. 2.5x multiplier!", tr: "4K 120 FPS ile sinematik kalite. 2.5x Kazanç Çarpanı!" }
  }
];

export const getRandomSponsorship = (isScam: boolean): Sponsorship => {
  const id = Math.random().toString(36).substr(2, 9);
  if (isScam) {
    return {
      id,
      brand: "ScamGlobal Inc.",
      offer: 100000,
      repImpact: -100,
      isScam: true,
      description: { en: "URGENT! Click this link to claim reward!", tr: "ACİL! Hemen bu linke tıkla ve ödülünü al!" },
      url: SCAM_DOMAINS[Math.floor(Math.random() * SCAM_DOMAINS.length)]
    };
  } else {
    const brand = REAL_BRANDS[Math.floor(Math.random() * REAL_BRANDS.length)];
    return {
      id,
      brand,
      offer: 5000,
      repImpact: 10,
      isScam: false,
      description: { en: `New partnership with ${brand}!`, tr: `${brand} ile yeni bir iş birliği fırsatı!` },
    };
  }
};
