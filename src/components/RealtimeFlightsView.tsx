import React, { useState, useEffect, useRef } from 'react';
import { RealtimeFlight, RealtimeFlightPhase } from '../types';
import { api } from '../services/api';
import { REALISTIC_AIRPORTS } from '../data/airports';
import { RealtimeRadarCanvas } from './RealtimeRadarCanvas';
import { RealtimeFlightDetailDrawer } from './RealtimeFlightDetailDrawer';
import {
  Radio,
  Plane,
  Search,
  SlidersHorizontal,
  Compass,
  Navigation,
  RefreshCw,
  Play,
  Pause,
  MapPin,
  TrendingUp,
  TrendingDown,
  Clock,
  Ticket,
  Building2,
  Table,
  Layers,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface RealtimeFlightsViewProps {
  onBookFlightRoute: (sourceCode: string, destCode: string) => void;
}

type RealtimeViewMode = 'RADAR' | 'TABLE' | 'AIRPORT_FIDS';

export const RealtimeFlightsView: React.FC<RealtimeFlightsViewProps> = ({
  onBookFlightRoute,
}) => {
  const [flights, setFlights] = useState<RealtimeFlight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<RealtimeFlight | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<RealtimeViewMode>('RADAR');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAirline, setSelectedAirline] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedAirportCode, setSelectedAirportCode] = useState('DEL');

  // Live simulation & auto-refresh state
  const [isLiveActive, setIsLiveActive] = useState(true);
  const [refreshCountdown, setRefreshCountdown] = useState(3);
  const [simulationSpeed, setSimulationSpeed] = useState<1 | 2 | 5>(1);
  const [radarSweeping, setRadarSweeping] = useState(true);

  // Airport FIDS state (Departures vs Arrivals tab)
  const [fidsTab, setFidsTab] = useState<'DEPARTURES' | 'ARRIVALS'>('DEPARTURES');
  const [airportBoardData, setAirportBoardData] = useState<{
    departures: RealtimeFlight[];
    arrivals: RealtimeFlight[];
  }>({ departures: [], arrivals: [] });

  // Fetch live flights
  const fetchFlights = async () => {
    try {
      const data = await api.getRealtimeFlights({
        search: searchQuery,
        airline: selectedAirline !== 'ALL' ? selectedAirline : undefined,
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
      });
      setFlights(data.flights);

      // Keep selected flight updated with latest telemetry
      if (selectedFlight) {
        const updated = data.flights.find(f => f.id === selectedFlight.id);
        if (updated) setSelectedFlight(updated);
      } else if (data.flights.length > 0 && !selectedFlight) {
        setSelectedFlight(data.flights[0]);
      }
    } catch (err) {
      console.error('Failed to load realtime flights:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch airport FIDS board
  const fetchAirportFids = async (code: string) => {
    try {
      const res = await api.getAirportLiveBoard(code);
      setAirportBoardData({
        departures: res.departures,
        arrivals: res.arrivals,
      });
    } catch (err) {
      console.error('Failed to load airport live board:', err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchFlights();
  }, [searchQuery, selectedAirline, selectedStatus]);

  useEffect(() => {
    if (viewMode === 'AIRPORT_FIDS') {
      fetchAirportFids(selectedAirportCode);
    }
  }, [viewMode, selectedAirportCode]);

  // Live countdown ticker & polling
  useEffect(() => {
    if (!isLiveActive) return;

    const interval = setInterval(() => {
      setRefreshCountdown(prev => {
        if (prev <= 1) {
          fetchFlights();
          if (viewMode === 'AIRPORT_FIDS') {
            fetchAirportFids(selectedAirportCode);
          }
          return 3 / simulationSpeed;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLiveActive, simulationSpeed, viewMode, selectedAirportCode, searchQuery, selectedAirline, selectedStatus]);

  // Statistics
  const activeCount = flights.length;
  const climbingCount = flights.filter(f => f.status === 'CLIMBING').length;
  const cruisingCount = flights.filter(f => f.status === 'CRUISING').length;
  const descendingCount = flights.filter(f => f.status === 'DESCENDING' || f.status === 'APPROACH').length;
  const avgSpeed = activeCount > 0 ? Math.round(flights.reduce((acc, f) => acc + f.speedKmh, 0) / activeCount) : 830;
  const avgAltitude = activeCount > 0 ? Math.round(flights.reduce((acc, f) => acc + f.altitudeFeet, 0) / activeCount) : 34500;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Airspace Statistics Bar */}
      <div className="bg-[#0B1E36] border border-[#152e4d] rounded-2xl p-4 sm:p-6 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Title & Live Status */}
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-sky-400 shadow-inner">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center space-x-2">
                  <span>Realtime Flight Radar</span>
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Live Feed</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Tracking live flights across 138+ Indian airports, metro trunks, and international airspace corridors.
              </p>
            </div>
          </div>

          {/* Telemetry Controls (Pause/Resume, Refresh, Sim Speed) */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Live Ticker Button */}
            <button
              onClick={() => setIsLiveActive(!isLiveActive)}
              className={`px-3 py-2 rounded-xl flex items-center space-x-2 border font-medium transition-all ${
                isLiveActive
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title="Toggle Live Telemetry Polling"
            >
              {isLiveActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isLiveActive ? `Live (${Math.ceil(refreshCountdown)}s)` : 'Paused'}</span>
            </button>

            {/* Manual Refresh */}
            <button
              onClick={() => {
                fetchFlights();
                if (viewMode === 'AIRPORT_FIDS') fetchAirportFids(selectedAirportCode);
              }}
              className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white flex items-center space-x-1.5 transition-colors"
              title="Refresh Telemetry Now"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>

            {/* Simulation Speed */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-1 flex items-center space-x-1">
              {([1, 2, 5] as const).map(speed => (
                <button
                  key={speed}
                  onClick={() => setSimulationSpeed(speed)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-mono font-bold transition-colors ${
                    simulationSpeed === speed
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Radar Beam Toggle */}
            <button
              onClick={() => setRadarSweeping(!radarSweeping)}
              className={`px-2.5 py-2 rounded-xl border text-xs font-medium transition-colors ${
                radarSweeping
                  ? 'bg-sky-500/15 border-sky-500/40 text-sky-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title="Toggle Radar Sweep Beam"
            >
              Sweep
            </button>
          </div>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-5 pt-5 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5">
            <div className="text-[10px] uppercase text-slate-400 font-semibold">Active Flights</div>
            <div className="text-lg font-black text-white font-mono mt-0.5">{activeCount}</div>
            <div className="text-[10px] text-emerald-400">100% In Airspace</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5">
            <div className="text-[10px] uppercase text-slate-400 font-semibold">Cruising</div>
            <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">{cruisingCount}</div>
            <div className="text-[10px] text-slate-400">Level at FL300+</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5">
            <div className="text-[10px] uppercase text-slate-400 font-semibold">Climbing</div>
            <div className="text-lg font-black text-amber-400 font-mono mt-0.5">{climbingCount}</div>
            <div className="text-[10px] text-slate-400">+2,100 FPM avg</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5">
            <div className="text-[10px] uppercase text-slate-400 font-semibold">Descending</div>
            <div className="text-lg font-black text-purple-400 font-mono mt-0.5">{descendingCount}</div>
            <div className="text-[10px] text-slate-400">On Approach</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5">
            <div className="text-[10px] uppercase text-slate-400 font-semibold">Fleet Avg Speed</div>
            <div className="text-lg font-black text-white font-mono mt-0.5">{avgSpeed} <span className="text-xs text-slate-400 font-normal">km/h</span></div>
            <div className="text-[10px] text-sky-400">Mach {(avgSpeed / 1235).toFixed(2)}</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5">
            <div className="text-[10px] uppercase text-slate-400 font-semibold">On-Time Index</div>
            <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">94.8%</div>
            <div className="text-[10px] text-slate-400">DGCA Congestion: Low</div>
          </div>
        </div>
      </div>

      {/* View Switcher & Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* View Mode Tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('RADAR')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 transition-all ${
              viewMode === 'RADAR'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Radar</span>
          </button>
          <button
            onClick={() => setViewMode('TABLE')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 transition-all ${
              viewMode === 'TABLE'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Flight Board</span>
          </button>
          <button
            onClick={() => setViewMode('AIRPORT_FIDS')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 transition-all ${
              viewMode === 'AIRPORT_FIDS'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Airport FIDS Terminal</span>
          </button>
        </div>

        {/* Search & Quick Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search flight, route (DEL, BOM), reg..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Airline filter */}
          <select
            value={selectedAirline}
            onChange={e => setSelectedAirline(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="ALL">All Airlines</option>
            <option value="IndiGo">IndiGo (6E)</option>
            <option value="Air India">Air India (AI)</option>
            <option value="Vistara">Vistara (UK)</option>
            <option value="Akasa Air">Akasa Air (QP)</option>
            <option value="SpiceJet">SpiceJet (SG)</option>
            <option value="Alliance Air">Alliance Air (9I)</option>
            <option value="Star Air">Star Air (S5)</option>
            <option value="Emirates">Emirates (EK)</option>
            <option value="Singapore Airlines">Singapore Airlines (SQ)</option>
          </select>

          {/* Phase status filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="ALL">All Flight Phases</option>
            <option value="CRUISING">Cruising (FL300+)</option>
            <option value="CLIMBING">Climbing</option>
            <option value="DESCENDING">Descending</option>
            <option value="APPROACH">Final Approach</option>
            <option value="DELAYED">Delayed</option>
          </select>
        </div>
      </div>

      {/* Main Content Areas */}
      
      {/* 1. INTERACTIVE RADAR VIEW */}
      {viewMode === 'RADAR' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          {/* Left / Center 2 Cols: Radar Canvas */}
          <div className="xl:col-span-2">
            <RealtimeRadarCanvas
              flights={flights}
              selectedFlight={selectedFlight}
              onSelectFlight={flight => setSelectedFlight(flight)}
              radarSweeping={radarSweeping}
            />
          </div>

          {/* Right 1 Col: Selected Flight Detailed Telemetry & Direct Booking */}
          <div className="xl:col-span-1 space-y-4">
            {selectedFlight ? (
              <RealtimeFlightDetailDrawer
                flight={selectedFlight}
                onClose={() => setSelectedFlight(null)}
                onBookRoute={(orig, dest) => onBookFlightRoute(orig, dest)}
              />
            ) : (
              <div className="bg-[#0B1E36] border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
                <Plane className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                <h3 className="text-white font-bold text-sm">Select an Aircraft on the Radar</h3>
                <p className="text-xs mt-1">Click on any rotating aircraft icon on the radar to inspect its live telemetry, avionics, speed, and great-circle route.</p>
              </div>
            )}

            {/* Quick List of Nearby / Trending Flights */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Active Air Traffic Stream</span>
                <span className="text-[10px] font-normal text-slate-400">Click to focus</span>
              </h3>
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {flights.slice(0, 7).map(f => {
                  const isSelected = selectedFlight?.id === f.id;
                  return (
                    <div
                      key={f.id}
                      onClick={() => setSelectedFlight(f)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                        isSelected
                          ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-sm'
                          : 'bg-slate-50 border-slate-100 hover:bg-slate-100/80 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[10px] ${
                          f.airlineCode === '6E' ? 'bg-blue-600 text-white' :
                          f.airlineCode === 'AI' ? 'bg-rose-600 text-white' :
                          f.airlineCode === 'UK' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-white'
                        }`}>
                          {f.airlineCode}
                        </div>
                        <div>
                          <div className="font-bold font-mono">{f.flightNumber}</div>
                          <div className="text-[10px] text-slate-500">
                            {f.origin.code} ➔ {f.destination.code}
                          </div>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <div className="font-semibold text-[11px] text-slate-800">
                          {f.altitudeFeet.toLocaleString()} FT
                        </div>
                        <div className="text-[10px] text-emerald-600">
                          {f.progressPercent}% ({f.speedKmh} km/h)
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. LIVE AIRSPACE BOARD (TABLE VIEW) */}
      {viewMode === 'TABLE' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Commercial Air Traffic Table</h2>
              <p className="text-xs text-slate-500 mt-0.5">Showing all {flights.length} tracked active flights with real-time ADS-B telemetry</p>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-600 bg-white px-3 py-1 rounded-lg border border-slate-200">
              {flights.length} Airborne
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/75 text-slate-600 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Flight</th>
                  <th className="py-3 px-4">Aircraft</th>
                  <th className="py-3 px-4">Origin</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Status / Phase</th>
                  <th className="py-3 px-4">Altitude</th>
                  <th className="py-3 px-4">Speed</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {flights.map(f => {
                  const isSelected = selectedFlight?.id === f.id;
                  return (
                    <tr
                      key={f.id}
                      onClick={() => setSelectedFlight(f)}
                      className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/70 font-medium' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 font-mono flex items-center space-x-1.5">
                          <Plane className="w-3.5 h-3.5 text-blue-600 -rotate-45" />
                          <span>{f.flightNumber}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">{f.airline}</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700">
                        <div>{f.aircraft}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{f.aircraftReg}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 font-mono text-sm">{f.origin.code}</span>
                        <div className="text-[11px] text-slate-500">{f.origin.city}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Dep: {f.origin.scheduledTime}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 font-mono text-sm">{f.destination.code}</span>
                        <div className="text-[11px] text-slate-500">{f.destination.city}</div>
                        <div className="text-[10px] text-amber-600 font-mono">ETA: {f.destination.estimatedTime}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          f.status === 'CRUISING' ? 'bg-emerald-100 text-emerald-800' :
                          f.status === 'CLIMBING' ? 'bg-amber-100 text-amber-800' :
                          f.status === 'DESCENDING' ? 'bg-purple-100 text-purple-800' :
                          f.status === 'APPROACH' ? 'bg-blue-100 text-blue-800' :
                          f.status === 'DELAYED' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {f.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-slate-800">{f.altitudeFeet.toLocaleString()} FT</div>
                        <div className="text-[10px] text-slate-400">FL{Math.round(f.altitudeFeet / 100)}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-slate-800">{f.speedKmh} km/h</div>
                        <div className="text-[10px] text-slate-400">{f.speedKnots} kts (M{f.mach})</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="w-24">
                          <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                            <span>{f.progressPercent}%</span>
                            <span>{f.remainingDistanceKm}km</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{ width: `${f.progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedFlight(f);
                              setViewMode('RADAR');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors"
                          >
                            Radar
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onBookFlightRoute(f.origin.code, f.destination.code);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold shadow-xs transition-colors flex items-center space-x-1"
                          >
                            <Ticket className="w-3 h-3" />
                            <span>Book</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. AIRPORT FIDS TERMINAL DISPLAY */}
      {viewMode === 'AIRPORT_FIDS' && (
        <div className="bg-[#0B1E36] border border-[#152e4d] rounded-2xl shadow-2xl p-6 text-white space-y-6">
          {/* Airport Selector Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-sky-400" />
                <h2 className="text-lg font-black tracking-tight text-white">Airport Flight Information Display (FIDS)</h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Simulated real-time gate terminal departures & arrivals display</p>
            </div>

            {/* Airport Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-medium">Select Airport Hub:</span>
              <select
                value={selectedAirportCode}
                onChange={e => setSelectedAirportCode(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-bold font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {REALISTIC_AIRPORTS.filter(a => ['DEL', 'BOM', 'BLR', 'MAA', 'HYD', 'CCU', 'AYJ', 'GOI', 'GOX', 'COK', 'AMD', 'IXL', 'SXR', 'DXB'].includes(a.code)).map(ap => (
                  <option key={ap.code} value={ap.code}>
                    {ap.code} - {ap.city} ({ap.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* FIDS Departures vs Arrivals Tabs */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setFidsTab('DEPARTURES')}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 transition-colors ${
                  fidsTab === 'DEPARTURES'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-mono'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>DEPARTURES ({airportBoardData.departures.length})</span>
              </button>
              <button
                onClick={() => setFidsTab('ARRIVALS')}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 transition-colors ${
                  fidsTab === 'ARRIVALS'
                    ? 'bg-sky-400 text-slate-950 shadow-md font-mono'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ArrowDownRight className="w-4 h-4" />
                <span>ARRIVALS ({airportBoardData.arrivals.length})</span>
              </button>
            </div>

            <div className="text-xs font-mono text-amber-400 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>TERMINAL RADAR ACTIVE</span>
            </div>
          </div>

          {/* FIDS Display Board */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto shadow-inner">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-900/90 text-amber-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Sched Time</th>
                  <th className="py-3 px-4">Flight</th>
                  <th className="py-3 px-4">Airline</th>
                  <th className="py-3 px-4">{fidsTab === 'DEPARTURES' ? 'Destination' : 'Origin'}</th>
                  <th className="py-3 px-4">Terminal</th>
                  <th className="py-3 px-4">Gate</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {(fidsTab === 'DEPARTURES' ? airportBoardData.departures : airportBoardData.arrivals).length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500 font-sans">
                      No active flights currently matching this terminal stream. Check back shortly or select another major hub (e.g. DEL, BOM, BLR).
                    </td>
                  </tr>
                ) : (
                  (fidsTab === 'DEPARTURES' ? airportBoardData.departures : airportBoardData.arrivals).map(f => {
                    const isDeparture = fidsTab === 'DEPARTURES';
                    const targetAirport = isDeparture ? f.destination : f.origin;
                    return (
                      <tr key={f.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-3.5 px-4 text-white font-bold font-mono">
                          {isDeparture ? f.origin.scheduledTime : f.destination.scheduledTime}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-amber-300">
                          {f.flightNumber}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 font-sans font-medium">
                          {f.airline}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white">{targetAirport.city}</span>
                          <span className="text-slate-400 text-[10px] ml-1.5">({targetAirport.code})</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {isDeparture ? f.origin.terminal : f.destination.terminal}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-sky-400">
                          {isDeparture ? f.origin.gate : f.destination.gate}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            f.status === 'CRUISING' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                            f.status === 'CLIMBING' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                            f.status === 'DELAYED' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                            'bg-blue-950 text-blue-400 border border-blue-800'
                          }`}>
                            {isDeparture
                              ? (f.progressPercent > 10 ? 'AIRBORNE' : 'BOARDING')
                              : (f.progressPercent > 90 ? 'LANDED' : 'EN ROUTE')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => onBookFlightRoute(f.origin.code, f.destination.code)}
                            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-sans font-bold shadow-xs transition-colors inline-flex items-center space-x-1"
                          >
                            <span>Book</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
