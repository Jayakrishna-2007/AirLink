import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import { REALISTIC_AIRPORTS, getAirportByCode } from './src/data/airports';
import {
  generateRealtimeFlightsSnapshot,
  PREDEFINED_FLIGHT_ROUTES,
  computeFlightTelemetry
} from './src/data/realtimeFlightsData';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || '404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970';
const serverStartTime = Date.now();

app.use(express.json());

// In-Memory Database simulating Spring Boot Data JPA Entities
interface UserEntity {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

interface FlightEntity {
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
  status: 'SCHEDULED' | 'DELAYED' | 'CANCELLED' | 'COMPLETED';
  terminalSource?: string;
  terminalDest?: string;
  gate?: string;
  sourceAirportName?: string;
  destAirportName?: string;
  distance?: string;
  baggageAllowance?: { cabin: string; checkIn: string };
  amenities?: string[];
}

interface SeatEntity {
  id: number;
  flightId: number;
  seatNumber: string;
  seatClass: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST_CLASS';
  status: 'AVAILABLE' | 'OCCUPIED';
}

interface PassengerEntity {
  id: number;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  passportId: string;
  email?: string;
  phone?: string;
  seatNumber: string;
}

interface PaymentEntity {
  id: number;
  paymentId: string;
  paymentMethod: 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING';
  amount: number;
  paymentStatus: 'SUCCESS' | 'REFUNDED' | 'FAILED' | 'PENDING';
  paymentDate: string;
  transactionReference: string;
}

interface TicketEntity {
  id: number;
  ticketNumber: string;
  issuedAt: string;
  barcodeData: string;
}

interface BookingEntity {
  id: number;
  pnr: string;
  userId: number;
  flightId: number;
  bookingDate: string;
  travelClass: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST_CLASS';
  totalAmount: number;
  bookingStatus: 'CONFIRMED' | 'CANCELLED' | 'PENDING';
  passengers: PassengerEntity[];
  payment: PaymentEntity;
  ticket: TicketEntity;
}

// Initial Data
const defaultHashedPassword = bcrypt.hashSync('Password@123', 10);

const dbUsers: UserEntity[] = [
  {
    id: 1,
    name: 'System Administrator',
    email: 'admin@airlink.com',
    phone: '+91 9876543210',
    password: defaultHashedPassword,
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Rahul Sharma',
    email: 'user@airlink.com',
    phone: '+91 9811223344',
    password: defaultHashedPassword,
    role: 'USER',
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: 'System Administrator (Legacy)',
    email: 'admin@airbooking.com',
    phone: '+91 9876543210',
    password: defaultHashedPassword,
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Rahul Sharma (Legacy)',
    email: 'user@airbooking.com',
    phone: '+91 9811223344',
    password: defaultHashedPassword,
    role: 'USER',
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  }
];

// Helper function to get dates relative to today
const getOffsetDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const dbFlights: FlightEntity[] = [
  {
    id: 1,
    airline: 'Air India',
    flightNumber: 'AI-102',
    source: 'DEL',
    destination: 'BOM',
    departureDate: getOffsetDate(1),
    departureTime: '06:00:00',
    arrivalDate: getOffsetDate(1),
    arrivalTime: '08:15:00',
    duration: '2h 15m',
    aircraft: 'Airbus A320neo',
    totalSeats: 180,
    availableSeats: 168,
    economyFare: 5400.00,
    premiumFare: 8200.00,
    businessFare: 16500.00,
    firstClassFare: 24000.00,
    status: 'SCHEDULED'
  },
  {
    id: 2,
    airline: 'IndiGo',
    flightNumber: '6E-503',
    source: 'DEL',
    destination: 'BOM',
    departureDate: getOffsetDate(1),
    departureTime: '09:30:00',
    arrivalDate: getOffsetDate(1),
    arrivalTime: '11:45:00',
    duration: '2h 15m',
    aircraft: 'Airbus A321neo',
    totalSeats: 220,
    availableSeats: 204,
    economyFare: 4950.00,
    premiumFare: 7500.00,
    businessFare: 14200.00,
    firstClassFare: 21000.00,
    status: 'SCHEDULED'
  },
  {
    id: 3,
    airline: 'Vistara',
    flightNumber: 'UK-945',
    source: 'DEL',
    destination: 'BLR',
    departureDate: getOffsetDate(1),
    departureTime: '07:15:00',
    arrivalDate: getOffsetDate(1),
    arrivalTime: '10:05:00',
    duration: '2h 50m',
    aircraft: 'Boeing 737-800',
    totalSeats: 168,
    availableSeats: 150,
    economyFare: 6200.00,
    premiumFare: 9400.00,
    businessFare: 18900.00,
    firstClassFare: 28000.00,
    status: 'SCHEDULED'
  },
  {
    id: 4,
    airline: 'Air India',
    flightNumber: 'AI-804',
    source: 'BOM',
    destination: 'BLR',
    departureDate: getOffsetDate(1),
    departureTime: '14:20:00',
    arrivalDate: getOffsetDate(1),
    arrivalTime: '16:00:00',
    duration: '1h 40m',
    aircraft: 'Airbus A320',
    totalSeats: 180,
    availableSeats: 172,
    economyFare: 4200.00,
    premiumFare: 6800.00,
    businessFare: 13500.00,
    firstClassFare: 19500.00,
    status: 'SCHEDULED'
  },
  {
    id: 5,
    airline: 'SpiceJet',
    flightNumber: 'SG-291',
    source: 'DEL',
    destination: 'GOI',
    departureDate: getOffsetDate(2),
    departureTime: '11:00:00',
    arrivalDate: getOffsetDate(2),
    arrivalTime: '13:35:00',
    duration: '2h 35m',
    aircraft: 'Boeing 737 MAX',
    totalSeats: 186,
    availableSeats: 178,
    economyFare: 5800.00,
    premiumFare: 8600.00,
    businessFare: 15900.00,
    firstClassFare: 23000.00,
    status: 'SCHEDULED'
  },
  {
    id: 6,
    airline: 'IndiGo',
    flightNumber: '6E-712',
    source: 'BLR',
    destination: 'HYD',
    departureDate: getOffsetDate(1),
    departureTime: '17:45:00',
    arrivalDate: getOffsetDate(1),
    arrivalTime: '18:55:00',
    duration: '1h 10m',
    aircraft: 'Airbus A320',
    totalSeats: 180,
    availableSeats: 175,
    economyFare: 3100.00,
    premiumFare: 5200.00,
    businessFare: 11000.00,
    firstClassFare: 16000.00,
    status: 'SCHEDULED'
  },
  {
    id: 7,
    airline: 'Emirates',
    flightNumber: 'EK-511',
    source: 'DEL',
    destination: 'DXB',
    departureDate: getOffsetDate(2),
    departureTime: '04:15:00',
    arrivalDate: getOffsetDate(2),
    arrivalTime: '06:45:00',
    duration: '4h 00m',
    aircraft: 'Boeing 777-300ER',
    totalSeats: 354,
    availableSeats: 320,
    economyFare: 19800.00,
    premiumFare: 29500.00,
    businessFare: 58000.00,
    firstClassFare: 95000.00,
    status: 'SCHEDULED'
  }
];

// Seat map cache per flight
const dbSeats: Map<number, SeatEntity[]> = new Map();

function getOrCreateSeatsForFlight(flightId: number): SeatEntity[] {
  if (dbSeats.has(flightId)) {
    return dbSeats.get(flightId)!;
  }
  const flight = dbFlights.find(f => f.id === flightId);
  const total = flight ? flight.totalSeats : 180;
  const rows = Math.min(30, Math.max(12, Math.floor(total / 6)));
  const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seats: SeatEntity[] = [];

  let idCounter = 1;
  for (let r = 1; r <= rows; r++) {
    let seatClass: 'FIRST_CLASS' | 'BUSINESS' | 'PREMIUM_ECONOMY' | 'ECONOMY' = 'ECONOMY';
    if (r <= 2) seatClass = 'FIRST_CLASS';
    else if (r <= 5) seatClass = 'BUSINESS';
    else if (r <= 8) seatClass = 'PREMIUM_ECONOMY';

    for (const c of cols) {
      const seatNum = `${r}${c}`;
      // Pre-occupy a few seats realistically
      const isOccupied = (r === 3 && c === 'A') || (r === 4 && c === 'C') || (r === 12 && c === 'B') || (r === 15 && c === 'D');
      seats.push({
        id: idCounter++,
        flightId,
        seatNumber: seatNum,
        seatClass,
        status: isOccupied ? 'OCCUPIED' : 'AVAILABLE'
      });
    }
  }
  dbSeats.set(flightId, seats);
  return seats;
}

// Initial confirmed seed booking for demonstration
const dbBookings: BookingEntity[] = [
  {
    id: 1,
    pnr: 'AI7K9P',
    userId: 2,
    flightId: 1,
    bookingDate: new Date(Date.now() - 86400000).toISOString(),
    travelClass: 'ECONOMY',
    totalAmount: 6298.00,
    bookingStatus: 'CONFIRMED',
    passengers: [
      {
        id: 1,
        fullName: 'Rahul Sharma',
        dateOfBirth: '1995-04-12',
        gender: 'MALE',
        nationality: 'INDIAN',
        passportId: 'N8472910',
        email: 'user@airlink.com',
        phone: '+91 9811223344',
        seatNumber: '12B'
      }
    ],
    payment: {
      id: 1,
      paymentId: 'PAY-UPI-8849F2A1',
      paymentMethod: 'UPI',
      amount: 6298.00,
      paymentStatus: 'SUCCESS',
      paymentDate: new Date(Date.now() - 86400000).toISOString(),
      transactionReference: 'UPI-REF-992019482'
    },
    ticket: {
      id: 1,
      ticketNumber: 'ETKT-910482716',
      issuedAt: new Date(Date.now() - 86400000).toISOString(),
      barcodeData: 'TKT-AI7K9P-ETKT-910482716'
    }
  }
];

let nextUserId = 3;
let nextFlightId = 8;
let nextBookingId = 2;
let nextPassengerId = 2;

// Calculate distance between two lat/lng points using Haversine formula
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function calculateArrivalTime(depTime: string, durationMinutes: number): string {
  const [hStr, mStr] = depTime.split(':');
  const depMinutes = parseInt(hStr, 10) * 60 + parseInt(mStr, 10);
  const arrMinutes = (depMinutes + durationMinutes) % (24 * 60);
  const arrH = Math.floor(arrMinutes / 60).toString().padStart(2, '0');
  const arrM = (arrMinutes % 60).toString().padStart(2, '0');
  return `${arrH}:${arrM}:00`;
}

function ensureFlightsForRouteAndDate(sourceCode: string, destCode: string, departureDate: string): void {
  const src = sourceCode.toUpperCase().trim();
  const dest = destCode.toUpperCase().trim();
  if (!src || !dest || src === dest) return;

  const existing = dbFlights.filter(
    f => f.source.toUpperCase() === src && f.destination.toUpperCase() === dest && f.departureDate === departureDate
  );

  if (existing.length > 0) return;

  const srcAirport = getAirportByCode(src);
  const destAirport = getAirportByCode(dest);

  let distanceKm = 1150;
  if (srcAirport && destAirport) {
    distanceKm = calculateDistanceKm(srcAirport.lat, srcAirport.lng, destAirport.lat, destAirport.lng);
  }

  const durationMin = Math.max(50, Math.round((distanceKm / 780) * 60 + 35));
  const durH = Math.floor(durationMin / 60);
  const durM = durationMin % 60;
  const durationStr = `${durH}h ${durM.toString().padStart(2, '0')}m`;

  const isIntl = (srcAirport && srcAirport.category === 'INTERNATIONAL_HUB') ||
                 (destAirport && destAirport.category === 'INTERNATIONAL_HUB');

  const fareFactor = isIntl ? 5.8 : 3.6;
  const baseFare = Math.max(2900, Math.round((distanceKm * fareFactor) / 100) * 100);

  const scheduleSlots = [
    {
      time: '06:15:00',
      airline: isIntl ? (dest === 'DXB' ? 'Emirates' : (dest === 'SIN' ? 'Singapore Airlines' : (dest === 'LHR' ? 'British Airways' : 'Air India'))) : 'IndiGo',
      flightNumPrefix: isIntl ? (dest === 'DXB' ? 'EK' : (dest === 'SIN' ? 'SQ' : (dest === 'LHR' ? 'BA' : 'AI'))) : '6E',
      aircraft: distanceKm > 3000 ? 'Boeing 787-9 Dreamliner' : 'Airbus A321neo',
      fareMultiplier: 0.95,
      seats: distanceKm > 3000 ? 296 : 220,
    },
    {
      time: '10:30:00',
      airline: isIntl ? 'Air India' : 'Vistara',
      flightNumPrefix: isIntl ? 'AI' : 'UK',
      aircraft: distanceKm > 3000 ? 'Airbus A350-900' : 'Airbus A320neo',
      fareMultiplier: 1.15,
      seats: 180,
    },
    {
      time: '15:20:00',
      airline: isIntl ? (dest === 'DOH' ? 'Qatar Airways' : 'Air India') : 'Akasa Air',
      flightNumPrefix: isIntl ? (dest === 'DOH' ? 'QR' : 'AI') : 'QP',
      aircraft: distanceKm > 3000 ? 'Boeing 777-300ER' : 'Boeing 737 MAX 8',
      fareMultiplier: 1.05,
      seats: 189,
    },
    {
      time: '19:45:00',
      airline: isIntl ? 'Air India' : 'IndiGo',
      flightNumPrefix: isIntl ? 'AI' : '6E',
      aircraft: 'Airbus A320neo',
      fareMultiplier: 1.25,
      seats: 180,
    },
    {
      time: '22:15:00',
      airline: isIntl ? 'IndiGo' : 'SpiceJet',
      flightNumPrefix: isIntl ? '6E' : 'SG',
      aircraft: 'Boeing 737-800',
      fareMultiplier: 0.90,
      seats: 186,
    }
  ];

  scheduleSlots.forEach((slot, index) => {
    const flightId = nextFlightId++;
    const randomFlightNo = `${slot.flightNumPrefix}-${Math.floor(100 + Math.random() * 899)}`;
    const econFare = Math.round(baseFare * slot.fareMultiplier);
    const premFare = Math.round(econFare * 1.45);
    const bizFare = Math.round(econFare * 2.7);
    const firstFare = Math.round(econFare * 4.2);
    const arrivalTime = calculateArrivalTime(slot.time, durationMin);

    const flight: FlightEntity = {
      id: flightId,
      airline: slot.airline,
      flightNumber: randomFlightNo,
      source: src,
      destination: dest,
      departureDate,
      departureTime: slot.time,
      arrivalDate: departureDate,
      arrivalTime,
      duration: durationStr,
      aircraft: slot.aircraft,
      totalSeats: slot.seats,
      availableSeats: slot.seats - Math.floor(Math.random() * 20 + 5),
      economyFare: econFare,
      premiumFare: premFare,
      businessFare: bizFare,
      firstClassFare: firstFare,
      status: 'SCHEDULED',
      terminalSource: srcAirport?.defaultTerminal || 'Terminal 1',
      terminalDest: destAirport?.defaultTerminal || 'Terminal 1',
      gate: `Gate ${Math.floor(Math.random() * 28 + 1)}${['A', 'B', 'C'][index % 3]}`,
      sourceAirportName: srcAirport?.name || `${src} Airport`,
      destAirportName: destAirport?.name || `${dest} Airport`,
      distance: `${distanceKm.toLocaleString()} km`,
      baggageAllowance: isIntl
        ? { cabin: '7 kg Hand Luggage', checkIn: '30 kg (2 Pieces)' }
        : { cabin: '7 kg Hand Luggage', checkIn: '15 kg Standard' },
      amenities: isIntl
        ? ['Complimentary Hot Meals', 'Universal AC & USB Ports', 'Seatback IFE Touchscreen', 'In-Flight Wi-Fi Available']
        : ['Complimentary Snack & Water', 'USB Fast Charger', 'Pre-book Hot Meals', 'Priority Baggage Available'],
    };

    dbFlights.push(flight);
    getOrCreateSeatsForFlight(flightId);
  });
}

// Middleware for authentication
interface AuthenticatedRequest extends Request {
  user?: UserEntity;
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    return res.status(401).json({ status: 401, error: 'Unauthorized', message: 'JWT token missing or expired' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = dbUsers.find(u => u.email.toLowerCase() === decoded.sub.toLowerCase());
    if (!user) {
      return res.status(401).json({ status: 401, error: 'Unauthorized', message: 'User not found' });
    }
    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ status: 403, error: 'Forbidden', message: 'User account is deactivated' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ status: 401, error: 'Unauthorized', message: 'Invalid or expired JWT token' });
  }
};

