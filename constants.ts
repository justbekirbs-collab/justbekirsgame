
import { Sponsorship, ShopItem, LocalizedString, ElonItem, BillItem } from './types.ts';

// Defined milestones for subscriber goals
export const MILESTONES = [100, 1000, 10000, 50000, 100000, 500000, 1000000, 10000000, 50000000, 100000000];

export const TRANSLATIONS = {
  en: {
    money: "Money",
    reputation: "Reputation",
    subscribers: "Subscribers",
    videos: "Videos",
    day: "Day",
    uploadVideo: "Upload Video",
    uploadCheat: "Upload Cheat",
    uploadCooking: "Upload Cooking Video",
    brandPromo: "Brand Promotion",
    newProject: "Big Software Project",
    shop: "Shop",
    main: "Home",
    inventory: "Inventory",
    restaurant: "Restaurant",
    settings: "Settings",
    redeem: "Redeem",
    enterCode: "Enter code...",
    owned: "OWNED",
    buy: "BUY",
    sell: "SELL",
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
    footerText: "JustBekir's Game 43",
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
    visit: "Eat",
    active: "Eaten",
    redeemedCodes: "Redeemed Codes",
    // Action Descriptions
    videoBtnDesc: "Coding tutorial. (Reward: ~50 Sub, ~100₺, +2 Rep)",
    promoBtnDesc: "Brand showcase. (Reward: 100 Sub, 10,000₺, +10 Rep)",
    projectBtnDesc: "Massive SAAS. (Reward: 5,000 Sub, 25,000₺, +100 Rep | Cost: 10,000₺)",
    cheatBtnDesc: "Quick growth. (Reward: ~3k Sub, ~10k₺)",
    cookingBtnDesc: "Kitchen VLOG. (Reward: 5,000 Sub, 10,000₺, +50 Rep)",
    uploadedMsg: "uploaded successfully!",
    gained: "Gained",
    elonTitle: "Spend Elon's Money",
    billTitle: "Spend Bill Gates' Money",
    remaining: "Remaining",
    spent: "Spent",
    elonDesc: "Elon just handed you his credit card. Don't worry, it's unlimited (mostly).",
    billDesc: "Bill Gates left his wallet here. Let's see how much good we can do (or buy).",
    adminTitle: "Admin Control Panel",
    adminDesc: "God Mode: Modify your reality.",
    updateStats: "Update Stats",
    unlockAllModes: "Unlock All Modes",
    addAllItems: "Add All Shop Items",
    resetGame: "Hard Reset State",
    activeSponsorLuck: "Active Sponsor Luck",
    deactiveSponsorLuck: "Deactive Sponsor Luck",
    setSponsorLuck: "Sponsor Luck (Multiplier)"
  },
  tr: {
    money: "Para",
    reputation: "İtibar",
    subscribers: "Abone",
    videos: "Videolar",
    day: "Gün",
    uploadVideo: "Video Yükle",
    uploadCheat: "Hileli İçerik",
    uploadCooking: "Yemek Videosu Yükle",
    brandPromo: "Marka Ürün Tanıtımı",
    newProject: "Büyük Yazılım Projesi",
    shop: "Mağaza",
    main: "Ana Sayfa",
    inventory: "Envanter",
    restaurant: "Restoran",
    settings: "Ayarlar",
    redeem: "Kullan",
    enterCode: "Kodu buraya yaz...",
    owned: "ALINDI",
    buy: "SATIN AL",
    sell: "SAT",
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
    brand: "Brand",
    offerPrice: "Teklif",
    details: "Detaylar",
    website: "Web Sitesi",
    bonusMultiplier: "Bonus Çarpanı",
    totalVideos: "Toplam Video",
    subGoal: "Abone Hedefi",
    footerText: "JustBekir's Game 43",
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
    visit: "Yemek Ye",
    active: "Yenildi",
    redeemedCodes: "Kullanılan Kodlar",
    // Action Descriptions
    videoBtnDesc: "Kodlama dersi. (Ödül: ~50 Abone, ~100₺, +2 İtibar)",
    promoBtnDesc: "Ürün tanıtımı. (Ödül: 100 Abone, 10.000₺, +10 İtibar)",
    projectBtnDesc: "Büyük proje. (Ödül: 5.000 Abone, 25.000₺, +100 İtibar | Maliyet: 10.000₺)",
    cheatBtnDesc: "Hızlı büyüme. (Ödül: ~3k Abone, ~10k₺)",
    cookingBtnDesc: "Mutfak VLOG'u. (Ödül: 5.000 Abone, 10.000₺, +50 İtibar)",
    uploadedMsg: "başarıyla yüklendi!",
    gained: "Kazanç",
    elonTitle: "Elon'un Parasını Ez",
    billTitle: "Bill Gates'in Parasını Ez",
    remaining: "Kalan",
    spent: "Harcanan",
    elonDesc: "Elon kredi kartını sana verdi. Merak etme, (neredeyse) sınırsız.",
    billDesc: "Bill Gates cüzdanını burada unutmuş. Ne kadar harcayabiliriz bakalım.",
    adminTitle: "Admin Kontrol Paneli",
    adminDesc: "Tanrı Modu: Gerçekliğini değiştir.",
    updateStats: "İstatistikleri Güncelle",
    unlockAllModes: "Tüm Modları Aç",
    addAllItems: "Add All Shop Items",
    resetGame: "Tüm İlerlemeyi Sıfırla",
    activeSponsorLuck: "Sponsor Şansını Aç",
    deactiveSponsorLuck: "Sponsor Şansını Kapat",
    setSponsorLuck: "Sponsor Şansı (Çarpan)"
  }
};

