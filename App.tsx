import React, { useState, useCallback, useMemo, useEffect } from 'react';
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

// --- Types Fix for local scope ---
interface FloatingReward {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
}

const INITIAL_KFC_MENU = ["Kentucky Fried Chicken", "French Fries", "Cola", "Gamer kova", "Kanat eseri", "çıtır shots", "TOGG menü"];

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
  sponsorLuck: 35,
  activeRestaurant: null,
  isElonModeUnlocked: false,
  elonPurchases: {},
  isBillModeUnlocked: false,
  billPurchases: {},
  isAdminUnlocked: false,
  isGeminiEnabled: false,
  isKfcGameUnlocked: false,
  kfcMenu: INITIAL_KFC_MENU,
  kfcSatisfaction: 50
};

const SAVE_KEY = "devtube_tycoon_omega_v11_stable";

const App: React.FC = () => {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeSponsor, setActiveSponsor] = useState<Sponsorship | null>(null);
  const [currentTab, setCurrentTab] = useState<'main' | 'elon' | 'bill' | 'shop' | 'inventory' | 'restaurant' | 'settings' | 'admin' | 'kfc'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace('/', '');
      if (path === 'home') return 'main';
      if (['elon', 'bill', 'shop', 'inventory', 'restaurant', 'settings', 'admin', 'kfc'].includes(path)) {
        return path as any;
      }
    }
    return 'main';
  });
  const [promoCode, setPromoCode] = useState('');
  const [floatingRewards, setFloatingRewards] = useState<FloatingReward[]>([]);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace('/', '');
      if (path === 'home' || !path) {
        setCurrentTab('main');
      } else if (['elon', 'bill', 'shop', 'inventory', 'restaurant', 'settings', 'admin', 'kfc'].includes(path)) {
        setCurrentTab(path as any);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const path = window.location.pathname.replace('/', '');
    const targetPath = currentTab === 'main' ? 'home' : currentTab;
    if (path !== targetPath) {
      window.history.pushState(null, '', `/${targetPath}`);
    }
  }, [currentTab]);

  useEffect(() => {
    Object.defineProperty(window, 'YetAnotherGoodGame', {
      get: function() {
        window.location.href = 'https://as.justbekir.workers.dev/home';
        return 'Redirecting...';
      },
      configurable: true
    });
    Object.defineProperty(window, 'rentagf', {
      get: function() {
        window.location.href = 'https://static0.cbrimages.com/wordpress/wp-content/uploads/2023/06/rent-a-girlfriend-season-3-visual.jpg?w=1200&h=675&fit=crop';
        return 'Redirecting...';
      },
      configurable: true
    });
  }, []);

  // Admin Inputs
  const [adminMoney, setAdminMoney] = useState<string>('');
  const [adminSubs, setAdminSubs] = useState<string>('');
  const [adminRep, setAdminRep] = useState<string>('');

  const t = TRANSLATIONS[state.language];

  // ROBUST ADDITIVE MULTIPLIER SYSTEM
  const totalMultiplier = useMemo(() => {
    const uniqueOwnedIds = Array.from(new Set(state.inventory));
    const bonus = uniqueOwnedIds.reduce<number>((acc, itemId) => {
      const item = SHOP_ITEMS.find(i => i.id === itemId);
      return acc + (item ? (item.multiplier - 1) : 0);
    }, 0);
    return parseFloat(Math.max(1.0, 1.0 + bonus).toFixed(2));
  }, [state.inventory]);

  const currentMilestone = useMemo(() => {
    return MILESTONES.find(m => m > state.subscribers) || 999999999;
  }, [state.subscribers]);

  const addNotification = useCallback((message: string, type: Notification['type'] = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  const spawnFloatingReward = useCallback((text: string, color: string, x: number, y: number) => {
    const id = Math.random().toString(36).substring(2, 9);
    const reward: FloatingReward = { id, x, y, text, color };
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
        if (loaded && typeof loaded.money === 'number') setState(loaded);
      } catch (e) { console.error("Load failed", e); }
    }
  }, []);

  useEffect(() => {
    if (!state.isGameOver) {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const handleAction = (type: 'video' | 'cheat' | 'promo' | 'project' | 'cooking', event: React.MouseEvent) => {
    if (state.isGameOver) return;

    let baseSubGain = 0;
    let baseMoneyGain = 0;
    let repGain = 0;
    let cost = 0;
    let msg = "";

    switch (type) {
      case 'video': {
        const title = VIDEO_TITLES[Math.floor(Math.random() * VIDEO_TITLES.length)][state.language];
        baseSubGain = (Math.floor(Math.random() * 50) + 20);
        baseMoneyGain = (Math.floor(Math.random() * 100) + 50);
        repGain = 2;
        msg = `"${title}" ${t.uploadedMsg}`;
        
        if (Math.random() < (state.sponsorLuck / 100)) {
          setTimeout(() => {
            let nextSponsor: Sponsorship;
            const isScam = Math.random() < 0.15;
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
              nextSponsor = rMap[state.activeRestaurant] ? rMap[state.activeRestaurant]() : getRandomSponsorship(isScam);
            } else {
              nextSponsor = getRandomSponsorship(isScam);
            }
            setActiveSponsor(nextSponsor);
          }, 800);
        }
        break;
      }
      case 'cooking':
        baseSubGain = 5000;
        baseMoneyGain = 10000;
        repGain = 50;
        msg = `${t.uploadCooking} ${t.uploadedMsg}`;
        break;
      case 'cheat':
        baseSubGain = 3000;
        baseMoneyGain = 10000;
        msg = `${t.uploadCheat}!`;
        break;
      case 'promo':
        baseSubGain = 100;
        baseMoneyGain = 10000;
        repGain = 10;
        msg = `${t.brandPromo}!`;
        break;
      case 'project':
        cost = 10000;
        if (state.money < cost) {
          addNotification(state.language === 'tr' ? "Yetersiz Bakiye!" : "Not enough money!", "error");
          return;
        }
        baseSubGain = 5000;
        baseMoneyGain = 25000;
        repGain = 100;
        msg = `${t.newProject}!`;
        break;
    }

    const subGain = Math.floor(baseSubGain * totalMultiplier);
    const moneyGain = Math.floor(baseMoneyGain * totalMultiplier);

    // Dynamic numbers (+70 etc.) removed as requested for video upload actions.
    
    setState(prev => ({
      ...prev,
      subscribers: prev.subscribers + subGain,
      money: prev.money + moneyGain - cost,
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
    // Numbers removed here as well for a consistent clean look
  };

  const handleRedeemCode = () => {
    const code = promoCode.trim().toLowerCase();
    if (!code) return;

    let update: Partial<GameState> = {};
    let success = false;

    // RESTORED ALL LEGACY REDEEM CODES
    if (code === 'en') {
      update = { language: 'en' };
      success = true;
    } else if (code === 'tr') {
      update = { language: 'tr' };
      success = true;
    } else if (code === 'justbekirpykfc1966982014') {
      update = { isKfcGameUnlocked: true };
      success = true;
    } else if (code === 'decode2014') {
      update = {
        isElonModeUnlocked: false,
        isBillModeUnlocked: false,
        isAdminUnlocked: false,
        isGeminiEnabled: false,
        elonPurchases: {},
        billPurchases: {},
        money: 10000,
        subscribers: 0,
        reputation: 50,
        usedCodes: []
      };
      success = true;
    } else if (code === 'justbekirinf2014') {
      update = { money: 999999999, subscribers: 999999999, reputation: 10000 };
      success = true;
    } else if (code === 'justbekirelon2014' || code === 'elonmusknet') {
      update = { isElonModeUnlocked: true };
      success = true;
    } else if (code === 'justbekirbillgates2014' || code === 'billgatesnet') {
      update = { isBillModeUnlocked: true };
      success = true;
    } else if (code === 'justbekiradminpanel2014') {
      update = { isAdminUnlocked: true };
      success = true;
    }

    if (success) {
      setState(prev => ({ 
        ...prev, 
        ...update, 
        usedCodes: (code === 'en' || code === 'tr' || code === 'decode2014') ? prev.usedCodes : [...prev.usedCodes, code] 
      }));
      addNotification(t.codeSuccess, "success");
      setPromoCode('');
    } else {
      addNotification(t.invalidCode, "error");
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
  };

  const tabs = useMemo(() => [
    { id: 'main', label: t.main, icon: '🏠' },
    { id: 'shop', label: t.shop, icon: '🛒' },
    { id: 'inventory', label: t.inventory, icon: '📦' },
    { id: 'restaurant', label: t.restaurant, icon: '🍔' },
    ...(state.isKfcGameUnlocked ? [{ id: 'kfc', label: 'KFC', icon: '🍗' }] : []),
    { id: 'settings', label: t.settings, icon: '⚙️' },
    ...(state.isAdminUnlocked ? [{ id: 'admin', label: 'Admin', icon: '🛡️' }] : []),
  ], [t, state.isAdminUnlocked, state.isKfcGameUnlocked]);

  return (
    <div className="h-screen bg-transparent text-slate-200 flex flex-col overflow-hidden relative">
      <StatsBar state={state} />
      <NotificationSystem notifications={notifications} />

      <div className="fixed inset-0 pointer-events-none z-[400]">
        {floatingRewards.map(reward => (
          <div key={reward.id} className="absolute font-black text-4xl animate-float-up-fade shadow-lg text-white" style={{ left: reward.x - 20, top: reward.y - 40 }}>
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

      <nav className="flex justify-center flex-wrap gap-2 p-4 glass border-b border-slate-800 shrink-0 z-40 animate-slide-down">
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setCurrentTab(tab.id as any)}
            className={`px-5 py-3 rounded-2xl font-black transition-all text-xs uppercase tracking-[0.2em] flex items-center gap-3 active-crunch border-2 border-transparent ${currentTab === tab.id ? 'rgb-border-anim shadow-lg scale-105' : 'hover:bg-slate-800/60'}`}
          >
            <span>{tab.icon}</span>
            <span className={`hidden md:inline ${currentTab === tab.id ? 'rgb-text' : ''}`}>{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center w-full relative">
        {currentTab === 'main' && (
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 pb-16 animate-slide-up">
            <div className="space-y-6">
              <div className="bg-slate-900/90 glass rounded-[3rem] p-8 shadow-2xl relative overflow-hidden rgb-border-anim">
                <h2 className="text-xs font-black mb-6 uppercase tracking-[0.4em] rgb-text">{t.subGoal}</h2>
                <div className="relative h-6 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-1">
                  <div className="h-full bg-gradient-to-r from-blue-700 via-purple-600 to-red-600 rounded-full transition-all duration-[2000ms]" style={{ width: `${Math.min(100, (state.subscribers / currentMilestone) * 100)}%` }}></div>
                </div>
                <div className="flex justify-between text-sm mt-4 font-black tracking-[0.2em]">
                  <span className="rgb-text">{state.subscribers.toLocaleString()}</span>
                  <span className="rgb-text">{currentMilestone.toLocaleString()}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-900/90 glass p-8 rounded-[2.5rem] border border-slate-800 text-center shadow-xl rgb-border-anim">
                  <p className="text-[10px] uppercase font-black mb-2 tracking-widest">{t.totalVideos}</p>
                  <p className="text-4xl font-black rgb-text">{state.videoCount}</p>
                </div>
                <div className="bg-slate-900/90 glass p-8 rounded-[2.5rem] border border-slate-800 text-center shadow-xl rgb-border-anim">
                  <p className="text-[10px] uppercase font-black mb-2 tracking-widest">{t.boost}</p>
                  <p className="text-4xl font-black rgb-text">x{totalMultiplier.toFixed(2)}</p>
                </div>
              </div>
              <div className="bg-slate-900/90 glass border-2 border-slate-800 rounded-[2.5rem] p-8 shadow-xl rgb-border-anim">
                <h2 className="text-[10px] font-black mb-6 uppercase tracking-[0.4em] rgb-text">{t.redeem}</h2>
                <div className="flex gap-4">
                  <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder={t.enterCode} className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none text-white" />
                  <button onClick={handleRedeemCode} className="px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] active-crunch rgb-border-anim">
                    <span className="rgb-text">OK</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <button onClick={(e) => handleAction('video', e)} className="p-10 rgb-border-anim rounded-[3rem] font-black uppercase shadow-2xl active-crunch transition-all flex flex-col items-center gap-4 hover-3d">
                <span className="text-3xl rgb-text">🎥 {t.uploadVideo}</span>
                <span className="text-xs opacity-60 normal-case">{t.videoBtnDesc}</span>
              </button>
              <button onClick={(e) => handleAction('cooking', e)} className="p-8 rgb-border-anim rounded-[3rem] font-black uppercase shadow-2xl active-crunch transition-all flex flex-col items-center gap-2 hover-3d">
                <span className="text-xl rgb-text">🍳 {t.uploadCooking}</span>
                <span className="text-[10px] opacity-60 normal-case">{t.cookingBtnDesc}</span>
              </button>
              <button onClick={(e) => handleAction('project', e)} className="p-8 rgb-border-anim rounded-[3rem] font-black uppercase shadow-2xl active-crunch transition-all flex flex-col items-center gap-2 hover-3d">
                <span className="text-xl rgb-text">💻 {t.newProject}</span>
                <span className="text-[10px] opacity-60 normal-case">{t.projectBtnDesc}</span>
              </button>
              <button onClick={(e) => handleAction('cheat', e)} className="p-6 rgb-border-anim border-red-600/40 border-dashed rounded-[3rem] font-black active-crunch transition-all uppercase flex flex-col items-center gap-2 hover-3d">
                <span className="rgb-text">☢️ {t.uploadCheat}</span>
                <span className="text-[10px] opacity-60 normal-case">{t.cheatBtnDesc}</span>
              </button>
            </div>
          </div>
        )}

        {currentTab === 'shop' && (
          <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 pb-32">
            {SHOP_ITEMS.map((item) => {
              const owned = state.inventory.includes(item.id);
              return (
                <div key={item.id} className="bg-slate-900/95 glass rgb-border-anim rounded-[4rem] overflow-hidden flex flex-col shadow-2xl hover-3d animate-pop-in">
                  <div className="h-64 overflow-hidden relative"><img src={item.image} className="w-full h-full object-cover" alt={item.name[state.language]} /></div>
                  <div className="p-10 flex-1 flex flex-col">
                    <h3 className="font-black mb-4 text-3xl uppercase rgb-text">{item.name[state.language]}</h3>
                    <p className="text-sm mb-10 flex-1 leading-relaxed italic">{item.description[state.language]}</p>
                    <button onClick={(e) => buyItem(item, e)} disabled={owned} className="w-full py-6 rounded-[2rem] font-black transition-all uppercase text-xs tracking-[0.3em] active-crunch border-4 rgb-border-anim">
                      <span className="rgb-text">{owned ? t.owned : `${item.price.toLocaleString()} ₺`}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {currentTab === 'inventory' && (
          <div className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 pb-32">
            {state.inventory.length === 0 ? (
              <div className="col-span-full py-32 text-center border-4 border-dashed border-slate-800 rounded-[4rem] opacity-30 glass">
                <p className="font-black uppercase tracking-[0.4em] text-sm"><span>{t.noItems}</span></p>
              </div>
            ) : (
              state.inventory.map((id, index) => {
                const item = SHOP_ITEMS.find(i => i.id === id);
                if (!item) return null;
                return (
                  <div key={`${id}-${index}`} className="bg-slate-900 glass p-8 rounded-[3rem] border-2 border-slate-800 flex flex-col items-center text-center shadow-xl hover-3d rgb-border-anim animate-pop-in">
                    <img src={item.image} className="w-24 h-24 rounded-full object-cover mb-6 ring-4 ring-slate-800 shadow-2xl" />
                    <span className="text-sm font-black uppercase rgb-text">{item.name[state.language]}</span>
                    <span className="text-[10px] font-black uppercase mt-2 opacity-60">+{Math.round((item.multiplier - 1) * 100)}% BOOST</span>
                  </div>
                );
              })
            )}
          </div>
        )}

        {currentTab === 'restaurant' && (
          <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 pb-32">
            {RESTAURANTS.map((res) => (
              <div key={res.id} className="bg-slate-900/95 glass rounded-[4rem] p-12 flex flex-col items-center text-center hover-3d rgb-border-anim shadow-2xl animate-pop-in">
                <div className="w-28 h-28 mb-8 bg-white rounded-[2rem] p-6 shadow-2xl flex items-center justify-center">
                  <img src={res.logo} className="w-full h-full object-contain" alt={res.name} />
                </div>
                <h3 className="text-3xl font-black uppercase mb-4 rgb-text">{res.name}</h3>
                <p className="font-black text-emerald-400 text-2xl mb-6">{res.price.toLocaleString()} ₺</p>
                <p className="text-xs opacity-50 mb-10 italic flex-1 leading-relaxed">{res.desc[state.language]}</p>
                <button 
                  onClick={(e) => eatAtRestaurant(res, e)} 
                  disabled={state.activeRestaurant === res.id}
                  className={`w-full py-6 rounded-[2rem] font-black uppercase text-xs border-4 active-crunch transition-all ${state.activeRestaurant === res.id ? 'bg-emerald-900/40 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-slate-950 border-slate-800'}`}
                >
                   <span className="rgb-text">{state.activeRestaurant === res.id ? t.active : t.visit}</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {currentTab === 'admin' && state.isAdminUnlocked && (
          <div className="w-full max-w-xl bg-slate-900/95 glass border-4 border-red-600/40 rounded-[4.5rem] p-16 space-y-10 shadow-2xl hover-3d animate-pop-in rgb-border-anim">
            <h2 className="text-4xl font-black uppercase text-center border-b-4 border-slate-800 pb-10 rgb-text">God Mode</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase opacity-40 ml-2">Money (₺)</label>
                <input type="number" value={adminMoney} onChange={(e) => setAdminMoney(e.target.value)} placeholder={state.money.toString()} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase opacity-40 ml-2">Subscribers</label>
                <input type="number" value={adminSubs} onChange={(e) => setAdminSubs(e.target.value)} placeholder={state.subscribers.toString()} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase opacity-40 ml-2">Reputation</label>
                <input type="number" value={adminRep} onChange={(e) => setAdminRep(e.target.value)} placeholder={state.reputation.toString()} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white font-bold" />
              </div>
              <button onClick={() => {
                setState(prev => ({
                  ...prev,
                  money: adminMoney !== '' ? parseInt(adminMoney) : prev.money,
                  subscribers: adminSubs !== '' ? parseInt(adminSubs) : prev.subscribers,
                  reputation: adminRep !== '' ? parseInt(adminRep) : prev.reputation
                }));
                addNotification("Reality Altered!", "success");
              }} className="w-full py-7 font-black rounded-[2.5rem] uppercase tracking-widest shadow-2xl rgb-border-anim">
                 <span className="rgb-text">Update Reality</span>
              </button>
            </div>
          </div>
        )}

        {currentTab === 'settings' && (
          <div className="w-full max-w-xl bg-slate-900/90 glass border-4 border-slate-800 rounded-[4.5rem] p-16 space-y-16 shadow-2xl animate-pop-in rgb-border-anim">
            <h2 className="text-4xl font-black uppercase tracking-[0.5em] text-center border-b-4 border-slate-800 pb-10 rgb-text">SYSTEM CORE</h2>
            <div className="space-y-8 text-center">
              <label className="text-xs font-black uppercase tracking-[0.6em] block rgb-text">Language</label>
              <div className="grid grid-cols-2 gap-6">
                <button onClick={() => setState(p => ({ ...p, language: 'en' }))} className={`py-6 rounded-3xl font-black uppercase text-sm border-4 ${state.language === 'en' ? 'rgb-border-anim' : 'border-slate-800'}`}>
                   <span className="rgb-text">ENG</span>
                </button>
                <button onClick={() => setState(p => ({ ...p, language: 'tr' }))} className={`py-6 rounded-3xl font-black uppercase text-sm border-4 ${state.language === 'tr' ? 'rgb-border-anim' : 'border-slate-800'}`}>
                   <span className="rgb-text">TR</span>
                </button>
              </div>
            </div>
            <button onClick={() => { if(confirm(t.confirmWipe)) { localStorage.removeItem(SAVE_KEY); setState(INITIAL_STATE); window.location.reload(); } }} className="w-full py-7 bg-red-950/30 border-4 border-red-600/40 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.5em] hover:bg-red-600 transition-all rgb-border-anim">
               <span className="rgb-text">PURGE PROGRESS</span>
            </button>
          </div>
        )}
      </main>

      <footer className="p-10 glass border-t border-slate-800 text-center text-xs font-black uppercase tracking-[0.6em] shrink-0 z-40 relative">
        <span className="rgb-text">{t.footerText}</span>
        <div className="inline-block px-4 py-2 rounded-full rgb-border-anim shadow-lg ml-8">
           <span className="font-black rgb-text">{state.inventory.length} NODES CONNECTED</span>
        </div>
      </footer>
    </div>
  );
};

export default App;