const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ status: 403, error: 'Forbidden', message: 'Access denied: Administrator privileges required' });
  }
  next();
};

// -------------------------------------------------------------
// REST API ENDPOINTS
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', service: 'Airplane Ticket Booking Management System', javaBackendReady: true });
});

// Auth Routes
app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body;

  if (!name || !email || !phone || !password || !confirmPassword) {
    return res.status(400).json({ status: 400, error: 'Bad Request', message: 'All registration fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ status: 400, error: 'Bad Request', message: 'Password and confirm password do not match' });
  }

  if (dbUsers.some(u => u.email.toLowerCase() === email.toLowerCase().trim())) {
    return res.status(400).json({ status: 400, error: 'Bad Request', message: `Email ${email} is already registered` });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser: UserEntity = {
    id: nextUserId++,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phone: phone.trim(),
    password: hashedPassword,
    role: 'USER',
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  };

  dbUsers.push(newUser);

  const token = jwt.sign(
    { sub: newUser.email, role: newUser.role, id: newUser.id, name: newUser.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.status(201).json({
    token,
    type: 'Bearer',
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
    role: newUser.role
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: 400, error: 'Bad Request', message: 'Email and password are required' });
  }

  const user = dbUsers.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) {
    return res.status(401).json({ status: 401, error: 'Unauthorized', message: 'Invalid email or password' });
  }

  if (user.status !== 'ACTIVE') {
    return res.status(403).json({ status: 403, error: 'Forbidden', message: 'Account is deactivated. Contact support.' });
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ status: 401, error: 'Unauthorized', message: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { sub: user.email, role: user.role, id: user.id, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    type: 'Bearer',
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role
  });
});

app.get('/api/auth/me', authenticateToken, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role
  });
});

