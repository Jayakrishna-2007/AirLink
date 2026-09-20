import React from 'react';
import { X, User, Mail, ShieldCheck, Calendar, Phone, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfileModalProps {
  onClose: () => void;
  onOpenAdmin: () => void;
  onNavigateToLogin?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose, onOpenAdmin, onNavigateToLogin }) => {
  const { user, isAdmin, quickSwitchUser } = useAuth();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#0B1E36] p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">{user?.name || 'Rahul Sharma'}</h3>
              <p className="text-xs text-blue-200">Airlink Frequent Flyer</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-6 space-y-4 text-xs text-slate-600">
          
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Email Address</span>
              </span>
              <span className="font-semibold text-slate-800">{user?.email || 'rahul.sharma@airlink.com'}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Contact Number</span>
              </span>
              <span className="font-semibold text-slate-800">{user?.phone || '+91 9876543210'}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Account Role</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-extrabold text-[10px] uppercase">
                {user?.role || 'USER'}
              </span>
            </div>
          </div>

          {/* Quick Role Switch for Viva / Testing */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 mb-2">Switch Role (Academic Demo Mode)</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => quickSwitchUser('USER')}
                className={`py-2 px-3 rounded-xl border font-bold text-xs transition-colors ${
                  !isAdmin ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'
                }`}
              >
                Normal Passenger
              </button>

              <button
                type="button"
                onClick={() => {
                  quickSwitchUser('ADMIN');
                  onOpenAdmin();
                  onClose();
                }}
                className={`py-2 px-3 rounded-xl border font-bold text-xs transition-colors ${
                  isAdmin ? 'border-amber-600 bg-amber-50 text-amber-700' : 'border-slate-200 text-slate-600'
                }`}
              >
                System Admin
              </button>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            {onNavigateToLogin && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToLogin();
                }}
                className="w-full py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition-colors flex items-center justify-center space-x-2"
              >
                <span>Log Out / Switch Account</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
            >
              Done
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
