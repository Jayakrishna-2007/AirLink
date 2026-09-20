import React from 'react';
import { RealtimeFlight } from '../types';
import {
  X,
  Plane,
  Navigation,
  Compass,
  Wind,
  Clock,
  MapPin,
  Ticket,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Calendar
} from 'lucide-react';

interface RealtimeFlightDetailDrawerProps {
  flight: RealtimeFlight | null;
  onClose: () => void;
  onBookRoute: (originCode: string, destCode: string) => void;
}

export const RealtimeFlightDetailDrawer: React.FC<RealtimeFlightDetailDrawerProps> = ({
  flight,
  onClose,
  onBookRoute,
}) => {
  if (!flight) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CLIMBING':
        return { label: 'Climbing', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: TrendingUp };
      case 'CRUISING':
        return { label: 'Cruising', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', icon: Minus };
      case 'DESCENDING':
        return { label: 'Descending', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40', icon: TrendingDown };
      case 'APPROACH':
        return { label: 'Final Approach', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/40', icon: Navigation };
      case 'DELAYED':
        return { label: 'Delayed', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40', icon: Clock };
      case 'LANDED':
        return { label: 'Landed', bg: 'bg-slate-500/20 text-slate-300 border-slate-500/40', icon: Plane };
      default:
        return { label: status, bg: 'bg-blue-500/20 text-blue-300 border-blue-500/40', icon: Plane };
    }
  };

  const statusInfo = getStatusBadge(flight.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-[#0B1E36] border border-slate-700/80 rounded-2xl shadow-2xl p-5 text-white flex flex-col space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-700/70 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400 shadow-inner">
            <Plane className="w-6 h-6 -rotate-45" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black tracking-tight text-white font-mono">{flight.flightNumber}</h2>
              <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${statusInfo.bg} flex items-center space-x-1`}>
                <StatusIcon className="w-3 h-3" />
                <span>{statusInfo.label}</span>
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              <span className="font-semibold text-slate-300">{flight.airline}</span> • {flight.aircraft} • Reg: <span className="font-mono text-sky-300">{flight.aircraftReg}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close Drawer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Origin & Destination Progress Tracker */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          {/* Origin */}
          <div className="text-left">
            <div className="text-2xl font-black font-mono text-sky-400">{flight.origin.code}</div>
            <div className="text-xs font-semibold text-white truncate max-w-[120px]">{flight.origin.city}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{flight.origin.terminal}</div>
            <div className="text-[11px] font-mono text-emerald-400 mt-1 font-semibold">
              DEP: {flight.origin.scheduledTime}
            </div>
          </div>

          {/* Center Progress Arc */}
          <div className="flex-1 px-4 flex flex-col items-center">
            <div className="text-[11px] font-mono text-slate-400 mb-1 flex items-center space-x-1">
              <span>{flight.elapsedMinutes}m elapsed</span>
              <span>•</span>
              <span className="text-sky-300 font-bold">{flight.progressPercent}%</span>
            </div>
            
            {/* Progress Bar with Airplane Marker */}
            <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-visible flex items-center">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, flight.progressPercent))}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center shadow-lg transition-all duration-300"
                style={{ left: `${Math.min(100, Math.max(0, flight.progressPercent))}%` }}
              >
                <Plane className="w-3 h-3 rotate-45" />
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-mono mt-2">
              Remaining: <span className="text-white font-bold">{flight.remainingDistanceKm.toLocaleString()} km</span> ({Math.max(0, flight.totalMinutes - flight.elapsedMinutes)}m)
            </div>
          </div>

          {/* Destination */}
          <div className="text-right">
            <div className="text-2xl font-black font-mono text-sky-400">{flight.destination.code}</div>
            <div className="text-xs font-semibold text-white truncate max-w-[120px]">{flight.destination.city}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{flight.destination.terminal}</div>
            <div className="text-[11px] font-mono text-amber-300 mt-1 font-semibold">
              ETA: {flight.destination.estimatedTime}
            </div>
          </div>
        </div>

        {/* Airport Gate & Baggage Belt details */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>Departure: <strong className="text-slate-200">{flight.origin.gate || 'Gate 12A'}</strong></span>
          </div>
          <div className="flex items-center space-x-1.5 justify-end">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>Arrival: <strong className="text-slate-200">{flight.destination.baggageBelt || 'Belt 4'}</strong></span>
          </div>
        </div>
      </div>

      {/* Real-time Avionics Telemetry Grid */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
          <Activity className="w-3.5 h-3.5 text-sky-400" />
          <span>Live Avionics & Telemetry</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Altitude */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
            <div className="text-[10px] uppercase text-slate-400 font-medium">Altitude</div>
            <div className="text-base font-bold text-white font-mono mt-0.5">
              {flight.altitudeFeet.toLocaleString()} <span className="text-xs text-slate-400 font-normal">FT</span>
            </div>
            <div className="text-[10px] text-sky-400 font-mono mt-0.5">
              FL{Math.round(flight.altitudeFeet / 100)} {flight.verticalSpeedFpm !== 0 ? `(${flight.verticalSpeedFpm > 0 ? '+' : ''}${flight.verticalSpeedFpm} FPM)` : '• Level'}
            </div>
          </div>

          {/* Ground Speed */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
            <div className="text-[10px] uppercase text-slate-400 font-medium">Ground Speed</div>
            <div className="text-base font-bold text-white font-mono mt-0.5">
              {flight.speedKmh} <span className="text-xs text-slate-400 font-normal">km/h</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
              {flight.speedKnots} kts • M{flight.mach}
            </div>
          </div>

          {/* Heading */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
            <div className="text-[10px] uppercase text-slate-400 font-medium">Heading</div>
            <div className="text-base font-bold text-white font-mono mt-0.5 flex items-center space-x-1">
              <span>{flight.heading}°</span>
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {flight.heading >= 315 || flight.heading < 45 ? 'North' : flight.heading < 135 ? 'East' : flight.heading < 225 ? 'South' : 'West'}bound
            </div>
          </div>

          {/* Squawk Transponder */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
            <div className="text-[10px] uppercase text-slate-400 font-medium">Transponder</div>
            <div className="text-base font-bold text-amber-300 font-mono mt-0.5">
              {flight.squawk}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Mode S / ADS-B
            </div>
          </div>
        </div>
      </div>

      {/* Weather Conditions at Hubs */}
      {flight.weather && (
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Wind className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="text-slate-400">{flight.origin.city}: </span>
              <strong className="text-white">{flight.weather.originTemp}</strong> ({flight.weather.originCondition})
            </div>
          </div>
          <div className="text-right">
            <span className="text-slate-400">{flight.destination.city}: </span>
            <strong className="text-white">{flight.weather.destTemp}</strong> ({flight.weather.destCondition})
          </div>
        </div>
      )}

      {/* Action Footer: Seamless Route Booking CTA */}
      <div className="pt-2 border-t border-slate-700/70 flex items-center justify-between">
        <div>
          <div className="text-[11px] text-slate-400">Available from</div>
          <div className="text-lg font-black text-emerald-400 font-mono">
            ₹{flight.economyFare.toLocaleString()}
          </div>
        </div>

        <button
          onClick={() => onBookRoute(flight.origin.code, flight.destination.code)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center space-x-2 transition-transform active:scale-95"
        >
          <Ticket className="w-4 h-4" />
          <span>Book Flight on this Route</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