// Realistic Airport Routes
app.get('/api/airports', (req, res) => {
  res.json(REALISTIC_AIRPORTS);
});

app.get('/api/airports/:code', (req, res) => {
  const code = (req.params.code || '').toUpperCase();
  const airport = getAirportByCode(code);
  if (!airport) {
    return res.status(404).json({ status: 404, error: 'Not Found', message: `Airport with code ${code} not found` });
  }
  res.json(airport);
});

// -------------------------------------------------------------
// Real-Time Flights & Radar Telemetry Endpoints
// -------------------------------------------------------------
app.get('/api/realtime-flights', (req, res) => {
  const { airline, airport, status, search } = req.query as any;
  const elapsedSec = Math.floor((Date.now() - serverStartTime) / 1000);
  let flights = generateRealtimeFlightsSnapshot(elapsedSec);

  if (search) {
    const q = search.toLowerCase().trim();
    flights = flights.filter(f =>
      f.flightNumber.toLowerCase().includes(q) ||
      f.airline.toLowerCase().includes(q) ||
      f.origin.city.toLowerCase().includes(q) ||
      f.origin.code.toLowerCase().includes(q) ||
      f.destination.city.toLowerCase().includes(q) ||
      f.destination.code.toLowerCase().includes(q) ||
      f.aircraft.toLowerCase().includes(q) ||
      f.aircraftReg.toLowerCase().includes(q)
    );
  }

  if (airline && airline !== 'ALL') {
    flights = flights.filter(f => f.airline.toLowerCase() === airline.toLowerCase() || f.airlineCode.toLowerCase() === airline.toLowerCase());
  }

  if (airport && airport !== 'ALL') {
    const code = airport.toUpperCase().trim();
    flights = flights.filter(f => f.origin.code === code || f.destination.code === code);
  }

  if (status && status !== 'ALL') {
    if (status === 'AIRBORNE' || status === 'EN_ROUTE') {
      flights = flights.filter(f => f.status === 'CLIMBING' || f.status === 'CRUISING' || f.status === 'DESCENDING' || f.status === 'APPROACH');
    } else {
      flights = flights.filter(f => f.status.toUpperCase() === status.toUpperCase());
    }
  }

  res.json({
    timestamp: new Date().toISOString(),
    totalActiveFlights: flights.length,
    flights,
  });
});

