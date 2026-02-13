import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { GameState, Sponsorship, Notification, ShopItem, Language, ElonItem, BillItem } from './types';
import { 
  VIDEO_TITLES, 
  COOKING_VIDEO_TITLES, 
  getRandomSponsorship, 
  getKFC_Sponsorship, 
  getPopeyes_Sponsorship, 
  getBK_Sponsorship, 
  getWendys_Sponsorship, 
  getHDIskender_Sponsorship, 
  getKudoKudo_Sponsorship,
  getDominos_Sponsorship,
  getStarbucks_Sponsorship,
  getSubway_Sponsorship,
  getDoyuyo_Sponsorship,
  getMcDonalds_Sponsorship,
  getBursaKebapEvi_Sponsorship,
  getPlanetsPizza_Sponsorship,
  getLittleCaesars_Sponsorship,
  getMaydonozDoner_Sponsorship,
  getYouTubePremium_Sponsorship,
  SHOP_ITEMS, 
  TRANSLATIONS, 
  RESTAURANTS,
  ELON_ITEMS,
  BILL_ITEMS
} from './constants';
import StatsBar from './components/StatsBar';
import NotificationSystem from './components/NotificationSystem';
import SponsorshipDialog from './components/SponsorshipDialog';

const INITIAL_STATE: GameState = {
  money: 10000, 
  reputation: 50,
  subscribers: 0,
  videoCount: 0,
  day: 1,
  isGameOver: false,
  gameOverReason: '',
  inventory: [],
  usedCodes: [],
  language: 'en',
  guaranteedSponsor: false,
  sponsorLuck: 35, // 35% default
  activeRestaurant: null,
  isElonModeUnlocked: false,
  elonPurchases: {},
  isBillModeUnlocked: false,
  billPurchases: {},
  isAdminUnlocked: false
};

const ELON_BUDGET = 9999999999999999999999999999999999999999999;
const BILL_BUDGET = 9999999999999999999999999999999999999999999;

const SAVE_KEY = "devtube_tycoon_bin_v1";
const XOR_KEY = 0xAA;

const encryptSave = (data: GameState): string => {
  const json = JSON.stringify(data);
  const encoder = new TextEncoder();
  const uint8 = encoder.encode(json);
  const encrypted = new Uint8Array(uint8.length);
  for (let i = 0; i < uint8.length; i++) {
    encrypted[i] = uint8[i] ^ XOR_KEY;
  }
  let binaryString = '';
  for (let i = 0; i < encrypted.byteLength; i++) {
    binaryString += String.fromCharCode(encrypted[i]);
  }
  return btoa(binaryString);
};

const decryptSave = (data: string): GameState | null => {
  try {
    const binaryString = atob(data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i) ^ XOR_KEY;
    }
    const decoder = new TextDecoder();
    const json = decoder.decode(bytes);
    const parsed = JSON.parse(json);
    if (typeof parsed.money !== 'number' || !Array.isArray(parsed.inventory)) return null;
    return parsed;
  } catch (e) {
    return null;
  }
};

const MILESTONES = [1000, 10000, 50000, 100000, 500000, 1000000, 10000000, 50000000, 100000000];

