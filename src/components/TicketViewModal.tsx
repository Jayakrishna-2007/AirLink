import React from 'react';
import { X, Printer, Plane, QrCode, AlertTriangle, ShieldCheck, Building2, Luggage, Compass } from 'lucide-react';
import { Booking } from '../types';
import { getAirportByCode } from '../data/airports';

interface TicketViewModalProps {
  booking: Booking;
  onClose: () => void;
  onCancelBooking?: (id: number) => void;
}

export const TicketViewModal: React.FC<TicketViewModalProps> = ({
  booking,
  onClose,
  onCancelBooking,
}) => {
  const isCancelled = booking.bookingStatus === 'CANCELLED';

  const handlePrint = () => {
    window.print();
  };

  const srcAirport = booking.flight ? getAirportByCode(booking.flight.source) : null;
  const destAirport = booking.flight ? getAirportByCode(booking.flight.destination) : null;

  const srcName = booking.flight?.sourceAirportName || srcAirport?.name || `${booking.flight?.source} International Airport`;
  const destName = booking.flight?.destAirportName || destAirport?.name || `${booking.flight?.destination} International Airport`;
  const srcTerm = booking.flight?.terminalSource || srcAirport?.defaultTerminal || 'Terminal 1';
  const destTerm = booking.flight?.terminalDest || destAirport?.defaultTerminal || 'Terminal 1';
  const gate = booking.flight?.gate || 'Gate 12B';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Controls Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-white tracking-tight">Electronic Flight Ticket & Boarding Pass</span>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
              isCancelled
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {booking.bookingStatus}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors text-xs flex items-center space-x-1"
              title="Print E-Ticket"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Boarding Pass Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Visual Boarding Pass Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
            
            {/* Top Banner with Airline & PNR */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 px-6 py-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg">
                  <Plane className="w-5 h-5 -rotate-45" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-white tracking-tight">
                    {booking.flight?.airline || 'Commercial Airline'}
                  </div>
                  <div className="text-xs text-blue-300 font-mono">
                    Flight {booking.flight?.flightNumber || 'FLIGHT'} • Aircraft: {booking.flight?.aircraft || 'A320'}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Booking Reference (PNR)</div>
                <div className="text-2xl font-mono font-black text-amber-400 tracking-widest">
                  {booking.pnr}
                </div>
              </div>
            </div>

            {/* Flight Route Details with Full Airport & Terminal Data */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-dashed border-slate-800">
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Departure Hub</div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold text-white">{booking.flight?.source || 'DEL'}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30">
                    {srcTerm}
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-medium truncate mt-0.5" title={srcName}>
                  {srcName}
                </div>
                <div className="text-xs text-blue-400 font-medium mt-1">{booking.flight?.departureDate}</div>
                <div className="text-base font-bold text-white mt-0.5">{booking.flight?.departureTime?.slice(0, 5)}</div>
                <div className="text-[11px] text-emerald-400 font-mono mt-0.5">Boarding: {gate}</div>
              </div>

              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-[11px] text-slate-400 font-medium mb-1">
                  {booking.flight?.duration} • Non-stop
                </span>
                {booking.flight?.distance && (
                  <span className="text-[10px] text-slate-500 font-mono flex items-center space-x-1 mb-1">
                    <Compass className="w-3 h-3 text-blue-400" />
                    <span>{booking.flight.distance}</span>
                  </span>
                )}
                <div className="w-full flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                  <Plane className="w-4 h-4 text-indigo-400 transform rotate-90" />
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                </div>
                <span className="text-[10px] text-emerald-400 font-medium mt-1">Confirmed Itinerary</span>
              </div>

              <div className="text-left md:text-right">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Arrival Hub</div>
                <div className="flex items-baseline md:justify-end space-x-2">
                  <span className="text-3xl font-extrabold text-white">{booking.flight?.destination || 'BOM'}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/30">
                    {destTerm}
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-medium truncate md:ml-auto mt-0.5" title={destName}>
                  {destName}
                </div>
                <div className="text-xs text-indigo-400 font-medium mt-1">{booking.flight?.arrivalDate}</div>
                <div className="text-base font-bold text-white mt-0.5">{booking.flight?.arrivalTime?.slice(0, 5)}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Baggage Belt: Assigned at Arrival</div>
              </div>
            </div>

            {/* Baggage & Terminal Policy Row */}
            <div className="px-6 py-3 bg-slate-900/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <Luggage className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  Baggage Included: Cabin <strong>{booking.flight?.baggageAllowance?.cabin || '7 kg'}</strong> • Check-in <strong>{booking.flight?.baggageAllowance?.checkIn || '15 kg'}</strong>
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span>DigiYatra / Automated Biometrics Enabled at Origin Gate</span>
              </div>
            </div>

            {/* Passenger Manifest in Ticket */}
            <div className="p-6 space-y-4">
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                <span>Passenger Manifest</span>
                <span className="text-slate-400 font-normal">Class: <strong className="text-white">{booking.travelClass.replace('_', ' ')}</strong></span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="px-3 py-2 rounded-l-lg">Passenger Name</th>
                      <th className="px-3 py-2">Passport / ID</th>
                      <th className="px-3 py-2">Seat</th>
                      <th className="px-3 py-2 rounded-r-lg">E-Ticket No.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {booking.passengers?.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="px-3 py-2.5 text-white font-semibold flex items-center space-x-2">
                          <span>{p.fullName}</span>
                          <span className="text-[10px] text-slate-500">({p.gender})</span>
                        </td>
                        <td className="px-3 py-2.5 font-mono text-slate-400">{p.passportId}</td>
                        <td className="px-3 py-2.5">
                          <span className="px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 border border-blue-500/40 font-mono font-bold">
                            {p.seatNumber}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 font-mono text-slate-400">
                          {booking.ticket?.ticketNumber || 'ETKT-PENDING'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Barcode & Security Stamp Footer */}
            <div className="bg-slate-900/80 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center">
                  <QrCode className="w-full h-full text-slate-900" />
                </div>
                <div>
                  <div className="text-xs font-mono text-white font-bold">{booking.ticket?.barcodeData || `TKT-${booking.pnr}`}</div>
                  <div className="text-[10px] text-slate-400">Issued: {booking.bookingDate?.slice(0, 10)} • Payment: {booking.payment?.paymentMethod || 'UPI'} (₹{booking.totalAmount.toLocaleString()})</div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Commercial Reservation</span>
              </div>
            </div>
          </div>

          {/* Cancellation Option */}
          {!isCancelled && onCancelBooking && (
            <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-red-300 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>Cancel Booking & Release Inventory</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Cancelling will immediately free your seats ({booking.passengers?.map(p => p.seatNumber).join(', ')}) and initiate full simulated refund of ₹{booking.totalAmount.toLocaleString()}.
                </div>
              </div>

              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to cancel booking ${booking.pnr}? Seats will be released immediately.`)) {
                    onCancelBooking(booking.id);
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Cancel This Booking
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
