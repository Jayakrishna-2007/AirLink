import { RealtimeFlight, RealtimeFlightPhase } from '../types';
import { getAirportByCode } from './airports';

export interface RouteDefinition {
  id: string;
  flightNumber: string;
  airline: string;
  airlineCode: string;
  aircraft: string;
  aircraftReg: string;
  originCode: string;
  destCode: string;
  depTimeUtcMin: number; // Scheduled departure in minutes of day (e.g. 360 = 06:00)
  durationMinutes: number;
  squawk: string;
  cruisingAltitudeFeet: number;
  cruisingSpeedKmh: number;
  economyFare: number;
  initialProgressOffset?: number; // 0..1 for varied initial positions
}

// 45 authentic commercial flights across Indian metro, regional UDAN, and international corridors
export const PREDEFINED_FLIGHT_ROUTES: RouteDefinition[] = [
  // Delhi <-> Mumbai Flagships
  {
    id: 'rf-1',
    flightNumber: 'AI-102',
    airline: 'Air India',
    airlineCode: 'AI',
    aircraft: 'Boeing 777-300ER',
    aircraftReg: 'VT-ALJ',
    originCode: 'DEL',
    destCode: 'BOM',
    depTimeUtcMin: 360,
    durationMinutes: 135,
    squawk: '4215',
    cruisingAltitudeFeet: 36000,
    cruisingSpeedKmh: 865,
    economyFare: 5600,
    initialProgressOffset: 0.62,
  },
  {
    id: 'rf-2',
    flightNumber: '6E-205',
    airline: 'IndiGo',
    airlineCode: '6E',
    aircraft: 'Airbus A321neo',
    aircraftReg: 'VT-IMD',
    originCode: 'BOM',
    destCode: 'DEL',
    depTimeUtcMin: 400,
    durationMinutes: 130,
    squawk: '6312',
    cruisingAltitudeFeet: 37000,
    cruisingSpeedKmh: 840,
    economyFare: 4950,
    initialProgressOffset: 0.38,
  },
  {
    id: 'rf-3',
    flightNumber: 'UK-993',
    airline: 'Vistara',
    airlineCode: 'UK',
    aircraft: 'Boeing 787-9 Dreamliner',
    aircraftReg: 'VT-TSN',
    originCode: 'DEL',
    destCode: 'BOM',
    depTimeUtcMin: 450,
    durationMinutes: 135,
    squawk: '2104',
    cruisingAltitudeFeet: 38000,
    cruisingSpeedKmh: 880,
    economyFare: 6300,
    initialProgressOffset: 0.82,
  },

  // Bengaluru <-> Delhi
  {
    id: 'rf-4',
    flightNumber: '6E-512',
    airline: 'IndiGo',
    airlineCode: '6E',
    aircraft: 'Airbus A320neo',
    aircraftReg: 'VT-IZB',
    originCode: 'BLR',
    destCode: 'DEL',
    depTimeUtcMin: 380,
    durationMinutes: 165,
    squawk: '5521',
    cruisingAltitudeFeet: 35000,
    cruisingSpeedKmh: 850,
    economyFare: 5800,
    initialProgressOffset: 0.45,
  },
  {
    id: 'rf-5',
    flightNumber: 'AI-506',
    airline: 'Air India',
    airlineCode: 'AI',
    aircraft: 'Airbus A350-900',
    aircraftReg: 'VT-JRA',
    originCode: 'DEL',
    destCode: 'BLR',
    depTimeUtcMin: 420,
    durationMinutes: 170,
    squawk: '1432',
    cruisingAltitudeFeet: 39000,
    cruisingSpeedKmh: 890,
    economyFare: 6100,
    initialProgressOffset: 0.74,
  },
  {
    id: 'rf-6',
    flightNumber: 'UK-945',
    airline: 'Vistara',
    airlineCode: 'UK',
    aircraft: 'Airbus A321neo',
    aircraftReg: 'VT-TVE',
    originCode: 'DEL',
    destCode: 'BLR',
    depTimeUtcMin: 480,
    durationMinutes: 165,
    squawk: '3341',
    cruisingAltitudeFeet: 36000,
    cruisingSpeedKmh: 855,
    economyFare: 6400,
    initialProgressOffset: 0.18,
  },

  // Chennai <-> Delhi & Mumbai
  {
    id: 'rf-7',
    flightNumber: '6E-843',
    airline: 'IndiGo',
    airlineCode: '6E',
    aircraft: 'Airbus A320neo',
    aircraftReg: 'VT-ITA',
    originCode: 'MAA',
    destCode: 'BOM',
    depTimeUtcMin: 350,
    durationMinutes: 120,
    squawk: '7105',
    cruisingAltitudeFeet: 34000,
    cruisingSpeedKmh: 830,
    economyFare: 4200,
    initialProgressOffset: 0.52,
  },
  {
    id: 'rf-8',
    flightNumber: 'AI-430',
    airline: 'Air India',
    airlineCode: 'AI',
    aircraft: 'Airbus A320neo',
    aircraftReg: 'VT-EXF',
    originCode: 'MAA',
    destCode: 'DEL',
    depTimeUtcMin: 390,
    durationMinutes: 175,
    squawk: '4622',
    cruisingAltitudeFeet: 36000,
    cruisingSpeedKmh: 860,
    economyFare: 5900,
    initialProgressOffset: 0.65,
  },
  {
    id: 'rf-9',
    flightNumber: 'UK-850',
    airline: 'Vistara',
    airlineCode: 'UK',
    aircraft: 'Airbus A320neo',
    aircraftReg: 'VT-TNI',
    originCode: 'DEL',
    destCode: 'MAA',
    depTimeUtcMin: 410,
    durationMinutes: 170,
    squawk: '2350',
    cruisingAltitudeFeet: 37000,
    cruisingSpeedKmh: 850,
    economyFare: 6150,
    initialProgressOffset: 0.31,
  },

  // Hyderabad Hub
  {
    id: 'rf-10',
    flightNumber: '6E-904',
    airline: 'IndiGo',
    airlineCode: '6E',
    aircraft: 'Airbus A320neo',
    aircraftReg: 'VT-IFJ',
    originCode: 'HYD',
    destCode: 'CCU',
    depTimeUtcMin: 370,
    durationMinutes: 125,
    squawk: '5120',
    cruisingAltitudeFeet: 35000,
    cruisingSpeedKmh: 840,
    economyFare: 4400,
    initialProgressOffset: 0.58,
  },
  {
    id: 'rf-11',
    flightNumber: 'AI-544',
    airline: 'Air India',
    airlineCode: 'AI',
    aircraft: 'Airbus A320neo',
    aircraftReg: 'VT-EXK',
    originCode: 'DEL',
    destCode: 'HYD',
    depTimeUtcMin: 430,
    durationMinutes: 135,
    squawk: '6211',
    cruisingAltitudeFeet: 35000,
    cruisingSpeedKmh: 845,
    economyFare: 4700,
    initialProgressOffset: 0.86,
  },
  {
    id: 'rf-12',
    flightNumber: 'UK-870',
    airline: 'Vistara',
    airlineCode: 'UK',
    aircraft: 'Airbus A320neo',
    aircraftReg: 'VT-TNA',
    originCode: 'BOM',
    destCode: 'HYD',
    depTimeUtcMin: 460,
    durationMinutes: 85,
    squawk: '3109',
    cruisingAltitudeFeet: 32000,
    cruisingSpeedKmh: 820,
    economyFare: 3600,
    initialProgressOffset: 0.40,
  },

  // Kolkata & Northeast Corridor
  {
    id: 'rf-13',
    flightNumber: 'AI-773',
    airline: 'Air India',
    airlineCode: 'AI',
    aircraft: 'Airbus A320neo',
    aircraftReg: 'VT-CIQ',
    originCode: 'CCU',
    destCode: 'DEL',
    depTimeUtcMin: 340,
    durationMinutes: 145,
    squawk: '4410',
    cruisingAltitudeFeet: 36000,
    cruisingSpeedKmh: 850,
    economyFare: 5200,
    initialProgressOffset: 0.69,
  },
  {
    id: 'rf-14',
    flightNumber: '6E-721',
    airline: 'IndiGo',
    airlineCode: '6E',
    aircraft: 'Airbus A320neo',
    aircraftReg: 'VT-IVG',
    originCode: 'GAU',
    destCode: 'CCU',
    depTimeUtcMin: 420,
    durationMinutes: 75,
    squawk: '1540',
    cruisingAltitudeFeet: 28000,
    cruisingSpeedKmh: 790,
    economyFare: 3200,
    initialProgressOffset: 0.50,
  },
  {
    id: 'rf-15',
    flightNumber: '6E-241',
    airline: 'IndiGo',
    airlineCode: '6E',
    aircraft: 'Airbus A320neo',
    aircraftReg: 'VT-IHN',
    originCode: 'DEL',
    destCode: 'GAU',
    depTimeUtcMin: 390,
    durationMinutes: 155,
    squawk: '2703',
    cruisingAltitudeFeet: 37000,
    cruisingSpeedKmh: 860,
    economyFare: 5400,
    initialProgressOffset: 0.28,
  },

  // Cultural & Regional Pilgrimage Hubs: Ayodhya, Varanasi, Leh, Srinagar
  {
    id: 'rf-16',
    flightNumber: '6E-318',
    airline: 'IndiGo',
    airlineCode: '6E',
    aircraft: 'Airbus A320neo',
    aircraftReg: 'VT-ISW',
    originCode: 'DEL',
    destCode: 'AYJ',
    depTimeUtcMin: 450,
    durationMinutes: 80,
    squawk: '3614',
    cruisingAltitudeFeet: 29000,
    cruisingSpeedKmh: 810,
    economyFare: 3800,
    initialProgressOffset: 0.64,
  },
  {
    id: 'rf-17',
    flightNumber: 'AI-445',
    airline: 'Air India',
    airlineCode: 'AI',
    aircraft: 'Airbus A320neo (High Altitude Certified)',
    aircraftReg: 'VT-EXU',
    originCode: 'DEL',
    destCode: 'IXL',
    depTimeUtcMin: 370,
    durationMinutes: 85,
    squawk: '7011',
    cruisingAltitudeFeet: 31000,
    cruisingSpeedKmh: 800,
    economyFare: 6800,
    initialProgressOffset: 0.55,
  },
  {
    id: 'rf-18',
    flightNumber: '6E-212',
    airline: 'IndiGo',
    airlineCode: '6E',
    aircraft: 'Airbus A320neo',
    aircraftReg: 'VT-IYL',
    originCode: 'DEL',
    destCode: 'SXR',
    depTimeUtcMin: 400,
    durationMinutes: 90,
    squawk: '2214',
    cruisingAltitudeFeet: 32000,
    cruisingSpeedKmh: 820,
    economyFare: 4900,
    initialProgressOffset: 0.72,
  },
  {
    id: 'rf-19',
    flightNumber: 'SG-8169',
    airline: 'SpiceJet',
    airlineCode: 'SG',
    aircraft: 'Boeing 737-800',
    aircraftReg: 'VT-SZK',
    originCode: 'DEL',
    destCode: 'VNS',
    depTimeUtcMin: 430,
    durationMinutes: 85,
    squawk: '4106',
    cruisingAltitudeFeet: 30000,
    cruisingSpeedKmh: 815,
    economyFare: 3700,
    initialProgressOffset: 0.42,
  },

  // West Coast & Goa Vacation Express
  {
    id: 'rf-20',
    flightNumber: '6E-145',
    airline: 'IndiGo',
    airlineCode: '6E',
    aircraft: 'Airbus A320neo',
    aircraftReg: 'VT-IZY',
    originCode: 'BOM',
    destCode: 'GOI',
    depTimeUtcMin: 460,
    durationMinutes: 70,
    squawk: '5201',
    cruisingAltitudeFeet: 27000,
    cruisingSpeedKmh: 790,
    economyFare: 3100,
    initialProgressOffset: 0.48,
  },
  {
    id: 'rf-21',
    flightNumber: 'AI-687',
    airline: 'Air India',
    airlineCode: 'AI',
    aircraft: 'Airbus A320neo',
    aircraftReg: 'VT-EXS',
    originCode: 'DEL',
    destCode: 'GOX',
    depTimeUtcMin: 390,
    durationMinutes: 150,
    squawk: '6110',
    cruisingAltitudeFeet: 36000,
    cruisingSpeedKmh: 850,
    economyFare: 5500,
    initialProgressOffset: 0.77,
  },
  {
    id: 'rf-22',
    flightNumber: 'QP-1552',
    airline: 'Akasa Air',
    airlineCode: 'QP',
    aircraft: 'Boeing 737 MAX 8',
    aircraftReg: 'VT-YAE',
    originCode: 'GOX',
    destCode: 'BLR',
    depTimeUtcMin: 440,
    durationMinutes: 75,
    squawk: '1723',
    cruisingAltitudeFeet: 28000,
    cruisingSpeedKmh: 800,
    economyFare: 3200,
    initialProgressOffset: 0.35,
  },

  // South Regional & Kerala Gateway
  {
    id: 'rf-23',
    flightNumber: '6E-442',
    airline: 'IndiGo',
    airlineCode: '6E',
    aircraft: 'Airbus A320neo',
    aircraftReg: 'VT-IVM',
    originCode: 'BLR',
    destCode: 'COK',
    depTimeUtcMin: 420,
    durationMinutes: 65,
    squawk: '3412',
    cruisingAltitudeFeet: 24000,
    cruisingSpeedKmh: 760,
    economyFare: 2900,
    initialProgressOffset: 0.60,
  },
  {
    id: 'rf-24',
    flightNumber: 'QP-1601',
    airline: 'Akasa Air',
    airlineCode: 'QP',
    aircraft: 'Boeing 737 MAX 8',
    aircraftReg: 'VT-YAC',
    originCode: 'BOM',
    destCode: 'CCJ',
    depTimeUtcMin: 410,
    durationMinutes: 110,
    squawk: '4305',
    cruisingAltitudeFeet: 33000,
    cruisingSpeedKmh: 830,
    economyFare: 4100,
    initialProgressOffset: 0.81,
  },
  {
    id: 'rf-25',
    flightNumber: 'AI-511',
    airline: 'Air India',
    airlineCode: 'AI',
    aircraft: 'Airbus A320neo',
    aircraftReg: 'VT-EXA',
    originCode: 'DEL',
    destCode: 'TRV',
    depTimeUtcMin: 350,
    durationMinutes: 195,
    squawk: '7219',
    cruisingAltitudeFeet: 38000,
    cruisingSpeedKmh: 870,
    economyFare: 6700,
    initialProgressOffset: 0.52,
  },

  // Gujarat & Western Industrial Circuit
  {
    id: 'rf-26',
    flightNumber: 'QP-1102',
    airline: 'Akasa Air',
    airlineCode: 'QP',
    aircraft: 'Boeing 737 MAX 8',
    aircraftReg: 'VT-YAA',
    originCode: 'BOM',
    destCode: 'AMD',
    depTimeUtcMin: 470,
    durationMinutes: 70,
    squawk: '2118',
    cruisingAltitudeFeet: 26000,
    cruisingSpeedKmh: 780,
    economyFare: 2800,
    initialProgressOffset: 0.25,
  },
  {
    id: 'rf-27',
    flightNumber: '6E-608',
    airline: 'IndiGo',
    airlineCode: '6E',
    aircraft: 'Airbus A320neo',
    aircraftReg: 'VT-IKW',
    originCode: 'AMD',
    destCode: 'DEL',
    depTimeUtcMin: 440,
    durationMinutes: 90,
    squawk: '5420',
    cruisingAltitudeFeet: 31000,
    cruisingSpeedKmh: 820,
    economyFare: 3600,
    initialProgressOffset: 0.70,
  },
  {
    id: 'rf-28',
    flightNumber: 'SG-291',
    airline: 'SpiceJet',
    airlineCode: 'SG',
    aircraft: 'Boeing 737-800',
    aircraftReg: 'VT-SZW',
    originCode: 'DEL',
    destCode: 'STV',
    depTimeUtcMin: 450,
    durationMinutes: 95,
    squawk: '3511',
    cruisingAltitudeFeet: 31000,
    cruisingSpeedKmh: 810,
    economyFare: 3750,
    initialProgressOffset: 0.44,
  },

  // Central & Eastern Hubs (Bhubaneswar, Raipur, Patna, Ranchi)
  {
    id: 'rf-29',
    flightNumber: '6E-671',
    airline: 'IndiGo',
    airlineCode: '6E',
    aircraft: 'Airbus A320neo',
    aircraftReg: 'VT-IZC',
    originCode: 'DEL',
    destCode: 'BBI',
    depTimeUtcMin: 400,
    durationMinutes: 130,
    squawk: '6145',
    cruisingAltitudeFeet: 35000,
    cruisingSpeedKmh: 840,
    economyFare: 4600,
    initialProgressOffset: 0.57,
  },
  {
    id: 'rf-30',
    flightNumber: 'AI-409',
    airline: 'Air India',
    airlineCode: 'AI',
    aircraft: 'Airbus A320neo',
    aircraftReg: 'VT-EXE',
    originCode: 'DEL',
    destCode: 'PAT',
    depTimeUtcMin: 430,
    durationMinutes: 100,
    squawk: '1422',
    cruisingAltitudeFeet: 32000,
    cruisingSpeedKmh: 820,
    economyFare: 3900,
    initialProgressOffset: 0.63,
  },
  {
    id: 'rf-31',
    flightNumber: '6E-489',
    airline: 'IndiGo',
    airlineCode: '6E',
    aircraft: 'Airbus A320neo',
    aircraftReg: 'VT-IVB',
    originCode: 'BOM',
    destCode: 'RPR',
    depTimeUtcMin: 410,
    durationMinutes: 115,
    squawk: '3318',
    cruisingAltitudeFeet: 33000,
    cruisingSpeedKmh: 830,
    economyFare: 4200,
    initialProgressOffset: 0.49,
  },

  // Regional Turboprop & UDAN routes
  {
    id: 'rf-32',
    flightNumber: '9I-635',
    airline: 'Alliance Air',
    airlineCode: '9I',
    aircraft: 'ATR 72-600',
    aircraftReg: 'VT-AIH',
    originCode: 'DEL',
    destCode: 'DHM',
    depTimeUtcMin: 440,
    durationMinutes: 75,
    squawk: '7140',
    cruisingAltitudeFeet: 18000,
    cruisingSpeedKmh: 510,
    economyFare: 4500,
    initialProgressOffset: 0.54,
  },
  {
    id: 'rf-33',
    flightNumber: 'S5-112',
    airline: 'Star Air',
    airlineCode: 'S5',
    aircraft: 'Embraer E175',
    aircraftReg: 'VT-GSI',
    originCode: 'BLR',
    destCode: 'HBX',
    depTimeUtcMin: 460,
    durationMinutes: 55,
    squawk: '2411',
    cruisingAltitudeFeet: 22000,
    cruisingSpeedKmh: 680,
    economyFare: 2800,
    initialProgressOffset: 0.33,
  },

  // Major International Gateways
  {
    id: 'rf-34',
    flightNumber: 'EK-501',
    airline: 'Emirates',
    airlineCode: 'EK',
    aircraft: 'Airbus A380-800',
    aircraftReg: 'A6-EOT',
    originCode: 'BOM',
    destCode: 'DXB',
    depTimeUtcMin: 320,
    durationMinutes: 205,
    squawk: '4512',
    cruisingAltitudeFeet: 40000,
    cruisingSpeedKmh: 910,
    economyFare: 16500,
    initialProgressOffset: 0.68,
  },
  {
    id: 'rf-35',
    flightNumber: 'AI-995',
    airline: 'Air India',
    airlineCode: 'AI',
    aircraft: 'Boeing 787-9 Dreamliner',
    aircraftReg: 'VT-NAA',
    originCode: 'DEL',
    destCode: 'DXB',
    depTimeUtcMin: 340,
    durationMinutes: 225,
    squawk: '6204',
    cruisingAltitudeFeet: 39000,
    cruisingSpeedKmh: 890,
    economyFare: 14800,
    initialProgressOffset: 0.78,
  },
  {
    id: 'rf-36',
    flightNumber: 'SQ-403',
    airline: 'Singapore Airlines',
    airlineCode: 'SQ',
    aircraft: 'Airbus A380-800',
    aircraftReg: '9V-SKU',
    originCode: 'DEL',
    destCode: 'SIN',
    depTimeUtcMin: 300,
    durationMinutes: 330,
    squawk: '7119',
    cruisingAltitudeFeet: 41000,
    cruisingSpeedKmh: 920,
    economyFare: 21500,
    initialProgressOffset: 0.45,
  },
  {
    id: 'rf-37',
    flightNumber: 'QR-571',
    airline: 'Qatar Airways',
    airlineCode: 'QR',
    aircraft: 'Airbus A350-1000',
    aircraftReg: 'A7-ANI',
    originCode: 'DEL',
    destCode: 'DOH',
    depTimeUtcMin: 330,
    durationMinutes: 240,
    squawk: '3205',
    cruisingAltitudeFeet: 39000,
    cruisingSpeedKmh: 900,
    economyFare: 18200,
    initialProgressOffset: 0.58,
  },
  {
    id: 'rf-38',
    flightNumber: 'BA-198',
    airline: 'British Airways',
    airlineCode: 'BA',
    aircraft: 'Boeing 777-300ER',
    aircraftReg: 'G-STBA',
    originCode: 'BOM',
    destCode: 'LHR',
    depTimeUtcMin: 280,
    durationMinutes: 570,
    squawk: '1504',
    cruisingAltitudeFeet: 38000,
    cruisingSpeedKmh: 890,
    economyFare: 38500,
    initialProgressOffset: 0.22,
  },

  // Additional Busy City Connectors
  {
    id: 'rf-39',
    flightNumber: '6E-654',
    airline: 'IndiGo',
    airlineCode: '6E',
    aircraft: 'Airbus A320neo',
    aircraftReg: 'VT-IZT',
    originCode: 'PNQ',
    destCode: 'DEL',
    depTimeUtcMin: 420,
    durationMinutes: 125,
    squawk: '5114',
    cruisingAltitudeFeet: 35000,
    cruisingSpeedKmh: 840,
    economyFare: 4400,
    initialProgressOffset: 0.52,
  },
  {
    id: 'rf-40',
    flightNumber: 'QP-1405',
    airline: 'Akasa Air',
    airlineCode: 'QP',
    aircraft: 'Boeing 737 MAX 8',
    aircraftReg: 'VT-YAB',
    originCode: 'DEL',
    destCode: 'BLR',
    depTimeUtcMin: 450,
    durationMinutes: 165,
    squawk: '2610',
    cruisingAltitudeFeet: 36000,
    cruisingSpeedKmh: 855,
    economyFare: 5700,
    initialProgressOffset: 0.32,
  },
  {
    id: 'rf-41',
    flightNumber: '6E-531',
    airline: 'IndiGo',
    airlineCode: '6E',
    aircraft: 'Airbus A320neo',
    aircraftReg: 'VT-IFR',
    originCode: 'BOM',
    destCode: 'BLR',
    depTimeUtcMin: 470,
    durationMinutes: 100,
    squawk: '4221',
    cruisingAltitudeFeet: 34000,
    cruisingSpeedKmh: 830,
    economyFare: 3600,
    initialProgressOffset: 0.88,
  },
  {
    id: 'rf-42',
    flightNumber: 'AI-804',
    airline: 'Air India',
    airlineCode: 'AI',
    aircraft: 'Airbus A320neo',
    aircraftReg: 'VT-EXW',
    originCode: 'BLR',
    destCode: 'BOM',
    depTimeUtcMin: 460,
    durationMinutes: 100,
    squawk: '6308',
    cruisingAltitudeFeet: 33000,
    cruisingSpeedKmh: 830,
    economyFare: 3800,
    initialProgressOffset: 0.15,
  }
];

