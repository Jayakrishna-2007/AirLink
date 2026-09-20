import React, { useState } from 'react';
import {
  PlaneTakeoff,
  PlaneLanding,
  Calendar,
  Users,
  ArrowLeftRight,
  Search,
  Sparkles,
  Building2,
  Compass,
  Clock
} from 'lucide-react';
import { FlightSearchParams, TravelClass } from '../types';
import { POPULAR_ROUTES, getAirportByCode } from '../data/airports';
import { AirportSelector } from './AirportSelector';
import { AirportGuideModal } from './AirportGuideModal';

interface FlightSearchFormProps {
  onSearch: (params: FlightSearchParams) => void;
  isLoading?: boolean;
}

export const FlightSearchForm: React.FC<FlightSearchFormProps> = ({ onSearch, isLoading }) => {
  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [source, setSource] = useState('DEL');
  const [destination, setDestination] = useState('BOM');
  const [departureDate, setDepartureDate] = useState(getTomorrowDate());
  const [passengers, setPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState<TravelClass>('ECONOMY');
  const [error, setError] = useState<string | null>(null);
  const [isAirportGuideOpen, setIsAirportGuideOpen] = useState(false);

  const handleSwap = () => {
    setSource(destination);
    setDestination(source);
    setError(null);
  };

  const handleSelectPopularRoute = (src: string, dest: string) => {
    setSource(src);
    setDestination(dest);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (source === destination) {
      setError('Origin and destination airports cannot be identical. Please select different hubs.');
      return;
    }
    setError(null);
    onSearch({
      source,
      destination,
      departureDate,
      passengers,
      travelClass,
    });
  };

  const sourceAirport = getAirportByCode(source);
  const destAirport = getAirportByCode(destination);

  // Approximate distance calculation
  const calculateDistance = () => {
    if (!sourceAirport || !destAirport) return null;
    const R = 6371;
    const dLat = (destAirport.lat - sourceAirport.lat) * (Math.PI / 180);
    const dLon = (destAirport.lng - sourceAirport.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(sourceAirport.lat * (Math.PI / 180)) *
        Math.cos(destAirport.lat * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = Math.round(R * c);
    const durMin = Math.max(50, Math.round((dist / 780) * 60 + 35));
    const h = Math.floor(durMin / 60);
    const m = durMin % 60;
    return {
      distance: `${dist.toLocaleString()} km`,
      duration: `${h}h ${m}m`,
    };
  };

  const routeMetrics = calculateDistance();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
      {/* Aviation backdrop gradient */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header & Airport Guide CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
              <span>Commercial Airline Reservations</span>
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              Active Fleet Inventory
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time schedule generator, multi-terminal routing, seat matrix & verified IATA hubs
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setIsAirportGuideOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Airport Guide & Live Radar</span>
          </button>

          {/* Travel Class Selector */}
          <div className="flex items-center space-x-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 text-xs">
            {(['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST_CLASS'] as TravelClass[]).map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => setTravelClass(cls)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  travelClass === cls
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/40'
                }`}
              >
                {cls === 'PREMIUM_ECONOMY'
                  ? 'Prem. Econ'
                  : cls === 'FIRST_CLASS'
                  ? 'First Class'
                  : cls.charAt(0) + cls.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Corridor Quick Selection Chips */}
      <div className="mb-5 pb-3 border-b border-slate-800/80">
        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 flex items-center space-x-1.5">
          <Compass className="w-3 h-3 text-blue-400" />
          <span>Popular Realistic Airport Corridors (1-Click Fill)</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {POPULAR_ROUTES.map((route, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelectPopularRoute(route.source, route.dest)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center space-x-2 border transition-all ${
                source === route.source && destination === route.dest
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 border-slate-700/70 hover:border-slate-600'
              }`}
            >
              <span>{route.label}</span>
              <span className="text-[10px] text-blue-300 opacity-80">({route.duration})</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700/50 rounded-xl text-xs text-red-300 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          
          {/* Origin Airport */}
          <div className="md:col-span-4">
            <AirportSelector
              id="flight-source-selector"
              label="From (Origin Hub)"
              value={source}
              onChange={setSource}
              icon={<PlaneTakeoff className="w-4 h-4 text-blue-400" />}
              excludeCode={destination}
            />
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center pb-1">
            <button
              type="button"
              onClick={handleSwap}
              title="Swap Airports"
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-transform hover:rotate-180 duration-200"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* Destination Airport */}
          <div className="md:col-span-4">
            <AirportSelector
              id="flight-dest-selector"
              label="To (Destination Hub)"
              value={destination}
              onChange={setDestination}
              icon={<PlaneLanding className="w-4 h-4 text-indigo-400" />}
              excludeCode={source}
            />
          </div>

          {/* Departure Date */}
          <div className="md:col-span-3">
            <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1 tracking-wider">
              Departure Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4 text-emerald-400" />
              </div>
              <input
                id="search-departure-date"
                type="date"
                value={departureDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Selected Route Telemetry Preview Badge */}
        {routeMetrics && (
          <div className="bg-slate-950/70 border border-slate-800 px-4 py-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="font-mono font-bold text-blue-400">{source}</span>
              <span className="text-slate-500">({sourceAirport?.defaultTerminal})</span>
              <span className="text-slate-500">➔</span>
              <span className="font-mono font-bold text-indigo-400">{destination}</span>
              <span className="text-slate-500">({destAirport?.defaultTerminal})</span>
            </div>

            <div className="flex items-center space-x-4 text-[11px] text-slate-400">
              <span className="flex items-center space-x-1">
                <Compass className="w-3.5 h-3.5 text-blue-400" />
                <span>Airway Distance: <strong className="text-white">{routeMetrics.distance}</strong></span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Estimated Non-Stop Flight: <strong className="text-white">{routeMetrics.duration}</strong></span>
              </span>
              <span className="hidden lg:inline text-emerald-400">
                Dest. Weather: {destAirport?.weather.temp} ({destAirport?.weather.condition})
              </span>
            </div>
          </div>
        )}

        {/* Second Row: Passengers & Submit */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-slate-800/80 gap-3">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-slate-300 font-medium">Passengers:</span>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  disabled={passengers <= 1}
                  onClick={() => setPassengers(p => Math.max(1, p - 1))}
                  className="w-6 h-6 rounded bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-40 flex items-center justify-center text-xs font-bold"
                >
                  -
                </button>
                <span className="w-6 text-center text-xs font-bold text-white">{passengers}</span>
                <button
                  type="button"
                  disabled={passengers >= 6}
                  onClick={() => setPassengers(p => Math.min(6, p + 1))}
                  className="w-6 h-6 rounded bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-40 flex items-center justify-center text-xs font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="text-xs text-slate-400 hidden md:flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Full scheduled daily departures on selected date</span>
            </div>
          </div>

          <button
            id="search-flights-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-60"
          >
            <Search className="w-4 h-4" />
            <span>{isLoading ? 'Retrieving Schedules...' : 'Search Available Flights'}</span>
          </button>
        </div>
      </form>

      {/* Airport Master Guide Modal */}
      <AirportGuideModal
        isOpen={isAirportGuideOpen}
        onClose={() => setIsAirportGuideOpen(false)}
        onSelectAsOrigin={(code) => setSource(code)}
        onSelectAsDestination={(code) => setDestination(code)}
      />
    </div>
  );
};