export const REAL_BRANDS = [
  "MSI", "Sony", "Razer", "Logitech", "JetBrains", "AWS", "DigitalOcean", 
  "Intel", "NVIDIA", "AMD", "ASUS", "Corsair", "SteelSeries", "HyperX", "Elgato", "Shure"
];

export const BRAND_LOGOS: Record<string, string> = {
  "MSI": "https://upload.wikimedia.org/wikipedia/tr/0/05/MSI_logo.png",
  "Sony": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Sony_logo.svg/1200px-Sony_logo.svg.png",
  "Razer": "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Razer_Snake_Logo.svg/1200px-Razer_Snake_Logo.svg.png",
  "Logitech": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Logitech_logo.svg/1200px-Logitech_logo.svg.png",
  "JetBrains": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/JetBrains_Logo_2016.svg/1200px-JetBrains_Logo_2016.svg.png",
  "AWS": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1024px-Amazon_Web_Services_Logo.svg.png",
  "DigitalOcean": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/DigitalOcean_logo.svg/1200px-DigitalOcean_logo.svg.png",
  "Intel": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Intel_logo_%282020%2C_dark_blue%29.svg/1200px-Intel_logo_%282020%2C_dark_blue%29.svg.png",
  "NVIDIA": "https://upload.wikimedia.org/wikipedia/sco/thumb/2/21/Nvidia_logo.svg/1200px-Nvidia_logo.svg.png",
  "AMD": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/AMD_Logo.svg/1200px-AMD_Logo.svg.png",
  "ASUS": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Asus_logo.svg/1200px-Asus_logo.svg.png",
  "Corsair": "https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Corsair_Logo.svg/1200px-Corsair_Logo.svg.png",
  "SteelSeries": "https://upload.wikimedia.org/wikipedia/en/thumb/3/30/SteelSeries_logo.svg/1200px-SteelSeries_logo.svg.png",
  "HyperX": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/HyperX_logo.svg/1200px-HyperX_logo.svg.png",
  "Elgato": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Elgato_logo.svg/1200px-Elgato_logo.svg.png",
  "Shure": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Shure_logo.svg/1200px-Shure_logo.svg.png",
  "ScamGlobal Inc.": "https://img.icons8.com/color/512/pirate.png",
  "YouTube Premium": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/YouTube_Premium_logo.svg/1280px-YouTube_Premium_logo.svg.png",
  "KFC": "https://upload.wikimedia.org/wikipedia/tr/thumb/a/a5/Kentucky_Fried_Chicken_logo.svg/1280px-Kentucky_Fried_Chicken_logo.svg.png",
  "Popeyes": "https://istanbulcevahir.com/wp-content/uploads/2023/02/popeyes-logo.png",
  "Burger King": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Burger_King_2020.svg/2048px-Burger_King_2020.svg.png",
  "Wendy's": "https://upload.wikimedia.org/wikipedia/en/thumb/3/32/Wendy%27s_full_logo_2012.svg/1280px-Wendy%27s_full_logo_2012.svg.png",
  "HD İskender": "https://www.forumkayseri.com/media/image/YS4XOVQXLQQMID.jpg",
  "Kudo Kudo": "https://odoocdn.com/web/image/res.partner/17027629/avatar_1920/Kudo%20Kudo%20Türkiye?unique=12111c8",
  "Domino's": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNovqh1yOCTHErr7yiL8SrAOLQtwqJEmTAjw&s",
  "Starbucks": "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png",
  "Subway": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0Wdjnyoayitz6UbXytlAa-LITVuOXsfg-Ug&s",
  "Doyuyo": "https://www.mallofantalya.com.tr/content/upload/images/large/2025/08/doyuyo_logo.jpg",
  "McDonald's": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/1200px-McDonald%27s_Golden_Arches.svg.png",
  "Bursa Kebap Evi": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTk_jC7JIEA2X8z-4p4Z2lxEJNqHpTjjeQ2tw&s",
  "Planets Pizza": "https://images.squarespace-cdn.com/content/67caec292d79965e1f03863b/f8e95834-0f9a-430c-865f-b5c30091ebb2/hd-logo.png?format=1000w&content-type=image%2Fpng",
  "Little Caesars": "https://images.deliveryhero.io/image/fd-tr/tr-logos/cs2tr-logo.jpg",
  "Maydonoz Döner": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjMJBDAUmz4K-Z63H0Dq-TsgNbXYYsHaJBuA&s",
  "Nebras": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMW39-N0YoeN-OVIUgmNoulOQnfjdlGc0i6A&s",
  "Taco Bell": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLeeXNq1Ns1-jUhc9OPSwQB2-WRZW6mN0SMA&s",
  "Tavuk Dünyası": "https://www.forumkayseri.com/media/image/QPX38VOALVQ9QF.png"
};

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

