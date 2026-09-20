import React, { useState } from 'react';
import { Search, ArrowLeftRight, Calendar, Users, Briefcase, MapPin, Sparkles, Radio, ChevronRight } from 'lucide-react';
import { FlightSearchParams, TravelClass } from '../types';
import { AirportSelector } from './AirportSelector';
import { REALISTIC_AIRPORTS } from '../data/airports';

interface SearchStepViewProps {
  initialParams: FlightSearchParams;
  onSearch: (params: FlightSearchParams) => void;
  isLoading: boolean;
  onNavigateToRealtime?: () => void;
}

export const SearchStepView: React.FC<SearchStepViewProps> = ({
  initialParams,
  onSearch,
  isLoading,
  onNavigateToRealtime,
}) => {
  const [tripType, setTripType] = useState<'ONE_WAY' | 'ROUND_TRIP' | 'MULTI_CITY'>('ONE_WAY');
  const [source, setSource] = useState(initialParams.source || 'MAA');
  const [destination, setDestination] = useState(initialParams.destination || 'BLR');
  const [departureDate, setDepartureDate] = useState(
    initialParams.departureDate || new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [passengers, setPassengers] = useState(initialParams.passengers || 1);
  const [travelClass, setTravelClass] = useState<TravelClass>(initialParams.travelClass || 'ECONOMY');

  const handleSwapAirports = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (source === destination) {
      alert('Source and destination airports cannot be the same!');
      return;
    }
    onSearch({
      source,
      destination,
      departureDate,
      passengers,
      travelClass,
    });
  };

  const quickRoutes = [
    { from: 'MAA', to: 'BLR', label: 'Chennai ⇄ Bengaluru' },
    { from: 'DEL', to: 'BOM', label: 'Delhi ⇄ Mumbai' },
    { from: 'BOM', to: 'GOI', label: 'Mumbai ⇄ Goa' },
    { from: 'DEL', to: 'DXB', label: 'Delhi ⇄ Dubai' },
    { from: 'BLR', to: 'SIN', label: 'Bengaluru ⇄ Singapore' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Hero Banner with Airplane above clouds */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl h-72 sm:h-80 flex items-center justify-start p-8 sm:p-12 text-white bg-slate-900">
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80"
          alt="Airplane flying above sunset clouds"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-blue-950/50 to-transparent"></div>

        <div className="relative z-10 max-w-xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight drop-shadow-md text-white">
            Your Next Journey <br />
            <span className="text-blue-200">Starts Here</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-200 drop-shadow-sm font-medium">
            Search, compare, and book flights across domestic and international routes with instant confirmation.
          </p>
        </div>
      </div>

      {/* Floating White Search Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 -mt-16 sm:-mt-20 relative z-20">
        
        {/* Trip Type Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-4 mb-6">
          <button
            type="button"
            onClick={() => setTripType('ONE_WAY')}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              tripType === 'ONE_WAY'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            One Way
          </button>
          <button
            type="button"
            onClick={() => setTripType('ROUND_TRIP')}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              tripType === 'ROUND_TRIP'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Round Trip
          </button>
          <button
            type="button"
            onClick={() => setTripType('MULTI_CITY')}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              tripType === 'MULTI_CITY'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Multi-City
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Main Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-11 gap-3 items-center">
            
            {/* From Airport */}
            <div className="lg:col-span-5 relative">
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">
                From
              </label>
              <div className="relative">
                <AirportSelector
                  value={source}
                  onChange={setSource}
                  placeholder="Departure Airport (e.g. Chennai MAA)"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="lg:col-span-1 flex justify-center pt-5">
              <button
                type="button"
                onClick={handleSwapAirports}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-blue-50 border border-slate-300 hover:border-blue-400 text-slate-700 hover:text-blue-600 flex items-center justify-center shadow-xs transition-all hover:scale-105 active:scale-95"
                title="Swap departure and destination"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            {/* To Airport */}
            <div className="lg:col-span-5 relative">
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">
                To
              </label>
              <div className="relative">
                <AirportSelector
                  value={destination}
                  onChange={setDestination}
                  placeholder="Arrival Airport (e.g. Bengaluru BLR)"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Dates, Passengers, Class */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Departure Date */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Departure Date</span>
              </label>
              <input
                type="date"
                required
                value={departureDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-xs"
              />
            </div>

            {/* Passengers */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 flex items-center space-x-1">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>Passengers</span>
              </label>
              <select
                value={passengers}
                onChange={(e) => setPassengers(parseInt(e.target.value, 10))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-xs"
              >
                <option value={1}>1 Adult</option>
                <option value={2}>2 Adults</option>
                <option value={3}>3 Adults</option>
                <option value={4}>4 Adults</option>
                <option value={5}>5 Adults</option>
              </select>
            </div>

            {/* Travel Class */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 flex items-center space-x-1">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                <span>Class</span>
              </label>
              <select
                value={travelClass}
                onChange={(e) => setTravelClass(e.target.value as TravelClass)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-xs"
              >
                <option value="ECONOMY">Economy</option>
                <option value="PREMIUM_ECONOMY">Premium Economy</option>
                <option value="BUSINESS">Business</option>
                <option value="FIRST_CLASS">First Class</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 cursor-pointer"
          >
            <Search className="w-5 h-5" />
            <span>{isLoading ? 'Searching Flights...' : 'Search Flights'}</span>
          </button>
        </form>

        {/* Quick Route Shortcuts */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Popular Corridors:</span>
          {quickRoutes.map((r) => (
            <button
              key={r.label}
              type="button"
              onClick={() => {
                setSource(r.from);
                setDestination(r.to);
              }}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 border border-slate-200 transition-colors"
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Realtime Radar Teaser Banner */}
      {onNavigateToRealtime && (
        <div className="mt-6 bg-[#0B1E36] border border-[#173152] rounded-2xl p-4 sm:p-5 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-sky-400 flex-shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-bold text-white">Live Indian Airspace Radar</h4>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 tracking-wider">
                  LIVE ADS-B
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Track flights in real-time across 138+ Indian airports with live airspeed, altitude, heading, and terminal boards.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateToRealtime}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-102 flex-shrink-0"
          >
            <span>Launch Live Radar</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
