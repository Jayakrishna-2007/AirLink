import React from 'react';
import {
  Plane,
  Home,
  Search,
  Ticket,
  User,
  ShieldCheck,
  BookOpen,
  LogOut,
  Building2,
  Radio
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type ActiveNav = 'HOME' | 'SEARCH' | 'REALTIME' | 'BOOKINGS' | 'PROFILE' | 'ADMIN' | 'VIVA';

interface SkyBookSidebarProps {
  currentNav: ActiveNav;
  onNavigate: (nav: ActiveNav) => void;
  onOpenAirportGuide?: () => void;
}

export const SkyBookSidebar: React.FC<SkyBookSidebarProps> = ({
  currentNav,
  onNavigate,
  onOpenAirportGuide,
}) => {
  const { user, isAdmin, logout, quickSwitchUser } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { id: 'HOME' as const, label: 'Home', icon: Home },
    { id: 'SEARCH' as const, label: 'Search Flights', icon: Search },
    { id: 'REALTIME' as const, label: 'Realtime Flights', icon: Radio, isLive: true },
    { id: 'BOOKINGS' as const, label: 'My Bookings', icon: Ticket },
    { id: 'PROFILE' as const, label: 'Profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-[#0B1E36] text-white flex flex-col justify-between flex-shrink-0 h-screen sticky top-0 shadow-2xl z-30 select-none border-r border-[#152e4d]">
      {/* Brand Header */}
      <div>
        <div
          onClick={() => onNavigate('HOME')}
          className="p-6 cursor-pointer flex items-center space-x-3 border-b border-white/10 hover:opacity-90 transition-opacity"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-white shadow-inner">
            <Plane className="w-5 h-5 -rotate-45 text-blue-400" />
          </div>
          <div>
            <div className="text-xl font-black tracking-tight text-white flex items-center space-x-1">
              <span>Airlink</span>
            </div>
            <p className="text-[11px] text-blue-200/70 font-medium italic -mt-0.5">
              Fly Beyond Limits
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentNav === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id.toLowerCase()}-btn`}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.isLive && (
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 tracking-wider flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                    <span>LIVE</span>
                  </span>
                )}
              </button>
            );
          })}

          {/* Special Project Links: Airport Radar, Admin Portal & Viva Hub */}
          <div className="pt-4 mt-4 border-t border-white/10 space-y-1.5">
            {onOpenAirportGuide && (
              <button
                onClick={onOpenAirportGuide}
                className="w-full flex items-center space-x-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Airport Radar</span>
              </button>
            )}

            <button
              onClick={() => {
                if (!isAdmin) quickSwitchUser('ADMIN');
                onNavigate('ADMIN');
              }}
              className={`w-full flex items-center space-x-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentNav === 'ADMIN'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-amber-400/90 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Admin Portal</span>
            </button>

            <button
              onClick={() => onNavigate('VIVA')}
              className={`w-full flex items-center space-x-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentNav === 'VIVA'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-emerald-400/90 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Viva & Project Hub</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Footer / User & Logout */}
      <div className="p-4 border-t border-white/10 space-y-3">
        <div className="px-3 py-2 rounded-xl bg-white/5 flex items-center justify-between text-xs">
          <div className="truncate">
            <div className="font-semibold text-white truncate">{user?.name || 'Rahul Sharma'}</div>
            <div className="text-[10px] text-blue-300 truncate">{user?.email || 'user@airlink.com'}</div>
          </div>
          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-400/30">
            {user?.role || 'USER'}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>

        <div className="pt-2 text-center text-[10px] text-slate-400/80 font-mono flex items-center justify-center space-x-1.5 border-t border-white/5">
          <span>Created by:</span>
          <span className="font-semibold text-blue-300">Jayakrishna</span>
        </div>
      </div>
    </aside>
  );
};
