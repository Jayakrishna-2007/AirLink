import React, { useState } from 'react';
import { User, Calendar, Shield, Mail, Phone, ArrowLeft, ArrowRight, Wand2 } from 'lucide-react';
import { Flight, Passenger, TravelClass } from '../types';

interface PassengerFormProps {
  flight: Flight;
  travelClass: TravelClass;
  selectedSeats: string[];
  onBackToSeats: () => void;
  onProceedToPayment: (passengers: Passenger[]) => void;
}

export const PassengerForm: React.FC<PassengerFormProps> = ({
  flight,
  travelClass,
  selectedSeats,
  onBackToSeats,
  onProceedToPayment,
}) => {
  const [passengers, setPassengers] = useState<Passenger[]>(() =>
    selectedSeats.map(seatNumber => ({
      fullName: '',
      dateOfBirth: '1996-05-15',
      gender: 'MALE',
      nationality: 'INDIAN',
      passportId: '',
      email: '',
      phone: '',
      seatNumber,
    }))
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (index: number, field: keyof Passenger, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);

    // Clear specific error
    const key = `${index}_${field}`;
    if (errors[key]) {
      const copy = { ...errors };
      delete copy[key];
      setErrors(copy);
    }
  };

  const handleQuickFill = () => {
    const samples = [
      { name: 'Dr. Vikramaditya Sen', email: 'vikram.sen@example.com', phone: '+91 9811002233', passport: 'Z9482104', gender: 'MALE' as const, dob: '1990-08-21' },
      { name: 'Ananya Deshmukh', email: 'ananya.d@example.com', phone: '+91 9822334455', passport: 'P8371902', gender: 'FEMALE' as const, dob: '1995-11-14' },
      { name: 'Rohan Mehra', email: 'rohan.m@example.com', phone: '+91 9833445566', passport: 'M1029384', gender: 'MALE' as const, dob: '1988-03-02' },
      { name: 'Dr. Meenakshi Iyer', email: 'meenakshi@example.com', phone: '+91 9844556677', passport: 'L5049382', gender: 'FEMALE' as const, dob: '1992-06-30' },
    ];

    const filled = passengers.map((p, idx) => {
      const s = samples[idx % samples.length];
      return {
        ...p,
        fullName: s.name,
        email: s.email,
        phone: s.phone,
        passportId: s.passport,
        gender: s.gender,
        dateOfBirth: s.dob,
        nationality: 'INDIAN',
      };
    });

    setPassengers(filled);
    setErrors({});
  };

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    passengers.forEach((p, idx) => {
      if (!p.fullName.trim()) newErrors[`${idx}_fullName`] = 'Full name is required';
      if (!p.passportId.trim()) newErrors[`${idx}_passportId`] = 'Passport/Govt ID is required';
      if (idx === 0) {
        if (!p.email?.trim()) newErrors[`${idx}_email`] = 'Primary email is required for e-ticket delivery';
        if (!p.phone?.trim()) newErrors[`${idx}_phone`] = 'Contact phone is required for SMS updates';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onProceedToPayment(passengers);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header bar with flight summary & quick fill demo */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-base font-bold text-white tracking-tight">Passenger Manifest</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
              {flight.airline} {flight.flightNumber}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {flight.source} ➔ {flight.destination} • {travelClass.replace('_', ' ')} • {passengers.length} Traveler(s)
          </p>
        </div>

        <button
          type="button"
          onClick={handleQuickFill}
          className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-semibold rounded-xl shadow-md shadow-amber-600/20 flex items-center space-x-1.5 transition-all"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Quick Fill Demo Data (1-Click)</span>
        </button>
      </div>

      <form onSubmit={validateAndSubmit} className="space-y-5">
        {passengers.map((p, idx) => (
          <div key={p.seatNumber} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 relative">
            
            {/* Passenger title */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  {idx + 1}
                </div>
                <h4 className="text-sm font-bold text-white">
                  Passenger {idx + 1} {idx === 0 && <span className="text-xs text-blue-400 font-normal">(Primary Contact)</span>}
                </h4>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Assigned Seat:</span>
                <span className="px-2.5 py-0.5 rounded bg-blue-600/20 border border-blue-500/40 text-blue-300 font-mono font-bold text-xs">
                  {p.seatNumber}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1 tracking-wider">
                  Full Name (as per Passport / Govt ID) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={p.fullName}
                    onChange={(e) => handleFieldChange(idx, 'fullName', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {errors[`${idx}_fullName`] && (
                  <p className="text-[10px] text-red-400 mt-1">{errors[`${idx}_fullName`]}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1 tracking-wider">
                  Gender *
                </label>
                <select
                  value={p.gender}
                  onChange={(e) => handleFieldChange(idx, 'gender', e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1 tracking-wider">
                  Date of Birth *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    required
                    value={p.dateOfBirth}
                    onChange={(e) => handleFieldChange(idx, 'dateOfBirth', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Nationality */}
              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1 tracking-wider">
                  Nationality *
                </label>
                <input
                  type="text"
                  required
                  value={p.nationality}
                  onChange={(e) => handleFieldChange(idx, 'nationality', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Passport ID */}
              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1 tracking-wider">
                  Passport / National ID No. *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Z9482104"
                    value={p.passportId}
                    onChange={(e) => handleFieldChange(idx, 'passportId', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {errors[`${idx}_passportId`] && (
                  <p className="text-[10px] text-red-400 mt-1">{errors[`${idx}_passportId`]}</p>
                )}
              </div>

              {/* Contact info (Primary only) */}
              {idx === 0 && (
                <>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1 tracking-wider">
                      Email Address (E-Ticket Delivery) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="passenger@example.com"
                        value={p.email || ''}
                        onChange={(e) => handleFieldChange(idx, 'email', e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {errors[`${idx}_email`] && (
                      <p className="text-[10px] text-red-400 mt-1">{errors[`${idx}_email`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1 tracking-wider">
                      Mobile Phone (SMS Gate Updates) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="+91 9811002233"
                        value={p.phone || ''}
                        onChange={(e) => handleFieldChange(idx, 'phone', e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {errors[`${idx}_phone`] && (
                      <p className="text-[10px] text-red-400 mt-1">{errors[`${idx}_phone`]}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={onBackToSeats}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-2 transition-colors border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Modify Seat Selection</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center space-x-2 transition-all"
          >
            <span>Proceed to Payment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
