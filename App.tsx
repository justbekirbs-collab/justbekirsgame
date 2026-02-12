
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GameState, Sponsorship, Notification, ShopItem, Language } from './types';
import { VIDEO_TITLES, getRandomSponsorship, SHOP_ITEMS, REAL_BRANDS, TRANSLATIONS } from './constants';
import StatsBar from './components/StatsBar';
import NotificationSystem from './components/NotificationSystem';
import SponsorshipDialog from './components/SponsorshipDialog';

const INITIAL_STATE: GameState = {
  money: 5000, 
  reputation: 50,
  subscribers: 0,
  videoCount: 0,
  day: 1,
  isGameOver: false,
  gameOverReason: '',
  inventory: [],
  usedCodes: [],
  language: 'en'
};

const SAVE_KEY = "devtube_tycoon_bin_v1";
const XOR_KEY = 0xAA; // Secret key for binary obfuscation

// Secure Save/Load Functions
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
  const [currentTab, setCurrentTab] = useState<'main' | 'shop' | 'inventory' | 'settings'>('main');
  const [promoCode, setPromoCode] = useState('');

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

  const handleAction = (type: 'video' | 'cheat' | 'promo' | 'project') => {
    if (state.isGameOver) return;

    let subGain = 0;
    let moneyGain = 0;
    let repGain = 0;
    let cost = 0;
    let msg = "";
    const titles = VIDEO_TITLES;
    const title = titles[Math.floor(Math.random() * titles.length)][state.language];

    switch (type) {
      case 'video':
        subGain = (Math.floor(Math.random() * 50) + 20) * multipliers.subMult;
        moneyGain = (Math.floor(Math.random() * 100) + 50) * multipliers.moneyMult;
        repGain = 2;
        msg = `"${title}" ${t.uploadedMsg}`;
        if (Math.random() < 0.35) {
          setTimeout(() => setActiveSponsor(getRandomSponsorship(Math.random() < 0.2)), 800);
        }
        break;
      case 'cheat':
        subGain = (Math.floor(Math.random() * 5000) + 1000) * multipliers.subMult;
        moneyGain = (Math.floor(Math.random() * 15000) + 5000) * multipliers.moneyMult;
        repGain = 0; // Removed reputation loss
        msg = `${t.uploadCheat}!`;
        break;
      case 'promo':
        if (state.reputation < 100) {
          addNotification(state.language === 'tr' ? "100 İtibar Lazım!" : "Need 100 Reputation!", "error");
          return;
        }
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
      addNotification(t.invalidCode, "error");
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

  if (state.isGameOver) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-8 text-center z-[500]">
        <h1 className="text-5xl font-black text-red-500 mb-4 uppercase">{t.gameOver}</h1>
        <p className="text-xl text-slate-300 mb-8">{state.gameOverReason}</p>
        <button onClick={() => { localStorage.removeItem(SAVE_KEY); setState(INITIAL_STATE); }} className="px-8 py-3 bg-white text-slate-950 font-bold rounded-full hover:bg-slate-200 transition-colors uppercase tracking-widest">{t.restart}</button>
      </div>
    );
  }

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
      <nav className="flex justify-center gap-1 sm:gap-4 p-2 sm:p-4 bg-slate-900 border-b border-slate-800 shrink-0">
        {['main', 'shop', 'inventory', 'settings'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setCurrentTab(tab as any)}
            className={`px-4 py-2 rounded-xl font-bold transition-all text-xs sm:text-sm uppercase tracking-wider ${currentTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            {t[tab as keyof typeof t] || tab}
          </button>
        ))}
      </nav>

      <main className="flex-1 overflow-y-auto p-4 flex flex-col items-center w-full">
        
        {currentTab === 'main' && (
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pb-12">
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm">
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
                <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 text-center shadow-sm">
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{t.totalVideos}</p>
                  <p className="text-xl font-black text-white">{state.videoCount}</p>
                </div>
                <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 text-center shadow-sm">
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{t.boost}</p>
                  <p className="text-xl font-black text-emerald-400">x{multipliers.moneyMult.toFixed(1)}</p>
                </div>
              </div>

              {/* Strategy/Description Section */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm border-l-4 border-l-blue-500">
                <h2 className="text-[10px] font-black mb-2 uppercase text-blue-400 tracking-widest">{t.strategy}</h2>
                <p className="text-xs text-slate-400 leading-relaxed italic">
                  {t.strategyDesc}
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm">
                <h2 className="text-[10px] font-bold mb-3 uppercase text-slate-500 tracking-widest">{t.redeem}</h2>
                <div className="flex gap-2">
                  <input 
                    type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)}
                    placeholder={t.enterCode}
                    onKeyDown={(e) => e.key === 'Enter' && handleRedeemCode()}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-white"
                  />
                  <button onClick={handleRedeemCode} className="bg-blue-600 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-500 transition-colors">{t.redeem}</button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => handleAction('video')} 
                className="p-6 bg-blue-600 hover:bg-blue-500 rounded-3xl font-black uppercase shadow-lg active:scale-95 transition-all text-white flex flex-col items-center gap-1"
              >
                <span className="text-xl">{t.uploadVideo}</span>
                <span className="text-[9px] opacity-60 normal-case font-normal tracking-wider">{t.videoBtnDesc}</span>
              </button>
              <button 
                onClick={() => handleAction('promo')} 
                className="p-4 bg-indigo-600 hover:bg-indigo-500 rounded-3xl font-black uppercase shadow-md active:scale-95 transition-all text-white flex flex-col items-center gap-1"
              >
                <span className="text-sm">{t.brandPromo}</span>
                <span className="text-[8px] opacity-60 normal-case font-normal tracking-wider">{t.promoBtnDesc}</span>
              </button>
              <button 
                onClick={() => handleAction('project')} 
                className="p-4 bg-emerald-600 hover:bg-emerald-500 rounded-3xl font-black uppercase shadow-md active:scale-95 transition-all text-white flex flex-col items-center gap-1"
              >
                <span className="text-sm">{t.newProject}</span>
                <span className="text-[8px] opacity-60 normal-case font-normal tracking-wider">{t.projectBtnDesc}</span>
              </button>
              <button 
                onClick={() => handleAction('cheat')} 
                className="p-4 bg-amber-900/10 border border-dashed border-amber-500/50 rounded-3xl text-amber-500 font-bold active:scale-95 transition-all uppercase flex flex-col items-center gap-1"
              >
                <span className="text-sm">{t.uploadCheat}</span>
                <span className="text-[8px] opacity-60 normal-case font-normal tracking-wider">{t.cheatBtnDesc}</span>
              </button>
            </div>
          </div>
        )}

        {currentTab === 'shop' && (
          <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {SHOP_ITEMS.map(item => {
              const owned = state.inventory.includes(item.id);
              return (
                <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-sm group">
                  <div className="h-44 overflow-hidden"><img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.name[state.language]} /></div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-bold text-white mb-2 text-lg uppercase tracking-tight">{item.name[state.language]}</h3>
                    <p className="text-xs text-slate-400 mb-6 flex-1 leading-relaxed">{item.description[state.language]}</p>
                    <button 
                      onClick={() => buyItem(item)} disabled={owned}
                      className={`w-full py-3 rounded-xl font-bold transition-all uppercase text-xs tracking-widest ${owned ? 'bg-slate-800 text-slate-500' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'}`}
                    >
                      {owned ? t.owned : `${item.price.toLocaleString()} ₺`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {currentTab === 'inventory' && (
          <div className="w-full max-w-4xl pb-20">
            {state.inventory.length === 0 ? (
              <div className="py-24 text-center border-2 border-dashed border-slate-800 rounded-3xl text-slate-500 italic uppercase tracking-widest text-xs">
                {t.noItems}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {state.inventory.map(id => {
                  const item = SHOP_ITEMS.find(i => i.id === id);
                  return item && (
                    <div key={id} className="bg-slate-900 p-5 rounded-3xl border border-slate-800 flex flex-col items-center text-center shadow-sm">
                      <div className="w-16 h-16 rounded-xl overflow-hidden mb-3">
                        <img src={item.image} className="w-full h-full object-cover" alt={item.name[state.language]} />
                      </div>
                      <span className="text-[10px] font-bold text-white uppercase tracking-tighter leading-tight">{item.name[state.language]}</span>
                      <span className="text-[8px] text-blue-400 mt-1 uppercase font-black">x{item.multiplier} BOOST</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {currentTab === 'settings' && (
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8 shadow-xl">
            <h2 className="text-xl font-black uppercase text-white tracking-widest">{t.settings}</h2>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.langHeader}</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setState(p => ({ ...p, language: 'en' }))} className={`py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${state.language === 'en' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>English</button>
                <button onClick={() => setState(p => ({ ...p, language: 'tr' }))} className={`py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${state.language === 'tr' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Türkçe</button>
              </div>
            </div>
            <div className="pt-8 border-t border-slate-800">
              <button 
                onClick={() => { if(window.confirm(t.confirmWipe)) { localStorage.removeItem(SAVE_KEY); window.location.reload(); }}}
                className="w-full py-4 bg-red-900/10 text-red-500 font-bold rounded-xl border border-red-900/40 hover:bg-red-900/20 transition-all uppercase text-[10px] tracking-widest"
              >
                {t.deleteSave}
              </button>
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
