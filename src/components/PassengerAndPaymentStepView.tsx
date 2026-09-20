import React, { useState } from 'react';
import {
  ArrowLeft,
  Plane,
  User,
  Calendar,
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  CheckCircle2,
  Plus,
  Trash2,
  Loader2,
  Lock,
  Sparkles
} from 'lucide-react';
import { Flight, FlightSearchParams, Passenger, PaymentMethod, TravelClass, Booking } from '../types';
import { api } from '../services/api';
import { getAirportByCode } from '../data/airports';
import { useAuth } from '../context/AuthContext';

interface PassengerAndPaymentStepViewProps {
  flight: Flight;
  searchParams: FlightSearchParams;
  onBack: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

export const PassengerAndPaymentStepView: React.FC<PassengerAndPaymentStepViewProps> = ({
  flight,
  searchParams,
  onBack,
  onBookingSuccess,
}) => {
  const { user } = useAuth();
  const srcAirport = getAirportByCode(flight.source);
  const destAirport = getAirportByCode(flight.destination);

  // Calculate fare
  const getBaseFare = () => {
    switch (searchParams.travelClass) {
      case 'PREMIUM_ECONOMY': return flight.premiumFare;
      case 'BUSINESS': return flight.businessFare;
      case 'FIRST_CLASS': return flight.firstClassFare;
      default: return flight.economyFare;
    }
  };

  const basePricePerPax = getBaseFare();
  const taxPerPax = Math.round(basePricePerPax * 0.18);

  const initialPaxCount = Math.max(1, searchParams.passengers || 1);
  const getInitialSeats = (count: number) => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seats: string[] = [];
    for (let i = 0; i < count; i++) {
      const row = 12 + Math.floor(i / letters.length);
      const col = letters[i % letters.length];
      seats.push(`${row}${col}`);
    }
    return seats;
  };

  // Seat state - strictly initialized to passenger count
  const [selectedSeats, setSelectedSeats] = useState<string[]>(() => getInitialSeats(initialPaxCount));
  
  // Passenger state pre-populated with logged in user details and matching initial pax count
  const [passengers, setPassengers] = useState<Passenger[]>(() => {
    const initSeats = getInitialSeats(initialPaxCount);
    return Array.from({ length: initialPaxCount }, (_, idx) => {
      if (idx === 0) {
        return {
          fullName: user?.name || 'Rahul Sharma',
          gender: 'MALE',
          dateOfBirth: '1998-05-20',
          passportId: 'K9876543',
          nationality: 'INDIAN',
          email: user?.email || 'user@airlink.com',
          phone: user?.phone || '+91 9811223344',
          seatNumber: initSeats[0] || '12A',
        };
      }
      return {
        fullName: `Passenger ${idx + 1}`,
        gender: 'MALE',
        dateOfBirth: '2000-01-01',
        passportId: '',
        nationality: 'INDIAN',
        email: `passenger${idx + 1}@airlink.com`,
        phone: user?.phone || '+91 9876543210',
        seatNumber: initSeats[idx] || `${12 + idx}A`,
      };
    });
  });

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [upiId, setUpiId] = useState('arjun.kumar@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8291');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const totalAmount = (basePricePerPax + taxPerPax) * passengers.length;

  // Handle seat click - strictly limited to passengers.length seats
  const handleSeatClick = (seatCode: string) => {
    if (occupiedSeats.includes(seatCode)) return;

    if (selectedSeats.includes(seatCode)) {
      // Toggle off / deselect
      const next = selectedSeats.filter((s) => s !== seatCode);
      setSelectedSeats(next);
      setPassengers(passengers.map((p, idx) => ({ ...p, seatNumber: next[idx] || '' })));
    } else {
      let next: string[];
      if (selectedSeats.length >= passengers.length) {
        // Strict boundary: When seat capacity for current pax count is reached,
        // replace the oldest seat so total seats NEVER exceeds passengers.length.
        // For 1 pax: selectedSeats.slice(1) is [], so next is strictly [seatCode] (1 seat).
        const seatsToKeep = selectedSeats.slice(selectedSeats.length - passengers.length + 1);
        next = [...seatsToKeep, seatCode];
      } else {
        next = [...selectedSeats, seatCode];
      }
      setSelectedSeats(next);
      setPassengers(passengers.map((p, idx) => ({ ...p, seatNumber: next[idx] || seatCode })));
    }
  };

