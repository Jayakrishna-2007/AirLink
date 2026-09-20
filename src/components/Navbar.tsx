import React, { useState } from 'react';
import { Plane, User, ShieldCheck, Ticket, BookOpen, LogOut, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab?: 'search' | 'bookings' | 'admin' | 'viva';
  setActiveTab?: (tab: 'search' | 'bookings' | 'admin' | 'viva') => void;
  openAuthModal?: () => void;
  currentView?: 'SEARCH' | 'MY_BOOKINGS' | 'ADMIN' | 'VIVA';
  onNavigate?: (view: 'SEARCH' | 'MY_BOOKINGS' | 'ADMIN' | 'VIVA') => void;
  onOpenAuthModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openAuthModal,
  currentView,
  onNavigate,
  onOpenAuthModal,
}) => {
  const { user, isAuthenticated, isAdmin, logout, quickSwitchUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  // Normalize current tab
  const tab = (currentView
    ? currentView === 'SEARCH'
      ? 'search'
      : currentView === 'MY_BOOKINGS'
      ? 'bookings'
      : currentView === 'ADMIN'
      ? 'admin'
      : 'viva'
    : activeTab) || 'search';

  const navigateTo = (target: 'search' | 'bookings' | 'admin' | 'viva') => {
    if (setActiveTab) setActiveTab(target);
    if (onNavigate) {
      const viewMap: Record<string, 'SEARCH' | 'MY_BOOKINGS' | 'ADMIN' | 'VIVA'> = {
        search: 'SEARCH',
        bookings: 'MY_BOOKINGS',
        admin: 'ADMIN',
        viva: 'VIVA',
      };
      onNavigate(viewMap[target]);
    }
  };

  const handleOpenAuth = () => {
    if (openAuthModal) openAuthModal();
    if (onOpenAuthModal) onOpenAuthModal();
  };

  const handleRoleSwitch = async (targetRole: 'USER' | 'ADMIN') => {
    setIsSwitching(true);
    try {
      await quickSwitchUser(targetRole);
      if (targetRole === 'ADMIN') {
        navigateTo('admin');
      } else {
        navigateTo('search');
      }
    } finally {
      setIsSwitching(false);
      setDropdownOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigateTo('search')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Plane className="w-6 h-6 text-white transform -rotate-45" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                AeroReserve
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                B.Tech CSE Project
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Spring Boot & React Booking Engine</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <button
            id="nav-search-btn"
            onClick={() => navigateTo('search')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
              tab === 'search'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Plane className="w-4 h-4" />
            <span>Search Flights</span>
          </button>

          <button
            id="nav-bookings-btn"
            onClick={() => navigateTo('bookings')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
              tab === 'bookings'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>My Bookings</span>
          </button>

          <button
            id="nav-admin-btn"
            onClick={() => {
              if (!isAdmin) {
                handleRoleSwitch('ADMIN');
              } else {
                navigateTo('admin');
              }
            }}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
              tab === 'admin'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Admin Portal</span>
            {isAdmin && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>}
          </button>

          <button
            id="nav-viva-btn"
            onClick={() => navigateTo('viva')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
              tab === 'viva'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                : 'text-emerald-400 hover:text-white hover:bg-emerald-950/40 border border-emerald-500/30'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Viva & Academic Hub</span>
          </button>
        </nav>

        {/* User / Authentication Area */}
        <div className="flex items-center space-x-3">
          {/* Quick Demo Role Switcher */}
          <div className="relative">
            <button
              id="role-switch-dropdown-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              disabled={isSwitching}
              className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 transition-colors"
            >
              <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-amber-400' : 'bg-blue-400'}`}></span>
              <span>Demo Role: {isAdmin ? 'Admin' : 'Passenger'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 border-b border-slate-700/60 mb-1 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  Quick Demo Switch (Viva Ready)
                </div>
                <button
                  id="switch-to-passenger-btn"
                  onClick={() => handleRoleSwitch('USER')}
                  className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-700/80 text-slate-200"
                >
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-400" />
                    <div>
                      <div className="font-semibold text-white">Passenger Demo</div>
                      <div className="text-[11px] text-slate-400">user@airlink.com</div>
                    </div>
                  </div>
                  {!isAdmin && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>

                <button
                  id="switch-to-admin-btn"
                  onClick={() => handleRoleSwitch('ADMIN')}
                  className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-700/80 text-slate-200"
                >
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="font-semibold text-white">Administrator Demo</div>
                      <div className="text-[11px] text-slate-400">admin@airlink.com</div>
                    </div>
                  </div>
                  {isAdmin && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>
              </div>
            )}
          </div>

          {/* User Profile / Auth */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <div className="hidden lg:block text-right">
                <div className="text-xs font-semibold text-white">{user?.name}</div>
                <div className="text-[10px] text-slate-400">{user?.role}</div>
              </div>
              <button
                id="logout-btn"
                onClick={logout}
                title="Log out"
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="login-register-btn"
              onClick={handleOpenAuth}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              Sign In / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
