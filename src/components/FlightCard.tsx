import React from 'react';
import {
  Plane,
  Clock,
  Armchair,
  ChevronRight,
  Check,
  Luggage,
  Building2,
  Compass,
  Sparkles
} from 'lucide-react';
import { Flight, TravelClass } from '../types';
import { getAirportByCode } from '../data/airports';

interface FlightCardProps {
  flight: Flight;
  travelClass: TravelClass;
  onSelectFlight: (flight: Flight) => void;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight, travelClass, onSelectFlight }) => {
  const getFare = (): number => {
    switch (travelClass) {
      case 'PREMIUM_ECONOMY': return flight.premiumFare;
      case 'BUSINESS': return flight.businessFare;
      case 'FIRST_CLASS': return flight.firstClassFare;
      default: return flight.economyFare;
    }
  };

  const getAirlineColor = (airline: string) => {
    switch (airline.toLowerCase()) {
      case 'air india': return 'from-red-600 to-amber-600 border-red-500/30';
      case 'indigo': return 'from-blue-600 to-indigo-600 border-blue-500/30';
      case 'vistara': return 'from-purple-800 to-amber-700 border-purple-500/30';
      case 'spicejet': return 'from-orange-600 to-red-600 border-orange-500/30';
      case 'akasa air': return 'from-amber-600 to-orange-500 border-amber-500/30';
      case 'emirates': return 'from-red-700 to-yellow-600 border-yellow-500/30';
      case 'singapore airlines': return 'from-blue-700 to-amber-500 border-amber-500/30';
      case 'british airways': return 'from-blue-800 to-red-600 border-red-500/30';
      case 'qatar airways': return 'from-rose-900 to-purple-800 border-rose-500/30';
      default: return 'from-slate-700 to-slate-800 border-slate-600';
    }
  };

  const sourceAirport = getAirportByCode(flight.source);
  const destAirport = getAirportByCode(flight.destination);

  const sourceName = flight.sourceAirportName || sourceAirport?.name || `${flight.source} International Airport`;
  const destName = flight.destAirportName || destAirport?.name || `${flight.destination} International Airport`;
  const sourceTerm = flight.terminalSource || sourceAirport?.defaultTerminal || 'Terminal 1';
  const destTerm = flight.terminalDest || destAirport?.defaultTerminal || 'Terminal 1';

  const currentFare = getFare();
  const seatsLeft = flight.availableSeats;
  const isUrgent = seatsLeft < 15;

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-lg hover:shadow-2xl transition-all group relative overflow-hidden">
      {/* Top row: Airline & Aircraft & Gate */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${getAirlineColor(flight.airline)} flex items-center justify-center text-white font-black text-sm shadow-md`}>
            {flight.airline.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-white text-base">{flight.airline}</span>
              <span className="text-xs px-2 py-0.5 rounded-lg bg-slate-800 text-blue-400 font-mono font-bold border border-slate-700">
                {flight.flightNumber}
              </span>
              {flight.gate && (
                <span className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-800 text-emerald-400 font-mono border border-slate-700">
                  {flight.gate}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="text-xs text-slate-400">{flight.aircraft}</span>
              {flight.distance && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <Compass className="w-3 h-3 text-blue-400" />
                    <span>{flight.distance}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isUrgent && (
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20 animate-pulse">
              Only {seatsLeft} seats remaining!
            </span>
          )}
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700 flex items-center space-x-1">
            <Armchair className="w-3 h-3 text-blue-400" />
            <span>{seatsLeft} Available</span>
          </span>
        </div>
      </div>

      {/* Flight Timing & Terminal Routing Itinerary */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 my-5 items-center">
        {/* Origin Hub */}
        <div className="md:col-span-3.5">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {flight.departureTime.slice(0, 5)}
            </span>
            <span className="text-base font-bold text-blue-400 font-mono">
              {flight.source}
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold mt-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>{sourceTerm}</span>
          </div>
          <div className="text-[11px] text-slate-400 truncate max-w-[190px] mt-0.5" title={sourceName}>
            {sourceName}
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            Dep: {flight.departureDate}
          </div>
        </div>

        {/* Flight Trajectory Graphic */}
        <div className="md:col-span-3 flex flex-col items-center">
          <div className="flex items-center space-x-1 text-[11px] text-slate-400 font-medium mb-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{flight.duration}</span>
            <span>• Non-stop</span>
          </div>
          <div className="w-full flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
            <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-400 relative">
              <Plane className="w-4 h-4 text-indigo-300 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
          </div>
          <span className="text-[10px] text-emerald-400 mt-1 font-medium flex items-center space-x-1">
            <Check className="w-2.5 h-2.5" />
            <span>Direct Scheduled</span>
          </span>
        </div>

        {/* Destination Hub */}
        <div className="md:col-span-3.5 text-left md:text-right">
          <div className="flex items-baseline md:justify-end space-x-2">
            <span className="text-base font-bold text-indigo-400 font-mono">
              {flight.destination}
            </span>
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {flight.arrivalTime.slice(0, 5)}
            </span>
          </div>
          <div className="flex items-center md:justify-end space-x-1.5 text-xs text-indigo-400 font-semibold mt-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>{destTerm}</span>
          </div>
          <div className="text-[11px] text-slate-400 truncate max-w-[190px] md:ml-auto mt-0.5" title={destName}>
            {destName}
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            Arr: {flight.arrivalDate}
          </div>
        </div>

        {/* Fare & CTA */}
        <div className="md:col-span-2 flex flex-col items-start md:items-end justify-center pt-2 md:pt-0 md:border-l md:border-slate-800 md:pl-4">
          <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            {travelClass.replace('_', ' ')}
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            ₹{currentFare.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mb-2">per passenger</div>

          <button
            onClick={() => onSelectFlight(flight)}
            className="w-full md:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center space-x-1 group-hover:bg-blue-500 transition-all"
          >
            <span>Select Seats</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Realistic Amenities & Baggage Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex flex-wrap items-center gap-3">
          {flight.baggageAllowance && (
            <div className="flex items-center space-x-1.5 text-[11px] bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-800">
              <Luggage className="w-3 h-3 text-amber-400" />
              <span>Cabin: <strong className="text-slate-200">{flight.baggageAllowance.cabin}</strong></span>
              <span>•</span>
              <span>Check-in: <strong className="text-slate-200">{flight.baggageAllowance.checkIn}</strong></span>
            </div>
          )}

          {flight.amenities && flight.amenities.length > 0 && (
            <div className="hidden sm:flex items-center space-x-2 text-[11px]">
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span>{flight.amenities.slice(0, 3).join(' • ')}</span>
            </div>
          )}
        </div>

        <div className="text-[10px] text-slate-500 font-mono">
          Terminal transfers & baggage handling guaranteed
        </div>
      </div>
    </div>
  );
};
