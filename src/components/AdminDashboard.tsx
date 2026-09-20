import React, { useState, useEffect } from 'react';
import {
  Plane,
  Users,
  DollarSign,
  Ticket,
  Plus,
  Trash2,
  Edit2,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  RefreshCw,
  X,
} from 'lucide-react';
import { Flight, Booking, User, AdminStats } from '../types';
import { api } from '../services/api';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'FLIGHTS' | 'BOOKINGS' | 'USERS'>('FLIGHTS');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Flight Modal state
  const [isFlightModalOpen, setIsFlightModalOpen] = useState(false);
  const [editingFlightId, setEditingFlightId] = useState<number | null>(null);
  const [flightForm, setFlightForm] = useState({
    airline: 'Air India',
    flightNumber: 'AI-205',
    source: 'DEL',
    destination: 'BOM',
    departureDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    departureTime: '10:30:00',
    arrivalDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    arrivalTime: '12:45:00',
    duration: '2h 15m',
    aircraft: 'Airbus A320neo',
    totalSeats: 180,
    availableSeats: 180,
    economyFare: 5200,
    premiumFare: 7800,
    businessFare: 15400,
    firstClassFare: 22000,
  });

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, flightsData, bookingsData, usersData] = await Promise.all([
        api.getAdminStats(),
        api.getAllFlights(),
        api.getAllBookingsAdmin(),
        api.getAllUsersAdmin(),
      ]);
      setStats(statsData);
      setFlights(flightsData);
      setBookings(bookingsData);
      setUsers(usersData);
    } catch (err: any) {
      setError(err.message || 'Failed to load admin telemetry');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddFlight = () => {
    setEditingFlightId(null);
    setFlightForm({
      airline: 'Air India',
      flightNumber: `AI-${Math.floor(100 + Math.random() * 900)}`,
      source: 'DEL',
      destination: 'BLR',
      departureDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      departureTime: '14:00:00',
      arrivalDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      arrivalTime: '16:45:00',
      duration: '2h 45m',
      aircraft: 'Airbus A321neo',
      totalSeats: 180,
      availableSeats: 180,
      economyFare: 5500,
      premiumFare: 8500,
      businessFare: 16500,
      firstClassFare: 24000,
    });
    setIsFlightModalOpen(true);
  };

  const handleOpenEditFlight = (f: Flight) => {
    setEditingFlightId(f.id);
    setFlightForm({
      airline: f.airline,
      flightNumber: f.flightNumber,
      source: f.source,
      destination: f.destination,
      departureDate: f.departureDate,
      departureTime: f.departureTime,
      arrivalDate: f.arrivalDate,
      arrivalTime: f.arrivalTime,
      duration: f.duration,
      aircraft: f.aircraft,
      totalSeats: f.totalSeats,
      availableSeats: f.availableSeats,
      economyFare: f.economyFare,
      premiumFare: f.premiumFare,
      businessFare: f.businessFare,
      firstClassFare: f.firstClassFare,
    });
    setIsFlightModalOpen(true);
  };

  const handleSaveFlight = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFlightId) {
        await api.updateFlight(editingFlightId, flightForm);
      } else {
        await api.createFlight(flightForm);
      }
      setIsFlightModalOpen(false);
      await loadAllAdminData();
    } catch (err: any) {
      alert('Flight save failed: ' + (err.message || 'Server error'));
    }
  };

  const handleDeleteFlight = async (id: number) => {
    if (!confirm('Are you sure you want to delete this flight? Associated seats and non-active bookings will be impacted.')) return;
    try {
      await api.deleteFlight(id);
      await loadAllAdminData();
    } catch (err: any) {
      alert('Delete failed: ' + (err.message || 'Server error'));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Title & Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              <span>Administrative Operations Console</span>
            </h2>
            <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
              Role: ADMIN
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time fleet scheduling, passenger reservations audit, and user accounts
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadAllAdminData}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenAddFlight}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center space-x-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Flight</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
            <Plane className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Active Flights</div>
            <div className="text-2xl font-extrabold text-white mt-0.5">{stats?.totalFlights ?? flights.length}</div>
            <div className="text-[10px] text-slate-500">Commercial Scheduled</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Total Bookings</div>
            <div className="text-2xl font-extrabold text-white mt-0.5">{stats?.totalBookings ?? bookings.length}</div>
            <div className="text-[10px] text-emerald-400">Live PNR Records</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Total Revenue</div>
            <div className="text-2xl font-extrabold text-white mt-0.5">
              ₹{(stats?.totalRevenue ?? 0).toLocaleString()}
            </div>
            <div className="text-[10px] text-amber-400">Simulated Transactions</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Registered Users</div>
            <div className="text-2xl font-extrabold text-white mt-0.5">{stats?.totalUsers ?? users.length}</div>
            <div className="text-[10px] text-purple-400">BCrypt Authenticated</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center space-x-2 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('FLIGHTS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'FLIGHTS'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Scheduled Flights ({flights.length})
        </button>
        <button
          onClick={() => setActiveTab('BOOKINGS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'BOOKINGS'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          All Reservations ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('USERS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'USERS'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          System Users ({users.length})
        </button>
      </div>

      {/* Main Table Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl overflow-x-auto">
        {activeTab === 'FLIGHTS' && (
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="px-3 py-3 rounded-l-xl">Flight</th>
                <th className="px-3 py-3">Route</th>
                <th className="px-3 py-3">Schedule</th>
                <th className="px-3 py-3">Aircraft</th>
                <th className="px-3 py-3">Available Seats</th>
                <th className="px-3 py-3">Economy Fare</th>
                <th className="px-3 py-3 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {flights.map((f) => (
                <tr key={f.id} className="hover:bg-slate-800/40">
                  <td className="px-3 py-3 font-semibold text-white">
                    <div>{f.airline}</div>
                    <span className="font-mono text-[11px] text-blue-400">{f.flightNumber}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="font-bold text-white">{f.source}</span> ➔ <span className="font-bold text-white">{f.destination}</span>
                  </td>
                  <td className="px-3 py-3 text-slate-400">
                    <div>{f.departureDate}</div>
                    <div className="text-white font-mono text-[11px]">{f.departureTime.slice(0, 5)} - {f.arrivalTime.slice(0, 5)}</div>
                  </td>
                  <td className="px-3 py-3 text-slate-400">{f.aircraft}</td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold ${
                      f.availableSeats < 20 ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {f.availableSeats} / {f.totalSeats}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-bold text-white font-mono">₹{f.economyFare.toLocaleString()}</td>
                  <td className="px-3 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditFlight(f)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-white rounded-lg transition-colors"
                      title="Edit Flight"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFlight(f.id)}
                      className="p-1.5 bg-slate-800 hover:bg-red-900/40 text-red-400 hover:text-white rounded-lg transition-colors"
                      title="Delete Flight"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'BOOKINGS' && (
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="px-3 py-3 rounded-l-xl">PNR Ref</th>
                <th className="px-3 py-3">Customer</th>
                <th className="px-3 py-3">Flight</th>
                <th className="px-3 py-3">Seats</th>
                <th className="px-3 py-3">Amount</th>
                <th className="px-3 py-3">Payment</th>
                <th className="px-3 py-3 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/40">
                  <td className="px-3 py-3 font-mono font-bold text-amber-400">{b.pnr}</td>
                  <td className="px-3 py-3 text-white font-semibold">
                    <div>{b.user?.name || b.passengers?.[0]?.fullName || 'Guest'}</div>
                    <div className="text-[10px] text-slate-400">{b.user?.email || b.passengers?.[0]?.email}</div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-semibold text-white">{b.flight?.flightNumber}</div>
                    <div className="text-[11px] text-slate-400">{b.flight?.source} ➔ {b.flight?.destination}</div>
                  </td>
                  <td className="px-3 py-3 font-mono text-slate-300">
                    {b.passengers?.map(p => p.seatNumber).join(', ') || 'N/A'}
                  </td>
                  <td className="px-3 py-3 font-mono font-bold text-white">₹{b.totalAmount.toLocaleString()}</td>
                  <td className="px-3 py-3 text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono">
                      {b.payment?.paymentMethod || 'UPI'}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      b.bookingStatus === 'CONFIRMED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {b.bookingStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'USERS' && (
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="px-3 py-3 rounded-l-xl">ID</th>
                <th className="px-3 py-3">Full Name</th>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Phone</th>
                <th className="px-3 py-3">Security Role</th>
                <th className="px-3 py-3 rounded-r-xl">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40">
                  <td className="px-3 py-3 font-mono text-slate-500">{u.id}</td>
                  <td className="px-3 py-3 font-bold text-white">{u.name}</td>
                  <td className="px-3 py-3 font-mono text-slate-400">{u.email}</td>
                  <td className="px-3 py-3 text-slate-400">{u.phone}</td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      u.role === 'ADMIN'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-emerald-400 font-bold text-[10px] flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{u.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Flight Create / Edit Modal */}
      {isFlightModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <h3 className="text-base font-bold text-white">
                {editingFlightId ? 'Edit Commercial Flight' : 'Schedule New Commercial Flight'}
              </h3>
              <button
                onClick={() => setIsFlightModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFlight} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Airline</label>
                  <input
                    type="text"
                    required
                    value={flightForm.airline}
                    onChange={(e) => setFlightForm({ ...flightForm, airline: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Flight Number</label>
                  <input
                    type="text"
                    required
                    value={flightForm.flightNumber}
                    onChange={(e) => setFlightForm({ ...flightForm, flightNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Origin (Source)</label>
                  <input
                    type="text"
                    required
                    value={flightForm.source}
                    onChange={(e) => setFlightForm({ ...flightForm, source: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Destination</label>
                  <input
                    type="text"
                    required
                    value={flightForm.destination}
                    onChange={(e) => setFlightForm({ ...flightForm, destination: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Departure Date</label>
                  <input
                    type="date"
                    required
                    value={flightForm.departureDate}
                    onChange={(e) => setFlightForm({ ...flightForm, departureDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Departure Time</label>
                  <input
                    type="time"
                    step="1"
                    required
                    value={flightForm.departureTime}
                    onChange={(e) => setFlightForm({ ...flightForm, departureTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Aircraft</label>
                  <input
                    type="text"
                    required
                    value={flightForm.aircraft}
                    onChange={(e) => setFlightForm({ ...flightForm, aircraft: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={flightForm.duration}
                    onChange={(e) => setFlightForm({ ...flightForm, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Economy Fare (₹)</label>
                  <input
                    type="number"
                    required
                    value={flightForm.economyFare}
                    onChange={(e) => setFlightForm({ ...flightForm, economyFare: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Business Fare (₹)</label>
                  <input
                    type="number"
                    required
                    value={flightForm.businessFare}
                    onChange={(e) => setFlightForm({ ...flightForm, businessFare: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsFlightModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md"
                >
                  {editingFlightId ? 'Update Flight' : 'Create Flight'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
