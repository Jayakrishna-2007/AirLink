import React, { useState } from 'react';
import {
  Plane,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Ticket,
  Clock,
  KeyRound,
  ArrowLeft,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onSuccessNavigate?: () => void;
  onBrowseAsGuest?: () => void;
  initialMode?: 'LOGIN' | 'REGISTER';
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccessNavigate,
  onBrowseAsGuest,
  initialMode = 'LOGIN',
}) => {
  const { login, register, isAuthenticated, user } = useAuth();
  
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Login Form States
  const [email, setEmail] = useState('user@airlink.com');
  const [password, setPassword] = useState('Password@123');
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (mode === 'REGISTER') {
      if (!name.trim()) {
        setError('Please enter your full legal name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify.');
        return;
      }
      if (!acceptTerms) {
        setError('You must accept the airline booking terms and privacy policy.');
        return;
      }
    } else {
      if (!email.trim() || !password) {
        setError('Please enter both email address and password.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'LOGIN') {
        await login(email.trim(), password);
        setSuccessMessage('Successfully authenticated! Redirecting to flight portal...');
      } else {
        await register(name.trim(), email.trim(), phone.trim(), password);
        setSuccessMessage('Account registered successfully! Welcome aboard Airlink.');
      }
      
      setTimeout(() => {
        if (onSuccessNavigate) {
          onSuccessNavigate();
        }
      }, 900);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string, demoRole: string) => {
    setEmail(demoEmail);
    setPassword('Password@123');
    setError(null);
    setSuccessMessage(null);
    setLoading(true);
    try {
      await login(demoEmail, 'Password@123');
      setSuccessMessage(`Logged in as ${demoRole}! Redirecting...`);
      setTimeout(() => {
        if (onSuccessNavigate) {
          onSuccessNavigate();
        }
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Gateway Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Plane className="w-4 h-4 -rotate-45" />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900 tracking-tight">Airlink Airlines • Traveler Gateway</div>
            <div className="text-[11px] text-slate-500 font-medium">Please sign in or register to continue to flight booking</div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">256-Bit Encrypted Authentication</span>
        </div>
      </div>

      {/* Main Two-Panel Login Showcase Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        
        {/* Left Side: Brand Visual & Aviation Highlights (5 columns) */}
        <div className="lg:col-span-5 bg-[#0B1E36] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          
          {/* Authentic Flight Background Overlay */}
          <img
            src="/assets/aircraft-hero.jpg"
            alt="Commercial airliner in flight"
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity pointer-events-none"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E36] via-[#0B1E36]/80 to-[#0B1E36]/65 pointer-events-none" />
          
          {/* Subtle decorative aviation circles & flight line */}
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent pointer-events-none" />

          {/* Brand Header */}
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Plane className="w-4 h-4 -rotate-45" />
              </div>
              <div className="text-left">
                <div className="text-base font-black tracking-tight text-white leading-none">Airlink</div>
                <div className="text-[10px] text-blue-200 font-medium italic mt-0.5">Commercial Aviation Portal</div>
              </div>
            </div>

            <div className="pt-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                Fly Beyond Limits with Airlink
              </h1>
              <p className="text-xs sm:text-sm text-blue-100/80 font-normal mt-2 leading-relaxed">
                Sign in to manage commercial reservations, select premium cabin seats, and download verified digital boarding passes.
              </p>
            </div>
          </div>

          {/* Feature Highlights with Badges */}
          <div className="relative z-10 py-8 space-y-4">
            <div className="flex items-start space-x-3.5 bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 flex-shrink-0 mt-0.5">
                <Ticket className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Instant PNR & Boarding Pass</div>
                <div className="text-[11px] text-blue-200/70 mt-0.5">Generate IATA-compliant barcode passes ready for airport gate boarding.</div>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Spring Boot 3.x Security</div>
                <div className="text-[11px] text-blue-200/70 mt-0.5">BCrypt password hashing & JWT token-based session persistence.</div>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 flex-shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Live Seat Map Reservation</div>
                <div className="text-[11px] text-blue-200/70 mt-0.5">Lock window and aisle seats with synchronized availability updates.</div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="relative z-10 pt-4 border-t border-white/10 text-[11px] text-blue-200/70 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <span>Created by:</span>
              <strong className="text-white font-bold tracking-wide">Jayakrishna</strong>
            </span>
            <span className="font-mono text-[10px] text-emerald-400">● 100% Operational</span>
          </div>

        </div>

        {/* Right Side: Interactive Login / Register Form (7 columns) */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-white">
          
          <div className="space-y-6">
            
            {/* Top Switcher: Sign In vs Register */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {mode === 'LOGIN' ? 'Welcome Back, Traveler' : 'Join Airlink Frequent Flyer'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {mode === 'LOGIN'
                    ? 'Access your flight bookings and frequent flyer benefits.'
                    : 'Create your passenger account in less than 30 seconds.'}
                </p>
              </div>

              {/* Segmented Pill Switcher */}
              <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setMode('LOGIN');
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    mode === 'LOGIN'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('REGISTER');
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    mode === 'REGISTER'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3 text-xs text-red-700 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{error}</div>
              </div>
            )}

            {/* Success Message Alert */}
            {successMessage && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-3 text-xs text-emerald-800 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 font-semibold">{successMessage}</div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* If Register: Full Name */}
              {mode === 'REGISTER' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Legal Name (as on Government ID)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Arjun Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="user@airlink.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* If Register: Phone Field */}
              {mode === 'REGISTER' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Contact Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  {mode === 'LOGIN' && (
                    <button
                      type="button"
                      onClick={() => setForgotPasswordOpen(true)}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter account password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* If Register: Confirm Password */}
              {mode === 'REGISTER' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Checkboxes & Helpers */}
              {mode === 'LOGIN' ? (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <span>Remember my session on this device</span>
                  </label>
                </div>
              ) : (
                <div className="pt-1">
                  <label className="flex items-start space-x-2 text-xs text-slate-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500 mt-0.5"
                    />
                    <span>
                      I agree to the Airlink Conditions of Carriage, Fare Rules, and Privacy Guidelines.
                    </span>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wider shadow-md shadow-blue-600/20 hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'LOGIN' ? 'Sign In & Continue Booking' : 'Register & Continue Booking'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

            {/* Quick 1-Click Academic Demo Sign-In Cards */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Instant Academic Demo Logins</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">1-Click Fast Auth</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                
                {/* Demo Passenger Card */}
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('user@airlink.com', 'Passenger (Rahul)')}
                  disabled={loading}
                  className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200/80 text-left transition-all group flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-blue-950 flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      <span>Passenger Demo</span>
                    </div>
                    <div className="text-[10px] text-blue-700/80 font-mono mt-0.5">user@airlink.com</div>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-white px-2 py-0.5 rounded-lg border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    Login
                  </span>
                </button>

                {/* Demo Admin Card */}
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin@airlink.com', 'System Admin')}
                  disabled={loading}
                  className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 text-left transition-all group flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-amber-950 flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                      <span>Admin Portal Demo</span>
                    </div>
                    <div className="text-[10px] text-amber-700/80 font-mono mt-0.5">admin@airlink.com</div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 bg-white px-2 py-0.5 rounded-lg border border-amber-200 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    Login
                  </span>
                </button>

              </div>
            </div>

          </div>

          {/* Bottom Help Note & Watermark */}
          <div className="pt-4 text-center space-y-2 border-t border-slate-100">
            <p className="text-[11px] text-slate-500">
              Need help accessing your booking? Call 24/7 Airline Support at{' '}
              <span className="font-semibold text-slate-700">+91 1800-AIR-LINK</span>
            </p>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 font-medium">
              <span>Created by:</span>
              <span className="font-bold text-blue-700">Jayakrishna</span>
            </div>
          </div>

        </div>

      </div>

      {/* Forgot Password Modal Dialog */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Password Recovery</h3>
                <p className="text-xs text-slate-500">Airlink Security Credentials</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
              <p>For academic demo and testing purposes, all preset accounts use the default password:</p>
              <div className="bg-white p-2.5 rounded-xl border border-slate-300 font-mono text-center font-bold text-blue-700 text-sm">
                Password@123
              </div>
              <p className="text-[11px] text-slate-400">
                In a production deployment, a 6-digit one-time passcode (OTP) is dispatched to your verified mobile number and email.
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setPassword('Password@123');
                  setForgotPasswordOpen(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
              >
                Auto-Fill Password
              </button>
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
