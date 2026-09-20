import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, ChevronDown, Check, Building2, Sparkles } from 'lucide-react';
import { Airport, REALISTIC_AIRPORTS } from '../data/airports';

interface AirportSelectorProps {
  id?: string;
  label?: string;
  value: string; // airport code e.g. "DEL"
  onChange: (code: string) => void;
  icon?: React.ReactNode;
  excludeCode?: string;
  placeholder?: string;
}

export const AirportSelector: React.FC<AirportSelectorProps> = ({
  id,
  label = '',
  value,
  onChange,
  icon,
  excludeCode,
  placeholder = 'Select airport...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'DOMESTIC_METRO' | 'DOMESTIC_REGIONAL' | 'INTERNATIONAL_HUB'>('ALL');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedAirport = REALISTIC_AIRPORTS.find(
    (a) => a.code.toUpperCase() === value.toUpperCase()
  ) || REALISTIC_AIRPORTS[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredAirports = REALISTIC_AIRPORTS.filter((a) => {
    if (excludeCode && a.code.toUpperCase() === excludeCode.toUpperCase()) {
      return false;
    }
    const matchesCat = categoryFilter === 'ALL' || a.category === categoryFilter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      a.code.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q) ||
      a.stateOrCountry.toLowerCase().includes(q) ||
      a.icao.toLowerCase().includes(q);

    return matchesCat && matchesSearch;
  });

  return (
    <div className="relative" ref={containerRef} id={id}>
      <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1 tracking-wider">
        {label}
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch('');
        }}
        className={`w-full p-2.5 bg-slate-800 border rounded-xl flex items-center justify-between text-left transition-all ${
          isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-700 hover:border-slate-600'
        }`}
      >
        <div className="flex items-center space-x-3 truncate">
          <div className="p-1.5 rounded-lg bg-slate-700/60 text-blue-400 flex-shrink-0">
            {icon || <Building2 className="w-4 h-4" />}
          </div>
          <div className="truncate">
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-sm text-blue-400">
                {selectedAirport.code}
              </span>
              <span className="font-semibold text-white text-sm truncate">
                {selectedAirport.city}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {selectedAirport.name}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 pl-2 flex-shrink-0">
          <span className="text-[10px] hidden sm:inline px-1.5 py-0.5 rounded bg-slate-900 text-emerald-400 font-mono">
            {selectedAirport.weather.temp}
          </span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-blue-400' : ''}`} />
        </div>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl z-40 overflow-hidden animate-in fade-in duration-150">
          {/* Search Header */}
          <div className="p-3 border-b border-slate-800 bg-slate-950">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                placeholder="Search city, code (DEL, BOM, AYJ), state (Kerala, Assam)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Quick Filter Categories */}
            <div className="flex items-center space-x-1 mt-2 overflow-x-auto scrollbar-none">
              {(['ALL', 'DOMESTIC_METRO', 'DOMESTIC_REGIONAL', 'INTERNATIONAL_HUB'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold whitespace-nowrap transition-colors ${
                    categoryFilter === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat === 'ALL' ? `All (${filteredAirports.length})` : cat === 'DOMESTIC_METRO' ? 'Metro Hubs' : cat === 'DOMESTIC_REGIONAL' ? 'Regional / UDAN' : 'International'}
                </button>
              ))}
            </div>
          </div>

          {/* Airport Items List */}
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/60 p-1.5">
            {filteredAirports.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No matching airports found for &quot;{search}&quot;.
              </div>
            ) : (
              filteredAirports.map((ap) => {
                const isCurrent = ap.code.toUpperCase() === value.toUpperCase();
                return (
                  <button
                    key={ap.code}
                    type="button"
                    onClick={() => {
                      onChange(ap.code);
                      setIsOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-colors ${
                      isCurrent
                        ? 'bg-blue-600/20 text-white'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-xs px-1.5 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700">
                          {ap.code}
                        </span>
                        <span className="font-semibold text-white text-xs">
                          {ap.city}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          • {ap.stateOrCountry}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {ap.name}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center space-x-2 mt-0.5">
                        <span>{ap.terminals.length} Terminals</span>
                        <span>•</span>
                        <span className="text-emerald-400 flex items-center space-x-0.5">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{ap.weather.temp} {ap.weather.condition}</span>
                        </span>
                      </div>
                    </div>

                    {isCurrent && (
                      <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
