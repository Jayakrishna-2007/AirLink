import React from 'react';
import { User, Menu, LogOut, Radio } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SkyBookTopBarProps {
  onToggleMobileSidebar?: () => void;
  onOpenProfile: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToRealtime?: () => void;
}

export const SkyBookTopBar: React.FC<SkyBookTopBarProps> = ({
  onToggleMobileSidebar,
  onOpenProfile,
  onNavigateToLogin,
  onNavigateToRealtime,
}) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div className="flex items-center space-x-3">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Quick Shortcut to Realtime Airspace Radar */}
        {onNavigateToRealtime && (
          <button
            onClick={onNavigateToRealtime}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-[#0B1E36] text-white text-xs font-semibold shadow-sm transition-all hover:scale-102"
            title="Open Live Flight Radar"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="hidden xs:inline font-sans">Live Airspace Radar</span>
            <span className="xs:hidden">Radar</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          </button>
        )}
      </div>

      {/* User Profile Avatar Icon & Quick Sign Out button */}
      <div className="flex items-center space-x-3">
        {onNavigateToLogin && (
          <button
            onClick={onNavigateToLogin}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-red-300 bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-700 text-xs font-bold transition-all shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5 text-red-500" />
            <span>Switch / Sign Out</span>
          </button>
        )}

        <button
          onClick={onOpenProfile}
          className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 border-2 border-blue-500/30 flex items-center justify-center text-blue-700 font-bold transition-all shadow-sm hover:scale-105"
          title="View Profile / Account"
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};