const App: React.FC = () => {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeSponsor, setActiveSponsor] = useState<Sponsorship | null>(null);
  const [currentTab, setCurrentTab] = useState<'main' | 'gemini' | 'elon' | 'bill' | 'shop' | 'inventory' | 'restaurant' | 'settings' | 'admin'>('main');
  const [promoCode, setPromoCode] = useState('');
  
  // Admin Panel Temporary State
  const [adminMoney, setAdminMoney] = useState<string>('');
  const [adminSubs, setAdminSubs] = useState<string>('');
  const [adminRep, setAdminRep] = useState<string>('');

  // Gemini State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const t = TRANSLATIONS[state.language];

  const multipliers = useMemo(() => {
    let totalMult = 1.0;
    state.inventory.forEach(itemId => {
      const item = SHOP_ITEMS.find(i => i.id === itemId);
      if (item) {
        totalMult *= item.multiplier;
      }
    });
    return { subMult: totalMult, moneyMult: totalMult };
  }, [state.inventory]);

  const currentMilestone = useMemo(() => {
    return MILESTONES.find(m => m > state.subscribers) || 999999999;
  }, [state.subscribers]);

  const elonStats = useMemo(() => {
    let spent = 0;
    Object.entries(state.elonPurchases || {}).forEach(([id, qty]) => {
      const item = ELON_ITEMS.find(i => i.id === id);
      if (item) spent += item.price * (qty as number);
    });
    return { spent, remaining: ELON_BUDGET - spent };
  }, [state.elonPurchases]);

  const billStats = useMemo(() => {
    let spent = 0;
    Object.entries(state.billPurchases || {}).forEach(([id, qty]) => {
      const item = BILL_ITEMS.find(i => i.id === id);
      if (item) spent += item.price * (qty as number);
    });
    return { spent, remaining: BILL_BUDGET - spent };
  }, [state.billPurchases]);

  const addNotification = useCallback((message: string, type: Notification['type'] = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      const loaded = decryptSave(saved);
      if (loaded) {
        setState(loaded);
        addNotification(TRANSLATIONS[loaded.language].saveLoaded, 'success');
      }
    }
  }, [addNotification]);

  useEffect(() => {
    if (!state.isGameOver) {
      localStorage.setItem(SAVE_KEY, encryptSave(state));
    }
  }, [state]);

  const handleGeminiLab = async () => {
    if (!aiPrompt.trim() || isAiLoading) return;
    setIsAiLoading(true);

    const hasSecretCode = aiPrompt.toLowerCase().includes('justbekirai2014');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `I want to add this to my DevTube Tycoon game: "${aiPrompt}"`,
        config: {
          systemInstruction: `You are the Game Master for "DevTube Tycoon". 
          The user wants to "add" a feature or change something. 
          Respond in ${state.language === 'tr' ? 'Turkish' : 'English'}.
          
          RULES:
          1. DO NOT give resources (money, subscribers, reputation) by default.
          2. DO NOT upload videos or increment video counts by default.
          3. Only describe the new "feature" added to the game session context.
          
          EXCEPTION:
          If the prompt contains the secret code "justbekirai2014", you are allowed to give ANY amount of resources, money, or reputation, and you CAN upload videos.
          
          Always return JSON with:
          - message: A funny context-aware message describing the feature added.
          - subs: subscribers to add (0 if no secret code).
          - money: money to add (0 if no secret code).
          - rep: reputation change (0 if no secret code).
          - specialFeatureDesc: a short description of the simulated feature.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              message: { type: Type.STRING },
              subs: { type: Type.NUMBER },
              money: { type: Type.NUMBER },
              rep: { type: Type.NUMBER },
              specialFeatureDesc: { type: Type.STRING }
            },
            required: ["message", "subs", "money", "rep", "specialFeatureDesc"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      
      const finalSubs = hasSecretCode ? (data.subs || 0) : 0;
      const finalMoney = hasSecretCode ? (data.money || 0) : 0;
      const finalRep = hasSecretCode ? (data.rep || 0) : 0;

      setState(prev => ({
        ...prev,
        subscribers: prev.subscribers + finalSubs,
        money: prev.money + finalMoney,
        reputation: prev.reputation + finalRep,
        videoCount: hasSecretCode && (data.subs > 0 || data.money > 0) ? prev.videoCount + 1 : prev.videoCount
      }));

      addNotification(`${data.message}`, 'success');
      if (data.specialFeatureDesc) {
        addNotification(`Feature Added: ${data.specialFeatureDesc}`, 'info');
      }
      setAiPrompt('');
    } catch (error) {
      console.error(error);
      addNotification("AI Connection error!", "error");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAction = (type: 'video' | 'cheat' | 'promo' | 'project' | 'cooking') => {
    if (state.isGameOver) return;

    let subGain = 0;
    let moneyGain = 0;
    let repGain = 0;
    let cost = 0;    let msg = "";

    const currentSponsorChance = state.sponsorLuck / 100;

    switch (type) {
      case 'video': {
        const title = VIDEO_TITLES[Math.floor(Math.random() * VIDEO_TITLES.length)][state.language];
        subGain = (Math.floor(Math.random() * 50) + 20) * multipliers.subMult;
        moneyGain = (Math.floor(Math.random() * 100) + 50) * multipliers.moneyMult;
        repGain = 2;
        msg = `"${title}" ${t.uploadedMsg}`;
        if (Math.random() < currentSponsorChance) {
          const isScam = Math.random() < 0.2;
          const isRare = Math.random() < 0.05;
          setTimeout(() => {
            if (isRare && !isScam) {
              setActiveSponsor(getYouTubePremium_Sponsorship());
            } else {
              setActiveSponsor(getRandomSponsorship(isScam));
            }
          }, 800);
        }
        break;
      }
      case 'cooking': {
        const title = COOKING_VIDEO_TITLES[Math.floor(Math.random() * COOKING_VIDEO_TITLES.length)][state.language];
        subGain = 5000 * multipliers.subMult;
        moneyGain = 10000 * multipliers.moneyMult;
        repGain = 50;
        msg = `"${title}" ${t.uploadedMsg}`;
        
        let foodSponsorChance = state.activeRestaurant ? (currentSponsorChance * 1.7) : currentSponsorChance;
        if (foodSponsorChance > 1) foodSponsorChance = 1.0;

        if (Math.random() < foodSponsorChance) {
          setTimeout(() => {
            if (Math.random() < 0.03) {
              setActiveSponsor(getYouTubePremium_Sponsorship());
              return;
            }

            if (state.activeRestaurant === 'kfc') setActiveSponsor(getKFC_Sponsorship());
            else if (state.activeRestaurant === 'popeyes') setActiveSponsor(getPopeyes_Sponsorship());
            else if (state.activeRestaurant === 'bk') setActiveSponsor(getBK_Sponsorship());
            else if (state.activeRestaurant === 'wendys') setActiveSponsor(getWendys_Sponsorship());
            else if (state.activeRestaurant === 'hd-iskender') setActiveSponsor(getHDIskender_Sponsorship());
            else if (state.activeRestaurant === 'kudo-kudo') setActiveSponsor(getKudoKudo_Sponsorship());
            else if (state.activeRestaurant === 'dominos') setActiveSponsor(getDominos_Sponsorship());
            else if (state.activeRestaurant === 'starbucks') setActiveSponsor(getStarbucks_Sponsorship());
            else if (state.activeRestaurant === 'subway') setActiveSponsor(getSubway_Sponsorship());
            else if (state.activeRestaurant === 'doyuyo') setActiveSponsor(getDoyuyo_Sponsorship());
            else if (state.activeRestaurant === 'mcdonalds') setActiveSponsor(getMcDonalds_Sponsorship());
            else if (state.activeRestaurant === 'bursa-kebap-evi') setActiveSponsor(getBursaKebapEvi_Sponsorship());
            else if (state.activeRestaurant === 'planets-pizza') setActiveSponsor(getPlanetsPizza_Sponsorship());
            else if (state.activeRestaurant === 'little-caesars') setActiveSponsor(getLittleCaesars_Sponsorship());
            else if (state.activeRestaurant === 'maydonoz-doner') setActiveSponsor(getMaydonozDoner_Sponsorship());
            else {
              const roll = Math.random();
              // Total 15 restaurants (0.066 each approx)
              if (roll < 0.06) setActiveSponsor(getKFC_Sponsorship());
              else if (roll < 0.12) setActiveSponsor(getPopeyes_Sponsorship());
              else if (roll < 0.18) setActiveSponsor(getBK_Sponsorship());
              else if (roll < 0.24) setActiveSponsor(getWendys_Sponsorship());
              else if (roll < 0.30) setActiveSponsor(getHDIskender_Sponsorship());
              else if (roll < 0.36) setActiveSponsor(getKudoKudo_Sponsorship());
              else if (roll < 0.42) setActiveSponsor(getDominos_Sponsorship());
              else if (roll < 0.48) setActiveSponsor(getStarbucks_Sponsorship());
              else if (roll < 0.54) setActiveSponsor(getSubway_Sponsorship());
              else if (roll < 0.60) setActiveSponsor(getDoyuyo_Sponsorship());
              else if (roll < 0.66) setActiveSponsor(getMcDonalds_Sponsorship());
              else if (roll < 0.72) setActiveSponsor(getBursaKebapEvi_Sponsorship());
              else if (roll < 0.78) setActiveSponsor(getPlanetsPizza_Sponsorship());
              else if (roll < 0.84) setActiveSponsor(getLittleCaesars_Sponsorship());
              else setActiveSponsor(getMaydonozDoner_Sponsorship());
            }
          }, 800);
        }
        break;
      }
      case 'cheat':
        subGain = (Math.floor(Math.random() * 5000) + 1000) * multipliers.subMult;
        moneyGain = (Math.floor(Math.random() * 15000) + 5000) * multipliers.moneyMult;
        repGain = 0; 
        msg = `${t.uploadCheat}!`;
        if (Math.random() < (currentSponsorChance * 0.5)) {
           setTimeout(() => setActiveSponsor(getRandomSponsorship(Math.random() < 0.1)), 800);
        }
        break;
      case 'promo':
        subGain = 100 * multipliers.subMult;
        moneyGain = 10000 * multipliers.moneyMult;
        repGain = 10;
        msg = `${t.brandPromo}!`;
        break;
      case 'project':
        cost = 10000;
        if (state.money < cost) {
          addNotification(state.language === 'tr' ? "Yetersiz Bakiye!" : "Not enough money!", "error");
          return;
        }
        subGain = 5000 * multipliers.subMult;
        moneyGain = 25000 * multipliers.moneyMult;
        repGain = 100;
        msg = `${t.newProject}!`;
        break;
    }

    setState(prev => ({
      ...prev,
      subscribers: prev.subscribers + Math.floor(subGain),
      money: prev.money + Math.floor(moneyGain) - cost,
      reputation: prev.reputation + repGain,
      videoCount: prev.videoCount + 1,
      day: prev.day + 1
    }));

    addNotification(msg, type === 'cheat' ? 'warning' : 'success');
  };

  const handleRedeemCode = () => {
    const code = promoCode.trim().toLowerCase();
    if (!code) return;

    if (code === 'en' || code === 'tr') {
      const newLang = code as Language;
      setState(prev => ({ ...prev, language: newLang }));
      addNotification(TRANSLATIONS[newLang].langSwitched, 'success');
      setPromoCode('');
      return;
    }

    if (state.usedCodes.includes(code)) {
      addNotification(t.codeUsed, "warning");
      setPromoCode('');
      return;
    }

    let update: Partial<GameState> = {};
    let success = false;

    if (code === 'justbekirinf2014') {
      update = { money: 999999999, subscribers: 999999999, reputation: 1000 };
      success = true;
    } else if (code === 'elonmusknet') {
      update = { money: state.money + 1000000000 };
      success = true;
    } else if (code === 'billgatesnet') {
      update = { money: state.money + 500000000 };
      success = true;
    } else if (code === 'justbekirsponsor2014') {
      update = { sponsorLuck: 100 };
      success = true;
    } else if (code === 'decode2014') {
      update = { sponsorLuck: 35 };
      success = true;
    } else if (code === 'justbekirelon2014') {
      update = { isElonModeUnlocked: true };
      success = true;
    } else if (code === 'justbekirbillgates2014') {
      update = { isBillModeUnlocked: true };
      success = true;
    } else if (code === 'justbekirpre2014') {
      if (!state.inventory.includes('yt_premium')) {
        update = { inventory: [...state.inventory, 'yt_premium'] };
      }
      success = true;
    } else if (code === 'justbekiradminpanel2014') {
      update = { isAdminUnlocked: true };
      success = true;
    }

    if (success) {
      setState(prev => ({ ...prev, ...update, usedCodes: [...prev.usedCodes, code] }));
      addNotification(t.codeSuccess, "success");
      setPromoCode('');
    } else {
      addNotification(t.invalidCode, "error");
    }
  };

  const buyItem = (item: ShopItem) => {
    if (state.money < item.price) {
      addNotification(state.language === 'tr' ? "Yetersiz Bakiye!" : "Not enough money!", "error");
      return;
    }
    if (state.inventory.includes(item.id)) return;

    setState(prev => ({
      ...prev,
      money: prev.money - item.price,
      inventory: [...prev.inventory, item.id]
    }));
    addNotification(`${item.name[state.language]} ${t.buy}!`, "success");
  };

  const handleElonAction = (id: string, type: 'buy' | 'sell') => {
    const item = ELON_ITEMS.find(i => i.id === id);
    if (!item) return;

    setState(prev => {
      const currentQty = prev.elonPurchases?.[id] || 0;
      const newQty = type === 'buy' ? currentQty + 1 : Math.max(0, currentQty - 1);
      const newPurchases: Record<string, number> = { ...(prev.elonPurchases || {}), [id]: newQty };
      let totalSpent = 0;
      Object.entries(newPurchases).forEach(([itemId, qty]) => {
        const it = ELON_ITEMS.find(i => i.id === itemId);
        if (it) totalSpent += it.price * (qty as number);
      });
      if (totalSpent > ELON_BUDGET) return prev;
      return { ...prev, elonPurchases: newPurchases };
    });
  };

  const handleBillAction = (id: string, type: 'buy' | 'sell') => {
    const item = BILL_ITEMS.find(i => i.id === id);
    if (!item) return;

    setState(prev => {
      const currentQty = prev.billPurchases?.[id] || 0;
      const newQty = type === 'buy' ? currentQty + 1 : Math.max(0, currentQty - 1);
      const newPurchases: Record<string, number> = { ...(prev.billPurchases || {}), [id]: newQty };
      let totalSpent = 0;
      Object.entries(newPurchases).forEach(([itemId, qty]) => {
        const it = BILL_ITEMS.find(i => i.id === itemId);
        if (it) totalSpent += it.price * (qty as number);
      });
      if (totalSpent > BILL_BUDGET) return prev;
      return { ...prev, billPurchases: newPurchases };
    });
  };

  const eatAtRestaurant = (restaurant: typeof RESTAURANTS[0]) => {
    if (state.money < restaurant.price) {
      addNotification(state.language === 'tr' ? "Yetersiz Bakiye!" : "Not enough money!", "error");
      return;
    }
    setState(prev => ({ 
      ...prev, 
      money: prev.money - restaurant.price,
      activeRestaurant: restaurant.id as any 
    }));
    addNotification(`${restaurant.name} ${t.visit}!`, 'success');
  };

  const onAcceptSponsor = (sponsor: Sponsorship) => {
    if (sponsor.isScam) {
      setState(prev => ({ ...prev, isGameOver: true, gameOverReason: t.scamGameOver }));
    } else {
      setState(prev => ({
        ...prev,
        money: prev.money + sponsor.offer,
        reputation: prev.reputation + sponsor.repImpact
      }));
      addNotification(`${sponsor.brand} ${t.accept}!`, 'success');
    }
    setActiveSponsor(null);
  };

  const handleAdminUpdateStats = () => {
    setState(prev => ({
      ...prev,
      money: adminMoney !== '' ? parseInt(adminMoney) : prev.money,
      subscribers: adminSubs !== '' ? parseInt(adminSubs) : prev.subscribers,
      reputation: adminRep !== '' ? parseInt(adminRep) : prev.reputation,
    }));
    addNotification("Admin: Stats updated.", "success");
  };

  if (state.isGameOver) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-8 text-center z-[500] animate-fade-in">
        <h1 className="text-5xl font-black text-red-500 mb-4 uppercase animate-pop-in">{t.gameOver}</h1>
        <p className="text-xl text-slate-300 mb-8">{state.gameOverReason}</p>
        <button onClick={() => { localStorage.removeItem(SAVE_KEY); setState(INITIAL_STATE); }} className="px-8 py-3 bg-white text-slate-950 font-bold rounded-full hover:bg-slate-200 transition-colors uppercase tracking-widest active-shrink">{t.restart}</button>
      </div>
    );
  }

  const tabs = [
    { id: 'main', label: t.main },
    { id: 'gemini', label: 'Gemini Lab', icon: '✨' },
    { id: 'shop', label: t.shop },
    ...(state.isElonModeUnlocked ? [{ id: 'elon', label: t.elonTitle, icon: '💰' }] : []),
    ...(state.isBillModeUnlocked ? [{ id: 'bill', label: t.billTitle, icon: '💳' }] : []),
    { id: 'inventory', label: t.inventory },
    { id: 'restaurant', label: t.restaurant },
    { id: 'settings', label: t.settings },
    ...(state.isAdminUnlocked ? [{ id: 'admin', label: 'Admin', icon: '🛡️' }] : [])
  ];

  return (
    <div className="h-screen bg-slate-950 text-slate-200 flex flex-col overflow-hidden sm:text-base text-sm">
      <StatsBar state={state} />
      <NotificationSystem notifications={notifications} />

      {activeSponsor && (
        <SponsorshipDialog 
          sponsor={activeSponsor} 
          language={state.language}
          onAccept={onAcceptSponsor} 
          onReject={() => setActiveSponsor(null)} 
        />
      )}

      {/* Tabs Navigation */}
      <nav className="flex justify-center flex-wrap gap-1 sm:gap-4 p-2 sm:p-4 bg-slate-900 border-b border-slate-800 shrink-0 animate-slide-down">
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setCurrentTab(tab.id as any)}
            className={`px-3 py-2 rounded-xl font-bold transition-all text-[10px] sm:text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-slate-800 active-shrink ${currentTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="flex-1 overflow-y-auto p-4 flex flex-col items-center w-full">
        
        {currentTab === 'main' && (
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pb-12 animate-slide-up">
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm hover-lift">
                <h2 className="text-xs font-bold mb-4 uppercase text-slate-400 tracking-widest">{t.subGoal}</h2>
                <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${Math.min(100, (state.subscribers / currentMilestone) * 100)}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] mt-2 font-bold text-slate-500">
                  <span>{state.subscribers.toLocaleString()}</span>
                  <span>{currentMilestone.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 text-center shadow-sm hover-lift">
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{t.totalVideos}</p>
                  <p className="text-xl font-black text-white">{state.videoCount}</p>
                </div>
                <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 text-center shadow-sm hover-lift">
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{t.boost}</p>
                  <p className="text-xl font-black text-emerald-400">x{multipliers.moneyMult.toFixed(1)}</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm border-l-4 border-l-blue-500 hover-lift">
                <h2 className="text-[10px] font-black mb-2 uppercase text-blue-400 tracking-widest">{t.strategy}</h2>
                <p className="text-xs text-slate-400 leading-relaxed italic">
                  {t.strategyDesc}
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm hover-lift">
                <h2 className="text-[10px] font-bold mb-3 uppercase text-slate-500 tracking-widest">{t.redeem}</h2>
                <div className="flex gap-2">
                  <input 
                    type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)}
                    placeholder={t.enterCode}
                    onKeyDown={(e) => e.key === 'Enter' && handleRedeemCode()}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-white transition-all"
                  />
                  <button onClick={handleRedeemCode} className="bg-blue-600 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-500 transition-all active-shrink">{t.redeem}</button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={() => handleAction('video')} className="p-6 bg-blue-600 hover:bg-blue-500 rounded-3xl font-black uppercase shadow-lg active-shrink transition-all text-white flex flex-col items-center gap-1 hover-lift">
                <span className="text-xl">{t.uploadVideo}</span>
                <span className="text-[9px] opacity-60 normal-case font-normal tracking-wider">{t.videoBtnDesc}</span>
              </button>
              <button onClick={() => handleAction('cooking')} className="p-4 bg-orange-600 hover:bg-orange-500 rounded-3xl font-black uppercase shadow-lg active-shrink transition-all text-white flex flex-col items-center gap-1 hover-lift">
                <span className="text-sm">{t.uploadCooking}</span>
                <span className="text-[8px] opacity-60 normal-case font-normal tracking-wider">{t.cookingBtnDesc}</span>
              </button>
              <button onClick={() => handleAction('promo')} className="p-4 bg-indigo-600 hover:bg-indigo-500 rounded-3xl font-black uppercase shadow-md active-shrink transition-all text-white flex flex-col items-center gap-1 hover-lift">
                <span className="text-sm">{t.brandPromo}</span>
                <span className="text-[8px] opacity-60 normal-case font-normal tracking-wider">{t.promoBtnDesc}</span>
              </button>
              <button onClick={() => handleAction('project')} className="p-4 bg-emerald-600 hover:bg-emerald-500 rounded-3xl font-black uppercase shadow-md active-shrink transition-all text-white flex flex-col items-center gap-1 hover-lift">
                <span className="text-sm">{t.newProject}</span>
                <span className="text-[8px] opacity-60 normal-case font-normal tracking-wider">{t.projectBtnDesc}</span>
              </button>
              <button onClick={() => handleAction('cheat')} className="p-4 bg-amber-900/10 border border-dashed border-amber-500/50 rounded-3xl text-amber-500 font-bold active-shrink transition-all uppercase flex flex-col items-center gap-1 hover-lift">
                <span className="text-sm">{t.uploadCheat}</span>
                <span className="text-[8px] opacity-60 normal-case font-normal tracking-wider">{t.cheatBtnDesc}</span>
              </button>
            </div>
          </div>
        )}

        {currentTab === 'gemini' && (
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden animate-slide-up">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl pointer-events-none rounded-full animate-pulse"></div>
            <div className="flex items-center gap-4 mb-2">
               <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg animate-bounce">✨</div>
               <div>
                 <h2 className="text-2xl font-black uppercase text-white tracking-tight">Gemini AI Lab</h2>
                 <p className="text-xs text-slate-400 font-medium italic">"Tell Gemini what to add..."</p>
               </div>
            </div>
            <div className="space-y-4">
              <textarea 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder={state.language === 'tr' ? "Sadece özellik ekleyebilir. Kaynak veremez. (Kodsuz)" : "Can only add features. Cannot give resources without code."}
                className="w-full h-32 bg-slate-800 border-2 border-slate-700 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500 text-white resize-none transition-all placeholder:text-slate-500"
              />
              <button onClick={handleGeminiLab} disabled={isAiLoading || !aiPrompt.trim()} className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all relative overflow-hidden active-shrink group ${isAiLoading ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] text-white'}`}>
                {isAiLoading ? "AI IS THINKING..." : "EXECUTE PROMPT"}
              </button>
            </div>
          </div>
        )}

        {currentTab === 'elon' && (
          <div className="w-full max-w-6xl flex flex-col gap-6 pb-20 animate-slide-up">
            <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md p-6 border border-slate-800 rounded-3xl shadow-xl flex flex-col items-center gap-2">
              <h2 className="text-2xl font-black text-white uppercase">{t.elonTitle}</h2>
              <div className="text-3xl font-black text-emerald-400 tabular-nums animate-pulse">
                $ {elonStats.remaining.toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">{t.elonDesc}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {ELON_ITEMS.map(item => {
                const qty = state.elonPurchases?.[item.id] || 0;
                return (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover-lift animate-fade-in">
                    <img src={item.image} className="h-32 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-white text-sm uppercase">{item.name[state.language]}</h4>
                        <span className="text-emerald-400 text-xs font-black">$ {item.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleElonAction(item.id, 'sell')} disabled={qty === 0} className="flex-1 py-2 bg-red-600/20 border border-red-500/50 text-red-500 text-[10px] font-black rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-20 active-shrink">{t.sell}</button>
                        <div className="w-12 text-center text-sm font-black text-white">{qty}</div>
                        <button onClick={() => handleElonAction(item.id, 'buy')} disabled={elonStats.remaining < item.price} className="flex-1 py-2 bg-emerald-600/20 border border-red-500/50 text-emerald-500 text-[10px] font-black rounded-lg hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-20 active-shrink">{t.buy}</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentTab === 'bill' && (
          <div className="w-full max-w-6xl flex flex-col gap-6 pb-20 animate-slide-up">
            <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md p-6 border border-slate-800 rounded-3xl shadow-xl flex flex-col items-center gap-2">
              <h2 className="text-2xl font-black text-white uppercase">{t.billTitle}</h2>
              <div className="text-3xl font-black text-blue-400 tabular-nums animate-pulse">
                $ {billStats.remaining.toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">{t.billDesc}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {BILL_ITEMS.map(item => {
                const qty = state.billPurchases?.[item.id] || 0;
                return (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover-lift animate-fade-in">
                    <img src={item.image} className="h-32 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-white text-sm uppercase">{item.name[state.language]}</h4>
                        <span className="text-blue-400 text-xs font-black">$ {item.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleBillAction(item.id, 'sell')} disabled={qty === 0} className="flex-1 py-2 bg-red-600/20 border border-red-500/50 text-red-500 text-[10px] font-black rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-20 active-shrink">{t.sell}</button>
                        <div className="w-12 text-center text-sm font-black text-white">{qty}</div>
                        <button onClick={() => handleBillAction(item.id, 'buy')} disabled={billStats.remaining < item.price} className="flex-1 py-2 bg-blue-600/20 border border-red-500/50 text-blue-500 text-[10px] font-black rounded-lg hover:bg-blue-500 hover:text-white transition-all disabled:opacity-20 active-shrink">{t.buy}</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentTab === 'admin' && (
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8 pb-20 animate-slide-up">
             <div className="flex items-center gap-4 mb-2">
               <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">🛡️</div>
               <div>
                 <h2 className="text-2xl font-black uppercase text-white tracking-tight">{t.adminTitle}</h2>
                 <p className="text-xs text-slate-400 font-medium italic">{t.adminDesc}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest">Resources</h3>
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Set Money (₺)</label>
                    <input type="number" value={adminMoney} onChange={(e) => setAdminMoney(e.target.value)} placeholder={state.money.toString()} className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Set Subscribers</label>
                    <input type="number" value={adminSubs} onChange={(e) => setAdminSubs(e.target.value)} placeholder={state.subscribers.toString()} className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Set Reputation</label>
                    <input type="number" value={adminRep} onChange={(e) => setAdminRep(e.target.value)} placeholder={state.reputation.toString()} className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <button onClick={handleAdminUpdateStats} className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold uppercase text-xs tracking-widest transition-all text-white shadow-lg active-shrink">{t.updateStats}</button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest">Features & Modes</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-slate-800 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.setSponsorLuck}</label>
                      <span className="text-xs font-black text-white">{state.sponsorLuck}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={state.sponsorLuck} 
                      onChange={(e) => setState(prev => ({ ...prev, sponsorLuck: parseInt(e.target.value) }))}
                      className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                  </div>
                  <button onClick={() => setState(prev => ({ ...prev, isElonModeUnlocked: true, isBillModeUnlocked: true }))} className="py-3 bg-emerald-600/20 border border-emerald-500/50 text-emerald-500 rounded-xl font-bold uppercase text-xs hover:bg-emerald-600 hover:text-white transition-all active-shrink">{t.unlockAllModes}</button>
                  <button onClick={() => setState(prev => ({ ...prev, inventory: SHOP_ITEMS.map(i => i.id) }))} className="py-3 bg-purple-600/20 border border-purple-500/50 text-purple-500 rounded-xl font-bold uppercase text-xs hover:bg-purple-600 hover:text-white transition-all active-shrink">{t.addAllItems}</button>
                  <button onClick={() => { localStorage.removeItem(SAVE_KEY); setState(INITIAL_STATE); }} className="py-3 bg-red-600/20 border border-red-500/50 text-red-500 rounded-xl font-bold uppercase text-xs hover:bg-red-600 hover:text-white transition-all active-shrink">{t.resetGame}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'shop' && (
          <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20 animate-slide-up">
            {SHOP_ITEMS.map(item => {
              const owned = state.inventory.includes(item.id);
              return (
                <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-sm group hover-lift animate-fade-in">
                  <div className="h-44 overflow-hidden"><img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.name[state.language]} /></div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-bold text-white mb-2 text-lg uppercase tracking-tight">{item.name[state.language]}</h3>
                    <p className="text-xs text-slate-400 mb-6 flex-1 leading-relaxed">{item.description[state.language]}</p>
                    <button onClick={() => buyItem(item)} disabled={owned} className={`w-full py-3 rounded-xl font-bold transition-all uppercase text-xs tracking-widest active-shrink ${owned ? 'bg-slate-800 text-slate-500' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'}`}>
                      {owned ? t.owned : `${item.price.toLocaleString()} ₺`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {currentTab === 'inventory' && (
          <div className="w-full max-w-4xl pb-20 animate-slide-up">
            {state.inventory.length === 0 ? (
              <div className="py-24 text-center border-2 border-dashed border-slate-800 rounded-3xl text-slate-500 italic uppercase tracking-widest text-xs animate-fade-in">{t.noItems}</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {state.inventory.map(id => {
                  const item = SHOP_ITEMS.find(i => i.id === id);
                  return item && (
                    <div key={id} className="bg-slate-900 p-5 rounded-3xl border border-slate-800 flex flex-col items-center text-center shadow-sm hover-lift animate-pop-in">
                      <div className="w-16 h-16 rounded-xl overflow-hidden mb-3"><img src={item.image} className="w-full h-full object-cover" /></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-white uppercase tracking-tighter leading-tight">{item.name[state.language]}</span>
                        <span className="text-[8px] text-blue-400 mt-1 uppercase font-black">x{item.multiplier} BOOST</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {currentTab === 'restaurant' && (
          <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-6 pb-20 animate-slide-up">
            {RESTAURANTS.map(res => (
              <div key={res.id} className={`bg-slate-900 border ${state.activeRestaurant === res.id ? 'border-orange-500 shadow-orange-500/20 shadow-lg' : 'border-slate-800'} rounded-3xl p-6 flex flex-col items-center text-center transition-all hover-lift animate-fade-in`}>
                <div className="w-24 h-24 mb-4 flex items-center justify-center bg-white rounded-full p-2 overflow-hidden shadow-inner"><img src={res.logo} className="w-full h-full object-contain" /></div>
                <h3 className="text-xl font-black text-white uppercase mb-1">{res.name}</h3>
                <p className="text-emerald-400 font-bold mb-4 text-sm">{res.price.toLocaleString()} ₺</p>
                <p className="text-xs text-slate-400 mb-6 flex-1 italic">{res.desc[state.language]}</p>
                <button onClick={() => eatAtRestaurant(res)} className={`w-full py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all active-shrink ${state.activeRestaurant === res.id ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                  {state.activeRestaurant === res.id ? t.active : t.visit}
                </button>
              </div>
            ))}
          </div>
        )}

        {currentTab === 'settings' && (
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8 shadow-xl animate-slide-up">
            <h2 className="text-xl font-black uppercase text-white tracking-widest">{t.settings}</h2>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.langHeader}</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setState(p => ({ ...p, language: 'en' }))} className={`py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all active-shrink ${state.language === 'en' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>English</button>
                <button onClick={() => setState(p => ({ ...p, language: 'tr' }))} className={`py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all active-shrink ${state.language === 'tr' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Türkçe</button>
              </div>
            </div>
          </div>
        )}

      </main>

      <footer className="p-4 bg-slate-900 border-t border-slate-800 text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest shrink-0">
        {t.footerText} &bull; {state.inventory.length} {t.itemsOwned}
      </footer>
    </div>
  );
};

export default App;