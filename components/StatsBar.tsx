
import React from 'react';
import { GameState } from '../types';
import { TRANSLATIONS } from '../constants';

interface StatsBarProps {
  state: GameState;
}

const StatsBar: React.FC<StatsBarProps> = ({ state }) => {
  const t = TRANSLATIONS[state.language];
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border-b border-slate-800 shrink-0 shadow-sm relative z-50">
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-0.5">{t.money}</span>
          <span className="text-base font-black text-emerald-400 tabular-nums">{state.money.toLocaleString()} ₺</span>
        </div>
        <div className="flex flex-col border-l border-slate-800 pl-6">
          <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-0.5">{t.reputation}</span>
          <span className="text-base font-black text-blue-400 tabular-nums">{state.reputation}</span>
        </div>
        <div className="flex flex-col border-l border-slate-800 pl-6">
          <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-0.5">{t.subscribers}</span>
          <span className="text-base font-black text-purple-400 tabular-nums">{state.subscribers.toLocaleString()}</span>
        </div>
      </div>
      <div className="flex items-center gap-6 ml-auto">
        <div className="flex flex-col items-end">
          <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-0.5">{t.day}</span>
          <span className="text-sm font-black text-slate-200 uppercase tabular-nums">Day #{state.day}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
