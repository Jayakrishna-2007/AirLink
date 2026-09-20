import React from 'react';
import { Plane, ShieldCheck, Sparkles } from 'lucide-react';

interface WebsiteWatermarkFooterProps {
  variant?: 'light' | 'dark';
  showFloatingBadge?: boolean;
}

export const WebsiteWatermarkFooter: React.FC<WebsiteWatermarkFooterProps> = ({
  variant = 'light',
  showFloatingBadge = true,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Inline Content Bottom Watermark Footer */}
      <footer
        id="website-watermark-footer"
        className={`mt-14 pt-6 pb-8 border-t transition-colors select-none ${
          variant === 'dark'
            ? 'border-white/10 text-slate-400'
            : 'border-slate-200/90 text-slate-500'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left Brand info */}
          <div className="flex items-center space-x-2 text-xs">
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                variant === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'
              }`}
            >
              <Plane className="w-3.5 h-3.5" />
            </div>
            <span className={`font-bold ${variant === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              Airlink Aviation
            </span>
            <span className="opacity-40">•</span>
            <span className="text-[11px] opacity-75 font-mono">Flight Reservation & Airspace Portal</span>
          </div>

          {/* Center/Main Prominent Jayakrishna Creator Pill */}
          <div
            id="watermark-jayakrishna-badge"
            className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border shadow-2xs backdrop-blur-md transition-transform hover:scale-102 ${
              variant === 'dark'
                ? 'bg-white/10 border-white/15 text-white'
                : 'bg-white border-blue-200/80 text-slate-800 shadow-sm'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-semibold tracking-wide">
              Created by <strong className="font-extrabold text-blue-600 dark:text-sky-300">Jayakrishna</strong>
            </span>
          </div>

          {/* Right Copyright & Academic Metadata */}
          <div className="text-[11px] opacity-75 text-center sm:text-right font-mono">
            <span>© {currentYear} • Engineered by </span>
            <strong className={`font-semibold ${variant === 'dark' ? 'text-blue-200' : 'text-slate-800'}`}>
              Jayakrishna
            </strong>
          </div>
        </div>
      </footer>

      {/* Persistent Floating Badge at the very bottom-right of viewport */}
      {showFloatingBadge && (
        <aside
          id="persistent-floating-watermark"
          aria-label="Author Credit"
          className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-40 pointer-events-auto select-none group"
        >
          <div
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full shadow-lg border backdrop-blur-md transition-all duration-200 group-hover:scale-105 group-hover:shadow-xl ${
              variant === 'dark'
                ? 'bg-[#0B1E36]/90 border-blue-400/30 text-white shadow-blue-950/50'
                : 'bg-slate-900/90 hover:bg-slate-900 border-slate-700/60 text-white shadow-slate-950/30'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            <span className="text-xs font-semibold tracking-wide text-slate-200">
              Created by <span className="font-extrabold bg-gradient-to-r from-sky-300 to-indigo-200 bg-clip-text text-transparent">Jayakrishna</span>
            </span>
          </div>
        </aside>
      )}
    </>
  );
};