app.get('/api/realtime-flights/:id', (req, res) => {
  const flightIdOrNumber = (req.params.id || '').toUpperCase();
  const elapsedSec = Math.floor((Date.now() - serverStartTime) / 1000);
  const route = PREDEFINED_FLIGHT_ROUTES.find(r => r.id.toUpperCase() === flightIdOrNumber || r.flightNumber.toUpperCase() === flightIdOrNumber);

  if (!route) {
    return res.status(404).json({ status: 404, error: 'Not Found', message: `Realtime flight ${flightIdOrNumber} not found` });
  }

  const flight = computeFlightTelemetry(route, elapsedSec);
  if (!flight) {
    return res.status(500).json({ status: 500, error: 'Internal Error', message: 'Failed to compute telemetry' });
  }

  res.json(flight);
});

app.get('/api/realtime-flights/airport/:code', (req, res) => {
  const code = (req.params.code || '').toUpperCase().trim();
  const airport = getAirportByCode(code);
  if (!airport) {
    return res.status(404).json({ status: 404, error: 'Not Found', message: `Airport ${code} not found` });
  }

  const elapsedSec = Math.floor((Date.now() - serverStartTime) / 1000);
  const allFlights = generateRealtimeFlightsSnapshot(elapsedSec);

  const departures = allFlights.filter(f => f.origin.code === code);
  const arrivals = allFlights.filter(f => f.destination.code === code);

  res.json({
    airport,
    departures,
    arrivals,
    totalTraffic: departures.length + arrivals.length,
  });
});

