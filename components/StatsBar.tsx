import React, { useEffect, useState, useRef } from 'react';
import { GameState } from '../types.ts';
import { TRANSLATIONS } from '../constants.ts';

interface StatsBarProps {
  state: GameState;
}

const AnimatedNumber: React.FC<{ value: number; suffix?: string; colorClass?: string }> = ({ value, suffix = "", colorClass = "" }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [flash, setFlash] = useState<'positive' | 'negative' | null>(null);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (value !== prevValueRef.current) {
      const isPositive = value > prevValueRef.current;
      setFlash(isPositive ? 'positive' : 'negative');
      const flashTimeout = setTimeout(() => setFlash(null), 1000);
      
      const startValue = prevValueRef.current;
      const endValue = value;
      const duration = 1200;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 5);
        const currentVal = Math.floor(startValue + (endValue - startValue) * ease);
        setDisplayValue(currentVal);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          prevValueRef.current = endValue;
        }
      };

      requestAnimationFrame(animate);
      return () => clearTimeout(flashTimeout);
    }
  }, [value]);

  return (
    <span className={`tabular-nums transition-all duration-300 inline-block 
      ${flash === 'positive' ? 'scale-125 brightness-150' : ''}
      ${flash === 'negative' ? 'scale-90 brightness-150' : ''}
      ${!flash ? 'scale-100 ' + (colorClass || 'rgb-text') : ''}
    `}>
      {displayValue.toLocaleString()}{suffix}
    </span>
  );
};

const StatsBar: React.FC<StatsBarProps> = ({ state }) => {
  const t = TRANSLATIONS[state.language];
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-5 glass border-b border-slate-800 shrink-0 shadow-2xl relative z-50 animate-slide-down">
      <div className="flex items-center gap-4 sm:gap-10">
        <div className="flex flex-col group">
          <span className="text-[8px] uppercase font-black tracking-widest mb-0.5 transition-colors opacity-70">{t.money}</span>
          <span className="text-lg font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
            <AnimatedNumber value={state.money} suffix=" ₺" />
          </span>
        </div>
        <div className="flex flex-col border-l border-slate-800 pl-4 sm:pl-10 group">
          <span className="text-[8px] uppercase font-black tracking-widest mb-0.5 transition-colors opacity-70">{t.reputation}</span>
          <span className="text-lg font-black drop-shadow-[0_0_8px_rgba(96,165,250,0.3)]">
            <AnimatedNumber value={state.reputation} />
          </span>
        </div>
        <div className="flex flex-col border-l border-slate-800 pl-4 sm:pl-10 group">
          <span className="text-[8px] uppercase font-black tracking-widest mb-0.5 transition-colors opacity-70">{t.subscribers}</span>
          <span className="text-lg font-black drop-shadow-[0_0_8px_rgba(192,132,252,0.3)]">
            <AnimatedNumber value={state.subscribers} />
          </span>
        </div>
      </div>
      <div className="flex items-center gap-6 ml-auto">
        <div className="flex flex-col items-end group">
          <span className="text-[8px] uppercase font-black tracking-widest mb-0.5 transition-colors opacity-70">{t.day}</span>
          <div className="px-4 py-1.5 rounded-lg rgb-border-anim group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center">
             <span className="text-xs font-black uppercase tracking-tighter tabular-nums rgb-text">DAY {state.day}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;