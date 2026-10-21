import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Building2,
  Lock,
  CheckCircle2,
  ShieldCheck,
  Receipt,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Booking, Flight, Passenger, PaymentMethod, TravelClass } from '../types';
import { api } from '../services/api';

interface PaymentModalProps {
  flight: Flight;
  travelClass: TravelClass;
  passengers: Passenger[];
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  flight,
  travelClass,
  passengers,
  onClose,
  onBookingSuccess,
}) => {
  const [method, setMethod] = useState<PaymentMethod>('RAZORPAY');
  const [upiVpa, setUpiVpa] = useState('rahul.sharma@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 8190 2841 9028');
  const [cardHolder, setCardHolder] = useState('RAHUL SHARMA');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('829');
  const [bankName, setBankName] = useState('HDFC Bank');

  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Financial Fare Breakdown (Strict BigDecimal equivalent)
  const getBaseFarePerPax = () => {
    switch (travelClass) {
      case 'PREMIUM_ECONOMY': return flight.premiumFare;
      case 'BUSINESS': return flight.businessFare;
      case 'FIRST_CLASS': return flight.firstClassFare;
      default: return flight.economyFare;
    }
  };

  const count = passengers.length;
  const baseFarePerPax = getBaseFarePerPax();
  const baseSubtotal = Math.round(baseFarePerPax * count * 100) / 100;
  const taxAmount = Math.round(baseSubtotal * 0.12 * 100) / 100;
  const serviceFee = 250.00 * count;
  const totalAmount = Math.round((baseSubtotal + taxAmount + serviceFee) * 100) / 100;

  const handleProcessPayment = async () => {
    setError(null);
    setProcessing(true);
    setProcessingStep('Creating secure order with Razorpay gateway...');

    try {
      const orderRes = await api.createRazorpayOrder({
        amount: totalAmount,
        currency: 'INR',
        receipt: `rcpt_modal_${flight.id}_${Date.now()}`,
        notes: {
          flightNumber: flight.flightNumber,
          travelClass,
        },
      });

      setProcessingStep('Authorizing payment and verifying signature...');
      await new Promise(r => setTimeout(r, 600));

      const simulatedPaymentId = `pay_${Math.random().toString(36).substring(2, 16)}`;
      const simulatedSignature = `sig_${Math.random().toString(36).substring(2, 24)}`;

      await api.verifyRazorpayPayment({
        razorpay_order_id: orderRes.order?.id || 'order_simulated',
        razorpay_payment_id: simulatedPaymentId,
        razorpay_signature: simulatedSignature,
      });

      setProcessingStep('Generating unique 6-character PNR & issuing digital boarding pass...');
      await new Promise(r => setTimeout(r, 400));

      const bookingPayload = {
        flightId: flight.id,
        travelClass,
        passengers,
        paymentMethod: method,
        razorpayOrderId: orderRes.order?.id,
        razorpayPaymentId: simulatedPaymentId,
        razorpaySignature: simulatedSignature,
        upiVpa: method === 'UPI' ? upiVpa : undefined,
        cardNumber: method === 'CREDIT_CARD' || method === 'DEBIT_CARD' ? cardNumber : undefined,
        bankName: method === 'NET_BANKING' ? bankName : undefined,
      };

      const result = await api.createBooking(bookingPayload);
      onBookingSuccess(result);
    } catch (err: any) {
      setError(err.message || 'Payment simulation failed');
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Secure Simulated Checkout</span>
            </h3>
            <p className="text-xs text-slate-400">
              Flight {flight.flightNumber} • {flight.source} ➔ {flight.destination}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={processing}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-900/40 border border-red-700/60 rounded-xl text-xs text-red-200 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Payment Method Selector & Gateway Inputs */}
          <div className="md:col-span-7 space-y-5">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-2 tracking-wider">
                Select Payment Rail
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('UPI')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all ${
                    method === 'UPI'
                      ? 'bg-blue-600/20 border-blue-500 text-white font-bold shadow-md'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('CREDIT_CARD')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all ${
                    method === 'CREDIT_CARD' || method === 'DEBIT_CARD'
                      ? 'bg-blue-600/20 border-blue-500 text-white font-bold shadow-md'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-400" />
                  <span className="text-xs">Cards</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('NET_BANKING')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all ${
                    method === 'NET_BANKING'
                      ? 'bg-blue-600/20 border-blue-500 text-white font-bold shadow-md'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-amber-400" />
                  <span className="text-xs">Net Banking</span>
                </button>
              </div>
            </div>

            {/* UPI Option */}
            {method === 'UPI' && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center space-x-3 pb-2 border-b border-slate-800">
                  <div className="w-16 h-16 bg-white rounded-xl p-1.5 flex items-center justify-center shadow-inner">
                    <QrCode className="w-full h-full text-slate-900" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Scan UPI QR or enter Virtual Address</div>
                    <div className="text-[11px] text-slate-400">Supported: GPay, PhonePe, Paytm, BHIM</div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
                    Virtual Payment Address (VPA)
                  </label>
                  <input
                    type="text"
                    value={upiVpa}
                    onChange={(e) => setUpiVpa(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="user@bank"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  {['rahul@okaxis', 'sharma@okhdfcbank', '9811223344@paytm'].map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setUpiVpa(v)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-blue-300 font-mono"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Card Option */}
            {(method === 'CREDIT_CARD' || method === 'DEBIT_CARD') && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                {/* Visual Card Preview */}
                <div className="bg-gradient-to-tr from-blue-900 via-indigo-900 to-slate-800 p-4 rounded-xl text-white shadow-lg border border-blue-500/30">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-mono tracking-widest text-blue-300 uppercase">AERO PREMIER</span>
                    <CreditCard className="w-5 h-5 text-amber-300" />
                  </div>
                  <div className="text-sm font-mono tracking-wider font-bold mb-3">{cardNumber}</div>
                  <div className="flex justify-between items-end text-[10px] font-mono">
                    <div>
                      <div className="text-[8px] text-blue-300 uppercase">Cardholder</div>
                      <div>{cardHolder}</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-blue-300 uppercase">Expires</div>
                      <div>{cardExpiry}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Net Banking Option */}
            {method === 'NET_BANKING' && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
                  Select Partner Bank
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBankName(b)}
                      className={`p-2 rounded-xl text-left text-xs border transition-colors ${
                        bankName === b
                          ? 'bg-blue-600/20 border-blue-500 text-white font-semibold'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Fare Summary & Breakdown Column */}
          <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-white font-bold text-sm pb-2 border-b border-slate-800">
                <Receipt className="w-4 h-4 text-blue-400" />
                <span>Transparent Fare Breakdown</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Base Fare ({count} × ₹{baseFarePerPax.toLocaleString()})</span>
                  <span className="text-white font-mono">₹{baseSubtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Aviation GST & Taxes (12%)</span>
                  <span className="text-white font-mono">₹{taxAmount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Passenger Security Fee</span>
                  <span className="text-white font-mono">₹{serviceFee.toLocaleString()}</span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="font-bold text-white">Total Payable Amount</span>
                  <span className="font-mono text-lg font-extrabold text-emerald-400">
                    ₹{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-[11px] text-blue-300 space-y-1">
                <div className="font-semibold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Academic Simulated Payment</span>
                </div>
                <p className="text-blue-300/80 leading-relaxed">
                  No actual credit card charge occurs. Demonstrates Polymorphic Strategy Pattern implementation.
                </p>
              </div>
            </div>

            {/* Pay Button / Processing Indicator */}
            <div className="pt-4 mt-4 border-t border-slate-800">
              {processing ? (
                <div className="space-y-2 text-center py-2">
                  <div className="flex items-center justify-center space-x-2 text-blue-400 text-xs font-semibold">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{processingStep}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full w-3/4 animate-pulse"></div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleProcessPayment}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 text-xs transition-all flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Pay ₹{totalAmount.toLocaleString()} & Confirm Booking</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