// Flight Routes
app.get('/api/flights', (req, res) => {
  res.json(dbFlights);
});

app.get('/api/flights/search', (req, res) => {
  const { source, destination, departureDate, passengers, travelClass, airline, maxPrice, departureTimeSlot, sortBy } = req.query as any;

  // If both origin and destination are provided, ensure realistic schedules exist for that day
  if (source && destination) {
    const searchDate = departureDate || getOffsetDate(1);
    ensureFlightsForRouteAndDate(source, destination, searchDate);
  }

  let results = [...dbFlights];

  if (source) {
    results = results.filter(f => f.source.toLowerCase() === source.toLowerCase().trim());
  }

  if (destination) {
    results = results.filter(f => f.destination.toLowerCase() === destination.toLowerCase().trim());
  }

  if (departureDate) {
    results = results.filter(f => f.departureDate === departureDate);
  }

  const pax = parseInt(passengers) || 1;
  results = results.filter(f => f.availableSeats >= pax && f.status === 'SCHEDULED');

  if (airline && airline !== 'ALL') {
    results = results.filter(f => f.airline.toLowerCase() === airline.toLowerCase());
  }

  const getFare = (f: FlightEntity) => {
    switch (travelClass) {
      case 'PREMIUM_ECONOMY': return f.premiumFare;
      case 'BUSINESS': return f.businessFare;
      case 'FIRST_CLASS': return f.firstClassFare;
      default: return f.economyFare;
    }
  };

  if (maxPrice) {
    const priceLimit = parseFloat(maxPrice);
    results = results.filter(f => getFare(f) <= priceLimit);
  }

  if (departureTimeSlot && departureTimeSlot !== 'ALL') {
    results = results.filter(f => {
      const hour = parseInt(f.departureTime.split(':')[0]);
      if (departureTimeSlot === 'MORNING') return hour >= 4 && hour < 12;
      if (departureTimeSlot === 'AFTERNOON') return hour >= 12 && hour < 17;
      if (departureTimeSlot === 'EVENING') return hour >= 17 && hour < 21;
      if (departureTimeSlot === 'NIGHT') return hour >= 21 || hour < 4;
      return true;
    });
  }

  if (sortBy) {
    if (sortBy === 'PRICE_ASC') results.sort((a, b) => getFare(a) - getFare(b));
    else if (sortBy === 'PRICE_DESC') results.sort((a, b) => getFare(b) - getFare(a));
    else if (sortBy === 'TIME_ASC') results.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    else if (sortBy === 'DURATION_ASC') results.sort((a, b) => a.duration.localeCompare(b.duration));
  }

  res.json(results);
});