  const handleAddPassenger = () => {
    const nextIndex = passengers.length + 1;
    const defaultSeat = `${12 + nextIndex}B`;
    const updatedSeats = [...selectedSeats, defaultSeat];
    setSelectedSeats(updatedSeats);
    setPassengers([
      ...passengers,
      {
        fullName: `Passenger ${nextIndex}`,
        gender: 'MALE',
        dateOfBirth: '2000-01-01',
        passportId: '',
        nationality: 'INDIAN',
        email: `passenger${nextIndex}@airlink.com`,
        phone: user?.phone || '+91 9876543210',
        seatNumber: defaultSeat,
      },
    ]);
  };

  const handleRemovePassenger = (index: number) => {
    if (passengers.length <= 1) return;
    const nextPax = passengers.filter((_, i) => i !== index);
    const nextSeats = selectedSeats.filter((_, i) => i !== index);
    setPassengers(nextPax);
    setSelectedSeats(nextSeats);
  };

  const handlePassengerChange = (index: number, field: keyof Passenger, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleProceedToPay = async () => {
    // Validate
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].fullName.trim()) {
        setErrorMsg(`Please enter full name for Passenger ${i + 1}`);
        return;
      }
    }

    if (selectedSeats.length !== passengers.length) {
      setErrorMsg(`Please select ${passengers.length} seat${passengers.length > 1 ? 's' : ''} for your booking (currently selected: ${selectedSeats.length})`);
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      // Direct integration with mock backend API
      const bookingData = {
        flightId: flight.id,
        travelClass: searchParams.travelClass,
        passengers: passengers.map((p, idx) => ({
          ...p,
          seatNumber: selectedSeats[idx] || '12A',
        })),
        payment: {
          paymentMethod,
          totalAmount,
          cardNumber: paymentMethod === 'CREDIT_CARD' ? cardNumber : undefined,
          upiVpa: paymentMethod === 'UPI' ? upiId : undefined,
        },
      };

      const result = await api.createBooking(bookingData);
      onBookingSuccess(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment processing failed. Please try again.');
      setIsProcessing(false);
    }
  };

  // Sample cabin layout rows 1 to 8
  const seatRows = [10, 11, 12, 13, 14, 15, 16, 17];
  const seatColsLeft = ['A', 'B', 'C'];
  const seatColsRight = ['D', 'E', 'F'];
  const occupiedSeats = ['10B', '11C', '13A', '14E', '15F'];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Passenger Details
        </h2>
      </div>

      {/* Flight Details Summary Bar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Flight Details</div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900">{flight.airline} <span className="font-mono font-medium text-slate-500">{flight.flightNumber}</span></div>
              <div className="text-xs text-slate-600 font-medium">
                {srcAirport?.city || flight.source} ({flight.source}) ➔ {destAirport?.city || flight.destination} ({flight.destination})
              </div>
            </div>
          </div>

          <div className="text-right text-xs sm:text-sm text-slate-700 font-semibold">
            <div>{flight.departureDate}</div>
            <div className="text-slate-500 font-normal">
              {flight.departureTime.slice(0, 5)} - {flight.arrivalTime.slice(0, 5)} • {flight.duration}
            </div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
          {errorMsg}
        </div>
      )}

      {/* 2-Column Content: Left = Forms & Payment, Right = Seat Selection & Pay CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Passenger Info & Payment */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Passenger Information Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>Passenger Information</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                {passengers.length} Passenger{passengers.length > 1 ? 's' : ''}
              </span>
            </div>

            {passengers.map((pax, index) => (
              <div key={index} className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Passenger {index + 1} (Adult)</span>
                  {passengers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePassenger(index)}
                      className="text-xs text-red-500 hover:text-red-700 flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Arjun Kumar"
                      value={pax.fullName}
                      onChange={(e) => handlePassengerChange(index, 'fullName', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Gender</label>
                    <select
                      value={pax.gender}
                      onChange={(e) => handlePassengerChange(index, 'gender', e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={pax.dateOfBirth}
                      onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Passport Number (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. A1234567"
                      value={pax.passportId}
                      onChange={(e) => handlePassengerChange(index, 'passportId', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddPassenger}
              className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1.5 p-2 rounded-xl hover:bg-blue-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Passenger</span>
            </button>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>Payment Method</span>
            </h3>

            {/* Payment Method Radios */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'UPI' as const, label: 'UPI', icon: QrCode },
                { id: 'CREDIT_CARD' as const, label: 'Credit/Debit Card', icon: CreditCard },
                { id: 'NET_BANKING' as const, label: 'Net Banking', icon: Building2 },
                { id: 'WALLET' as const, label: 'Wallet', icon: Wallet },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col items-center justify-center text-center space-y-1.5 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-xs ring-1 ring-blue-500'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="text-xs">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Specific Payment Input based on Selection */}
            {paymentMethod === 'UPI' && (
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-500 mb-1">Enter UPI VPA / PhonePe / GPay ID</label>
                <div className="relative">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@okaxis"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                  <div className="absolute right-3 top-2.5 text-emerald-600 text-xs font-bold">Verified</div>
                </div>
              </div>
            )}

            {paymentMethod === 'CREDIT_CARD' && (
              <div className="pt-2 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4532 0000 0000 0000"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Seat Selection & Total / Proceed */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Seat Selection Box */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Seat Selection</h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {passengers.length === 1
                    ? '1 seat limit (1 passenger)'
                    : `${passengers.length} seats max (${passengers.length} passengers)`}
                </p>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded bg-slate-100 border border-slate-300"></div>
                  <span className="text-slate-500 text-[10px]">Available</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded bg-blue-600"></div>
                  <span className="text-blue-600 text-[10px] font-bold">Selected</span>
                </div>
              </div>
            </div>

            {/* Cabin Map Grid */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
              <div className="text-center text-[11px] font-bold text-slate-400 mb-3 tracking-wider uppercase">
                Front of Aircraft (Cockpit ➔)
              </div>

              {/* Column labels */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 mb-2">
                <span>A</span>
                <span>B</span>
                <span>C</span>
                <span className="text-[10px] text-slate-300">Aisle</span>
                <span>D</span>
                <span>E</span>
                <span>F</span>
              </div>

              {/* Seat Rows */}
              <div className="space-y-1.5">
                {seatRows.map((row) => (
                  <div key={row} className="grid grid-cols-7 gap-1 items-center">
                    {seatColsLeft.map((col) => {
                      const code = `${row}${col}`;
                      const isOccupied = occupiedSeats.includes(code);
                      const isSelected = selectedSeats.includes(code);

                      return (
                        <button
                          key={code}
                          type="button"
                          disabled={isOccupied}
                          onClick={() => handleSeatClick(code)}
                          className={`h-7 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400'
                              : isOccupied
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              : 'bg-white text-slate-700 hover:bg-blue-100 border border-slate-200'
                          }`}
                        >
                          {isSelected ? '✓' : code}
                        </button>
                      );
                    })}

                    {/* Aisle label */}
                    <div className="text-[10px] font-mono text-slate-400 text-center">{row}</div>

                    {seatColsRight.map((col) => {
                      const code = `${row}${col}`;
                      const isOccupied = occupiedSeats.includes(code);
                      const isSelected = selectedSeats.includes(code);

                      return (
                        <button
                          key={code}
                          type="button"
                          disabled={isOccupied}
                          onClick={() => handleSeatClick(code)}
                          className={`h-7 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400'
                              : isOccupied
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              : 'bg-white text-slate-700 hover:bg-blue-100 border border-slate-200'
                          }`}
                        >
                          {isSelected ? '✓' : code}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
                <span>
                  Allocated: <strong className="text-blue-600">{selectedSeats.length} / {passengers.length} {passengers.length === 1 ? 'seat' : 'seats'}</strong>
                </span>
                <span className="font-bold text-slate-800">
                  {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None selected'}
                </span>
              </div>
            </div>

            {/* Total Fare Breakdown & Proceed Button */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Base Fare ({passengers.length} pax)</span>
                <span>₹{(basePricePerPax * passengers.length).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Taxes & Airport Surcharges</span>
                <span>₹{(taxPerPax * passengers.length).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="text-sm font-extrabold text-slate-900">Total Amount</span>
                <span className="text-2xl font-black text-slate-900">₹{totalAmount.toLocaleString()}</span>
              </div>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleProceedToPay}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authorizing Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Proceed to Pay (₹{totalAmount.toLocaleString()})</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
