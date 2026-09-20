import React, { useState, useEffect } from 'react';
import { Plane, Calendar, Search, Ticket, AlertCircle, Eye, XCircle, CheckCircle2 } from 'lucide-react';
import { Booking } from '../types';
import { api } from '../services/api';
import { TicketViewModal } from './TicketViewModal';

interface MyBookingsProps {
  onNavigateToSearch: () => void;
}

export const MyBookings: React.FC<MyBookingsProps> = ({ onNavigateToSearch }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pnrSearch, setPnrSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED'>('ALL');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getUserBookings();
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load user reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: number) => {
    try {
      await api.cancelBooking(bookingId);
      await loadBookings();
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking(null);
      }
    } catch (err: any) {
      alert('Cancellation failed: ' + (err.message || 'Server error'));
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesPnr = !pnrSearch.trim() || b.pnr.toLowerCase().includes(pnrSearch.toLowerCase().trim());
    const matchesStatus = statusFilter === 'ALL' || b.bookingStatus === statusFilter;
    return matchesPnr && matchesStatus;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header & Search Tools */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Ticket className="w-5 h-5 text-blue-600" />
            <span>My Flight Bookings & Boarding Passes</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your commercial reservations, retrieve boarding passes, or process cancellations
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* PNR search */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search PNR..."
              value={pnrSearch}
              onChange={(e) => setPnrSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs font-medium focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center bg-white border border-slate-200 rounded-3xl shadow-sm">
          <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-500 font-medium">Loading flight itineraries...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white border border-red-200 rounded-3xl text-red-600 text-xs shadow-sm">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
          <p>{error}</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="py-16 text-center bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-blue-600">
            <Ticket className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Reservations Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {pnrSearch ? 'No reservations match your search criteria.' : "You haven't booked any flights yet on Airlink."}
            </p>
          </div>
          <button
            onClick={onNavigateToSearch}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Search Flights Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const isConfirmed = b.bookingStatus === 'CONFIRMED';

            return (
              <div
                key={b.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-mono font-bold text-slate-400">PNR</span>
                    <span className="text-lg font-mono font-black text-slate-900 tracking-wider">
                      {b.pnr}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isConfirmed
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : 'bg-red-50 text-red-700 border border-red-300'
                      }`}
                    >
                      {b.bookingStatus}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Booked: {b.bookingDate ? b.bookingDate.slice(0, 10) : 'Recent'}</span>
                  </div>
                </div>

                {/* Flight summary row */}
                {b.flight && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{b.flight.airline}</div>
                      <div className="text-xs font-mono text-blue-600 font-semibold">{b.flight.flightNumber}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Aircraft: {b.flight.aircraft}</div>
                    </div>

                    <div className="flex items-center justify-between md:justify-center md:space-x-6 text-center">
                      <div>
                        <div className="text-base font-extrabold text-slate-900">{b.flight.source}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{b.flight.departureTime?.slice(0, 5)}</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-400">{b.flight.duration}</span>
                        <div className="w-16 h-0.5 bg-slate-300 my-0.5"></div>
                        <span className="text-[9px] text-emerald-600 font-bold">Non-stop</span>
                      </div>
                      <div>
                        <div className="text-base font-extrabold text-slate-900">{b.flight.destination}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{b.flight.arrivalTime?.slice(0, 5)}</div>
                      </div>
                    </div>

                    <div className="text-left md:text-right">
                      <div className="text-xs text-slate-500">Travel Date</div>
                      <div className="text-xs font-bold text-slate-900">{b.flight.departureDate}</div>
                      <div className="text-[11px] text-blue-600 font-semibold">{b.travelClass.replace('_', ' ')}</div>
                    </div>
                  </div>
                )}

                {/* Passenger Seats + Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">Seats:</span>
                    {b.passengers?.map((p, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-mono font-bold text-xs border border-blue-200"
                        title={p.fullName}
                      >
                        {p.seatNumber} ({p.fullName})
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-black text-slate-900">
                      ₹{b.totalAmount.toLocaleString()}
                    </span>

                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Ticket</span>
                    </button>

                    {isConfirmed && (
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to cancel booking ${b.pnr}?`)) {
                            handleCancel(b.id);
                          }
                        }}
                        className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 font-bold text-xs rounded-xl border border-red-200 transition-colors flex items-center space-x-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ticket Modal */}
      {selectedBooking && (
        <TicketViewModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onCancelBooking={(id) => {
            handleCancel(id);
          }}
        />
      )}

    </div>
  );
};
