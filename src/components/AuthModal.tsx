import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, ShieldCheck, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'LOGIN' | 'REGISTER';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'LOGIN' }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>(initialMode);
  const [email, setEmail] = useState('user@airlink.com');
  const [password, setPassword] = useState('Password@123');
  const [name, setName] = useState('Academic Student');
  const [phone, setPhone] = useState('+91 9811223344');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'LOGIN') {
        await login(email, password);
      } else {
        await register(name, email, phone, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setEmail(userEmail);
    setPassword('Password@123');
    setError(null);
    setLoading(true);
    try {
      await login(userEmail, 'Password@123');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              {mode === 'LOGIN' ? 'Sign In to Airlink' : 'Create Customer Account'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          
          {/* 1-Click Quick Demo Login Shortcuts */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 space-y-2">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>1-Click Viva Demo Logins</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('user@airlink.com')}
                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-blue-400">Customer</div>
                <div className="text-[10px] text-slate-400">user@airlink.com</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin@airlink.com')}
                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-left transition-all group"
              >
                <div className="text-xs font-bold text-indigo-300 group-hover:text-indigo-200">Administrator</div>
                <div className="text-[10px] text-slate-400">admin@airlink.com</div>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-xl text-xs text-red-300 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'REGISTER' && (
              <>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1 tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1 tracking-wider">
                    Mobile Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1 tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1 tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-1.5 transition-all mt-2"
            >
              <span>{loading ? 'Authenticating...' : mode === 'LOGIN' ? 'Sign In Securely' : 'Create Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="text-center pt-2">
            {mode === 'LOGIN' ? (
              <p className="text-xs text-slate-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('REGISTER'); setError(null); }}
                  className="text-blue-400 font-semibold hover:underline"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('LOGIN'); setError(null); }}
                  className="text-blue-400 font-semibold hover:underline"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
