import React, { useState } from 'react';
import { ArrowLeft, Plane, Clock, ShieldCheck, ChevronRight, Luggage, ArrowRight } from 'lucide-react';
import { Flight, FlightSearchParams, TravelClass } from '../types';
import { getAirportByCode } from '../data/airports';

interface SelectFlightStepViewProps {
  searchParams: FlightSearchParams;
  flights: Flight[];
  selectedFlight: Flight | null;
  onSelectFlight: (flight: Flight) => void;
  onBack: () => void;
  onContinue: (flight: Flight) => void;
}

export const SelectFlightStepView: React.FC<SelectFlightStepViewProps> = ({
  searchParams,
  flights,
  selectedFlight,
  onSelectFlight,
  onBack,
  onContinue,
}) => {
  const srcAirport = getAirportByCode(searchParams.source);
  const destAirport = getAirportByCode(searchParams.destination);

  // Generate date fare ribbon tabs around the search date
  const baseDate = new Date(searchParams.departureDate);
  const dateTabs = [-2, -1, 0, 1, 2].map((offset) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + offset);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    const dateStr = d.toISOString().split('T')[0];
    const isCurrent = offset === 0;
    
    // Sample fare variations
    const fareDiff = offset === 0 ? 0 : offset * 250 + (offset % 2 === 0 ? 300 : -150);
    return {
      dayName,
      dayNum,
      dateStr,
      isCurrent,
      fare: Math.max(3500, 3850 + fareDiff),
    };
  });

  const [activeDateTab, setActiveDateTab] = useState(searchParams.departureDate);

  // Determine pricing per class
  const getFlightFare = (f: Flight) => {
    switch (searchParams.travelClass) {
      case 'PREMIUM_ECONOMY': return f.premiumFare;
      case 'BUSINESS': return f.businessFare;
      case 'FIRST_CLASS': return f.firstClassFare;
      default: return f.economyFare;
    }
  };

  // Format date nicely
  const formattedDate = new Date(searchParams.departureDate).toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const currentSelection = selectedFlight || (flights.length > 0 ? flights[0] : null);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header & Route Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Back to search"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {srcAirport ? `${srcAirport.city} (${srcAirport.code})` : searchParams.source}
              </h2>
              <Plane className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {destAirport ? `${destAirport.city} (${destAirport.code})` : searchParams.destination}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              {formattedDate} • {searchParams.passengers} Adult{searchParams.passengers > 1 ? 's' : ''} • {searchParams.travelClass.replace('_', ' ')}
            </p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3.5 py-2 rounded-xl border border-blue-200 transition-colors"
        >
          Modify Search
        </button>
      </div>

      {/* Date Fare Ribbon Strip */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200 flex items-center justify-between gap-2 overflow-x-auto">
        {dateTabs.map((tab) => {
          const isSelected = tab.dateStr === activeDateTab || tab.isCurrent;
          return (
            <button
              key={tab.dateStr}
              onClick={() => setActiveDateTab(tab.dateStr)}
              className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl text-center transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="text-xs font-semibold">{tab.dayName} {tab.dayNum}</div>
              <div className={`text-sm font-black mt-0.5 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                ₹{tab.fare.toLocaleString()}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Content: Flight Listings + Sticky Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Flights List */}
        <div className="lg:col-span-8 space-y-4">
          {flights.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <Plane className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No flights found for this corridor</h3>
              <p className="text-xs text-slate-500">Please try adjusting your departure date or choosing another airport.</p>
              <button
                onClick={onBack}
                className="mt-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                Change Search
              </button>
            </div>
          ) : (
            flights.map((flight) => {
              const fare = getFlightFare(flight);
              const isSelected = currentSelection?.id === flight.id;

              return (
                <div
                  key={flight.id}
                  className={`bg-white rounded-2xl p-5 border transition-all duration-200 shadow-sm hover:shadow-md ${
                    isSelected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    {/* Airline & Flight Number */}
                    <div className="flex items-center space-x-3.5 min-w-[140px]">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center font-black text-blue-700 text-xs">
                        {flight.airline.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{flight.airline}</div>
                        <div className="text-xs font-mono text-slate-400">{flight.flightNumber}</div>
                      </div>
                    </div>

                    {/* Flight Schedule Times */}
                    <div className="flex-1 flex items-center justify-between sm:justify-center sm:space-x-8 px-2">
                      <div className="text-left sm:text-right">
                        <div className="text-lg font-extrabold text-slate-900">{flight.departureTime.slice(0, 5)}</div>
                        <div className="text-xs font-bold text-slate-500">{flight.source}</div>
                        <div className="text-[10px] text-slate-400">{flight.terminalSource || 'T1'}</div>
                      </div>

                      <div className="flex flex-col items-center px-2">
                        <span className="text-[11px] font-semibold text-slate-500 mb-1">{flight.duration}</span>
                        <div className="w-24 sm:w-28 flex items-center space-x-1.5">
                          <div className="h-0.5 flex-1 bg-slate-300"></div>
                          <Plane className="w-3.5 h-3.5 text-blue-600 rotate-90" />
                          <div className="h-0.5 flex-1 bg-slate-300"></div>
                        </div>
                        <span className="text-[10px] text-emerald-600 font-bold mt-1">Non-stop</span>
                      </div>

                      <div className="text-right sm:text-left">
                        <div className="text-lg font-extrabold text-slate-900">{flight.arrivalTime.slice(0, 5)}</div>
                        <div className="text-xs font-bold text-slate-500">{flight.destination}</div>
                        <div className="text-[10px] text-slate-400">{flight.terminalDest || 'T2'}</div>
                      </div>
                    </div>

                    {/* Price & Select Button */}
                    <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 min-w-[120px]">
                      <div>
                        <span className="text-xs text-slate-400 sm:hidden">Fare: </span>
                        <span className="text-xl font-black text-slate-900">₹{fare.toLocaleString()}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectFlight(flight);
                          onContinue(flight);
                        }}
                        className={`mt-2 px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                          isSelected
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        Select
                      </button>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Sticky Flight Summary Card */}
        <div className="lg:col-span-4 sticky top-20">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Plane className="w-5 h-5 text-blue-600 rotate-45" />
              <h3 className="font-extrabold text-slate-900 text-base">Flight Summary</h3>
            </div>

            {/* Route Summary */}
            <div className="space-y-1">
              <div className="text-sm font-bold text-slate-900">
                {srcAirport?.city || searchParams.source} ({searchParams.source})
              </div>
              <div className="text-xs text-slate-400 font-medium pl-4 border-l-2 border-dashed border-blue-400 py-1">
                {formattedDate} • Non-stop
              </div>
              <div className="text-sm font-bold text-slate-900">
                {destAirport?.city || searchParams.destination} ({searchParams.destination})
              </div>
            </div>

            <div className="text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
              {searchParams.passengers} Adult{searchParams.passengers > 1 ? 's' : ''} • {searchParams.travelClass.replace('_', ' ')}
            </div>

            {/* Selected Flight Snapshot */}
            {currentSelection ? (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{currentSelection.airline}</span>
                  <span className="font-mono text-slate-500">{currentSelection.flightNumber}</span>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>{currentSelection.departureTime.slice(0, 5)}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{currentSelection.duration}</span>
                  <span>{currentSelection.arrivalTime.slice(0, 5)}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Price per adult:</span>
                  <span className="text-base font-black text-blue-600">
                    ₹{getFlightFare(currentSelection).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => onContinue(currentSelection)}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
                >
                  <span>Continue to Passenger Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-xs text-slate-400 text-center py-4 italic">
                Choose a flight to view booking breakdown
              </div>
            )}

            <div className="text-[11px] text-slate-400 flex items-center space-x-2 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Free cancellation up to 24 hrs prior to departure</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