// Great-circle navigation spherical trigonometry
export function calculateGreatCirclePosition(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  fraction: number
): { lat: number; lng: number } {
  const f = Math.max(0, Math.min(1, fraction));
  const φ1 = (lat1 * Math.PI) / 180;
  const λ1 = (lon1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const λ2 = (lon2 * Math.PI) / 180;

  const Δφ = φ2 - φ1;
  const Δλ = λ2 - λ1;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const d = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  if (d < 1e-6) {
    return { lat: lat1, lng: lon1 };
  }

  const A = Math.sin((1 - f) * d) / Math.sin(d);
  const B = Math.sin(f * d) / Math.sin(d);

  const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
  const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
  const z = A * Math.sin(φ1) + B * Math.sin(φ2);

  const φ = Math.atan2(z, Math.sqrt(x * x + y * y));
  const λ = Math.atan2(y, x);

  return {
    lat: Number(((φ * 180) / Math.PI).toFixed(4)),
    lng: Number(((λ * 180) / Math.PI).toFixed(4)),
  };
}

// Forward azimuth / bearing in degrees [0, 360)
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const θ = Math.atan2(y, x);
  return Math.round(((θ * 180) / Math.PI + 360) % 360);
}

// Distance in kilometers
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Compute live telemetry for a given route and time offset
export function computeFlightTelemetry(
  route: RouteDefinition,
  elapsedSec: number
): RealtimeFlight | null {
  const origin = getAirportByCode(route.originCode);
  const dest = getAirportByCode(route.destCode);

  if (!origin || !dest) return null;

  const totalDist = calculateDistanceKm(origin.lat, origin.lng, dest.lat, dest.lng);
  const totalMin = route.durationMinutes;
  
  // Progress fraction (0..1) with looping simulation or time-based progression
  // We advance progress based on elapsed seconds and route duration
  const initialOffset = route.initialProgressOffset ?? 0.5;
  const cycleSeconds = totalMin * 60;
  const totalProgress = (initialOffset + elapsedSec / cycleSeconds) % 1;

  const currentPos = calculateGreatCirclePosition(
    origin.lat,
    origin.lng,
    dest.lat,
    dest.lng,
    totalProgress
  );

  const heading = calculateBearing(
    currentPos.lat,
    currentPos.lng,
    dest.lat,
    dest.lng
  );

  // Determine flight phase, altitude, vertical speed, and ground speed
  let status: RealtimeFlightPhase = 'CRUISING';
  let altitudeFeet = route.cruisingAltitudeFeet;
  let verticalSpeedFpm = 0;
  let speedKmh = route.cruisingSpeedKmh;

  if (totalProgress < 0.05) {
    status = 'TAXIING';
    altitudeFeet = 500;
    verticalSpeedFpm = 0;
    speedKmh = 35;
  } else if (totalProgress < 0.22) {
    status = 'CLIMBING';
    const climbFrac = (totalProgress - 0.05) / 0.17;
    altitudeFeet = Math.round(500 + climbFrac * (route.cruisingAltitudeFeet - 500));
    verticalSpeedFpm = 2100;
    speedKmh = Math.round(450 + climbFrac * (route.cruisingSpeedKmh - 450));
  } else if (totalProgress < 0.80) {
    status = 'CRUISING';
    altitudeFeet = route.cruisingAltitudeFeet + (Math.sin(totalProgress * 20) > 0 ? 200 : -100);
    verticalSpeedFpm = 0;
    speedKmh = route.cruisingSpeedKmh;
  } else if (totalProgress < 0.95) {
    status = 'DESCENDING';
    const descFrac = (totalProgress - 0.80) / 0.15;
    altitudeFeet = Math.round(route.cruisingAltitudeFeet - descFrac * (route.cruisingAltitudeFeet - 2500));
    verticalSpeedFpm = -1600;
    speedKmh = Math.round(route.cruisingSpeedKmh - descFrac * (route.cruisingSpeedKmh - 320));
  } else if (totalProgress < 0.99) {
    status = 'APPROACH';
    altitudeFeet = 1800;
    verticalSpeedFpm = -750;
    speedKmh = 270;
  } else {
    status = 'LANDED';
    altitudeFeet = 400;
    verticalSpeedFpm = 0;
    speedKmh = 40;
  }

  const speedKnots = Math.round(speedKmh / 1.852);
  const mach = Number((speedKmh / 1235).toFixed(2));
  const remainingDist = Math.max(0, Math.round(totalDist * (1 - totalProgress)));
  const elapsedMin = Math.round(totalProgress * totalMin);

  // Time calculations
  const depHour = Math.floor(route.depTimeUtcMin / 60) % 24;
  const depMin = route.depTimeUtcMin % 60;
  const schedDepStr = `${depHour.toString().padStart(2, '0')}:${depMin.toString().padStart(2, '0')}`;

  const arrTotalMin = (route.depTimeUtcMin + totalMin) % (24 * 60);
  const arrHour = Math.floor(arrTotalMin / 60);
  const arrMin = arrTotalMin % 60;
  const schedArrStr = `${arrHour.toString().padStart(2, '0')}:${arrMin.toString().padStart(2, '0')}`;

  const delayMinutes = (parseInt(route.id.replace('rf-', ''), 10) % 7 === 0) ? 15 : 0;
  const estArrTotalMin = (arrTotalMin + delayMinutes) % (24 * 60);
  const estArrHour = Math.floor(estArrTotalMin / 60);
  const estArrMin = estArrTotalMin % 60;
  const estArrStr = `${estArrHour.toString().padStart(2, '0')}:${estArrMin.toString().padStart(2, '0')}`;

  return {
    id: route.id,
    flightNumber: route.flightNumber,
    airline: route.airline,
    airlineCode: route.airlineCode,
    aircraft: route.aircraft,
    aircraftReg: route.aircraftReg,
    origin: {
      code: origin.code,
      city: origin.city,
      name: origin.name,
      country: origin.country,
      terminal: origin.defaultTerminal || 'Terminal 1',
      gate: `Gate ${Math.floor(1 + (parseInt(route.id.replace('rf-', '')) * 3) % 24)}A`,
      lat: origin.lat,
      lng: origin.lng,
      scheduledTime: schedDepStr,
      estimatedTime: schedDepStr,
    },
    destination: {
      code: dest.code,
      city: dest.city,
      name: dest.name,
      country: dest.country,
      terminal: dest.defaultTerminal || 'Terminal 2',
      gate: `Gate ${Math.floor(1 + (parseInt(route.id.replace('rf-', '')) * 5) % 28)}B`,
      baggageBelt: `Belt ${Math.floor(1 + (parseInt(route.id.replace('rf-', '')) * 2) % 9)}`,
      lat: dest.lat,
      lng: dest.lng,
      scheduledTime: schedArrStr,
      estimatedTime: estArrStr,
    },
    status: delayMinutes > 0 && totalProgress < 0.2 ? 'DELAYED' : status,
    progressPercent: Math.round(totalProgress * 100),
    coordinates: currentPos,
    altitudeFeet,
    speedKmh,
    speedKnots,
    mach,
    heading,
    verticalSpeedFpm,
    remainingDistanceKm: remainingDist,
    totalDistanceKm: totalDist,
    elapsedMinutes: elapsedMin,
    totalMinutes: totalMin,
    delayMinutes,
    squawk: route.squawk,
    economyFare: route.economyFare,
    availableSeats: Math.floor(18 + (parseInt(route.id.replace('rf-', '')) * 7) % 65),
    weather: {
      originTemp: origin.weather?.temp || '28°C',
      originCondition: origin.weather?.condition || 'Clear',
      destTemp: dest.weather?.temp || '26°C',
      destCondition: dest.weather?.condition || 'Fair',
    },
  };
}

// Generate the full snapshot of active real-time flights
export function generateRealtimeFlightsSnapshot(elapsedSec: number = 0): RealtimeFlight[] {
  const flights: RealtimeFlight[] = [];
  for (const route of PREDEFINED_FLIGHT_ROUTES) {
    const flight = computeFlightTelemetry(route, elapsedSec);
    if (flight) {
      flights.push(flight);
    }
  }
  return flights;
}