app.get('/api/flights/:id', (req, res) => {
  const flight = dbFlights.find(f => f.id === parseInt(req.params.id));
  if (!flight) {
    return res.status(404).json({ status: 404, error: 'Not Found', message: 'Flight not found with ID: ' + req.params.id });
  }
  res.json(flight);
});

app.post('/api/flights', authenticateToken, requireAdmin, (req, res) => {
  const f = req.body;
  const newFlight: FlightEntity = {
    id: nextFlightId++,
    airline: f.airline,
    flightNumber: f.flightNumber,
    source: f.source.toUpperCase(),
    destination: f.destination.toUpperCase(),
    departureDate: f.departureDate,
    departureTime: f.departureTime,
    arrivalDate: f.arrivalDate || f.departureDate,
    arrivalTime: f.arrivalTime,
    duration: f.duration || '2h 00m',
    aircraft: f.aircraft || 'Airbus A320neo',
    totalSeats: parseInt(f.totalSeats) || 180,
    availableSeats: parseInt(f.totalSeats) || 180,
    economyFare: parseFloat(f.economyFare) || 5000,
    premiumFare: parseFloat(f.premiumFare) || 8000,
    businessFare: parseFloat(f.businessFare) || 15000,
    firstClassFare: parseFloat(f.firstClassFare) || 25000,
    status: f.status || 'SCHEDULED'
  };

  dbFlights.push(newFlight);
  getOrCreateSeatsForFlight(newFlight.id);
  res.status(201).json(newFlight);
});

app.put('/api/flights/:id', authenticateToken, requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  const idx = dbFlights.findIndex(f => f.id === id);
  if (idx === -1) {
    return res.status(404).json({ status: 404, error: 'Not Found', message: 'Flight not found with ID: ' + id });
  }

  dbFlights[idx] = { ...dbFlights[idx], ...req.body, id };
  res.json(dbFlights[idx]);
});

app.delete('/api/flights/:id', authenticateToken, requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  const idx = dbFlights.findIndex(f => f.id === id);
  if (idx === -1) {
    return res.status(404).json({ status: 404, error: 'Not Found', message: 'Flight not found with ID: ' + id });
  }

  dbFlights.splice(idx, 1);
  dbSeats.delete(id);
  res.status(204).send();
});

// Seat Routes
app.get('/api/flights/:flightId/seats', (req, res) => {
  const flightId = parseInt(req.params.flightId);
  const flight = dbFlights.find(f => f.id === flightId);
  if (!flight) {
    return res.status(404).json({ status: 404, error: 'Not Found', message: 'Flight not found' });
  }

  const seats = getOrCreateSeatsForFlight(flightId);
  res.json(seats);
});

