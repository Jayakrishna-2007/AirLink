import {
  Booking,
  Flight,
  FlightSearchParams,
  Seat,
  User,
  AdminDashboardStats,
  RealtimeFlight,
  RealtimeFlightFilterParams
} from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = sessionStorage.getItem('airbooking_token') || localStorage.getItem('airbooking_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Auth
  async register(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Registration failed' }));
      throw new Error(err.message || 'Registration failed');
    }
    return res.json();
  },

  async login(credentials: any): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Invalid credentials' }));
      throw new Error(err.message || 'Invalid credentials');
    }
    return res.json();
  },

  async getCurrentUser(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  },

  // Flights & Airports
  async getAirports(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/airports`);
    if (!res.ok) throw new Error('Failed to fetch airport directory');
    return res.json();
  },

  async getAirportDetails(code: string): Promise<any> {
    const res = await fetch(`${API_BASE}/airports/${code}`);
    if (!res.ok) throw new Error(`Failed to fetch details for airport ${code}`);
    return res.json();
  },

  async getFlights(): Promise<Flight[]> {
    const res = await fetch(`${API_BASE}/flights`);
    if (!res.ok) throw new Error('Failed to fetch flights');
    return res.json();
  },

  async searchFlights(params: Partial<FlightSearchParams>): Promise<Flight[]> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    const res = await fetch(`${API_BASE}/flights/search?${query.toString()}`);
    if (!res.ok) throw new Error('Flight search failed');
    return res.json();
  },

  async getFlightById(id: number): Promise<Flight> {
    const res = await fetch(`${API_BASE}/flights/${id}`);
    if (!res.ok) throw new Error('Flight not found');
    return res.json();
  },

  async getFlightSeats(flightId: number): Promise<Seat[]> {
    const res = await fetch(`${API_BASE}/flights/${flightId}/seats`);
    if (!res.ok) throw new Error('Failed to fetch seat layout');
    return res.json();
  },

  // Bookings
  async createBooking(data: any): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Booking failed' }));
      throw new Error(err.message || 'Booking failed');
    }
    return res.json();
  },

  async getMyBookings(): Promise<Booking[]> {
    const res = await fetch(`${API_BASE}/bookings/my`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },

  async getBookingByPnr(pnr: string): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings/pnr/${pnr}`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Booking not found');
    return res.json();
  },

  async cancelBooking(bookingId: number): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Cancellation failed' }));
      throw new Error(err.message || 'Cancellation failed');
    }
    return res.json();
  },

  // Admin
  async getAdminStats(): Promise<AdminDashboardStats> {
    const res = await fetch(`${API_BASE}/admin/dashboard`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to load admin stats');
    return res.json();
  },

  async getAdminUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to load users');
    return res.json();
  },

  async updateUserStatus(userId: number, status: string): Promise<User> {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update user status');
    return res.json();
  },

  async createFlight(flightData: Partial<Flight>): Promise<Flight> {
    const res = await fetch(`${API_BASE}/flights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(flightData),
    });
    if (!res.ok) throw new Error('Failed to create flight');
    return res.json();
  },

  async updateFlight(id: number, flightData: Partial<Flight>): Promise<Flight> {
    const res = await fetch(`${API_BASE}/flights/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(flightData),
    });
    if (!res.ok) throw new Error('Failed to update flight');
    return res.json();
  },

  async deleteFlight(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/flights/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to delete flight');
  },

  async getAdminBookings(): Promise<Booking[]> {
    const res = await fetch(`${API_BASE}/admin/bookings`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to fetch admin bookings');
    return res.json();
  },

  async getAllFlights(): Promise<Flight[]> {
    return this.getFlights();
  },

  async getAllBookingsAdmin(): Promise<Booking[]> {
    return this.getAdminBookings();
  },

  async getAllUsersAdmin(): Promise<User[]> {
    return this.getAdminUsers();
  },

  async getUserBookings(): Promise<Booking[]> {
    return this.getMyBookings();
  },

  // Java Academic Files
  async getJavaFileTree(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/java-project/tree`);
    if (!res.ok) throw new Error('Failed to read project tree');
    return res.json();
  },

  async getJavaFileContent(filePath: string): Promise<{ path: string; content: string }> {
    const res = await fetch(`${API_BASE}/java-project/file?path=${encodeURIComponent(filePath)}`);
    if (!res.ok) throw new Error('Failed to read file content');
    return res.json();
  },

  // Real-Time Flights & Live Radar API
  async getRealtimeFlights(params?: RealtimeFlightFilterParams): Promise<{
    timestamp: string;
    totalActiveFlights: number;
    flights: RealtimeFlight[];
  }> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
    }
    const res = await fetch(`${API_BASE}/realtime-flights?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch real-time flights');
    return res.json();
  },

  async getRealtimeFlightById(id: string): Promise<RealtimeFlight> {
    const res = await fetch(`${API_BASE}/realtime-flights/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error(`Failed to fetch flight ${id}`);
    return res.json();
  },

  async getAirportLiveBoard(code: string): Promise<{
    airport: any;
    departures: RealtimeFlight[];
    arrivals: RealtimeFlight[];
    totalTraffic: number;
  }> {
    const res = await fetch(`${API_BASE}/realtime-flights/airport/${encodeURIComponent(code)}`);
    if (!res.ok) throw new Error(`Failed to fetch live board for ${code}`);
    return res.json();
  }
};
