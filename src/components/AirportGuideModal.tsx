import React, { useState } from 'react';
import {
  X,
  Search,
  Building2,
  Wind,
  Compass,
  Plane,
  Eye,
  CheckCircle2,
  MapPin,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Airport, REALISTIC_AIRPORTS } from '../data/airports';

interface AirportGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsOrigin?: (code: string) => void;
  onSelectAsDestination?: (code: string) => void;
}

export const AirportGuideModal: React.FC<AirportGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectAsOrigin,
  onSelectAsDestination,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'DOMESTIC_METRO' | 'DOMESTIC_REGIONAL' | 'INTERNATIONAL_HUB'>('ALL');
  const [selectedAirport, setSelectedAirport] = useState<Airport>(REALISTIC_AIRPORTS[0]);

  if (!isOpen) return null;

  const filteredAirports = REALISTIC_AIRPORTS.filter((a) => {
    const matchesCategory = selectedCategory === 'ALL' || a.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      a.code.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q) ||
      a.stateOrCountry.toLowerCase().includes(q) ||
      a.icao.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Airport Master Directory & Live Terminal Radar
                </h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {REALISTIC_AIRPORTS.length} Verified Hubs
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official IATA/ICAO telemetry, terminal maps, runways, and METAR weather conditions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout: Left list + Right details */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Sidebar: Airport Search & List */}
          <div className="w-full md:w-80 border-r border-slate-800 flex flex-col bg-slate-900/50">
            {/* Search Input */}
            <div className="p-3 border-b border-slate-800">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search city, IATA or airport..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center space-x-1 mt-2 overflow-x-auto pb-1 scrollbar-none">
                {(['ALL', 'DOMESTIC_METRO', 'DOMESTIC_REGIONAL', 'INTERNATIONAL_HUB'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat === 'ALL' ? 'All' : cat === 'DOMESTIC_METRO' ? 'Metro' : cat === 'DOMESTIC_REGIONAL' ? 'Regional' : 'Intl'}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
              {filteredAirports.map((ap) => {
                const isSelected = selectedAirport.code === ap.code;
                return (
                  <button
                    key={ap.code}
                    onClick={() => setSelectedAirport(ap)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-sm text-blue-400">{ap.code}</span>
                        <span className="text-xs font-semibold text-white truncate max-w-[130px]">
                          {ap.city}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[170px]">
                        {ap.name}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">
                        {ap.icao}
                      </span>
                      <div className="text-[10px] text-emerald-400 font-medium mt-0.5">
                        {ap.weather.temp}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Area: Selected Airport Detailed Specification */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950">
            {/* Top Identity Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30 uppercase">
                      {selectedAirport.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      <span>{selectedAirport.city}, {selectedAirport.stateOrCountry}</span>
                    </span>
                  </div>

                  <h3 className="text-2xl font-extrabold text-white tracking-tight">
                    {selectedAirport.name}
                  </h3>

                  <div className="flex items-center space-x-3 mt-2 text-xs font-mono">
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-blue-400 font-bold">
                      IATA: {selectedAirport.code}
                    </span>
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-indigo-400 font-bold">
                      ICAO: {selectedAirport.icao}
                    </span>
                    <span className="text-slate-400">
                      Timezone: {selectedAirport.timezone}
                    </span>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center space-x-2">
                  {onSelectAsOrigin && (
                    <button
                      onClick={() => {
                        onSelectAsOrigin(selectedAirport.code);
                        onClose();
                      }}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-md"
                    >
                      <span>Fly From Here</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {onSelectAsDestination && (
                    <button
                      onClick={() => {
                        onSelectAsDestination(selectedAirport.code);
                        onClose();
                      }}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1 border border-slate-700"
                    >
                      <span>Fly To Here</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Weather & METAR telemetry bar */}
              <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <div className="text-[10px] uppercase font-semibold text-slate-400 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Temperature</span>
                  </div>
                  <div className="text-base font-bold text-white mt-0.5">{selectedAirport.weather.temp}</div>
                  <div className="text-[10px] text-slate-400">{selectedAirport.weather.condition}</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <div className="text-[10px] uppercase font-semibold text-slate-400 flex items-center space-x-1">
                    <Wind className="w-3 h-3 text-sky-400" />
                    <span>Wind Velocity</span>
                  </div>
                  <div className="text-base font-bold text-white mt-0.5">{selectedAirport.weather.wind}</div>
                  <div className="text-[10px] text-slate-400">Surface Anemometer</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <div className="text-[10px] uppercase font-semibold text-slate-400 flex items-center space-x-1">
                    <Eye className="w-3 h-3 text-emerald-400" />
                    <span>Visibility</span>
                  </div>
                  <div className="text-base font-bold text-white mt-0.5">{selectedAirport.weather.visibility}</div>
                  <div className="text-[10px] text-slate-400">VFR Minimums Met</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <div className="text-[10px] uppercase font-semibold text-slate-400 flex items-center space-x-1">
                    <Compass className="w-3 h-3 text-purple-400" />
                    <span>Coordinates</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-white mt-1">
                    {selectedAirport.lat.toFixed(2)}°N, {selectedAirport.lng.toFixed(2)}°E
                  </div>
                  <div className="text-[10px] text-slate-400">WGS84 Datum</div>
                </div>
              </div>
            </div>

            {/* Terminals & Passenger Concourses */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <h4 className="text-xs uppercase font-bold text-slate-300 tracking-wider flex items-center space-x-2 mb-3">
                <Building2 className="w-4 h-4 text-blue-400" />
                <span>Passenger Terminals & Departure Concourses</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedAirport.terminals.map((term, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center text-xs">
                      T{i + 1}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{term}</div>
                      <div className="text-[10px] text-slate-400">
                        {term.includes('Integrated') ? 'International & Domestic Baggage' : 'Domestic Airway Operations'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Runways & Technical Operations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <h4 className="text-xs uppercase font-bold text-slate-300 tracking-wider flex items-center space-x-2 mb-3">
                  <Plane className="w-4 h-4 text-emerald-400" />
                  <span>Runway Configuration</span>
                </h4>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-mono text-emerald-400 font-bold">
                    {selectedAirport.runways}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Equipped with Instrument Landing System (ILS), Runway Visual Range (RVR) transmissometers, and high-intensity approach lighting.
                  </p>
                </div>

                <div className="mt-4">
                  <div className="text-[10px] uppercase font-semibold text-slate-400 mb-2">Base & Hub Airlines</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAirport.hubAirlines.map((airline, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700"
                      >
                        {airline}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Special Features & Passenger Amenities */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <h4 className="text-xs uppercase font-bold text-slate-300 tracking-wider flex items-center space-x-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>Signature Amenities & Transit</span>
                </h4>
                <div className="space-y-2">
                  {selectedAirport.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center space-x-2.5 text-xs text-slate-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
