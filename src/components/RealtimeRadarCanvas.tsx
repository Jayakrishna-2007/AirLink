import React, { useState, useRef, useMemo } from 'react';
import { RealtimeFlight } from '../types';
import { Plane, Compass, Navigation, Radio, ZoomIn, ZoomOut, RotateCcw, MapPin, Eye, EyeOff } from 'lucide-react';

interface RealtimeRadarCanvasProps {
  flights: RealtimeFlight[];
  selectedFlight: RealtimeFlight | null;
  onSelectFlight: (flight: RealtimeFlight) => void;
  airportsToShow?: Array<{ code: string; city: string; lat: number; lng: number }>;
  radarSweeping?: boolean;
}

// Geographic bounding box roughly covering South Asia & Gulf routes
// Lat: ~6°N to 36°N, Lng: ~50°E to 100°E
const GEO_BOUNDS = {
  minLat: 6.0,
  maxLat: 36.5,
  minLng: 50.0,
  maxLng: 98.0,
};

const MAJOR_RADAR_AIRPORTS = [
  { code: 'DEL', city: 'Delhi', lat: 28.5562, lng: 77.1000 },
  { code: 'BOM', city: 'Mumbai', lat: 19.0896, lng: 72.8656 },
  { code: 'BLR', city: 'Bengaluru', lat: 13.1986, lng: 77.7066 },
  { code: 'MAA', city: 'Chennai', lat: 12.9941, lng: 80.1709 },
  { code: 'HYD', city: 'Hyderabad', lat: 17.2403, lng: 78.4294 },
  { code: 'CCU', city: 'Kolkata', lat: 22.6547, lng: 88.4467 },
  { code: 'AMD', city: 'Ahmedabad', lat: 23.0772, lng: 72.6347 },
  { code: 'GOI', city: 'Goa', lat: 15.3808, lng: 73.8314 },
  { code: 'COK', city: 'Kochi', lat: 10.1556, lng: 76.3914 },
  { code: 'GAU', city: 'Guwahati', lat: 26.1061, lng: 91.5859 },
  { code: 'AYJ', city: 'Ayodhya', lat: 26.7450, lng: 82.1550 },
  { code: 'IXL', city: 'Leh', lat: 34.1359, lng: 77.5465 },
  { code: 'SXR', city: 'Srinagar', lat: 33.9871, lng: 74.7742 },
  { code: 'DXB', city: 'Dubai', lat: 25.2532, lng: 55.3657 },
  { code: 'SIN', city: 'Singapore', lat: 1.3644, lng: 103.9915 },
  { code: 'DOH', city: 'Doha', lat: 25.2731, lng: 51.6081 },
];

// Simplified outline of Indian Subcontinent coastline & borders for realistic radar background
const SUB_CONTINENT_PATHS = [
  // India mainland outline points (approximate polygon for radar silhouette)
  [
    [35.5, 74.8], [34.5, 76.5], [32.5, 78.5], [30.5, 80.0], [28.5, 81.5],
    [27.0, 88.5], [27.5, 92.0], [28.0, 96.0], [26.0, 97.0], [24.0, 94.0],
    [22.5, 91.5], [21.5, 87.0], [19.8, 85.8], [17.7, 83.3], [15.8, 80.3],
    [13.1, 80.3], [10.8, 79.8], [9.3, 79.1], [8.1, 77.5], [9.5, 76.3],
    [11.2, 75.8], [13.0, 74.8], [15.4, 73.8], [18.9, 72.8], [20.9, 72.8],
    [21.6, 69.5], [22.8, 69.0], [23.5, 68.5], [24.5, 71.0], [27.0, 70.5],
    [30.0, 72.5], [32.5, 74.5], [35.5, 74.8]
  ]
];