export const COOKING_VIDEO_TITLES: LocalizedString[] = [
  { en: "Chef Developer: Spicy Pasta", tr: "Yazılımcı Şef: Acılı Makarna" },
  { en: "Late Night Coding Ramen", tr: "Gece Yarısı Kodlama Rameni" },
  { en: "The Ultimate Pancake Recipe", tr: "En İyi Pankek Tarifi" },
  { en: "How to Cook While Coding?", tr: "Kod Yazarken Nasıl Yemek Yapılır?" },
  { en: "Testing 5-Minute Recipes", tr: "5 Dakikalık Tarifleri Deniyoruz" }
];

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: "anonymous",
    name: { en: "Anonymous Mask", tr: "Anonymous Maskesi" },
    price: 500000,
    multiplier: 12.0,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Anonymous_emblem.svg/500px-Anonymous_emblem.svg.png",
    description: { en: "Expect us. Provides ultimate hacking aura. 12.0x multiplier!", tr: "Bizi bekleyin. Nihai hackleme aurası sağlar. 12.0x çarpan!" }
  },
  {
    id: "sony_a7s_iii",
    name: { en: "Sony A7S III", tr: "Sony A7S III" },
    price: 85000,
    multiplier: 2.8,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600",
    description: { en: "Top-tier video quality for your VLOGs. 2.8x multiplier!", tr: "Vloglarınız için üst düzey video kalitesi. 2.8x çarpan!" }
  },
  {
    id: "yt_premium",
    name: { en: "YouTube Premium Subscription", tr: "YouTube Premium Aboneliği" },
    price: 150000,
    multiplier: 5.0,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/YouTube_Premium_logo.svg/1280px-YouTube_Premium_logo.svg.png",
    description: { en: "Removes ads from your life! Massive 5.0x multiplier!", tr: "Hayatından reklamları çıkar! Devasa 5.0x çarpan!" }
  },
  {
    id: "mac_pro",
    name: { en: "Mac Pro", tr: "Mac Pro" },
    price: 350000,
    multiplier: 8.5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4jySZ0hydPWdIpYKKNLrjjhQhCnsMGdCYMg&s",
    description: { en: "The peak of performance. Insane 8.5x multiplier!", tr: "Performansın zirvesi. Çılgın 8.5x çarpan!" }
  },
  {
    id: "mac_studio",
    name: { en: "Mac Studio", tr: "Mac Studio" },
    price: 95000,
    multiplier: 3.2,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwOYbnNNpwBcC3oc6WGAkCv-Dsfriuv3Dd4Q&s",
    description: { en: "Powerhouse in a compact frame. 3.2x multiplier!", tr: "Küçük dev! 3.2x kazanç çarpanı!" }
  },
  {
    id: "rtx5090",
    name: { en: "NVIDIA RTX 5090", tr: "NVIDIA RTX 5090" },
    price: 50000,
    multiplier: 2.0,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=600",
    description: { en: "World's most powerful GPU. 2x multiplier!", tr: "Dünyanın en güçlü ekran kartı. 2x Kazanç Çarpanı!" }
  },
  {
    id: "macbook_pro_m4_max",
    name: { en: "Macbook Pro M4 Max", tr: "MacBook Pro M4 Max" },
    price: 120000,
    multiplier: 4.2,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1kRCeu_N6xFLMDQaENNbRJTMW0EAEuRx02A&s",
    description: { en: "The dream machine for devs. 4.2x multiplier!", tr: "Yazılımcının rüyası. 4.2x Kazanç Çarpanı!" }
  },
  {
    id: "macbook_pro_m4",
    name: { en: "Macbook Pro M4", tr: "MacBook Pro M4" },
    price: 65000,
    multiplier: 2.1,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1kRCeu_N6xFLMDQaENNbRJTMW0EAEuRx02A&s",
    description: { en: "Standard pro performance. 2.1x multiplier!", tr: "Standart pro performansı. 2.1x çarpan!" }
  },
  {
    id: "shure_sm7b",
    name: { en: "Shure SM7B Mic", tr: "Shure SM7B Mikrofon" },
    price: 12000,
    multiplier: 1.7,
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=600",
    description: { en: "Professional studio sound. 1.7x multiplier!", tr: "Profesyonel stüdyo sesi. 1.7x Çarpan!" }
  },
  {
    id: "razer_monitor",
    name: { en: "Razer Monitor", tr: "Razer Monitör" },
    price: 15000,
    multiplier: 1.2,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4jpo4F6nF68jXHuO6jJ6gZIv5uMgmyje9Rg&s",
    description: { en: "High refresh rate. 1.2x multiplier!", tr: "Yüksek yenileme hızı. 1.2x Kazanç Çarpanı!" }
  },
  {
    id: "nintendo_switch_2",
    name: { en: "Nintendo Switch 2", tr: "Nintendo Switch 2" },
    price: 35000,
    multiplier: 1.6,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3sXlCMsEhZ1Q0_d0wZvvApAeVNoFkp78NtA&s",
    description: { en: "The next-gen hybrid console. Huge 1.6x multiplier!", tr: "Yeni nesil hibrit konsol. Devasa 1.6x Kazanç Çarpanı!" }
  },
  {
    id: "mac_mini",
    name: { en: "Mac Mini M4", tr: "Mac Mini M4" },
    price: 22000,
    multiplier: 1.45,
    image: "https://reimg-teknosa-cloud-prod.mncdn.com/mnresize/600/600/productimage/125015730/125015730_0_MC/97060785.jpg",
    description: { en: "Small but mighty. 1.45x multiplier!", tr: "Küçük ama etkili. 1.45x kazanç!" }
  },
  {
    id: "ps5",
    name: { en: "PlayStation 5", tr: "PlayStation 5" },
    price: 25000,
    multiplier: 1.3,
    image: "https://m.media-amazon.com/images/I/619BkvKW35L._SL1500_.jpg",
    description: { en: "The next generation of console gaming. 1.3x multiplier!", tr: "Yeni nesil konsol oyunculuğu. 1.3x Kazanç Çarpanı!" }
  },
  {
    id: "steam_deck",
    name: { en: "Steam Deck", tr: "Steam Deck" },
    price: 28000,
    multiplier: 1.4,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdCmrrhVnj2o3om_G4Rv8A3E2XWwCaWBipXQ&s",
    description: { en: "The ultimate portable PC gaming machine. 1.4x multiplier!", tr: "Mükemmel taşınabilir PC oyun makinesi. 1.4x Kazanç Çarpanı!" }
  }
];

