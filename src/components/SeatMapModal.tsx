import React, { useState, useEffect } from 'react';
import { X, Check, Armchair, AlertCircle, Info } from 'lucide-react';
import { Flight, Seat, TravelClass } from '../types';
import { api } from '../services/api';

interface SeatMapModalProps {
  flight: Flight;
  travelClass: TravelClass;
  passengerCount: number;
  onClose: () => void;
  onConfirmSeats: (selectedSeats: string[]) => void;
}

export const SeatMapModal: React.FC<SeatMapModalProps> = ({
  flight,
  travelClass,
  passengerCount,
  onClose,
  onConfirmSeats,
}) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSeats();
  }, [flight.id]);

  const loadSeats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getFlightSeats(flight.id);
      setSeats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load seats');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'OCCUPIED') return;

    if (selectedSeats.includes(seat.seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat.seatNumber));
    } else {
      if (selectedSeats.length >= passengerCount) {
        const seatsToKeep = selectedSeats.slice(selectedSeats.length - passengerCount + 1);
        setSelectedSeats([...seatsToKeep, seat.seatNumber]);
      } else {
        setSelectedSeats([...selectedSeats, seat.seatNumber]);
      }
    }
  };

  // Group seats by row number
  const rowsMap = new Map<number, Seat[]>();
  seats.forEach(seat => {
    const match = seat.seatNumber.match(/^(\d+)([A-F])$/);
    if (match) {
      const rowNum = parseInt(match[1]);
      if (!rowsMap.has(rowNum)) rowsMap.set(rowNum, []);
      rowsMap.get(rowNum)!.push(seat);
    }
  });

  const sortedRowNums = Array.from(rowsMap.keys()).sort((a, b) => a - b);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-10">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Select Airplane Seats
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-400/30">
                {flight.airline} • {flight.flightNumber}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
                {flight.source} ({flight.terminalSource || 'T1'}) ➔ {flight.destination} ({flight.terminalDest || 'T1'})
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Aircraft: <span className="text-white font-medium">{flight.aircraft}</span> • Gate: <span className="text-emerald-400 font-medium">{flight.gate || 'Assigned at check-in'}</span> • Select <span className="text-blue-400 font-bold">{passengerCount}</span> {passengerCount === 1 ? 'seat' : 'seats'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend and Class Status */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <div className="w-4 h-4 rounded bg-slate-800 border border-slate-600"></div>
              <span className="text-slate-300">Available</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-4 h-4 rounded bg-blue-600 border border-blue-400 flex items-center justify-center text-[10px] text-white font-bold">
                ✓
              </div>
              <span className="text-blue-400 font-medium">Selected</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-4 h-4 rounded bg-slate-900 border border-slate-800 opacity-40"></div>
              <span className="text-slate-500">Occupied</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-[11px] text-slate-400">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Rows 1-2: First</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              <span>Rows 3-5: Business</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Rows 6-8: Prem Econ</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              <span>Rows 9+: Economy</span>
            </span>
          </div>
        </div>

        {/* Airplane Fuselage & Cabin Layout */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs text-slate-400">Loading live aircraft cabin layout...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center text-red-400 text-xs">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
              <p>{error}</p>
            </div>
          ) : (
            <div className="w-full max-w-xl bg-slate-950 border border-slate-800/80 rounded-[40px] p-6 shadow-inner relative">
              
              {/* Airplane Cockpit Nose Curve */}
              <div className="w-40 h-16 mx-auto mb-6 border-t-2 border-x-2 border-slate-700 rounded-t-[50px] flex items-center justify-center bg-gradient-to-b from-slate-800 to-transparent">
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">COCKPIT</span>
              </div>

              {/* Column labels */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 mb-3 px-2">
                <span>A</span>
                <span>B</span>
                <span>C</span>
                <span className="text-[10px] text-slate-600 uppercase font-mono">Aisle</span>
                <span>D</span>
                <span>E</span>
                <span>F</span>
              </div>

              {/* Seat Matrix Rows */}
              <div className="space-y-2.5">
                {sortedRowNums.map(rowNum => {
                  const rowSeats = rowsMap.get(rowNum) || [];
                  const getSeat = (col: string) => rowSeats.find(s => s.seatNumber === `${rowNum}${col}`);

                  const isFirst = rowNum <= 2;
                  const isBusiness = rowNum > 2 && rowNum <= 5;
                  const isPremium = rowNum > 5 && rowNum <= 8;

                  return (
                    <div key={rowNum} className="grid grid-cols-7 gap-2 items-center px-2">
                      {/* Left: A, B, C */}
                      {['A', 'B', 'C'].map(col => {
                        const seat = getSeat(col);
                        if (!seat) return <div key={col} className="w-8 h-8"></div>;
                        const isSelected = selectedSeats.includes(seat.seatNumber);
                        const isOccupied = seat.status === 'OCCUPIED';

                        let borderAccent = 'border-slate-700';
                        if (isFirst) borderAccent = 'border-amber-500/50';
                        else if (isBusiness) borderAccent = 'border-indigo-500/50';
                        else if (isPremium) borderAccent = 'border-emerald-500/50';

                        return (
                          <button
                            key={col}
                            disabled={isOccupied}
                            onClick={() => handleSeatClick(seat)}
                            title={`${seat.seatNumber} (${seat.seatClass}) - ${seat.status}`}
                            className={`h-9 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all relative ${
                              isOccupied
                                ? 'bg-slate-900 border border-slate-800/80 text-slate-600 cursor-not-allowed opacity-40'
                                : isSelected
                                ? 'bg-blue-600 border-2 border-white text-white shadow-lg shadow-blue-500/30 scale-105'
                                : `bg-slate-800 hover:bg-slate-700 border ${borderAccent} text-slate-200`
                            }`}
                          >
                            {seat.seatNumber}
                          </button>
                        );
                      })}

                      {/* Middle Aisle Indicator with Row Number */}
                      <div className="text-center text-[11px] font-mono font-bold text-slate-500 select-none">
                        {rowNum}
                      </div>

                      {/* Right: D, E, F */}
                      {['D', 'E', 'F'].map(col => {
                        const seat = getSeat(col);
                        if (!seat) return <div key={col} className="w-8 h-8"></div>;
                        const isSelected = selectedSeats.includes(seat.seatNumber);
                        const isOccupied = seat.status === 'OCCUPIED';

                        let borderAccent = 'border-slate-700';
                        if (isFirst) borderAccent = 'border-amber-500/50';
                        else if (isBusiness) borderAccent = 'border-indigo-500/50';
                        else if (isPremium) borderAccent = 'border-emerald-500/50';

                        return (
                          <button
                            key={col}
                            disabled={isOccupied}
                            onClick={() => handleSeatClick(seat)}
                            title={`${seat.seatNumber} (${seat.seatClass}) - ${seat.status}`}
                            className={`h-9 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all relative ${
                              isOccupied
                                ? 'bg-slate-900 border border-slate-800/80 text-slate-600 cursor-not-allowed opacity-40'
                                : isSelected
                                ? 'bg-blue-600 border-2 border-white text-white shadow-lg shadow-blue-500/30 scale-105'
                                : `bg-slate-800 hover:bg-slate-700 border ${borderAccent} text-slate-200`
                            }`}
                          >
                            {seat.seatNumber}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Airplane Tail Curve */}
              <div className="w-28 h-10 mx-auto mt-6 border-b-2 border-x-2 border-slate-700 rounded-b-[30px] flex items-center justify-center bg-gradient-to-t from-slate-800 to-transparent">
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">GALLEY / TAIL</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Selected Summary & Action */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400">
              Selected Seats: <span className="font-bold text-white">{selectedSeats.length} of {passengerCount}</span>
            </div>
            <div className="flex items-center space-x-1.5 mt-1">
              {selectedSeats.length === 0 ? (
                <span className="text-xs text-slate-500 italic">No seats selected yet</span>
              ) : (
                selectedSeats.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded bg-blue-600 text-white font-mono font-bold text-xs">
                    {s}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={selectedSeats.length !== passengerCount}
              onClick={() => onConfirmSeats(selectedSeats)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center space-x-1.5"
            >
              <span>Confirm Seats & Continue</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
