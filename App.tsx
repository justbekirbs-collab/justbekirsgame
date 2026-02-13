import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { GameState, Sponsorship, Notification, ShopItem, Language, ElonItem, BillItem } from './types.ts';
import { 
  VIDEO_TITLES, 
  getRandomSponsorship, 
  getYouTubePremium_Sponsorship,
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
  getNebras_Sponsorship,
  getTacoBell_Sponsorship,
  getTavukDunyasi_Sponsorship,
  SHOP_ITEMS, 
  TRANSLATIONS, 
  RESTAURANTS,
  ELON_ITEMS,
  BILL_ITEMS,
  MILESTONES
} from './constants.ts';
import StatsBar from './components/StatsBar.tsx';
import NotificationSystem from './components/NotificationSystem.tsx';
import SponsorshipDialog from './components/SponsorshipDialog.tsx';

// --- Animated Typing Effect Component ---
const TypingEffect: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let current = "";
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        current += text[i];
        setDisplayedText(current);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

interface FloatingReward {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
}

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
  language: 'en', // Default English
  sponsorLuck: 35,
  activeRestaurant: null,
  isElonModeUnlocked: false,
  elonPurchases: {},
  isBillModeUnlocked: false,
  billPurchases: {},
  isAdminUnlocked: false,
  isGeminiEnabled: false 
};

const ELON_BUDGET = 250000000000;
const BILL_BUDGET = 100000000000; // Classic $100 Billion for Bill Gates

const SAVE_KEY = "devtube_tycoon_omega_v5_reverted";

