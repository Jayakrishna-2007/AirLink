import React, { useState } from 'react';
import {
  CheckCircle2,
  Plane,
  Download,
  Calendar,
  AlertTriangle,
  User,
  CreditCard,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Booking } from '../types';
import { getAirportByCode } from '../data/airports';

interface BookingConfirmationStepViewProps {
  booking: Booking;
  onDownloadTicket: () => void;
  onManageBooking: () => void;
  onCancelBooking?: (id: number) => void;
  onBookAnother: () => void;
}

export const BookingConfirmationStepView: React.FC<BookingConfirmationStepViewProps> = ({
  booking,
  onDownloadTicket,
  onManageBooking,
  onCancelBooking,
  onBookAnother,
}) => {
  const [showAllPassengers, setShowAllPassengers] = useState(false);
  const flight = booking.flight;
  const srcAirport = flight ? getAirportByCode(flight.source) : null;
  const destAirport = flight ? getAirportByCode(flight.destination) : null;

  const baseFare = Math.round(booking.totalAmount * 0.83);
  const taxesAndFees = booking.totalAmount - baseFare;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Green Booking Confirmed Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 tracking-tight">
              Booking Confirmed!
            </h2>
            <p className="text-xs sm:text-sm text-emerald-800 font-medium mt-1 max-w-lg">
              Your flight has been successfully booked. A confirmation email and SMS have been sent to your registered contact details.
            </p>
          </div>
        </div>

        <div className="bg-white/80 border border-emerald-300 px-4 py-3 rounded-2xl text-right flex-shrink-0 self-stretch sm:self-auto flex sm:flex-col justify-between items-center sm:items-end">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Booking ID / PNR</span>
          <span className="text-lg font-mono font-black text-slate-900">{booking.pnr}</span>
        </div>
      </div>

      {/* Confirmed Flight Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        {/* Airline & Route Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center font-black text-blue-700 text-sm">
              {flight?.airline?.slice(0, 2).toUpperCase() || '6E'}
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                <span>{flight?.airline || 'Commercial Flight'}</span>
                <span className="font-mono text-xs text-slate-400 font-semibold">{flight?.flightNumber}</span>
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">
                {srcAirport?.name || flight?.source} ➔ {destAirport?.name || flight?.destination}
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs font-semibold text-slate-600">
            <div>{flight?.departureDate}</div>
            <div className="text-slate-400 font-normal mt-0.5">
              {flight?.departureTime?.slice(0, 5)} - {flight?.arrivalTime?.slice(0, 5)} • {flight?.duration} • Non-stop
            </div>
          </div>
        </div>

        {/* 3-Column Summary Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          
          {/* Passenger Details */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Passenger Details
            </div>
            
            {booking.passengers && booking.passengers.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-bold text-slate-900">
                  1. {booking.passengers[0].fullName} <span className="text-xs font-normal text-slate-500">(Adult)</span>
                </div>
                <div className="text-xs font-mono text-blue-600 font-bold">
                  Seat: {booking.passengers[0].seatNumber}
                </div>
              </div>
            )}

            {booking.passengers && booking.passengers.length > 1 && (
              <button
                type="button"
                onClick={() => setShowAllPassengers(!showAllPassengers)}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold pt-1"
              >
                {showAllPassengers ? 'Hide Passengers' : `View All (${booking.passengers.length}) Passengers`}
              </button>
            )}

            {showAllPassengers && booking.passengers && (
              <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
                {booking.passengers.map((p, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{idx + 1}. {p.fullName}</span>
                    <span className="font-mono font-bold text-blue-600">{p.seatNumber}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fare Details */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-2.5 text-xs">
            <div className="font-extrabold text-slate-400 uppercase tracking-wider mb-3">
              Fare Details
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Base Fare</span>
              <span className="font-semibold text-slate-800">₹{baseFare.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Taxes & Fees</span>
              <span className="font-semibold text-slate-800">₹{taxesAndFees.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
              <span>Total Paid</span>
              <span className="text-blue-600 font-black">₹{booking.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-2.5 flex flex-col justify-center">
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">
              Actions
            </div>

            <button
              type="button"
              onClick={onDownloadTicket}
              className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Ticket</span>
            </button>

            <button
              type="button"
              onClick={onManageBooking}
              className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold text-xs transition-colors flex items-center justify-center space-x-2"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Manage Booking</span>
            </button>

            {onCancelBooking && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Cancel reservation ${booking.pnr} and release seats?`)) {
                    onCancelBooking(booking.id);
                  }
                }}
                className="w-full py-2 px-3 rounded-xl hover:bg-red-50 text-red-600 font-bold text-xs transition-colors flex items-center justify-center space-x-1"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Cancel Booking</span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Book Another Flight CTA */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onBookAnother}
          className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2"
        >
          <Plane className="w-4 h-4" />
          <span>Book Another Flight</span>
        </button>
      </div>

    </div>
  );
};
