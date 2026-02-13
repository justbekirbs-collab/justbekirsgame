
import React from 'react';
import { Sponsorship, Language } from '../types.ts';
import { TRANSLATIONS, BRAND_LOGOS } from '../constants.ts';

interface SponsorshipDialogProps {
  sponsor: Sponsorship;
  language: Language;
  onAccept: (sponsor: Sponsorship) => void;
  onReject: () => void;
}

const SponsorshipDialog: React.FC<SponsorshipDialogProps> = ({ sponsor, language, onAccept, onReject }) => {
  const t = TRANSLATIONS[language];
  const brandLogo = BRAND_LOGOS[sponsor.brand];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl animate-pop-in overflow-hidden relative">
        {/* Background glow for branding */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-600/10 blur-[60px] pointer-events-none" />

        <div className="flex flex-col items-center mb-6 relative z-10">
          {brandLogo ? (
            <div className="w-20 h-20 bg-white rounded-2xl p-3 flex items-center justify-center shadow-xl mb-4 animate-float">
              <img src={brandLogo} alt={sponsor.brand} className="w-full h-full object-contain" />
            </div>
          ) : (
             <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center shadow-xl mb-4 text-3xl">
               🤝
             </div>
          )}
          <h2 className="text-xl font-black text-slate-100 uppercase tracking-tight text-center">{t.sponsorshipTitle}</h2>
          {sponsor.isScam && (
            <span className="mt-2 px-2 py-1 bg-red-600 text-white text-[8px] font-black uppercase rounded tracking-widest animate-pulse">
              {t.scamWarning}
            </span>
          )}
        </div>

        <div className="space-y-4 mb-8 relative z-10">
          <div className="p-4 bg-slate-800/50 glass rounded-xl border border-slate-700/50">
            <p className="text-slate-500 text-[9px] uppercase font-black mb-1 tracking-widest">{t.brand}</p>
            <p className="text-base font-bold text-white">{sponsor.brand}</p>
          </div>

          <div className="p-4 bg-slate-800/50 glass rounded-xl border border-slate-700/50">
            <p className="text-slate-500 text-[9px] uppercase font-black mb-1 tracking-widest">{t.offerPrice}</p>
            <p className="text-lg font-black text-emerald-400">{sponsor.offer.toLocaleString()} ₺</p>
          </div>

          {sponsor.url && (
            <div className="p-4 bg-red-900/10 glass rounded-xl border border-red-500/20">
              <p className="text-red-500 text-[9px] uppercase font-black mb-1 tracking-widest">{t.website}</p>
              <p className="text-xs font-mono text-red-300 break-all select-all">{sponsor.url}</p>
            </div>
          )}

          <div className="p-4 bg-slate-800/50 glass rounded-xl border border-slate-700/50">
            <p className="text-slate-500 text-[9px] uppercase font-black mb-1 tracking-widest">{t.details}</p>
            <p className="text-slate-300 text-sm leading-relaxed">{sponsor.description[language]}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 relative z-10">
          <button onClick={onReject} className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all border border-slate-700 uppercase text-[10px] tracking-widest active-shrink">{t.reject}</button>
          <button onClick={() => onAccept(sponsor)} className="px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-md uppercase text-[10px] tracking-widest active-shrink">{t.accept}</button>
        </div>
      </div>
    </div>
  );
};

export default SponsorshipDialog;