const App: React.FC = () => {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeSponsor, setActiveSponsor] = useState<Sponsorship | null>(null);
  const [currentTab, setCurrentTab] = useState<'main' | 'elon' | 'bill' | 'shop' | 'inventory' | 'restaurant' | 'settings' | 'admin' | 'gemini' | 'gemini-admin'>('main');
  const [promoCode, setPromoCode] = useState('');
  const [floatingRewards, setFloatingRewards] = useState<FloatingReward[]>([]);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string>("");
  const [neuralCommand, setNeuralCommand] = useState<string>("");

  const [adminMoney, setAdminMoney] = useState<string>('');
  const [adminSubs, setAdminSubs] = useState<string>('');

  const t = TRANSLATIONS[state.language];

  const multipliers = useMemo(() => {
    let totalMult = 1.0;
    state.inventory.forEach(itemId => {
      const item = SHOP_ITEMS.find(i => i.id === itemId);
      if (item) totalMult *= item.multiplier;
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

  const spawnFloatingReward = useCallback((text: string, color: string, event: React.MouseEvent) => {
    const id = Math.random().toString(36).substring(2, 9);
    const reward: FloatingReward = { id, x: event.clientX, y: event.clientY, text, color };
    setFloatingRewards(prev => [...prev, reward]);
    setTimeout(() => {
      setFloatingRewards(prev => prev.filter(r => r.id !== id));
    }, 1500);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const loaded = JSON.parse(saved);
        if (loaded && typeof loaded.money === 'number') {
          setState(loaded);
        }
      } catch (e) {
        console.error("Save load failed", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!state.isGameOver) {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const handleAction = (type: 'video' | 'cheat' | 'promo' | 'project' | 'cooking', event: React.MouseEvent) => {
    if (state.isGameOver) return;

    let subGain = 0;
    let moneyGain = 0;
    let repGain = 0;
    let cost = 0;
    let msg = "";

    switch (type) {
      case 'video': {
        const title = VIDEO_TITLES[Math.floor(Math.random() * VIDEO_TITLES.length)][state.language];
        subGain = (Math.floor(Math.random() * 50) + 20) * multipliers.subMult;
        moneyGain = (Math.floor(Math.random() * 100) + 50) * multipliers.moneyMult;
        repGain = 2;
        msg = `"${title}" ${t.uploadedMsg}`;
        
        const sponsorRoll = Math.random() < (state.sponsorLuck / 100);
        if (sponsorRoll) {
          setTimeout(() => {
            let nextSponsor: Sponsorship;
            const isScam = Math.random() < 0.2;
            const isRare = Math.random() < 0.05;
            
            if (isRare && !isScam) {
              nextSponsor = getYouTubePremium_Sponsorship();
            } else if (state.activeRestaurant && !isScam) {
              const rMap: Record<string, () => Sponsorship> = {
                'kfc': getKFC_Sponsorship,
                'popeyes': getPopeyes_Sponsorship,
                'bk': getBK_Sponsorship,
                'wendys': getWendys_Sponsorship,
                'hd-iskender': getHDIskender_Sponsorship,
                'kudo-kudo': getKudoKudo_Sponsorship,
                'dominos': getDominos_Sponsorship,
                'starbucks': getStarbucks_Sponsorship,
                'subway': getSubway_Sponsorship,
                'doyuyo': getDoyuyo_Sponsorship,
                'mcdonalds': getMcDonalds_Sponsorship,
                'bursa-kebap-evi': getBursaKebapEvi_Sponsorship,
                'planets-pizza': getPlanetsPizza_Sponsorship,
                'little-caesars': getLittleCaesars_Sponsorship,
                'maydonoz-doner': getMaydonozDoner_Sponsorship,
                'nebras': getNebras_Sponsorship,
                'taco-bell': getTacoBell_Sponsorship,
                'tavuk-dunyasi': getTavukDunyasi_Sponsorship,
              };
              const restaurantGetter = rMap[state.activeRestaurant];
              nextSponsor = restaurantGetter ? restaurantGetter() : getRandomSponsorship(isScam);
            } else {
              nextSponsor = getRandomSponsorship(isScam);
            }
            setActiveSponsor(nextSponsor);
          }, 800);
        }
        break;
      }
      case 'cooking':
        subGain = 5000 * multipliers.subMult;
        moneyGain = 10000 * multipliers.moneyMult;
        repGain = 50;
        msg = `${t.uploadCooking} ${t.uploadedMsg}`;
        break;
      case 'cheat':
        subGain = 3000 * multipliers.subMult;
        moneyGain = 10000 * multipliers.moneyMult;
        msg = `${t.uploadCheat}!`;
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

    if (subGain > 0) spawnFloatingReward(`+${Math.floor(subGain).toLocaleString()}`, 'text-purple-300', event);
    if (moneyGain > 0) setTimeout(() => spawnFloatingReward(`+${Math.floor(moneyGain).toLocaleString()} ₺`, 'text-emerald-300', event), 150);

    setState(prev => ({
      ...prev,
      subscribers: prev.subscribers + Math.floor(subGain),
      money: prev.money + Math.floor(moneyGain) - cost,
      reputation: prev.reputation + repGain,
      videoCount: prev.videoCount + 1,
      day: prev.day + 1
    }));
    addNotification(msg, 'success');
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
      addNotification(`${sponsor.brand} deal accepted!`, 'success');
    }
    setActiveSponsor(null);
  };

  const buyItem = (item: ShopItem, event: React.MouseEvent) => {
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
    addNotification(`${item.name[state.language]} owned!`, "success");
    spawnFloatingReward(`-${item.price.toLocaleString()} ₺`, 'text-red-500', event);
  };

  const handleRedeemCode = () => {
    const code = promoCode.trim().toLowerCase();
    if (!code) return;

    let update: Partial<GameState> = {};
    let success = false;

    // Direct language codes
    if (code === 'en') {
      update = { language: 'en' };
      success = true;
    } else if (code === 'tr') {
      update = { language: 'tr' };
      success = true;
    } else if (code === 'decode2014') {
      // Revert all code effects: Close modes, clear purchases, reset stats to initial state
      update = {
        isElonModeUnlocked: false,
        isBillModeUnlocked: false,
        isAdminUnlocked: false,
        isGeminiEnabled: false,
        elonPurchases: {},
        billPurchases: {},
        money: INITIAL_STATE.money,
        subscribers: INITIAL_STATE.subscribers,
        reputation: INITIAL_STATE.reputation,
        usedCodes: [] // Also clear used codes history to allow re-entry if desired
      };
      setCurrentTab('main');
      addNotification(state.language === 'tr' ? "Tüm kod etkileri temizlendi!" : "All code effects cleared!", "success");
      setPromoCode('');
      setState(prev => ({ ...prev, ...update }));
      return;
    } else if (state.usedCodes.includes(code)) {
      addNotification(t.codeUsed, "warning");
      setPromoCode('');
      return;
    } else if (code === 'justbekirinf2014') {
      update = { money: 999999999, subscribers: 999999999, reputation: 1000 };
      success = true;
    } else if (code === 'elonmusknet' || code === 'justbekirelon2014') {
      update = { isElonModeUnlocked: true };
      success = true;
    } else if (code === 'billgatesnet' || code === 'justbekirbillgates2014') {
      update = { isBillModeUnlocked: true };
      success = true;
    } else if (code === 'justbekiradminpanel2014') {
      update = { isAdminUnlocked: true, isGeminiEnabled: true }; 
      success = true;
    }

    if (success) {
      setState(prev => ({ 
        ...prev, 
        ...update, 
        // Only track as used if it's not a language toggle or a reset
        usedCodes: (code === 'en' || code === 'tr' || code === 'decode2014') ? prev.usedCodes : [...prev.usedCodes, code] 
      }));
      addNotification(t.codeSuccess, "success");
      setPromoCode('');
    } else {
      addNotification(t.invalidCode, "error");
    }
  };

  const handleGeminiCall = async () => {
    setIsAiLoading(true);
    setAiResponse("");
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Generate a single short, hyper-futuristic, tech video title for a YouTuber Tycoon game. Current subs: ${state.subscribers}.`;
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      setAiResponse(response.text || "Neural connection failed.");
      
      setState(prev => ({
        ...prev,
        subscribers: prev.subscribers + 10000,
        money: prev.money + 15000,
        reputation: prev.reputation + 50
      }));
      addNotification("Quantum Intel Received!", "success");
    } catch (e) {
      addNotification("Neural Error", "error");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleNeuralAdminCall = async () => {
    if (!neuralCommand.trim()) return;
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: neuralCommand,
        config: {
          systemInstruction: `You are the Neural Admin for JustBekir's YouTuber Tycoon Game. 
          The user is trying to cheat or modify the game state via natural language.
          Return a JSON object with any of these keys to modify the game state: money, subscribers, reputation, videoCount, day.
          If the user says "give me a million", return {"money": 1000000}.
          If the user says "make me famous", return {"subscribers": 1000000, "reputation": 100}.
          If you don't understand, return {}.
          Only return the JSON.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              money: { type: Type.NUMBER },
              subscribers: { type: Type.NUMBER },
              reputation: { type: Type.NUMBER },
              videoCount: { type: Type.NUMBER },
              day: { type: Type.NUMBER }
            }
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      if (Object.keys(result).length > 0) {
        setState(prev => ({
          ...prev,
          ...result
        }));
        addNotification("Neural Injection Successful!", "success");
      } else {
        addNotification("Neural Rejection: Ambiguous Command", "warning");
      }
      setNeuralCommand("");
    } catch (e) {
      console.error(e);
      addNotification("Neural Static: Connection Interrupted", "error");
    } finally {
      setIsAiLoading(false);
    }
  };

  const eatAtRestaurant = (restaurant: typeof RESTAURANTS[0], event: React.MouseEvent) => {
    if (state.money < restaurant.price) {
      addNotification(state.language === 'tr' ? "Yetersiz Bakiye!" : "Not enough money!", "error");
      return;
    }
    setState(prev => ({ 
      ...prev, 
      money: prev.money - restaurant.price,
      activeRestaurant: restaurant.id as any 
    }));
    addNotification(`${restaurant.name} visit recorded!`, 'success');
    spawnFloatingReward(`-${restaurant.price.toLocaleString()} ₺`, 'text-red-500', event);
  };

  const handleElonAction = (id: string, type: 'buy' | 'sell', event: React.MouseEvent) => {
    const item = ELON_ITEMS.find(i => i.id === id);
    if (!item) return;

    if (type === 'buy' && elonStats.remaining < item.price) {
      addNotification(state.language === 'tr' ? "Yetersiz Bakiye!" : "Not enough money!", "error");
      return;
    }

    setState(prev => {
      const currentQty = prev.elonPurchases?.[id] || 0;
      const newQty = type === 'buy' ? currentQty + 1 : Math.max(0, currentQty - 1);
      const newPurchases = { ...(prev.elonPurchases || {}), [id]: newQty };
      return { ...prev, elonPurchases: newPurchases };
    });

    if (type === 'buy') {
      spawnFloatingReward(`-${item.price.toLocaleString()} $`, 'text-red-400', event);
    } else if ((state.elonPurchases?.[id] || 0) > 0) {
      spawnFloatingReward(`+${item.price.toLocaleString()} $`, 'text-emerald-400', event);
    }
  };

  const handleBillAction = (id: string, type: 'buy' | 'sell', event: React.MouseEvent) => {
    const item = BILL_ITEMS.find(i => i.id === id);
    if (!item) return;

    if (type === 'buy' && billStats.remaining < item.price) {
      addNotification(state.language === 'tr' ? "Yetersiz Bakiye!" : "Not enough money!", "error");
      return;
    }

    setState(prev => {
      const currentQty = prev.billPurchases?.[id] || 0;
      const newQty = type === 'buy' ? currentQty + 1 : Math.max(0, currentQty - 1);
      const newPurchases = { ...(prev.billPurchases || {}), [id]: newQty };
      return { ...prev, billPurchases: newPurchases };
    });

    if (type === 'buy') {
      spawnFloatingReward(`-${item.price.toLocaleString()} $`, 'text-red-400', event);
    } else if ((state.billPurchases?.[id] || 0) > 0) {
      spawnFloatingReward(`+${item.price.toLocaleString()} $`, 'text-emerald-400', event);
    }
  };

  const tabs = useMemo(() => [
    { id: 'main', label: t.main, icon: '🏠' },
    { id: 'shop', label: t.shop, icon: '🛒' },
    { id: 'inventory', label: t.inventory, icon: '📦' },
    { id: 'restaurant', label: t.restaurant, icon: '🍔' },
    ...(state.isElonModeUnlocked ? [{ id: 'elon', label: t.elonTitle, icon: '💰' }] : []),
    ...(state.isBillModeUnlocked ? [{ id: 'bill', label: t.billTitle, icon: '💳' }] : []),
    { id: 'settings', label: t.settings, icon: '⚙️' },
    ...(state.isAdminUnlocked ? [
      { id: 'admin', label: 'Admin', icon: '🛡️' },
      { id: 'gemini', label: 'Gemini', icon: '✨' },
      { id: 'gemini-admin', label: 'NEURAL', icon: '🧠' }
    ] : []),
  ], [t, state.isElonModeUnlocked, state.isBillModeUnlocked, state.isAdminUnlocked]);

  if (state.isGameOver) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-8 text-center z-[500] animate-glitch">
        <h1 className="text-8xl font-black text-red-600 mb-6 uppercase tracking-tighter shadow-red-600/50 drop-shadow-2xl">{t.gameOver}</h1>
        <p className="text-2xl text-slate-400 mb-12 max-w-2xl">{state.gameOverReason}</p>
        <button onClick={() => { localStorage.removeItem(SAVE_KEY); setState(INITIAL_STATE); window.location.reload(); }} className="px-16 py-6 bg-white text-slate-950 font-black rounded-3xl hover:bg-slate-200 transition-all uppercase tracking-[0.5em] active-crunch shadow-[0_0_60px_rgba(255,255,255,0.4)]">{t.restart}</button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-transparent text-slate-200 flex flex-col overflow-hidden relative">
      <StatsBar state={state} />
      <NotificationSystem notifications={notifications} />

      <div className="fixed inset-0 pointer-events-none z-[400]">
        {floatingRewards.map(reward => (
          <div key={reward.id} className={`absolute font-black text-4xl animate-float-up-fade ${reward.color} shadow-lg`} style={{ left: reward.x - 20, top: reward.y - 40 }}>
            {reward.text}
          </div>
        ))}
      </div>

      {activeSponsor && (
        <SponsorshipDialog 
          sponsor={activeSponsor} 
          language={state.language}
          onAccept={onAcceptSponsor} 
          onReject={() => setActiveSponsor(null)} 
        />
      )}

      <nav className="flex justify-center flex-wrap gap-2 sm:gap-3 p-4 glass border-b border-slate-800 shrink-0 z-40 animate-slide-down">
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setCurrentTab(tab.id as any)}
            className={`px-5 py-3 rounded-2xl font-black transition-all text-xs sm:text-sm uppercase tracking-[0.2em] flex items-center gap-3 active-crunch border-2 border-transparent ${currentTab === tab.id ? 'bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.7)] border-blue-400 scale-105 animate-glow-pulse' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/60'}`}
          >
            <span>{tab.icon}</span>
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center w-full relative">
        {currentTab === 'main' && (
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 pb-16 animate-slide-up">
            <div className="space-y-6">
              <div className="bg-slate-900/90 glass liquid-border rounded-[3rem] p-8 shadow-2xl hover-3d relative overflow-hidden">
                <h2 className="text-xs font-black mb-6 uppercase text-slate-500 tracking-[0.4em]">{t.subGoal}</h2>
                <div className="relative h-6 bg-slate-950 rounded-full overflow-hidden shadow-inner border border-slate-800 p-1">
                  <div className="h-full bg-gradient-to-r from-blue-700 to-purple-600 rounded-full transition-all duration-[2000ms] animate-reveal" style={{ width: `${Math.min(100, (state.subscribers / currentMilestone) * 100)}%` }}></div>
                </div>
                <div className="flex justify-between text-sm mt-4 font-black tracking-[0.2em]">
                  <span className="text-slate-300">{state.subscribers.toLocaleString()}</span>
                  <span className="text-blue-500">{currentMilestone.toLocaleString()}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-900/90 glass p-8 rounded-[2.5rem] border border-slate-800 text-center shadow-xl hover-3d">
                  <p className="text-[10px] text-slate-600 uppercase font-black mb-2 tracking-widest">{t.totalVideos}</p>
                  <p className="text-4xl font-black text-white">{state.videoCount}</p>
                </div>
                <div className="bg-slate-900/90 glass p-8 rounded-[2.5rem] border border-slate-800 text-center shadow-xl hover-3d">
                  <p className="text-[10px] text-slate-600 uppercase font-black mb-2 tracking-widest">{t.boost}</p>
                  <p className="text-4xl font-black text-emerald-400">x{multipliers.moneyMult.toFixed(1)}</p>
                </div>
              </div>
              <div className="bg-slate-900/90 glass border-2 border-slate-800 rounded-[2.5rem] p-8 shadow-xl hover-3d">
                <h2 className="text-[10px] font-black mb-6 uppercase text-slate-500 tracking-[0.4em]">{t.redeem}</h2>
                <div className="flex gap-4">
                  <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder={t.enterCode} className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50" />
                  <button onClick={handleRedeemCode} className="bg-blue-600 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-blue-500 active-crunch btn-gliss">{t.redeem}</button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <button onClick={(e) => handleAction('video', e)} className="p-10 bg-blue-700 hover:bg-blue-600 rounded-[3rem] font-black uppercase shadow-2xl active-crunch transition-all text-white flex flex-col items-center gap-4 hover-3d border-2 border-blue-500/50 animate-breath">
                <span className="text-3xl">🎥 {t.uploadVideo}</span>
                <span className="text-xs opacity-60 normal-case">{t.videoBtnDesc}</span>
              </button>
              <button onClick={(e) => handleAction('cooking', e)} className="p-8 bg-orange-700 hover:bg-orange-600 rounded-[3rem] font-black uppercase shadow-2xl active-crunch transition-all text-white flex flex-col items-center gap-2 hover-3d border-2 border-orange-500/50">
                <span className="text-xl">🍳 {t.uploadCooking}</span>
                <span className="text-[10px] opacity-60 normal-case">{t.cookingBtnDesc}</span>
              </button>
              <button onClick={(e) => handleAction('promo', e)} className="p-8 bg-indigo-700 hover:bg-indigo-600 rounded-[3rem] font-black uppercase shadow-2xl active-crunch transition-all text-white flex flex-col items-center gap-2 hover-3d border-2 border-indigo-500/50">
                <span className="text-xl">📢 {t.brandPromo}</span>
                <span className="text-[10px] opacity-60 normal-case">{t.promoBtnDesc}</span>
              </button>
              <button onClick={(e) => handleAction('project', e)} className="p-8 bg-emerald-700 hover:bg-emerald-600 rounded-[3rem] font-black uppercase shadow-2xl active-crunch transition-all text-white flex flex-col items-center gap-2 hover-3d border-2 border-emerald-500/50">
                <span className="text-xl">💻 {t.newProject}</span>
                <span className="text-[10px] opacity-60 normal-case">{t.projectBtnDesc}</span>
              </button>
              <button onClick={(e) => handleAction('cheat', e)} className="p-6 bg-red-950/40 border-4 border-dashed border-red-600/40 rounded-[3rem] text-red-500 font-black active-crunch transition-all uppercase flex flex-col items-center gap-2 hover-3d">
                <span>☢️ {t.uploadCheat}</span>
              </button>
            </div>
          </div>
        )}

        {currentTab === 'gemini' && state.isAdminUnlocked && (
          <div className="w-full max-w-5xl flex flex-col gap-8 pb-20 animate-slide-up">
            <div className="bg-indigo-950/50 glass liquid-border rounded-[4rem] p-12 flex flex-col items-center text-center relative overflow-hidden group shadow-2xl hover-3d">
              <h2 className="text-5xl font-black text-white uppercase mb-4">Gemini Neural Core</h2>
              <p className="text-indigo-400 text-xs font-black uppercase tracking-[0.6em] mb-12 opacity-80">Quantum Trend Synthesis Interface</p>
              <div className="w-full max-w-3xl bg-slate-950/90 rounded-[3rem] border-2 border-indigo-500/40 p-10 min-h-[220px] flex items-center justify-center mb-12 relative overflow-hidden shadow-inner">
                {isAiLoading ? (
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-sm text-indigo-400 font-black uppercase animate-pulse">Scanning Future Trends...</p>
                  </div>
                ) : aiResponse ? (
                  <p className="text-3xl font-black text-white italic drop-shadow-md leading-tight">
                    "<TypingEffect text={aiResponse} />"
                  </p>
                ) : (
                  <p className="text-slate-600 text-xs uppercase font-black tracking-[0.8em]">Core Standby</p>
                )}
              </div>
              <button onClick={handleGeminiCall} disabled={isAiLoading} className={`px-16 py-7 rounded-[2rem] font-black uppercase text-xl tracking-[0.3em] transition-all active-crunch border-4 ${isAiLoading ? 'bg-slate-900 border-slate-800 text-slate-700' : 'bg-indigo-600 border-indigo-400 text-white shadow-2xl'}`}>
                {isAiLoading ? 'SYNCING...' : 'EXECUTE NEURAL SEARCH'}
              </button>
            </div>
          </div>
        )}

        {currentTab === 'gemini-admin' && state.isAdminUnlocked && (
          <div className="w-full max-w-5xl flex flex-col gap-8 pb-20 animate-pop-in">
            <div className="bg-slate-950/90 glass border-4 border-indigo-600/60 rounded-[4rem] p-12 flex flex-col items-center text-center relative overflow-hidden shadow-[0_0_100px_rgba(79,70,229,0.3)] hover-3d">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
              
              <div className="relative z-10 w-full">
                <h2 className="text-4xl font-black text-indigo-400 uppercase mb-2 tracking-[0.3em] drop-shadow-[0_0_15px_rgba(79,70,229,0.8)]">NEURAL ADMIN INTERFACE</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.8em] mb-12">Direct Neural Modification System</p>
                
                <div className="w-full bg-black/60 rounded-[2rem] border border-indigo-500/30 p-8 mb-10 text-left font-mono">
                  <div className="flex items-center gap-3 mb-4 border-b border-indigo-500/20 pb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-[10px] text-indigo-300 uppercase ml-2 opacity-60">Terminal Session Active</span>
                  </div>
                  <div className="text-indigo-400 text-xs mb-2">root@gemini-tycoon:~# <span className="text-slate-200">INIT NEURAL_ADMIN_PROTOCOL</span></div>
                  <div className="text-indigo-500/60 text-[10px] mb-8">Access granted. Monitoring natural language directives...</div>
                  
                  <textarea 
                    value={neuralCommand}
                    onChange={(e) => setNeuralCommand(e.target.value)}
                    placeholder="Enter directive (e.g. 'Give me 10 million subs and 50 million lira')"
                    className="w-full bg-transparent border-none focus:ring-0 text-slate-100 placeholder-indigo-900 resize-none h-32 text-lg"
                  />
                </div>

                <button 
                  onClick={handleNeuralAdminCall}
                  disabled={isAiLoading || !neuralCommand.trim()}
                  className={`w-full py-8 rounded-[2rem] font-black uppercase text-xl tracking-[0.4em] transition-all active-crunch border-4 ${isAiLoading ? 'bg-slate-900 border-slate-800 text-slate-700' : 'bg-indigo-700 border-indigo-400 text-white shadow-[0_0_50px_rgba(79,70,229,0.4)] hover:bg-indigo-600'}`}
                >
                  {isAiLoading ? 'INJECTING DIRECTIVE...' : 'INJECT NEURAL DATA'}
                </button>

                <p className="mt-8 text-[9px] text-slate-600 uppercase tracking-[0.5em] font-black italic">Warning: Direct neural modification may destabilize economic reality</p>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'shop' && (
          <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 pb-32">
            {SHOP_ITEMS.map((item) => {
              const owned = state.inventory.includes(item.id);
              return (
                <div key={item.id} className={`bg-slate-900/95 glass border-4 ${owned ? 'border-blue-600/60' : 'border-slate-800'} rounded-[4rem] overflow-hidden flex flex-col shadow-2xl hover-3d animate-pop-in`}>
                  <div className="h-64 overflow-hidden relative"><img src={item.image} className="w-full h-full object-cover" alt={item.name[state.language]} /></div>
                  <div className="p-10 flex-1 flex flex-col">
                    <h3 className="font-black text-white mb-4 text-3xl uppercase">{item.name[state.language]}</h3>
                    <p className="text-sm text-slate-500 mb-10 flex-1 leading-relaxed italic">{item.description[state.language]}</p>
                    <button onClick={(e) => buyItem(item, e)} disabled={owned} className={`w-full py-6 rounded-[2rem] font-black transition-all uppercase text-xs tracking-[0.3em] active-crunch border-4 ${owned ? 'bg-slate-800 text-slate-600 border-slate-700' : 'bg-emerald-600 border-emerald-400 text-white shadow-2xl btn-gliss'}`}>
                      {owned ? 'UNIT OWNED' : `${item.price.toLocaleString()} ₺`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {currentTab === 'inventory' && (
          <div className="w-full max-w-7xl pb-32">
            {state.inventory.length === 0 ? (
              <div className="py-56 text-center border-8 border-dashed border-slate-800/60 rounded-[5rem] glass animate-fade-in group hover-3d">
                <span className="text-9xl block mb-10 opacity-40">🫙</span>
                <p className="text-slate-700 font-black uppercase tracking-[0.6em] text-sm">{t.noItems}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                {state.inventory.map((id) => {
                  const item = SHOP_ITEMS.find(i => i.id === id);
                  return item && (
                    <div key={id} className="bg-slate-900/90 glass p-10 rounded-[4rem] border-4 border-slate-800 flex flex-col items-center text-center shadow-2xl hover-3d liquid-border animate-pop-in">
                      <img src={item.image} className="w-24 h-24 rounded-full object-cover mb-8 shadow-2xl ring-4 ring-slate-800" />
                      <span className="text-lg font-black text-white uppercase">{item.name[state.language]}</span>
                      <span className="text-[10px] text-blue-400 uppercase font-black tracking-widest mt-2">x{item.multiplier} BOOST</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {currentTab === 'restaurant' && (
          <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 pb-32">
            {RESTAURANTS.map((res) => (
              <div key={res.id} className={`bg-slate-900/90 glass border-4 ${state.activeRestaurant === res.id ? 'border-orange-600 shadow-2xl animate-glow-pulse' : 'border-slate-800'} rounded-[4rem] p-12 flex flex-col items-center text-center hover-3d animate-pop-in`}>
                <div className="w-32 h-32 mb-10 bg-white rounded-full p-6 shadow-xl"><img src={res.logo} className="w-full h-full object-contain" /></div>
                <h3 className="text-3xl font-black text-white uppercase mb-3">{res.name}</h3>
                <p className="text-orange-500 font-black mb-8 text-2xl">{res.price.toLocaleString()} ₺</p>
                <p className="text-xs text-slate-500 mb-12 flex-1 italic">{res.desc[state.language]}</p>
                <button onClick={(e) => eatAtRestaurant(res, e)} className={`w-full py-6 rounded-3xl font-black uppercase text-xs tracking-[0.3em] transition-all active-crunch border-4 ${state.activeRestaurant === res.id ? 'bg-orange-600 text-white border-orange-400' : 'bg-slate-800 text-slate-400 border-slate-700 btn-gliss'}`}>
                  {state.activeRestaurant === res.id ? 'ACTIVE PROTOCOL' : 'ENGAGE FEAST'}
                </button>
              </div>
            ))}
          </div>
        )}

        {currentTab === 'elon' && (
          <div className="w-full max-w-7xl pb-32 animate-slide-up flex flex-col items-center">
            <div className="sticky top-0 z-[100] w-full max-w-4xl bg-gradient-to-r from-emerald-600 to-teal-700 p-8 rounded-3xl shadow-[0_20px_50px_rgba(16,185,129,0.4)] mb-12 text-center border-4 border-emerald-400/50">
              <h2 className="text-xl font-black text-emerald-100 uppercase tracking-[0.3em] mb-2">{t.elonTitle}</h2>
              <div className="text-5xl sm:text-7xl font-black text-white drop-shadow-lg tabular-nums animate-reveal">
                ${elonStats.remaining.toLocaleString()}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {ELON_ITEMS.map((item) => {
                const qty = state.elonPurchases?.[item.id] || 0;
                return (
                  <div key={item.id} className="bg-white p-6 rounded-[2.5rem] flex flex-col items-center shadow-2xl transition-all hover:scale-[1.02] border-b-8 border-slate-200">
                    <div className="w-full h-48 bg-slate-100 rounded-2xl mb-6 overflow-hidden">
                      <img src={item.image} className="w-full h-full object-cover" alt={item.name[state.language]} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase mb-1">{item.name[state.language]}</h3>
                    <p className="text-emerald-600 font-black text-xl mb-6">${item.price.toLocaleString()}</p>
                    
                    <div className="w-full grid grid-cols-3 items-center gap-2">
                      <button onClick={(e) => handleElonAction(item.id, 'sell', e)} disabled={qty <= 0} className={`py-4 rounded-xl font-black text-white text-lg transition-all active:scale-90 ${qty > 0 ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>Sell</button>
                      <div className="text-center">
                        <input type="text" value={qty} readOnly className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 text-center font-black text-slate-800 text-xl focus:outline-none" />
                      </div>
                      <button onClick={(e) => handleElonAction(item.id, 'buy', e)} disabled={elonStats.remaining < item.price} className={`py-4 rounded-xl font-black text-white text-lg transition-all active:scale-90 ${elonStats.remaining >= item.price ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>Buy</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentTab === 'bill' && (
          <div className="w-full max-w-7xl pb-32 animate-slide-up flex flex-col items-center">
            {/* Bill Gates Themed Spending Header */}
            <div className="sticky top-0 z-[100] w-full max-w-4xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-[0_20px_50px_rgba(37,99,235,0.4)] mb-12 text-center border-4 border-blue-400/50">
              <h2 className="text-xl font-black text-blue-100 uppercase tracking-[0.3em] mb-2">{t.billTitle}</h2>
              <div className="text-5xl sm:text-7xl font-black text-white drop-shadow-lg tabular-nums animate-reveal">
                ${billStats.remaining.toLocaleString()}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {BILL_ITEMS.map((item) => {
                const qty = state.billPurchases?.[item.id] || 0;
                return (
                  <div key={item.id} className="bg-white p-6 rounded-[2.5rem] flex flex-col items-center shadow-2xl transition-all hover:scale-[1.02] border-b-8 border-slate-200">
                    <div className="w-full h-48 bg-slate-100 rounded-2xl mb-6 overflow-hidden">
                      <img src={item.image} className="w-full h-full object-cover" alt={item.name[state.language]} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase mb-1">{item.name[state.language]}</h3>
                    <p className="text-blue-600 font-black text-xl mb-6">${item.price.toLocaleString()}</p>
                    
                    <div className="w-full grid grid-cols-3 items-center gap-2">
                      <button onClick={(e) => handleBillAction(item.id, 'sell', e)} disabled={qty <= 0} className={`py-4 rounded-xl font-black text-white text-lg transition-all active:scale-90 ${qty > 0 ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>Sell</button>
                      <div className="text-center">
                        <input type="text" value={qty} readOnly className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 text-center font-black text-slate-800 text-xl focus:outline-none" />
                      </div>
                      <button onClick={(e) => handleBillAction(item.id, 'buy', e)} disabled={billStats.remaining < item.price} className={`py-4 rounded-xl font-black text-white text-lg transition-all active:scale-90 ${billStats.remaining >= item.price ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>Buy</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentTab === 'settings' && (
          <div className="w-full max-w-xl bg-slate-900/90 glass border-4 border-slate-800 rounded-[4.5rem] p-16 space-y-16 shadow-2xl animate-pop-in relative overflow-hidden hover-3d">
            <h2 className="text-4xl font-black uppercase text-white tracking-[0.5em] text-center border-b-4 border-slate-800 pb-10">SYSTEM CORE</h2>
            <div className="space-y-8">
              <label className="text-xs font-black text-slate-600 uppercase tracking-[0.6em] block text-center">Language</label>
              <div className="grid grid-cols-2 gap-6">
                <button onClick={() => setState(p => ({ ...p, language: 'en' }))} className={`py-6 rounded-3xl font-black uppercase text-sm tracking-[0.3em] transition-all active-crunch border-4 ${state.language === 'en' ? 'bg-blue-600 text-white border-blue-400 shadow-xl scale-105' : 'bg-slate-950/60 text-slate-600 border-slate-800'}`}>ENG</button>
                <button onClick={() => setState(p => ({ ...p, language: 'tr' }))} className={`py-6 rounded-3xl font-black uppercase text-sm tracking-[0.3em] transition-all active-crunch border-4 ${state.language === 'tr' ? 'bg-blue-600 text-white border-blue-400 shadow-xl scale-105' : 'bg-slate-950/60 text-slate-600 border-slate-800'}`}>TR</button>
              </div>
            </div>
            <div className="pt-12">
               <button onClick={() => { if(confirm(t.confirmWipe)) { localStorage.removeItem(SAVE_KEY); setState(INITIAL_STATE); window.location.reload(); } }} className="w-full py-7 bg-red-950/30 border-4 border-red-600/40 text-red-600 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.5em] hover:bg-red-600 hover:text-white transition-all">PURGE PROGRESS</button>
            </div>
          </div>
        )}

        {currentTab === 'admin' && state.isAdminUnlocked && (
          <div className="w-full max-w-xl bg-slate-900/90 glass border-4 border-red-600/40 rounded-[4.5rem] p-16 space-y-12 shadow-2xl hover-3d animate-pop-in">
            <h2 className="text-4xl font-black text-red-600 uppercase text-center border-b-4 border-slate-800 pb-10">God Mode</h2>
            <div className="space-y-6">
              <input type="number" value={adminMoney} onChange={(e) => setAdminMoney(e.target.value)} placeholder="Set Money" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white" />
              <input type="number" value={adminSubs} onChange={(e) => setAdminSubs(e.target.value)} placeholder="Set Subscribers" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white" />
              <button onClick={() => {
                setState(prev => ({
                  ...prev,
                  money: adminMoney !== '' ? parseInt(adminMoney) : prev.money,
                  subscribers: adminSubs !== '' ? parseInt(adminSubs) : prev.subscribers
                }));
                addNotification("Reality Altered!", "success");
              }} className="w-full py-6 bg-red-600 text-white font-black rounded-3xl uppercase tracking-widest hover:bg-red-500 shadow-xl btn-gliss">Update Reality</button>
            </div>
          </div>
        )}
      </main>

      <footer className="p-10 glass border-t border-slate-800 text-center text-xs text-slate-600 font-black uppercase tracking-[0.6em] shrink-0 z-40 relative">
        <span>{t.footerText}</span> &bull; <span>{state.inventory.length} NODES CONNECTED</span>
      </footer>
    </div>
  );
};

export default App;