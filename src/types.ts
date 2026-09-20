export type UserRole = 'USER' | 'ADMIN';

export type TravelClass = 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST_CLASS';

export type FlightStatus = 'SCHEDULED' | 'DELAYED' | 'CANCELLED' | 'COMPLETED';

export type SeatStatus = 'AVAILABLE' | 'OCCUPIED' | 'SELECTED';

export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'PENDING';

export type PaymentMethod = 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING' | 'WALLET';

export type PaymentStatus = 'SUCCESS' | 'REFUNDED' | 'FAILED' | 'PENDING';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status?: string;
  createdAt?: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export interface Flight {
  id: number;
  airline: string;
  flightNumber: string;
  source: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  duration: string;
  aircraft: string;
  totalSeats: number;
  availableSeats: number;
  economyFare: number;
  premiumFare: number;
  businessFare: number;
  firstClassFare: number;
  status: FlightStatus;
  terminalSource?: string;
  terminalDest?: string;
  gate?: string;
  sourceAirportName?: string;
  destAirportName?: string;
  distance?: string;
  baggageAllowance?: { cabin: string; checkIn: string };
  amenities?: string[];
}

export interface Seat {
  id: number;
  flightId?: number;
  seatNumber: string;
  seatClass: TravelClass;
  status: 'AVAILABLE' | 'OCCUPIED';
}

export interface Passenger {
  id?: number;
  fullName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  nationality: string;
  passportId: string;
  email?: string;
  phone?: string;
  seatNumber: string;
}

export interface Payment {
  id?: number;
  paymentId: string;
  paymentMethod: PaymentMethod;
  amount: number;
  paymentStatus: PaymentStatus;
  paymentDate: string;
  transactionReference: string;
}

export interface Ticket {
  id?: number;
  ticketNumber: string;
  issuedAt: string;
  barcodeData: string;
}

export type AdminStats = AdminDashboardStats;

export interface Booking {
  id: number;
  pnr: string;
  userId: number;
  userName?: string;
  userEmail?: string;
  user?: { id?: number; name?: string; email?: string; phone?: string };
  flightId: number;
  flight?: Flight;
  bookingDate: string;
  travelClass: TravelClass;
  totalAmount: number;
  bookingStatus: BookingStatus;
  passengers: Passenger[];
  payment: Payment;
  ticket: Ticket;
}

export interface FareBreakdown {
  baseFarePerPax: number;
  passengerCount: number;
  baseFareSubtotal: number;
  taxAmount: number; // 12%
  serviceFee: number; // 250 per pax
  totalAmount: number;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalFlights: number;
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
}

export interface FlightSearchParams {
  source: string;
  destination: string;
  departureDate: string;
  passengers: number;
  travelClass: TravelClass;
  airline?: string;
  maxPrice?: number;
  departureTimeSlot?: 'ALL' | 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';
  sortBy?: 'PRICE_ASC' | 'PRICE_DESC' | 'TIME_ASC' | 'DURATION_ASC';
}

export type RealtimeFlightPhase =
  | 'TAXIING'
  | 'CLIMBING'
  | 'CRUISING'
  | 'DESCENDING'
  | 'APPROACH'
  | 'LANDED'
  | 'BOARDING'
  | 'DELAYED';

export interface RealtimeFlightAirport {
  code: string;
  city: string;
  name: string;
  country: string;
  terminal?: string;
  gate?: string;
  baggageBelt?: string;
  lat: number;
  lng: number;
  scheduledTime: string;
  estimatedTime: string;
}

export interface RealtimeFlight {
  id: string;
  flightNumber: string;
  airline: string;
  airlineCode: string;
  aircraft: string;
  aircraftReg: string;
  origin: RealtimeFlightAirport;
  destination: RealtimeFlightAirport;
  status: RealtimeFlightPhase;
  progressPercent: number; // 0 to 100
  coordinates: {
    lat: number;
    lng: number;
  };
  altitudeFeet: number;
  speedKmh: number;
  speedKnots: number;
  mach: number;
  heading: number; // 0 - 360 deg
  verticalSpeedFpm: number;
  remainingDistanceKm: number;
  totalDistanceKm: number;
  elapsedMinutes: number;
  totalMinutes: number;
  delayMinutes: number;
  squawk: string;
  economyFare: number;
  availableSeats: number;
  weather?: {
    originTemp?: string;
    originCondition?: string;
    destTemp?: string;
    destCondition?: string;
  };
}

export interface RealtimeFlightFilterParams {
  search?: string;
  airline?: string;
  status?: string;
  airport?: string;
  minAltitude?: number;
  maxAltitude?: number;
}

