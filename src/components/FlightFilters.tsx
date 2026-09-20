import React from 'react';
import { Filter, Clock, DollarSign, ArrowUpDown } from 'lucide-react';
import { TravelClass } from '../types';

interface FlightFiltersProps {
  airlineFilter: string;
  setAirlineFilter: (airline: string) => void;
  timeSlot: string;
  setTimeSlot: (slot: string) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  travelClass: TravelClass;
  priceRangeMax: number;
  resetFilters: () => void;
}

const AIRLINES = ['ALL', 'Air India', 'IndiGo', 'Vistara', 'SpiceJet', 'Emirates'];

export const FlightFilters: React.FC<FlightFiltersProps> = ({
  airlineFilter,
  setAirlineFilter,
  timeSlot,
  setTimeSlot,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  priceRangeMax,
  resetFilters,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-white font-semibold text-sm">
          <Filter className="w-4 h-4 text-blue-400" />
          <span>Filter & Sort Flights</span>
        </div>
        <button
          onClick={resetFilters}
          className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          Reset All
        </button>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-2 tracking-wider flex items-center space-x-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-blue-400" />
          <span>Sort By</span>
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="PRICE_ASC">Price: Lowest to Highest</option>
          <option value="PRICE_DESC">Price: Highest to Lowest</option>
          <option value="DURATION_ASC">Duration: Shortest First</option>
          <option value="TIME_ASC">Departure: Earliest First</option>
        </select>
      </div>

      {/* Airlines */}
      <div>
        <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-2 tracking-wider">
          Airlines
        </label>
        <div className="space-y-1.5">
          {AIRLINES.map((al) => (
            <label
              key={al}
              className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer hover:text-white p-1 rounded-lg hover:bg-slate-800/60"
            >
              <input
                type="radio"
                name="airline-filter"
                checked={airlineFilter === al}
                onChange={() => setAirlineFilter(al)}
                className="text-blue-600 focus:ring-blue-500 bg-slate-800 border-slate-700"
              />
              <span>{al === 'ALL' ? 'All Airlines' : al}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Departure Time Slots */}
      <div>
        <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-2 tracking-wider flex items-center space-x-1.5">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Departure Time</span>
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { id: 'ALL', label: 'Anytime' },
            { id: 'MORNING', label: 'Morning (04-12)' },
            { id: 'AFTERNOON', label: 'Noon (12-17)' },
            { id: 'EVENING', label: 'Evening (17-21)' },
          ].map((slot) => (
            <button
              key={slot.id}
              type="button"
              onClick={() => setTimeSlot(slot.id)}
              className={`p-2 rounded-xl text-center border transition-all ${
                timeSlot === slot.id
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-medium'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {slot.label}
            </button>
          ))}
        </div>
      </div>

      {/* Max Price Slider */}
      <div>
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase text-slate-400 mb-2 tracking-wider">
          <span className="flex items-center space-x-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Max Price</span>
          </span>
          <span className="text-white font-bold text-xs">₹{maxPrice.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={3000}
          max={priceRangeMax}
          step={500}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-blue-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
          <span>₹3,000</span>
          <span>₹{priceRangeMax.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