// Booking Routes
app.post('/api/bookings', authenticateToken, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { flightId, travelClass, passengers, paymentMethod, upiVpa, cardNumber, bankName } = req.body;

  if (!flightId || !passengers || !Array.isArray(passengers) || passengers.length === 0) {
    return res.status(400).json({ status: 400, error: 'Bad Request', message: 'Flight and passenger details are required' });
  }

  const flight = dbFlights.find(f => f.id === parseInt(flightId));
  if (!flight) {
    return res.status(404).json({ status: 404, error: 'Not Found', message: 'Flight not found' });
  }

  if (flight.availableSeats < passengers.length) {
    return res.status(400).json({ status: 400, error: 'Bad Request', message: 'Not enough seats available' });
  }

  // Validate seats
  const seats = getOrCreateSeatsForFlight(flight.id);
  const seatNums = passengers.map((p: any) => p.seatNumber);

  for (const sNum of seatNums) {
    const target = seats.find(s => s.seatNumber === sNum);
    if (!target) {
      return res.status(400).json({ status: 400, error: 'Bad Request', message: `Seat ${sNum} does not exist` });
    }
    if (target.status === 'OCCUPIED') {
      return res.status(409).json({ status: 409, error: 'Seat Conflict', message: `Seat ${sNum} is already booked` });
    }
  }

  // Reserve seats
  for (const sNum of seatNums) {
    const target = seats.find(s => s.seatNumber === sNum)!;
    target.status = 'OCCUPIED';
  }

  // Calculate fare breakdown with BigDecimal equivalent accuracy
  let baseFarePerPax = flight.economyFare;
  if (travelClass === 'PREMIUM_ECONOMY') baseFarePerPax = flight.premiumFare;
  else if (travelClass === 'BUSINESS') baseFarePerPax = flight.businessFare;
  else if (travelClass === 'FIRST_CLASS') baseFarePerPax = flight.firstClassFare;

  const subtotal = Math.round(baseFarePerPax * passengers.length * 100) / 100;
  const tax = Math.round(subtotal * 0.12 * 100) / 100;
  const serviceFee = 250.00 * passengers.length;
  const totalAmount = Math.round((subtotal + tax + serviceFee) * 100) / 100;

  // Generate 6-char alphanumeric PNR
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let pnr = '';
  for (let i = 0; i < 6; i++) pnr += chars.charAt(Math.floor(Math.random() * chars.length));

  // Simulated Payment
  const paymentId = `PAY-${paymentMethod || 'UPI'}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const payment: PaymentEntity = {
    id: Date.now(),
    paymentId,
    paymentMethod: paymentMethod || 'UPI',
    amount: totalAmount,
    paymentStatus: 'SUCCESS',
    paymentDate: new Date().toISOString(),
    transactionReference: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
  };

  // Ticket
  const ticketNumber = `ETKT-${Math.floor(100000000 + Math.random() * 900000000)}`;
  const ticket: TicketEntity = {
    id: Date.now(),
    ticketNumber,
    issuedAt: new Date().toISOString(),
    barcodeData: `TKT-${pnr}-${ticketNumber}`
  };

  // Create booking
  const newBooking: BookingEntity = {
    id: nextBookingId++,
    pnr,
    userId: user.id,
    flightId: flight.id,
    bookingDate: new Date().toISOString(),
    travelClass: travelClass || 'ECONOMY',
    totalAmount,
    bookingStatus: 'CONFIRMED',
    passengers: passengers.map((p: any) => ({
      id: nextPassengerId++,
      fullName: p.fullName,
      dateOfBirth: p.dateOfBirth,
      gender: p.gender,
      nationality: p.nationality || 'INDIAN',
      passportId: p.passportId,
      email: p.email,
      phone: p.phone,
      seatNumber: p.seatNumber
    })),
    payment,
    ticket
  };

  flight.availableSeats -= passengers.length;
  dbBookings.unshift(newBooking);

  // Return full response with flight & user info
  res.status(201).json({
    ...newBooking,
    userName: user.name,
    userEmail: user.email,
    flight
  });
});

app.get('/api/bookings/my', authenticateToken, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const list = dbBookings
    .filter(b => b.userId === user.id)
    .map(b => ({
      ...b,
      userName: user.name,
      userEmail: user.email,
      flight: dbFlights.find(f => f.id === b.flightId)
    }));
  res.json(list);
});

app.get('/api/bookings/pnr/:pnr', authenticateToken, (req: AuthenticatedRequest, res) => {
  const pnr = req.params.pnr.toUpperCase();
  const b = dbBookings.find(bk => bk.pnr === pnr);
  if (!b) {
    return res.status(404).json({ status: 404, error: 'Not Found', message: `Booking with PNR ${pnr} not found` });
  }

  if (req.user!.role !== 'ADMIN' && b.userId !== req.user!.id) {
    return res.status(403).json({ status: 403, error: 'Forbidden', message: 'You are not authorized to view this booking' });
  }

  const u = dbUsers.find(user => user.id === b.userId);
  res.json({
    ...b,
    userName: u ? u.name : '',
    userEmail: u ? u.email : '',
    flight: dbFlights.find(f => f.id === b.flightId)
  });
});

app.get('/api/bookings/:id', authenticateToken, (req: AuthenticatedRequest, res) => {
  const id = parseInt(req.params.id);
  const b = dbBookings.find(bk => bk.id === id);
  if (!b) {
    return res.status(404).json({ status: 404, error: 'Not Found', message: 'Booking not found' });
  }

  if (req.user!.role !== 'ADMIN' && b.userId !== req.user!.id) {
    return res.status(403).json({ status: 403, error: 'Forbidden', message: 'You are not authorized to view this booking' });
  }

  const u = dbUsers.find(user => user.id === b.userId);
  res.json({
    ...b,
    userName: u ? u.name : '',
    userEmail: u ? u.email : '',
    flight: dbFlights.find(f => f.id === b.flightId)
  });
});

app.put('/api/bookings/:id/cancel', authenticateToken, (req: AuthenticatedRequest, res) => {
  const id = parseInt(req.params.id);
  const b = dbBookings.find(bk => bk.id === id);
  if (!b) {
    return res.status(404).json({ status: 404, error: 'Not Found', message: 'Booking not found' });
  }

  if (req.user!.role !== 'ADMIN' && b.userId !== req.user!.id) {
    return res.status(403).json({ status: 403, error: 'Forbidden', message: 'You can only cancel your own bookings' });
  }

  if (b.bookingStatus === 'CANCELLED') {
    return res.status(400).json({ status: 400, error: 'Bad Request', message: 'This booking has already been cancelled' });
  }

  b.bookingStatus = 'CANCELLED';
  b.payment.paymentStatus = 'REFUNDED';

  // Release seats
  const seats = getOrCreateSeatsForFlight(b.flightId);
  const seatNums = b.passengers.map(p => p.seatNumber);
  for (const sNum of seatNums) {
    const seat = seats.find(s => s.seatNumber === sNum);
    if (seat) seat.status = 'AVAILABLE';
  }

  const flight = dbFlights.find(f => f.id === b.flightId);
  if (flight) {
    flight.availableSeats += seatNums.length;
  }

  const u = dbUsers.find(user => user.id === b.userId);
  res.json({
    ...b,
    userName: u ? u.name : '',
    userEmail: u ? u.email : '',
    flight
  });
});

// Admin Dashboard Routes
app.get('/api/admin/dashboard', authenticateToken, requireAdmin, (req, res) => {
  const totalUsers = dbUsers.length;
  const totalFlights = dbFlights.length;
  const totalBookings = dbBookings.length;
  const confirmedBookings = dbBookings.filter(b => b.bookingStatus === 'CONFIRMED').length;
  const cancelledBookings = dbBookings.filter(b => b.bookingStatus === 'CANCELLED').length;
  const totalRevenue = dbBookings
    .filter(b => b.bookingStatus === 'CONFIRMED')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  res.json({
    totalUsers,
    totalFlights,
    totalBookings,
    confirmedBookings,
    cancelledBookings,
    totalRevenue: Math.round(totalRevenue * 100) / 100
  });
});

app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
  const usersSafe = dbUsers.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    status: u.status,
    createdAt: u.createdAt
  }));
  res.json(usersSafe);
});

app.put('/api/admin/users/:id/status', authenticateToken, requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  const user = dbUsers.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ status: 404, error: 'Not Found', message: 'User not found' });
  }

  user.status = status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt
  });
});

app.get('/api/admin/bookings', authenticateToken, requireAdmin, (req, res) => {
  const list = dbBookings.map(b => ({
    ...b,
    userName: dbUsers.find(u => u.id === b.userId)?.name || 'Guest',
    userEmail: dbUsers.find(u => u.id === b.userId)?.email || '',
    flight: dbFlights.find(f => f.id === b.flightId)
  }));
  res.json(list);
});

// Endpoint to read Spring Boot Java files for Academic Viva Hub
app.get('/api/java-project/tree', (req, res) => {
  const backendRoot = path.join(process.cwd(), 'backend');
  const fileList: { path: string; name: string; type: string }[] = [];

  function scanDir(currentDir: string, relPath: string = '') {
    if (!fs.existsSync(currentDir)) return;
    const items = fs.readdirSync(currentDir);
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const relative = path.join(relPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanDir(fullPath, relative);
      } else {
        fileList.push({
          path: relative,
          name: item,
          type: item.endsWith('.java') ? 'java' : item.endsWith('.xml') ? 'xml' : item.endsWith('.sql') ? 'sql' : 'text'
        });
      }
    }
  }

  scanDir(backendRoot);
  res.json(fileList);
});

app.get('/api/java-project/file', (req, res) => {
  const filePath = req.query.path as string;
  if (!filePath || filePath.includes('..')) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  const fullPath = path.join(process.cwd(), 'backend', filePath);
  if (!fs.existsSync(fullPath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  res.json({ path: filePath, content });
});

// -------------------------------------------------------------
// VITE OR STATIC SERVING
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Airplane Ticket Booking Management System running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