export const RealtimeRadarCanvas: React.FC<RealtimeRadarCanvasProps> = ({
  flights,
  selectedFlight,
  onSelectFlight,
  radarSweeping = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showAirports, setShowAirports] = useState(true);
  const [showFlightLabels, setShowFlightLabels] = useState(true);
  const [hoveredFlight, setHoveredFlight] = useState<RealtimeFlight | null>(null);

  // Canvas coordinate projection: [lat, lng] -> [x, y] in viewBox [0..1000, 0..800]
  const project = (lat: number, lng: number) => {
    const x = ((lng - GEO_BOUNDS.minLng) / (GEO_BOUNDS.maxLng - GEO_BOUNDS.minLng)) * 1000;
    // Invert lat because SVG Y increases downwards
    const y = ((GEO_BOUNDS.maxLat - lat) / (GEO_BOUNDS.maxLat - GEO_BOUNDS.minLat)) * 800;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getAirlineColor = (code: string) => {
    switch (code) {
      case '6E': return '#0052cc'; // IndiGo blue
      case 'AI': return '#e11d48'; // Air India red
      case 'UK': return '#8b5cf6'; // Vistara purple
      case 'QP': return '#ea580c'; // Akasa orange
      case 'SG': return '#f59e0b'; // SpiceJet amber
      case 'EK': return '#10b981'; // Emirates emerald
      case 'SQ': return '#eab308'; // Singapore Airlines gold
      default: return '#38bdf8';   // Cyan
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[580px] lg:h-[650px] bg-[#07111E] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Radar Background Glow & Range Rings */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.15)_0,transparent_70%)]" />

      {/* Control Overlays Top Left */}
      <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2 pointer-events-auto">
        <div className="bg-[#0B1E36]/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 shadow-xl flex items-center space-x-3 text-xs text-slate-300">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
            <span className="font-bold text-white tracking-wider uppercase text-[11px]">
              Live Airspace Radar
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-slate-400 font-mono text-[11px]">
            <span className="text-emerald-400 font-bold">{flights.length}</span> Active In-Air
          </div>
        </div>

        {/* View toggles */}
        <div className="bg-[#0B1E36]/80 backdrop-blur-md border border-slate-700/60 rounded-xl p-1.5 flex items-center space-x-1 text-xs">
          <button
            onClick={() => setShowAirports(!showAirports)}
            className={`px-2.5 py-1 rounded-lg flex items-center space-x-1.5 transition-colors ${
              showAirports ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Airport Beacons"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium">Hubs</span>
          </button>
          <button
            onClick={() => setShowFlightLabels(!showFlightLabels)}
            className={`px-2.5 py-1 rounded-lg flex items-center space-x-1.5 transition-colors ${
              showFlightLabels ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Callsign Labels"
          >
            {showFlightLabels ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="text-[10px] font-medium">Callsigns</span>
          </button>
        </div>
      </div>

      {/* Zoom / Reset Controls Top Right */}
      <div className="absolute top-4 right-4 z-20 flex flex-col space-y-1.5 pointer-events-auto bg-[#0B1E36]/80 backdrop-blur-md border border-slate-700/60 rounded-xl p-1">
        <button
          onClick={() => setZoom(z => Math.min(z + 0.3, 3))}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(z => Math.max(z - 0.3, 0.7))}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetView}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
          title="Reset Center"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Compass Indicator Bottom Right */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-none flex items-center space-x-2 bg-[#0B1E36]/80 backdrop-blur-md border border-slate-700/60 px-3 py-1.5 rounded-xl text-[11px] text-slate-400 font-mono">
        <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '30s' }} />
        <span>ATC GRID • WGS-84</span>
      </div>

      {/* SVG Interactive Canvas */}
      <svg
        className="w-full h-full"
        viewBox="0 0 1000 800"
        preserveAspectRatio="xMidYMid meet"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '500px 400px',
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        <defs>
          {/* Radar Sweep Gradient */}
          <linearGradient id="radarSweep" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>

          {/* Glow filter for active aircraft */}
          <filter id="radarGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ATC Grid Latitude / Longitude Lines */}
        <g stroke="#1E293B" strokeWidth="0.8" strokeDasharray="3,6" opacity="0.6">
          {[10, 15, 20, 25, 30, 35].map(lat => {
            const y = project(lat, 75).y;
            return (
              <g key={`lat-${lat}`}>
                <line x1="0" y1={y} x2="1000" y2={y} />
                <text x="12" y={y - 4} fill="#475569" fontSize="9" fontFamily="monospace">
                  {lat}°N
                </text>
              </g>
            );
          })}
          {[55, 65, 75, 85, 95].map(lng => {
            const x = project(20, lng).x;
            return (
              <g key={`lng-${lng}`}>
                <line x1={x} y1="0" x2={x} y2="800" />
                <text x={x + 4} y="790" fill="#475569" fontSize="9" fontFamily="monospace">
                  {lng}°E
                </text>
              </g>
            );
          })}
        </g>

        {/* Concentric Radar Distance Rings centered around central India (approx 21°N, 78°E) */}
        {(() => {
          const center = project(21.0, 78.0);
          return (
            <g stroke="#0369a1" strokeWidth="0.6" strokeDasharray="4,6" opacity="0.25" fill="none">
              <circle cx={center.x} cy={center.y} r="120" />
              <circle cx={center.x} cy={center.y} r="240" />
              <circle cx={center.x} cy={center.y} r="360" />
              <circle cx={center.x} cy={center.y} r="480" />
            </g>
          );
        })()}

        {/* Simplified Geographic Coastline & Mainland Landmass */}
        {SUB_CONTINENT_PATHS.map((points, idx) => {
          const pathData = points
            .map((p, i) => {
              const { x, y } = project(p[0], p[1]);
              return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
            })
            .join(' ') + ' Z';

          return (
            <path
              key={`mainland-${idx}`}
              d={pathData}
              fill="#0F243B"
              fillOpacity="0.4"
              stroke="#1e3a5f"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          );
        })}

        {/* Animated Radar Sweep Cone (Phosphor beam) */}
        {radarSweeping && (
          <g transform={`translate(${project(21.0, 78.0).x}, ${project(21.0, 78.0).y})`}>
            <circle
              r="480"
              fill="url(#radarSweep)"
              clipPath="polygon(0 0, 480px 0, 480px 480px)"
              className="origin-center animate-[spin_6s_linear_infinite]"
              opacity="0.2"
            />
          </g>
        )}

        {/* Flight Trajectory Route Arcs */}
        <g>
          {flights.map(f => {
            const orig = project(f.origin.lat, f.origin.lng);
            const dest = project(f.destination.lat, f.destination.lng);
            const plane = project(f.coordinates.lat, f.coordinates.lng);
            const isSelected = selectedFlight?.id === f.id;
            const isHovered = hoveredFlight?.id === f.id;

            // Quadratic curve control point for great-circle arch
            const midX = (orig.x + dest.x) / 2;
            const midY = (orig.y + dest.y) / 2 - 25;

            return (
              <g key={`route-${f.id}`} opacity={isSelected ? 1 : isHovered ? 0.85 : 0.25}>
                {/* Past flown path */}
                <path
                  d={`M ${orig.x} ${orig.y} Q ${midX} ${midY} ${plane.x} ${plane.y}`}
                  fill="none"
                  stroke={isSelected ? '#38bdf8' : '#64748b'}
                  strokeWidth={isSelected ? 2 : 1}
                  strokeDasharray={isSelected ? 'none' : '4,4'}
                />
                {/* Remaining path to destination */}
                <path
                  d={`M ${plane.x} ${plane.y} Q ${midX} ${midY} ${dest.x} ${dest.y}`}
                  fill="none"
                  stroke={isSelected ? '#0ea5e9' : '#334155'}
                  strokeWidth={isSelected ? 1.8 : 0.8}
                  strokeDasharray="2,4"
                />
              </g>
            );
          })}
        </g>

        {/* Major Airport Radar Beacons */}
        {showAirports && (
          <g>
            {MAJOR_RADAR_AIRPORTS.map(ap => {
              const { x, y } = project(ap.lat, ap.lng);
              return (
                <g key={`ap-${ap.code}`} className="pointer-events-none">
                  <circle cx={x} cy={y} r="3" fill="#38bdf8" opacity="0.8" />
                  <circle cx={x} cy={y} r="7" fill="none" stroke="#38bdf8" strokeWidth="0.8" opacity="0.4" />
                  <text
                    x={x + 7}
                    y={y + 3}
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="sans-serif"
                    fontWeight="600"
                  >
                    {ap.code}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* Active Aircraft Markers */}
        <g>
          {flights.map(flight => {
            const { x, y } = project(flight.coordinates.lat, flight.coordinates.lng);
            const isSelected = selectedFlight?.id === flight.id;
            const isHovered = hoveredFlight?.id === flight.id;
            const airlineColor = getAirlineColor(flight.airlineCode);

            return (
              <g
                key={`flight-${flight.id}`}
                transform={`translate(${x}, ${y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectFlight(flight);
                }}
                onMouseEnter={() => setHoveredFlight(flight)}
                onMouseLeave={() => setHoveredFlight(null)}
                className="cursor-pointer transition-transform"
                style={{ zIndex: isSelected ? 30 : 10 }}
              >
                {/* Selection / Pulse Halo */}
                {isSelected && (
                  <circle
                    r="16"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    className="animate-ping opacity-75"
                  />
                )}

                {/* Aircraft Directional Marker */}
                <g transform={`rotate(${flight.heading})`}>
                  <path
                    d="M 0 -9 L 2.5 -4 L 8 -1 L 8 1.5 L 2.5 0.5 L 2 6 L 4.5 8 L 4.5 9.5 L 0 8.5 L -4.5 9.5 L -4.5 8 L -2 6 L -2.5 0.5 L -8 1.5 L -8 -1 L -2.5 -4 Z"
                    fill={isSelected ? '#38bdf8' : airlineColor}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? '1' : '0.5'}
                    filter={isSelected ? 'url(#radarGlow)' : undefined}
                  />
                </g>

                {/* Callsign & Altitude Label Pill */}
                {showFlightLabels && (
                  <g transform="translate(10, -12)" className="pointer-events-none">
                    <rect
                      x="0"
                      y="0"
                      width={isSelected ? "64" : "56"}
                      height="20"
                      rx="4"
                      fill={isSelected ? "#0284c7" : "#0B1E36"}
                      fillOpacity="0.85"
                      stroke={isSelected ? "#38bdf8" : "#334155"}
                      strokeWidth="0.8"
                    />
                    <text
                      x="5"
                      y="9"
                      fill="#ffffff"
                      fontSize="7.5"
                      fontWeight="700"
                      fontFamily="monospace"
                    >
                      {flight.flightNumber}
                    </text>
                    <text
                      x="5"
                      y="17"
                      fill={isSelected ? "#e0f2fe" : "#94a3b8"}
                      fontSize="6.5"
                      fontFamily="monospace"
                    >
                      FL{Math.round(flight.altitudeFeet / 100)} • {flight.speedKnots}k
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Hovered Flight Quick Peek Box */}
      {hoveredFlight && (
        <div className="absolute bottom-4 left-4 z-30 bg-[#0B1E36]/95 backdrop-blur-md border border-slate-700/80 p-3 rounded-xl shadow-2xl text-xs text-white max-w-xs pointer-events-none animate-fadeIn">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-700/60 mb-2">
            <span className="font-bold text-sky-400 font-mono">{hoveredFlight.flightNumber}</span>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
              {hoveredFlight.status}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-300 font-semibold mb-1">
            <span>{hoveredFlight.origin.code} ({hoveredFlight.origin.city})</span>
            <span className="text-slate-500">➔</span>
            <span>{hoveredFlight.destination.code} ({hoveredFlight.destination.city})</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 font-mono mt-2 bg-slate-900/60 p-1.5 rounded-lg">
            <div>
              <div className="text-slate-500">ALTITUDE</div>
              <div className="text-white font-bold">{hoveredFlight.altitudeFeet.toLocaleString()} FT</div>
            </div>
            <div>
              <div className="text-slate-500">SPEED</div>
              <div className="text-white font-bold">{hoveredFlight.speedKmh} km/h</div>
            </div>
            <div>
              <div className="text-slate-500">PROGRESS</div>
              <div className="text-emerald-400 font-bold">{hoveredFlight.progressPercent}%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