export const ELON_ITEMS: ElonItem[] = [
  { id: 'mac', name: { en: 'Big Mac', tr: 'Big Mac' }, price: 2, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
  { id: 'shoes', name: { en: 'Flip Flops', tr: 'Parmak Arası Terlik' }, price: 3, image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400' },
  { id: 'ps5', name: { en: 'PlayStation 5', tr: 'PlayStation 5' }, price: 499, image: 'https://m.media-amazon.com/images/I/619BkvKW35L._SL1500_.jpg' },
  { id: 'pc', name: { en: 'Gaming PC', tr: 'Gaming PC' }, price: 2500, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400' },
  { id: 'watch', name: { en: 'Rolex', tr: 'Rolex' }, price: 15000, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400' },
  { id: 'tesla', name: { en: 'Tesla Model S', tr: 'Tesla Model S' }, price: 75000, image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400' },
  { id: 'ferrari', name: { en: 'Ferrari F8', tr: 'Ferrari F8' }, price: 250000, image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=400' },
  { id: 'home', name: { en: 'Luxury Home', tr: 'Lüks Ev' }, price: 300000, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400' },
  { id: 'yacht', name: { en: 'Super Yacht', tr: 'Süper Yat' }, price: 7500000, image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=400' },
  { id: 'm1', name: { en: 'M1 Abrams', tr: 'M1 Abrams Tank' }, price: 8000000, image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=400' },
  { id: 'jet', name: { en: 'Private Jet', tr: 'Özel Jet' }, price: 148000000, image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400' },
  { id: 'mona', name: { en: 'Mona Lisa', tr: 'Mona Lisa' }, price: 860000000, image: 'https://images.unsplash.com/photo-1580136608260-4eb11f49a24e?w=400' },
  { id: 'sky', name: { en: 'Skyscraper', tr: 'Gökdelen' }, price: 1200000000, image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400' },
  { id: 'nba', name: { en: 'NBA Team', tr: 'NBA Takımı' }, price: 2500000000, image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=400' },
  { id: 'rocket', name: { en: 'SpaceX Rocket', tr: 'SpaceX Roketi' }, price: 5000000000, image: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=400' }
];

export const BILL_ITEMS: BillItem[] = [
  { id: 'book', name: { en: 'Book', tr: 'Kitap' }, price: 15, image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400' },
  { id: 'xbox', name: { en: 'Xbox Series X', tr: 'Xbox Series X' }, price: 499, image: 'https://images.unsplash.com/photo-1621259182978-f09e5e2ca09a?w=400' },
  { id: 'pc_bill', name: { en: 'Surface Studio', tr: 'Surface Studio' }, price: 3500, image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400' },
  { id: 'don_bill', name: { en: 'Charity Donation', tr: 'Bağış' }, price: 1000000, image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400' },
  { id: 'museum', name: { en: 'Museum', tr: 'Müze' }, price: 50000000, image: 'https://images.unsplash.com/photo-1518998053574-53f1f61f9b86?w=400' },
  { id: 'island', name: { en: 'Private Island', tr: 'Özel Ada' }, price: 150000000, image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400' },
  { id: 'nfl', name: { en: 'NFL Team', tr: 'NFL Takımı' }, price: 4000000000, image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400' },
  { id: 'win_bill', name: { en: 'Microsoft Stake', tr: 'Microsoft Hissesi' }, price: 15000000000, image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400' }
];

export const getKFC_Sponsorship = (): Sponsorship => ({
  id: 'kfc-' + Math.random().toString(36).substr(2, 5),
  brand: "KFC",
  offer: 8000,
  repImpact: 15,
  isScam: false,
  description: { en: "Finger lickin' good deal! Promote our new spicy bucket.", tr: "Parmak ısırtan teklif! Yeni acılı kovamızı tanıt." }
});

export const getPopeyes_Sponsorship = (): Sponsorship => ({
  id: 'popeyes-' + Math.random().toString(36).substr(2, 5),
  brand: "Popeyes",
  offer: 8500,
  repImpact: 12,
  isScam: false,
  description: { en: "Louisiana style chicken! Show off our crunchy tenders.", tr: "Louisiana usulü tavuk! Çıtır tavuklarımızı göster." }
});

export const getBK_Sponsorship = (): Sponsorship => ({
  id: 'bk-' + Math.random().toString(36).substr(2, 5),
  brand: "Burger King",
  offer: 7500,
  repImpact: 10,
  isScam: false,
  description: { en: "The King of Burgers! Promote the Whopper in your video.", tr: "Burgerlerin Kralı! Videonda Whopper tanıtımı yap." }
});

export const getWendys_Sponsorship = (): Sponsorship => ({
  id: 'wendys-' + Math.random().toString(36).substr(2, 5),
  brand: "Wendy's",
  offer: 9000,
  repImpact: 14,
  isScam: false,
  description: { en: "Always fresh, never frozen! Promote our signature square burgers.", tr: "Daima taze, asla dondurulmamış! Kare burgerlerimizi tanıt." }
});

export const getHDIskender_Sponsorship = (): Sponsorship => ({
  id: 'hd-iskender-' + Math.random().toString(36).substr(2, 5),
  brand: "HD İskender",
  offer: 12000,
  repImpact: 20,
  isScam: false,
  description: { en: "Premium traditional taste! Show our masterfully prepared İskender.", tr: "Geleneksel lezzet! Ustalıkla hazırlanan İskender'imizi tanıt." }
});

export const getKudoKudo_Sponsorship = (): Sponsorship => ({
  id: 'kudo-kudo-' + Math.random().toString(36).substr(2, 5),
  brand: "Kudo Kudo",
  offer: 11000,
  repImpact: 18,
  isScam: false,
  description: { en: "Delicious wings and buckets! Share the Kudo Kudo joy with your viewers.", tr: "Lezzetli kanatlar ve kovalar! Kudo Kudo neşesini izleyicilerinle paylaş." }
});

export const getDominos_Sponsorship = (): Sponsorship => ({
  id: 'dominos-' + Math.random().toString(36).substr(2, 5),
  brand: "Domino's",
  offer: 13000,
  repImpact: 22,
  isScam: false,
  description: { en: "Pizza party! Promote our 30-minute delivery guarantee.", tr: "Pizza partisi! 30 dakikada kapında garantimizi tanıt." }
});

export const getStarbucks_Sponsorship = (): Sponsorship => ({
  id: 'starbucks-' + Math.random().toString(36).substr(2, 5),
  brand: "Starbucks",
  offer: 15000,
  repImpact: 30,
  isScam: false,
  description: { en: "Fuel for developers! Show your favorite Starbucks coffee.", tr: "Yazılımcıların yakıtı! En sevdiğin Starbucks kahveni göster." }
});

export const getSubway_Sponsorship = (): Sponsorship => ({
  id: 'subway-' + Math.random().toString(36).substr(2, 5),
  brand: "Subway",
  offer: 10500,
  repImpact: 15,
  isScam: false,
  description: { en: "Eat fresh! Showcase our healthy sub options.", tr: "Taze ye! Sağlıklı sandviç seçeneklerimizi tanıt." }
});

export const getDoyuyo_Sponsorship = (): Sponsorship => ({
  id: 'doyuyo-' + Math.random().toString(36).substr(2, 5),
  brand: "Doyuyo",
  offer: 9500,
  repImpact: 15,
  isScam: false,
  description: { en: "Crispy chicken feast! Show our unique fried buckets in your video.", tr: "Çıtır tavuk ziyafeti! Videonda eşsiz kızarmış kovalarımızı göster." }
});

export const getMcDonalds_Sponsorship = (): Sponsorship => ({
  id: 'mcdonalds-' + Math.random().toString(36).substr(2, 5),
  brand: "McDonald's",
  offer: 11500,
  repImpact: 18,
  isScam: false,
  description: { en: "I'm lovin' it! Show your favorite Big Mac meal.", tr: "İşte bunu seviyorum! En sevdiğin Big Mac menüsünü göster." }
});

export const getBursaKebapEvi_Sponsorship = (): Sponsorship => ({
  id: 'bursa-kebap-evi-' + Math.random().toString(36).substr(2, 5),
  brand: "Bursa Kebap Evi",
  offer: 13500,
  repImpact: 25,
  isScam: false,
  description: { en: "The king of kebab! Promote our legendary Iskender and traditional flavors.", tr: "Kebabın kralı! Efsanevi İskender'imizi ve geleneksel lezzetlerimizi tanıt." }
});

export const getPlanetsPizza_Sponsorship = (): Sponsorship => ({
  id: 'planets-pizza-' + Math.random().toString(36).substr(2, 5),
  brand: "Planets Pizza",
  offer: 12500,
  repImpact: 19,
  isScam: false,
  description: { en: "Out of this world pizza! Show your favorite pizza combo from Planets.", tr: "Dünya dışı lezzet! Planets'ten en sevdiğin pizza menüsünü göster." }
});

export const getLittleCaesars_Sponsorship = (): Sponsorship => ({
  id: 'little-caesars-' + Math.random().toString(36).substr(2, 5),
  brand: "Little Caesars",
  offer: 11000,
  repImpact: 16,
  isScam: false,
  description: { en: "Pizza! Pizza! Promote our hot-n-ready deal.", tr: "Pizza! Pizza! Sıcak-ve-hazır teklifimizi tanıt." }
});

export const getMaydonozDoner_Sponsorship = (): Sponsorship => ({
  id: 'maydonoz-doner-' + Math.random().toString(36).substr(2, 5),
  brand: "Maydonoz Döner",
  offer: 10500,
  repImpact: 17,
  isScam: false,
  description: { en: "The unique herbal taste! Showcase our signature wrap.", tr: "Eşsiz otlu lezzet! İmza dürümümüzü tanıt." }
});

export const getNebras_Sponsorship = (): Sponsorship => ({
  id: 'nebras-' + Math.random().toString(36).substr(2, 5),
  brand: "Nebras",
  offer: 14500,
  repImpact: 28,
  isScam: false,
  description: { en: "Authentic Middle Eastern cuisine! Showcase our signature dishes.", tr: "Otantik Orta Doğu mutfağı! İmza yemeklerimizi tanıt." }
});

export const getTacoBell_Sponsorship = (): Sponsorship => ({
  id: 'taco-bell-' + Math.random().toString(36).substr(2, 5),
  brand: "Taco Bell",
  offer: 11500,
  repImpact: 19,
  isScam: false,
  description: { en: "Live más! Promote our world-famous tacos and burritos.", tr: "Live más! Dünyaca ünlü taco ve burritolarımızı tanıt." }
});

export const getTavukDunyasi_Sponsorship = (): Sponsorship => ({
  id: 'tavuk-dunyasi-' + Math.random().toString(36).substr(2, 5),
  brand: "Tavuk Dünyası",
  offer: 14000,
  repImpact: 24,
  isScam: false,
  description: { en: "Experience the world of chicken! Promote our unique recipes and flavors.", tr: "Tavuğun dünyasını keşfet! Eşsiz tariflerimizi ve lezzetlerimizi tanıt." }
});

export const getYouTubePremium_Sponsorship = (): Sponsorship => ({
  id: 'yt-premium-' + Math.random().toString(36).substr(2, 5),
  brand: "YouTube Premium",
  offer: 100000,
  repImpact: 150,
  isScam: false,
  description: { 
    en: "Exclusive partnership with YouTube! Showcase the benefits of Premium to your community with high rewards.", 
    tr: "YouTube ile özel iş birliği! Premium avantajlarını topluluğuna tanıt, yüksek ödül kazan." 
  }
});

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

export const RESTAURANTS = [
  {
    id: 'tavuk-dunyasi',
    name: "Tavuk Dünyası",
    logo: 'https://www.forumkayseri.com/media/image/QPX38VOALVQ9QF.png',
    price: 1550,
    desc: { en: "The world of chicken! Increases Tavuk Dünyası sponsorship probability.", tr: "Tavuğun dünyası! Tavuk Dünyası sponsorluk ihtimalini arttırır." }
  },
  {
    id: 'taco-bell',
    name: "Taco Bell",
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLeeXNq1Ns1-jUhc9OPSwQB2-WRZW6mN0SMA&s',
    price: 1100,
    desc: { en: "Live más! Increases Taco Bell sponsorship probability.", tr: "Live más! Taco Bell sponsorluk ihtimalini arttırır." }
  },
  {
    id: 'nebras',
    name: "Nebras",
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMW39-N0YoeN-OVIUgmNoulOQnfjdlGc0i6A&s',
    price: 1450,
    desc: { en: "Authentic Middle Eastern cuisine! Increases Nebras sponsorship probability.", tr: "Otantik Orta Doğu mutfağı! Nebras sponsorluk ihtimalini arttırır." }
  },
  {
    id: 'planets-pizza',
    name: "Planets Pizza",
    logo: 'https://images.squarespace-cdn.com/content/67caec292d79965e1f03863b/f8e95834-0f9a-430c-865f-b5c30091ebb2/hd-logo.png?format=1000w&content-type=image%2Fpng',
    price: 1350,
    desc: { en: "Cosmic pizza experience! Increases Planets Pizza sponsorship probability.", tr: "Kozmik pizza deneyimi! Planets Pizza sponsorship probability increases." }
  },
  {
    id: 'little-caesars',
    name: "Little Caesars",
    logo: 'https://images.deliveryhero.io/image/fd-tr/tr-logos/cs2tr-logo.jpg',
    price: 1150,
    desc: { en: "Pizza! Pizza! Increases Little Caesars sponsorship probability.", tr: "Pizza! Pizza! Little Caesars sponsorluk ihtimalini arttırır." }
  },
  {
    id: 'maydonoz-doner',
    name: "Maydonoz Döner",
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjMJBDAUmz4K-Z63H0Dq-TsgNbXYYsHaJBuA&s',
    price: 1100,
    desc: { en: "Legendary herbal flavors! Increases Maydonoz Döner sponsorship probability.", tr: "Efsanevi otlu lezzetler! Maydonoz Döner sponsorluk ihtimalini arttırır." }
  },
  {
    id: 'bursa-kebap-evi',
    name: "Bursa Kebap Evi",
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTk_jC7JIEA2X8z-4p4Z2lxEJNqHpTjjeQ2tw&s',
    price: 1600,
    desc: { en: "Premium traditional taste! Increases Bursa Kebap Evi sponsorship probability.", tr: "Birinci sınıf geleneksel lezzet! Bursa Kebap Evi sponsorluk ihtimalini arttırır." }
  },
  {
    id: 'mcdonalds',
    name: "McDonald's",
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/1200px-McDonald%27s_Golden_Arches.svg.png',
    price: 950,
    desc: { en: "The global icon! Increases McDonald's sponsorship probability.", tr: "Dünya ikonu! McDonald's sponsorluk ihtimalini arttırır." }
  },
  {
    id: 'doyuyo',
    name: 'Doyuyo',
    logo: 'https://www.mallofantalya.com.tr/content/upload/images/large/2025/08/doyuyo_logo.jpg',
    price: 1250,
    desc: { en: 'Crispy chicken and unique flavors! Eating here increases Doyuyo sponsorship probability.', tr: 'Çıtır tavuklar ve eşsiz lezzetler! Burada yemek yemek Doyuyo sponsorluk ihtimalini arttırır.' }
  },
  {
    id: 'kfc',
    name: 'KFC',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/a/a5/Kentucky_Fried_Chicken_logo.svg/1280px-Kentucky_Fried_Chicken_logo.svg.png',
    price: 1000,
    desc: { en: 'Eating here increases KFC sponsorship probability.', tr: 'Burada yemek yemek KFC sponsorluk ihtimalini arttırır.' }
  },
  {
    id: 'dominos',
    name: "Domino's",
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNovqh1yOCTHErr7yiL8SrAOLQtwqJEmTAjw&s',
    price: 1400,
    desc: { en: "Pizza time! Increases Domino's sponsorship probability.", tr: "Pizza zamanı! Domino's sponsorluk ihtimalini arttırır." }
  },
  {
    id: 'starbucks',
    name: "Starbucks",
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png',
    price: 900,
    desc: { en: "Caffeine boost! Increases Starbucks sponsorship probability.", tr: "Kafein deposu! Starbucks sponsorluk ihtimalini arttırır." }
  },
  {
    id: 'subway',
    name: "Subway",
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0Wdjnyoayitz6UbXytlAa-LITVuOXsfg-Ug&s',
    price: 1100,
    desc: { en: "Eat fresh! Increases Subway sponsorship probability.", tr: "Taze ye! Subway sponsorluk ihtimalini arttırır." }
  },
  {
    id: 'popeyes',
    name: 'Popeyes',
    logo: 'https://istanbulcevahir.com/wp-content/uploads/2023/02/popeyes-logo.png',
    price: 1200,
    desc: { en: 'Eating here increases Popeyes sponsorship probability.', tr: 'Burada yemek yemek Popeyes sponsorluk ihtimalini arttırır.' }
  },
  {
    id: 'bk',
    name: 'Burger King',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Burger_King_2020.svg/2048px-Burger_King_2020.svg.png',
    price: 800,
    desc: { en: 'Eating here increases general brand interest and chance for BK deals.', tr: 'Burada yemek yemek genel marka ilgisini ve BK teklifi şansını arttırır.' }
  },
  {
    id: 'wendys',
    name: "Wendy's",
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/32/Wendy%27s_full_logo_2012.svg/1280px-Wendy%27s_full_logo_2012.svg.png',
    price: 1100,
    desc: { en: "Eating here increases Wendy's sponsorship probability.", tr: "Burada yemek yemek Wendy's sponsorluk ihtimalini arttırır." }
  },
  {
    id: 'hd-iskender',
    name: "HD İskender",
    logo: 'https://www.forumkayseri.com/media/image/YS4XOVQXLQQMID.jpg',
    price: 1500,
    desc: { en: "Traditional taste! Eating here increases HD İskender sponsorship probability.", tr: "Geleneksel lezzet! Burada yemek yemek HD İskender sponsorluk ihtimalini arttırır." }
  },
  {
    id: 'kudo-kudo',
    name: "Kudo Kudo",
    logo: 'https://odoocdn.com/web/image/res.partner/17027629/avatar_1920/Kudo%20Kudo%20Türkiye?unique=12111c8',
    price: 1300,
    desc: { en: "Amazing flavors! Eating here increases Kudo Kudo sponsorship probability.", tr: "Harika lezzetler! Burada yemek yemek Kudo Kudo sponsorluk ihtimalini arttırır." }
  }
];
