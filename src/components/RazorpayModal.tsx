import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  ArrowRight,
  Smartphone,
  Info
} from 'lucide-react';
import { Flight, Passenger, TravelClass, Booking } from '../types';
import { api } from '../services/api';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: Flight;
  travelClass: TravelClass;
  passengers: Passenger[];
  selectedSeats: string[];
  totalAmount: number;
  orderId: string;
  keyId: string;
  onBookingSuccess: (booking: Booking) => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  onClose,
  flight,
  travelClass,
  passengers,
  selectedSeats,
  totalAmount,
  orderId,
  keyId,
  onBookingSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET'>('UPI');
  
  // Form states
  const [upiId, setUpiId] = useState(passengers[0]?.email ? `${passengers[0].email.split('@')[0]}@okaxis` : 'rahul.sharma@okaxis');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'GPAY' | 'PHONEPE' | 'PAYTM' | 'CRED'>('GPAY');
  
  const [cardNumber, setCardNumber] = useState('4532 8920 1827 9012');
  const [cardHolder, setCardHolder] = useState(passengers[0]?.fullName?.toUpperCase() || 'RAHUL SHARMA');
  const [expiry, setExpiry] = useState('09/28');
  const [cvv, setCvv] = useState('839');
  
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [selectedWallet, setSelectedWallet] = useState('Amazon Pay');

  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Timer simulation for QR code (10:00 countdown)
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePayNow = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      setStatusMessage('Connecting to Razorpay Secure Gateway...');
      await new Promise((r) => setTimeout(r, 600));

      const simulatedPaymentId = `pay_${Math.random().toString(36).substring(2, 16)}`;
      const simulatedSignature = `sig_${Math.random().toString(36).substring(2, 24)}`;

      setStatusMessage('Verifying payment signature with Airlink servers...');
      // Call backend verification endpoint
      await api.verifyRazorpayPayment({
        razorpay_order_id: orderId,
        razorpay_payment_id: simulatedPaymentId,
        razorpay_signature: simulatedSignature,
      });

      setStatusMessage('Payment verified! Confirming flight reservation and seat allocation...');
      await new Promise((r) => setTimeout(r, 500));

      const bookingResult = await api.createBooking({
        flightId: flight.id,
        travelClass,
        passengers: passengers.map((p, idx) => ({
          ...p,
          seatNumber: selectedSeats[idx] || '12A',
        })),
        paymentMethod: 'RAZORPAY',
        razorpayPaymentId: simulatedPaymentId,
        razorpayOrderId: orderId,
        razorpaySignature: simulatedSignature,
      });

      onBookingSuccess(bookingResult);
      onClose();
    } catch (err: any) {
      console.error('Payment verification failed:', err);
      setError(err?.message || 'Payment verification failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Razorpay Branded Header */}
        <div className="bg-[#0C2340] text-white px-6 py-5 flex items-center justify-between border-b border-blue-900/40">
          <div className="flex items-center space-x-3">
            {/* Razorpay Brand Icon */}
            <div className="w-10 h-10 rounded-xl bg-[#0284C7] flex items-center justify-center shadow-md font-black text-white text-lg tracking-tighter">
              ₹
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-extrabold tracking-wide text-white">Razorpay</span>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-bold border border-sky-400/30">
                  SECURE CHECKOUT
                </span>
              </div>
              <div className="text-xs text-slate-300 font-medium">
                Airlink Aviation • Flight {flight.flightNumber} ({flight.source} ➔ {flight.destination})
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Total Payable</div>
              <div className="text-xl font-black text-white">₹{totalAmount.toLocaleString()}</div>
            </div>

            <button
              onClick={onClose}
              disabled={isProcessing}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40"
              title="Close payment window"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Order Details Bar */}
        <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-500">Order ID:</span>
            <code className="font-mono font-bold text-slate-800 bg-slate-200/70 px-1.5 py-0.5 rounded text-[11px]">
              {orderId}
            </code>
          </div>

          <div className="flex items-center space-x-1.5 text-emerald-600 font-bold text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Navigation Sidebar for Payment Rails */}
          <div className="md:col-span-4 space-y-1.5 border-r border-slate-100 pr-0 md:pr-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Payment Rails
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('UPI')}
              className={`w-full p-3 rounded-xl text-left flex items-center justify-between text-xs transition-all ${
                activeTab === 'UPI'
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>UPI / QR Code</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded">FAST</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('CARD')}
              className={`w-full p-3 rounded-xl text-left flex items-center justify-between text-xs transition-all ${
                activeTab === 'CARD'
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Card (Credit / Debit)</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('NET_BANKING')}
              className={`w-full p-3 rounded-xl text-left flex items-center justify-between text-xs transition-all ${
                activeTab === 'NET_BANKING'
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>Net Banking</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('WALLET')}
              className={`w-full p-3 rounded-xl text-left flex items-center justify-between text-xs transition-all ${
                activeTab === 'WALLET'
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Wallet className="w-4 h-4 text-amber-600" />
                <span>Wallets</span>
              </div>
            </button>

            <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
              <div>Passengers: <strong className="text-slate-700">{passengers.length}</strong></div>
              <div>Seats: <strong className="text-slate-700">{selectedSeats.join(', ') || 'Auto'}</strong></div>
              <div>Class: <strong className="text-slate-700">{travelClass}</strong></div>
            </div>
          </div>

          {/* Payment Method Inputs */}
          <div className="md:col-span-8 space-y-4">
            
            {/* UPI Option */}
            {activeTab === 'UPI' && (
              <div className="space-y-4">
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-emerald-900">Scan QR via any UPI App</div>
                    <div className="text-[11px] text-emerald-700">Google Pay, PhonePe, Paytm, BHIM, CRED</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100/80 px-2 py-1 rounded-md font-bold">
                      {formatTimer(timeLeft)}
                    </span>
                  </div>
                </div>

                {/* Simulated QR Code Box */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-3">
                  <div className="p-3 bg-slate-900 rounded-xl shadow-inner">
                    <QrCode className="w-28 h-28 text-white" />
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium text-center">
                    Scan with any UPI app on your phone to complete instant payment
                  </div>
                </div>

                {/* UPI VPA Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Or Enter UPI ID / VPA
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okhdfcbank"
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                    <div className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-200 flex items-center">
                      ✓ Verified
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Card Option */}
            {activeTab === 'CARD' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4532 0000 0000 0000"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-bold tracking-wider focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="NAME ON CARD"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Net Banking Option */}
            {activeTab === 'NET_BANKING' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">Popular Banks</label>
                <div className="grid grid-cols-2 gap-2">
                  {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                        selectedBank === bank
                          ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-500'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Wallets Option */}
            {activeTab === 'WALLET' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Wallet</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Amazon Pay', 'Paytm Wallet', 'MobiKwik', 'Freecharge', 'Airtel Money'].map((wallet) => (
                    <button
                      key={wallet}
                      type="button"
                      onClick={() => setSelectedWallet(wallet)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                        selectedWallet === wallet
                          ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-500'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {wallet}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Lock className="w-4 h-4 text-slate-400" />
            <span>Razorpay Payment Gateway API v1</span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handlePayNow}
              disabled={isProcessing}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-75 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{statusMessage || 'Authorizing...'}</span>
                </>
              ) : (
                <>
                  <span>Pay ₹{totalAmount.toLocaleString()}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
