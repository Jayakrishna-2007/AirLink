// Generates complete airports database for India and international connections
import fs from 'fs';
import path from 'path';

const rawAirports = [
  // Metro Hubs & Major International Airports in India
  {
    code: 'DEL', icao: 'VIDP', name: 'Indira Gandhi International Airport', city: 'New Delhi', state: 'Delhi NCR',
    terminals: ['Terminal 1', 'Terminal 2', 'Terminal 3'], defaultTerminal: 'Terminal 3',
    runways: '11/29 & 10/28 & 09/27 (4,430m, Cat III-B ILS)', category: 'DOMESTIC_METRO',
    weather: { temp: '29°C', condition: 'Hazy Sun', wind: '080° at 8 kt', visibility: '6,000m' },
    hubAirlines: ['Air India', 'IndiGo', 'Vistara', 'SpiceJet'], lat: 28.5562, lng: 77.1000,
    features: ['Aerocity Metro Express', 'Encalm Privé Lounge', 'DigiYatra Fast-Track', 'A380 Gate']
  },
  {
    code: 'BOM', icao: 'VABB', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', state: 'Maharashtra',
    terminals: ['Terminal 1 (Santa Cruz)', 'Terminal 2 (Sahar)'], defaultTerminal: 'Terminal 2',
    runways: '09/27 (3,660m) & 14/32 Cross Runway', category: 'DOMESTIC_METRO',
    weather: { temp: '31°C', condition: 'Coastal Breeze', wind: '250° at 12 kt', visibility: '10,000m' },
    hubAirlines: ['Air India', 'IndiGo', 'Akasa Air', 'Vistara'], lat: 19.0896, lng: 72.8656,
    features: ['Jaya He Museum Walkway', 'Adani Lounge T2', 'DigiYatra', 'Direct Western Express Highway link']
  },
  {
    code: 'BLR', icao: 'VOBL', name: 'Kempegowda International Airport', city: 'Bengaluru', state: 'Karnataka',
    terminals: ['Terminal 1', 'Terminal 2 (Garden Terminal)'], defaultTerminal: 'Terminal 2',
    runways: '09L/27R & 09R/27L Parallel (4,000m)', category: 'DOMESTIC_METRO',
    weather: { temp: '24°C', condition: 'Pleasant & Breezy', wind: '120° at 7 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'Akasa Air', 'Air India', 'Star Air'], lat: 13.1986, lng: 77.7066,
    features: ['Garden Terminal in a Forest T2', 'Dual CAT III Runways', 'Zero-Carbon Certified', 'Flybus to City']
  },
  {
    code: 'HYD', icao: 'VOHS', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', state: 'Telangana',
    terminals: ['Integrated Passenger Terminal'], defaultTerminal: 'Terminal 1',
    runways: '09L/27R (4,260m) & Secondary 09R/27L', category: 'DOMESTIC_METRO',
    weather: { temp: '28°C', condition: 'Partly Cloudy', wind: '090° at 9 kt', visibility: '9,000m' },
    hubAirlines: ['IndiGo', 'Air India', 'Alliance Air'], lat: 17.2403, lng: 78.4294,
    features: ['Airport Express Metro under construction', 'India first Smart Flow DigiYatra', 'Plaza Premium']
  },
  {
    code: 'MAA', icao: 'VOMM', name: 'Chennai International Airport', city: 'Chennai', state: 'Tamil Nadu',
    terminals: ['T1 Domestic', 'T2 New Integrated Intl Terminal', 'T4 Domestic'], defaultTerminal: 'Terminal 2',
    runways: '07/25 (3,658m) & 12/30 (2,045m)', category: 'DOMESTIC_METRO',
    weather: { temp: '32°C', condition: 'Humid & Sunny', wind: '110° at 11 kt', visibility: '8,000m' },
    hubAirlines: ['IndiGo', 'Air India', 'SpiceJet'], lat: 12.9941, lng: 80.1709,
    features: ['Direct Metro Blue Line Concourse', 'Multi-Level Car Parking with PVR Cinemas', 'DigiYatra']
  },
  {
    code: 'CCU', icao: 'VECC', name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata', state: 'West Bengal',
    terminals: ['Integrated Terminal 2'], defaultTerminal: 'Terminal 2',
    runways: '01R/19L (3,627m) & 01L/19R (2,790m)', category: 'DOMESTIC_METRO',
    weather: { temp: '30°C', condition: 'Warm & Humid', wind: '180° at 8 kt', visibility: '7,000m' },
    hubAirlines: ['IndiGo', 'Air India', 'SpiceJet'], lat: 22.6547, lng: 88.4467,
    features: ['Yellow Metro Line Integration', 'Rabindranath Tagore Artwork Murals', 'Travel Club Lounge']
  },

  // Major International & Customs Airports in India
  {
    code: 'AMD', icao: 'VAAH', name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad', state: 'Gujarat',
    terminals: ['Terminal 1 (Domestic)', 'Terminal 2 (International)'], defaultTerminal: 'Terminal 1',
    runways: '05/23 (3,505m, Cat-I ILS)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '34°C', condition: 'Clear Sky', wind: '290° at 10 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'Air India', 'SpiceJet', 'Akasa Air'], lat: 23.0734, lng: 72.6347,
    features: ['Direct flights to London, Dubai, Singapore', 'The Lounge by Adani', 'DigiYatra Express']
  },
  {
    code: 'COK', icao: 'VOCI', name: 'Cochin International Airport', city: 'Kochi', state: 'Kerala',
    terminals: ['Terminal 1 (Domestic)', 'Terminal 3 (International)'], defaultTerminal: 'Terminal 3',
    runways: '09/27 (3,400m, Cat-I ILS)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '28°C', condition: 'Tropical Breeze', wind: '240° at 9 kt', visibility: '10,000m' },
    hubAirlines: ['Air India Express', 'IndiGo', 'SpiceJet'], lat: 10.1556, lng: 76.4019,
    features: ['World first 100% Solar-Powered Airport', 'Traditional Kerala Architecture T3', 'Earth Lounge']
  },
  {
    code: 'GOI', icao: 'VOGO', name: 'Goa International Airport (Dabolim)', city: 'Dabolim', state: 'Goa',
    terminals: ['Integrated Terminal'], defaultTerminal: 'Terminal 1',
    runways: '08/26 (3,458m Navy Enclave)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '29°C', condition: 'Sunny & Pleasant', wind: '280° at 10 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'Air India', 'Qatar Airways'], lat: 15.3800, lng: 73.8314,
    features: ['Coastal Scenic Approach', 'Direct Beach Resorts Access', 'Good Shepherd Lounge']
  },
  {
    code: 'GOX', icao: 'VOGA', name: 'Manohar International Airport (Mopa)', city: 'Mopa', state: 'Goa',
    terminals: ['Passenger Terminal 1'], defaultTerminal: 'Terminal 1',
    runways: '09/27 (3,750m, Cat-II ILS)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '28°C', condition: 'Warm & Breezy', wind: '260° at 8 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'Akasa Air', 'Air India'], lat: 15.7725, lng: 73.8683,
    features: ['Greenfield Modern Infrastructure', 'Direct North Goa Expressway', 'Encalm Lounge']
  },
  {
    code: 'TRV', icao: 'VOTV', name: 'Trivandrum International Airport', city: 'Thiruvananthapuram', state: 'Kerala',
    terminals: ['Terminal 1 (Domestic)', 'Terminal 2 (International)'], defaultTerminal: 'Terminal 2',
    runways: '14/32 (3,400m CAT-I ILS)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '30°C', condition: 'Coastal Sun', wind: '210° at 8 kt', visibility: '9,000m' },
    hubAirlines: ['Air India Express', 'IndiGo', 'Air India'], lat: 8.4821, lng: 76.9200,
    features: ['Arabian Sea Proximity', 'Middle East Transit Hub', 'Bird Lounge']
  },
  {
    code: 'CCJ', icao: 'VOCL', name: 'Calicut International Airport', city: 'Kozhikode', state: 'Kerala',
    terminals: ['Integrated Terminal'], defaultTerminal: 'Terminal 1',
    runways: '10/28 (2,860m Tabletop)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '29°C', condition: 'Tropical Clouds', wind: '230° at 7 kt', visibility: '9,000m' },
    hubAirlines: ['Air India Express', 'IndiGo', 'Flydubai'], lat: 11.1368, lng: 75.9553,
    features: ['High Middle-East Traffic Gateway', 'Tabletop Runway', 'Malabar Cultural Touches']
  },
  {
    code: 'CNN', icao: 'VOKN', name: 'Kannur International Airport', city: 'Kannur', state: 'Kerala',
    terminals: ['Integrated Passenger Terminal'], defaultTerminal: 'Terminal 1',
    runways: '07/25 (3,050m)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '29°C', condition: 'Pleasant Breeze', wind: '250° at 8 kt', visibility: '10,000m' },
    hubAirlines: ['Air India Express', 'IndiGo'], lat: 11.9174, lng: 75.5482,
    features: ['LEED Gold Certified', 'Theyyam Traditional Wall Murals', 'Extensive Gulf Network']
  },
  {
    code: 'IXC', icao: 'VICG', name: 'Shaheed Bhagat Singh International Airport', city: 'Chandigarh', state: 'Chandigarh',
    terminals: ['Integrated Eco-Terminal (Mohali)'], defaultTerminal: 'Terminal 1',
    runways: '11/29 (3,780m Cat-II ILS)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '25°C', condition: 'Clear', wind: '320° at 6 kt', visibility: '8,000m' },
    hubAirlines: ['IndiGo', 'Vistara', 'Air India'], lat: 30.6735, lng: 76.7885,
    features: ['Punjab & Haryana Joint Hub', 'Eco-friendly Glass Terminal', 'Middle East Direct Flights']
  },
  {
    code: 'ATQ', icao: 'VIAR', name: 'Sri Guru Ram Dass Jee International Airport', city: 'Amritsar', state: 'Punjab',
    terminals: ['Integrated Terminal'], defaultTerminal: 'Terminal 1',
    runways: '16/34 (3,658m Cat-III-B ILS)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '26°C', condition: 'Sunny & Clear', wind: '310° at 7 kt', visibility: '7,000m' },
    hubAirlines: ['Air India', 'IndiGo', 'Air India Express', 'Qatar Airways'], lat: 31.7096, lng: 74.7973,
    features: ['Direct London, Birmingham, Rome & Dubai flights', 'Cat III-B Winter Fog ILS', 'Golden Temple Shuttle']
  },
  {
    code: 'JAI', icao: 'VIJP', name: 'Jaipur International Airport', city: 'Jaipur', state: 'Rajasthan',
    terminals: ['Terminal 1 (Restored Intl)', 'Terminal 2 (Domestic & Intl)'], defaultTerminal: 'Terminal 2',
    runways: '09/27 (3,507m, Cat III-B ILS)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '30°C', condition: 'Dry & Clear', wind: '290° at 6 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'Air India Express', 'SpiceJet'], lat: 26.8242, lng: 75.8122,
    features: ['Rajasthani Sandstone Architecture', 'Adani Lounge', 'DigiYatra Enabled']
  },
  {
    code: 'LKO', icao: 'VILK', name: 'Chaudhary Charan Singh International Airport', city: 'Lucknow', state: 'Uttar Pradesh',
    terminals: ['Terminal 1', 'Terminal 2', 'Terminal 3 (Mega Integrated)'], defaultTerminal: 'Terminal 3',
    runways: '09/27 (2,743m, Cat-III-B ILS)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '28°C', condition: 'Hazy Sun', wind: '080° at 5 kt', visibility: '7,000m' },
    hubAirlines: ['IndiGo', 'Air India Express', 'Akasa Air'], lat: 26.7606, lng: 80.8893,
    features: ['New World-Class Terminal 3', 'Direct Metro Link (Chaudhary Charan Singh Line)', 'Chikankari Inspired Art']
  },
  {
    code: 'VNS', icao: 'VEBN', name: 'Lal Bahadur Shastri International Airport', city: 'Varanasi', state: 'Uttar Pradesh',
    terminals: ['Integrated Terminal'], defaultTerminal: 'Terminal 1',
    runways: '09/27 (2,745m Cat-I ILS)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '29°C', condition: 'Sunny', wind: '100° at 6 kt', visibility: '8,000m' },
    hubAirlines: ['IndiGo', 'Air India', 'SpiceJet'], lat: 25.4524, lng: 82.8593,
    features: ['Spiritual Capital Gateway', 'Direct Flights to Kathmandu & Bangkok', 'Kashi Vishwanath Cultural Decor']
  },
  {
    code: 'AYJ', icao: 'VEAY', name: 'Maharishi Valmiki International Airport', city: 'Ayodhya', state: 'Uttar Pradesh',
    terminals: ['Phase 1 Integrated Terminal'], defaultTerminal: 'Terminal 1',
    runways: '09/27 (2,200m expandable)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '28°C', condition: 'Clear', wind: '090° at 5 kt', visibility: '8,000m' },
    hubAirlines: ['IndiGo', 'Air India Express', 'SpiceJet', 'Akasa Air'], lat: 26.7460, lng: 82.1557,
    features: ['Ramayana Murals & Nagara Temple Architecture', 'Fast Connecting Highway', 'Inaugurated 2024']
  },
  {
    code: 'GAU', icao: 'VEGT', name: 'Lokpriya Gopinath Bordoloi International Airport', city: 'Guwahati', state: 'Assam',
    terminals: ['Terminal 1', 'New Terminal 2 (Mega Adani Hub)'], defaultTerminal: 'Terminal 1',
    runways: '02/20 (3,110m Cat-I ILS)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '26°C', condition: 'Misty Morning', wind: '040° at 5 kt', visibility: '7,000m' },
    hubAirlines: ['IndiGo', 'Air India', 'FlyBig'], lat: 26.1061, lng: 91.5859,
    features: ['Gateway to Northeast India', 'Direct Paro & Bangkok Flights', 'Kaziranga Bamboo Architecture']
  },
  {
    code: 'BBI', icao: 'VEBS', name: 'Biju Patnaik International Airport', city: 'Bhubaneswar', state: 'Odisha',
    terminals: ['Terminal 1 (Domestic)', 'Terminal 2 (International)'], defaultTerminal: 'Terminal 1',
    runways: '14/32 (2,743m) & 05/23 (1,379m)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '31°C', condition: 'Humid & Sunny', wind: '150° at 8 kt', visibility: '9,000m' },
    hubAirlines: ['IndiGo', 'Air India', 'AirAsia'], lat: 20.2444, lng: 85.8178,
    features: ['Odisha Tribal & Temple Art Installations', 'Direct Dubai & Singapore Connections', 'City Center Proximity']
  },
  {
    code: 'IXB', icao: 'VEBD', name: 'Bagdogra International Airport', city: 'Siliguri', state: 'West Bengal',
    terminals: ['Civil Enclave Terminal'], defaultTerminal: 'Terminal 1',
    runways: '18/36 (2,743m IAF Enclave)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '24°C', condition: 'Clear Mountain Air', wind: '020° at 6 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'Air India', 'SpiceJet'], lat: 26.6812, lng: 88.3286,
    features: ['Gateway to Darjeeling, Sikkim & Bhutan', 'Direct Flights to Bangkok & Paro', 'Tea Garden Surroundings']
  },
  {
    code: 'IXZ', icao: 'VOPB', name: 'Veer Savarkar International Airport', city: 'Port Blair', state: 'Andaman & Nicobar Islands',
    terminals: ['New Integrated Terminal (Shell-Shaped)'], defaultTerminal: 'Terminal 1',
    runways: '04/22 (3,290m INS Utkrosh)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '29°C', condition: 'Tropical Breeze', wind: '190° at 12 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'Air India', 'SpiceJet'], lat: 11.6412, lng: 92.7297,
    features: ['Stunning Shell-Shaped Sustainable Terminal', 'Ocean View Approach', 'Island Connection Flights']
  },
  {
    code: 'IXE', icao: 'VOML', name: 'Mangaluru International Airport', city: 'Mangaluru', state: 'Karnataka',
    terminals: ['Integrated Passenger Terminal (Kenjar)'], defaultTerminal: 'Terminal 1',
    runways: '06/24 (2,450m Concrete Tabletop)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '30°C', condition: 'Coastal Sun', wind: '260° at 9 kt', visibility: '10,000m' },
    hubAirlines: ['Air India Express', 'IndiGo'], lat: 12.9613, lng: 74.8901,
    features: ['Tabletop Runway Overlooking Hills', 'High Middle East Traffic (Dubai, Dammam, Muscat)', 'Yakshagana Art Decor']
  },
  {
    code: 'CJB', icao: 'VOCB', name: 'Coimbatore International Airport', city: 'Coimbatore', state: 'Tamil Nadu',
    terminals: ['Integrated Terminal'], defaultTerminal: 'Terminal 1',
    runways: '05/23 (3,048m)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '28°C', condition: 'Breezy & Pleasant', wind: '240° at 10 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'Air India', 'Scoot', 'Air Arabia'], lat: 11.0300, lng: 77.0434,
    features: ['Textile & Industrial Hub of Tamil Nadu', 'Direct Sharjah & Singapore Flights', 'Western Ghats Approach']
  },
  {
    code: 'TRZ', icao: 'VOTR', name: 'Tiruchirappalli International Airport', city: 'Tiruchirappalli', state: 'Tamil Nadu',
    terminals: ['New Integrated Terminal Building (NITB)'], defaultTerminal: 'Terminal 1',
    runways: '09/27 (2,480m)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '33°C', condition: 'Sunny & Warm', wind: '130° at 8 kt', visibility: '10,000m' },
    hubAirlines: ['Air India Express', 'IndiGo', 'Scoot', 'Batik Air'], lat: 10.7654, lng: 78.7097,
    features: ['State of the Art NITB Terminal (2024)', 'One of India highest international-to-domestic ratio airports', 'Kallanai Dam Architectural Motifs']
  },
  {
    code: 'IXM', icao: 'VOMD', name: 'Madurai Airport', city: 'Madurai', state: 'Tamil Nadu',
    terminals: ['Integrated Terminal'], defaultTerminal: 'Terminal 1',
    runways: '09/27 (2,285m Cat-I ILS)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '32°C', condition: 'Clear', wind: '110° at 7 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'Air India', 'SriLankan Airlines'], lat: 9.8345, lng: 78.0934,
    features: ['Meenakshi Temple Gateway', 'Direct Colombo & Dubai Flights', 'Modern Terminal Concourse']
  },
  {
    code: 'VTZ', icao: 'VOVZ', name: 'Visakhapatnam International Airport', city: 'Visakhapatnam', state: 'Andhra Pradesh',
    terminals: ['Integrated Terminal'], defaultTerminal: 'Terminal 1',
    runways: '05/23 (3,050m INS Dega)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '30°C', condition: 'Sunny & Coastal', wind: '170° at 9 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'Air India', 'AirAsia'], lat: 17.7212, lng: 83.2245,
    features: ['Bay of Bengal Port City Gateway', 'Direct Kuala Lumpur & Bangkok Connections', 'Naval Civil Enclave']
  },
  {
    code: 'VGA', icao: 'VOBZ', name: 'Vijayawada International Airport', city: 'Vijayawada', state: 'Andhra Pradesh',
    terminals: ['Integrated Terminal (Gannavaram)'], defaultTerminal: 'Terminal 1',
    runways: '08/26 (3,360m Cat-I ILS)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '32°C', condition: 'Clear', wind: '140° at 7 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'Air India', 'Air India Express'], lat: 16.5304, lng: 80.7968,
    features: ['Andhra Pradesh Amaravati Capital Region Hub', 'Direct Gulf Flights', 'Steel-glass Eco Terminal']
  },
  {
    code: 'TIR', icao: 'VOTP', name: 'Tirupati International Airport', city: 'Tirupati', state: 'Andhra Pradesh',
    terminals: ['Garuda Terminal'], defaultTerminal: 'Terminal 1',
    runways: '08/26 (2,286m)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '31°C', condition: 'Warm & Clear', wind: '100° at 6 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'Air India', 'SpiceJet'], lat: 13.6325, lng: 79.5433,
    features: ['Lord Venkateswara Tirumala Pilgrimage Gateway', 'Garuda Wing Inspired Architecture', 'High Frequency Shuttle Flights']
  },
  {
    code: 'PNQ', icao: 'VAPO', name: 'Pune International Airport', city: 'Pune', state: 'Maharashtra',
    terminals: ['Terminal 1', 'New Integrated Terminal 2'], defaultTerminal: 'Terminal 2',
    runways: '10/28 (2,540m IAF Lohegaon)', category: 'DOMESTIC_METRO',
    weather: { temp: '28°C', condition: 'Pleasant & Mild', wind: '260° at 8 kt', visibility: '9,000m' },
    hubAirlines: ['IndiGo', 'Air India', 'Akasa Air', 'SpiceJet'], lat: 18.5822, lng: 73.9197,
    features: ['Brand New Terminal 2 (2024)', 'Direct Dubai & Singapore Connections', 'Maharashtra IT Hub Gate']
  },
  {
    code: 'NAG', icao: 'VANP', name: 'Dr. Babasaheb Ambedkar International Airport', city: 'Nagpur', state: 'Maharashtra',
    terminals: ['Integrated Passenger Terminal'], defaultTerminal: 'Terminal 1',
    runways: '14/32 (3,200m Cat-I ILS)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '32°C', condition: 'Sunny', wind: '050° at 6 kt', visibility: '9,000m' },
    hubAirlines: ['IndiGo', 'Air India', 'Qatar Airways'], lat: 21.0922, lng: 79.0472,
    features: ['Geographical Center of India (Zero Mile)', 'Air Arabia & Qatar Middle East Flights', 'MIHAN SEZ Cargo Hub']
  },
  {
    code: 'STV', icao: 'VASU', name: 'Surat International Airport', city: 'Surat', state: 'Gujarat',
    terminals: ['New Integrated Terminal Building'], defaultTerminal: 'Terminal 1',
    runways: '04/22 (2,906m Cat-I ILS)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '31°C', condition: 'Sunny & Coastal', wind: '270° at 9 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'Air India Express'], lat: 21.1139, lng: 72.7419,
    features: ['Designated International Airport (2024)', 'Direct Dubai & Sharjah Flights', 'Diamond & Textile Trade Gateway']
  },
  {
    code: 'HSR', icao: 'VAHS', name: 'Rajkot International Airport', city: 'Rajkot (Hirasar)', state: 'Gujarat',
    terminals: ['Greenfield International Terminal'], defaultTerminal: 'Terminal 1',
    runways: '05/23 (3,040m Cat-I ILS)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '32°C', condition: 'Clear', wind: '260° at 9 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'Air India'], lat: 22.3556, lng: 70.9986,
    features: ['Brand New Greenfield Hub at Hirasar (Inaugurated 2023)', 'Capable of A321 & Widebody Jets', 'Saurashtra Industrial Hub']
  },
  {
    code: 'IDR', icao: 'VAID', name: 'Devi Ahilyabai Holkar Airport', city: 'Indore', state: 'Madhya Pradesh',
    terminals: ['Integrated Terminal'], defaultTerminal: 'Terminal 1',
    runways: '07/25 (2,750m Cat-I ILS)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '29°C', condition: 'Sunny & Breezy', wind: '250° at 8 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'Air India', 'Air India Express'], lat: 22.7217, lng: 75.8011,
    features: ['Cleanest City in India Airport', 'Direct Dubai Flights', 'Central India Commercial Powerhouse']
  },
  {
    code: 'BHO', icao: 'VABP', name: 'Raja Bhoj Airport', city: 'Bhopal', state: 'Madhya Pradesh',
    terminals: ['Integrated Passenger Terminal'], defaultTerminal: 'Terminal 1',
    runways: '12/30 (2,744m Cat-I ILS)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '29°C', condition: 'Sunny', wind: '230° at 7 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'Air India', 'Fly91'], lat: 23.2875, lng: 77.3378,
    features: ['100% Solar-Powered Auxiliary Terminal', 'Madhya Pradesh Capital Gateway', 'Modern Art Glass Architecture']
  },
  {
    code: 'SXR', icao: 'VISR', name: 'Sheikh ul-Alam International Airport', city: 'Srinagar', state: 'Jammu & Kashmir',
    terminals: ['Integrated Terminal'], defaultTerminal: 'Terminal 1',
    runways: '13/31 (3,685m Cat-I ILS)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '16°C', condition: 'Cool & Mountain Air', wind: '180° at 5 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'Air India', 'SpiceJet', 'Vistara'], lat: 34.0088, lng: 74.7741,
    features: ['Kashmir Valley Himalayan Gateway', 'Night Landing & Cat-I Capability', 'Direct Hajj & Seasonal International Flights']
  },
  {
    code: 'IXL', icao: 'VILH', name: 'Kushok Bakula Rimpochee Airport', city: 'Leh', state: 'Ladakh',
    terminals: ['Terminal 1', 'New World-Class High Altitude Terminal'], defaultTerminal: 'Terminal 1',
    runways: '07/25 (2,752m Mountain Valley)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '12°C', condition: 'Crisp & Mountain Clear', wind: '050° at 10 kt', visibility: '10,000m' },
    hubAirlines: ['Air India', 'IndiGo', 'SpiceJet'], lat: 34.1359, lng: 77.5465,
    features: ['World’s 23rd Highest Commercial Airport (3,256m MSL)', 'Himalayan Dramatic Visual Approach', 'Thermal Geothermal Eco Design']
  },
  {
    code: 'IXR', icao: 'VERC', name: 'Birsa Munda Airport', city: 'Ranchi', state: 'Jharkhand',
    terminals: ['Integrated Terminal'], defaultTerminal: 'Terminal 1',
    runways: '13/31 (2,748m Cat-I ILS)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '28°C', condition: 'Pleasant', wind: '110° at 6 kt', visibility: '9,000m' },
    hubAirlines: ['IndiGo', 'Air India'], lat: 23.3143, lng: 85.3216,
    features: ['Jharkhand Capital Hub', 'Top-Rated AAI Customer Satisfaction', 'Birsa Munda Bronze Statue Murals']
  },
  {
    code: 'PAT', icao: 'VEPT', name: 'Jay Prakash Narayan Airport', city: 'Patna', state: 'Bihar',
    terminals: ['Terminal 1 (Under Expansion with New NITB)'], defaultTerminal: 'Terminal 1',
    runways: '07/25 (2,286m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '30°C', condition: 'Warm', wind: '090° at 6 kt', visibility: '7,000m' },
    hubAirlines: ['IndiGo', 'SpiceJet', 'Air India'], lat: 25.5913, lng: 85.0880,
    features: ['Busiest Airport in Bihar', 'New Modern Terminal Under Construction', 'Ancient Pataliputra Heritage Display']
  },
  {
    code: 'GAY', icao: 'VEGY', name: 'Gaya International Airport', city: 'Gaya', state: 'Bihar',
    terminals: ['Integrated Terminal'], defaultTerminal: 'Terminal 1',
    runways: '10/28 (2,286m)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '31°C', condition: 'Clear', wind: '080° at 5 kt', visibility: '8,000m' },
    hubAirlines: ['IndiGo', 'Bhutan Airlines', 'Thai Airways', 'Myanmar Airways'], lat: 24.7443, lng: 84.9512,
    features: ['Bodh Gaya Buddhist Pilgrimage Circuit Hub', 'Seasonal Direct Flights to Bangkok, Yangon, Paro', 'Only Intl Airport in Bihar']
  },
  {
    code: 'IMF', icao: 'VEIM', name: 'Bir Tikendrajit International Airport', city: 'Imphal', state: 'Manipur',
    terminals: ['Integrated Terminal'], defaultTerminal: 'Terminal 1',
    runways: '04/22 (2,746m Cat-I ILS)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '24°C', condition: 'Pleasant & Mild', wind: '020° at 5 kt', visibility: '9,000m' },
    hubAirlines: ['IndiGo', 'Air India', 'Alliance Air'], lat: 24.7600, lng: 93.8967,
    features: ['Second Busiest Airport in Northeast India', 'Direct Flights to Myanmar & Regional Hubs', 'Manipuri Classical Art Facade']
  },
  {
    code: 'KBK', icao: 'VEKI', name: 'Kushinagar International Airport', city: 'Kushinagar', state: 'Uttar Pradesh',
    terminals: ['Passenger Terminal'], defaultTerminal: 'Terminal 1',
    runways: '11/29 (3,200m Cat-I ILS)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '29°C', condition: 'Sunny', wind: '100° at 5 kt', visibility: '8,000m' },
    hubAirlines: ['SpiceJet'], lat: 26.7725, lng: 83.8997,
    features: ['Lord Buddha Parinirvana Pilgrimage Gateway', 'Long 3.2km Runway for International Charters', 'Inaugurated for Global Buddhist Circuit']
  },

  // Operating Domestic & Regional / UDAN Airports Across All States
  // Andhra Pradesh
  {
    code: 'RJA', icao: 'VORY', name: 'Rajahmundry Airport', city: 'Rajahmundry', state: 'Andhra Pradesh',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '05/23 (3,165m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '32°C', condition: 'Sunny', wind: '120° at 7 kt', visibility: '9,000m' },
    hubAirlines: ['IndiGo'], lat: 17.1106, lng: 81.8183,
    features: ['Godavari River Basin Gateway', 'ONGC & Industrial Hub Flights', 'New Expanded Terminal']
  },
  {
    code: 'CDP', icao: 'VOCP', name: 'Kadapa Airport', city: 'Kadapa (Cuddapah)', state: 'Andhra Pradesh',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '11/29 (1,719m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '33°C', condition: 'Warm', wind: '100° at 6 kt', visibility: '9,000m' },
    hubAirlines: ['IndiGo'], lat: 14.5103, lng: 78.7728,
    features: ['Rayalaseema Regional Aviation Hub', 'UDAN Connectivity', 'Gandikota Canyon Access']
  },
  {
    code: 'KJB', icao: 'VOKN', name: 'Uyyalawada Narasimha Reddy Airport', city: 'Kurnool', state: 'Andhra Pradesh',
    terminals: ['Terminal 1 (Orvakal)'], defaultTerminal: 'Terminal 1', runways: '10/28 (2,000m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '33°C', condition: 'Sunny', wind: '090° at 6 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo'], lat: 15.7144, lng: 78.2936,
    features: ['Greenfield Regional Airport (2021)', 'Direct Connections to Bengaluru & Visakhapatnam', 'Solar Powered Facility']
  },

  // Arunachal Pradesh
  {
    code: 'HGI', icao: 'VEHO', name: 'Donyi Polo Airport (Hollongi)', city: 'Itanagar', state: 'Arunachal Pradesh',
    terminals: ['Passenger Terminal'], defaultTerminal: 'Terminal 1', runways: '04/22 (2,300m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '22°C', condition: 'Misty Mountains', wind: '030° at 4 kt', visibility: '8,000m' },
    hubAirlines: ['IndiGo', 'Alliance Air', 'FlyBig'], lat: 26.9856, lng: 93.6558,
    features: ['Capital City of Arunachal Pradesh Gateway (Inaugurated 2022)', 'Great Hornbill Inspired Roof Design', 'Night Landing Capable']
  },
  {
    code: 'IXT', icao: 'VEPG', name: 'Pasighat Airport', city: 'Pasighat', state: 'Arunachal Pradesh',
    terminals: ['Civil Enclave'], defaultTerminal: 'Terminal 1', runways: '10/28 (2,060m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '21°C', condition: 'Cloudy', wind: '010° at 4 kt', visibility: '7,000m' },
    hubAirlines: ['Alliance Air', 'FlyBig'], lat: 28.0664, lng: 95.3364,
    features: ['Siang River Valley Gateway', 'First Commercial Flight in Arunachal Pradesh', 'Himalayan Foothills']
  },
  {
    code: 'TEI', icao: 'VETJ', name: 'Tezu Airport', city: 'Tezu', state: 'Arunachal Pradesh',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '09/27 (1,500m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '20°C', condition: 'Clear', wind: '020° at 4 kt', visibility: '8,000m' },
    hubAirlines: ['FlyBig', 'Alliance Air'], lat: 27.9400, lng: 96.1347,
    features: ['Lohit District Access', 'Parshuram Kund Pilgrimage Circuit', 'UDAN Fixed Wing Flights']
  },
  {
    code: 'ZER', icao: 'VEZO', name: 'Ziro Airport', city: 'Ziro', state: 'Arunachal Pradesh',
    terminals: ['Civil Aerodrome'], defaultTerminal: 'Terminal 1', runways: '12/30 (1,222m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '18°C', condition: 'Pine Valley Breeze', wind: '360° at 4 kt', visibility: '9,000m' },
    hubAirlines: ['Alliance Air'], lat: 27.5900, lng: 93.8300,
    features: ['UNESCO World Heritage Pine Valley', 'Ziro Music Festival Hub', 'Dornier 228 Aircraft Service']
  },

  // Assam
  {
    code: 'DIB', icao: 'VEMN', name: 'Dibrugarh Airport (Mohanbari)', city: 'Dibrugarh', state: 'Assam',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '05/23 (2,286m Cat-I ILS)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '25°C', condition: 'Humid', wind: '050° at 5 kt', visibility: '8,000m' },
    hubAirlines: ['IndiGo', 'Air India', 'FlyBig'], lat: 27.4839, lng: 95.0178,
    features: ['Tea City of India Airport', 'Upper Assam Oil & Gas Hub', 'Direct Flights to Delhi & Kolkata']
  },
  {
    code: 'IXS', icao: 'VEKU', name: 'Silchar Airport (Kumbhirgram)', city: 'Silchar', state: 'Assam',
    terminals: ['Civil Enclave Terminal'], defaultTerminal: 'Terminal 1', runways: '06/24 (2,286m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '27°C', condition: 'Cloudy', wind: '160° at 5 kt', visibility: '8,000m' },
    hubAirlines: ['IndiGo', 'Air India'], lat: 24.9128, lng: 92.9792,
    features: ['Barak Valley Aviation Center', 'Gateway to Tripura and Mizoram', 'IAF Joint Base']
  },
  {
    code: 'JRH', icao: 'VEJT', name: 'Jorhat Airport (Rowriah)', city: 'Jorhat', state: 'Assam',
    terminals: ['Civil Enclave'], defaultTerminal: 'Terminal 1', runways: '04/22 (2,743m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '26°C', condition: 'Mild', wind: '070° at 4 kt', visibility: '8,000m' },
    hubAirlines: ['IndiGo'], lat: 26.7314, lng: 94.1756,
    features: ['Majuli River Island Access', 'Historic Assam Tea Capital', 'IAF Base Support']
  },
  {
    code: 'TEZ', icao: 'VETZ', name: 'Tezpur Airport (Salonibari)', city: 'Tezpur', state: 'Assam',
    terminals: ['Civil Enclave'], defaultTerminal: 'Terminal 1', runways: '04/22 (2,746m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '26°C', condition: 'Clear', wind: '060° at 5 kt', visibility: '8,000m' },
    hubAirlines: ['Alliance Air', 'FlyBig'], lat: 26.7092, lng: 92.7969,
    features: ['Brahmaputra Cultural Hub', 'Gateway to Tawang, Arunachal', 'Su-30MKI Fighter Enclave']
  },
  {
    code: 'RUP', icao: 'VERU', name: 'Rupsi Airport', city: 'Dhubri (Kokrajhar)', state: 'Assam',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '05/23 (1,829m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '27°C', condition: 'Partly Cloudy', wind: '090° at 5 kt', visibility: '8,000m' },
    hubAirlines: ['Alliance Air', 'FlyBig'], lat: 26.1408, lng: 89.9069,
    features: ['Revived World War II Airfield under UDAN', 'Bodo Territorial Region Access', 'Eco Friendly Bamboo Furnishings']
  },
  {
    code: 'IXI', icao: 'VELR', name: 'Lilabari Airport', city: 'North Lakhimpur', state: 'Assam',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '04/22 (2,286m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '25°C', condition: 'Pleasant', wind: '040° at 4 kt', visibility: '8,000m' },
    hubAirlines: ['Alliance Air', 'FlyBig'], lat: 27.2967, lng: 94.0978,
    features: ['Eastern Arunachal & Assam Gateway', 'Modern Aviation Training Academy', 'Subansiri River Basin']
  },

  // Bihar
  {
    code: 'DBR', icao: 'VEDH', name: 'Darbhanga Airport', city: 'Darbhanga', state: 'Bihar',
    terminals: ['Civil Enclave Terminal'], defaultTerminal: 'Terminal 1', runways: '10/28 (2,743m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '29°C', condition: 'Sunny', wind: '080° at 5 kt', visibility: '8,000m' },
    hubAirlines: ['SpiceJet', 'IndiGo'], lat: 26.1969, lng: 85.9189,
    features: ['One of India most successful UDAN airports', 'Mithilanchal Gateway', 'Direct Delhi, Mumbai, Bengaluru Flights']
  },

  // Chhattisgarh
  {
    code: 'RPR', icao: 'VERP', name: 'Swami Vivekananda Airport', city: 'Raipur', state: 'Chhattisgarh',
    terminals: ['Integrated Terminal'], defaultTerminal: 'Terminal 1', runways: '06/24 (2,286m Cat-I ILS)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '31°C', condition: 'Sunny', wind: '110° at 7 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'Air India'], lat: 21.1804, lng: 81.7389,
    features: ['State Capital Hub of Chhattisgarh', 'Bastar Dokra Art Decor', 'Consistent Top AAI Ranking']
  },
  {
    code: 'JGB', icao: 'VEJR', name: 'Maa Danteshwari Airport', city: 'Jagdalpur', state: 'Chhattisgarh',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '06/24 (1,707m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '29°C', condition: 'Clear', wind: '100° at 5 kt', visibility: '9,000m' },
    hubAirlines: ['Alliance Air', 'IndiGo'], lat: 19.0742, lng: 82.0353,
    features: ['Bastar Forest & Chitrakote Waterfalls Gateway', 'Tribal Handicrafts Architecture', 'UDAN Connectivity']
  },
  {
    code: 'PAB', icao: 'VEBU', name: 'Bilasa Devi Kevat Airport', city: 'Bilaspur', state: 'Chhattisgarh',
    terminals: ['Terminal 1 (Chakarbhatha)'], defaultTerminal: 'Terminal 1', runways: '17/35 (1,500m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '30°C', condition: 'Warm', wind: '090° at 5 kt', visibility: '9,000m' },
    hubAirlines: ['Alliance Air'], lat: 21.9881, lng: 82.1122,
    features: ['High Court of Chhattisgarh Access', 'Direct Flights to Delhi & Jabalpur', 'Upgraded 3C Category']
  },

  // Delhi NCR / UP borders
  {
    code: 'HDO', icao: 'VIDX', name: 'Hindon Airport (NCR Civil Terminal)', city: 'Ghaziabad', state: 'Delhi NCR',
    terminals: ['Civil Terminal'], defaultTerminal: 'Terminal 1', runways: '09/27 (2,743m IAF Base)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '29°C', condition: 'Hazy', wind: '080° at 6 kt', visibility: '6,000m' },
    hubAirlines: ['FlyBig', 'Star Air'], lat: 28.7061, lng: 77.3606,
    features: ['Secondary NCR Commercial Terminal', 'Decongests IGI Delhi', 'Operates Flights to Kishangarh, Bathinda, Pithoragarh']
  },

  // Gujarat Regional
  {
    code: 'BDQ', icao: 'VABO', name: 'Vadodara Airport', city: 'Vadodara', state: 'Gujarat',
    terminals: ['Integrated Eco Terminal (Harni)'], defaultTerminal: 'Terminal 1', runways: '04/22 (2,469m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '32°C', condition: 'Sunny', wind: '270° at 9 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'Air India'], lat: 22.3361, lng: 73.2264,
    features: ['India second Green Airport', 'Single Sheet Rooftop Architecture', 'Statue of Unity Nearest Major Airport']
  },
  {
    code: 'BHU', icao: 'VABV', name: 'Bhavnagar Airport', city: 'Bhavnagar', state: 'Gujarat',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '07/25 (1,920m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '31°C', condition: 'Sunny & Coastal', wind: '240° at 9 kt', visibility: '10,000m' },
    hubAirlines: ['SpiceJet'], lat: 21.7522, lng: 72.1856,
    features: ['Alang Shipbreaking Yard Access', 'Palitana Jain Temples Circuit', 'Direct Mumbai Flights']
  },
  {
    code: 'BHJ', icao: 'VABJ', name: 'Bhuj Airport', city: 'Bhuj', state: 'Gujarat',
    terminals: ['Civil Enclave'], defaultTerminal: 'Terminal 1', runways: '05/23 (2,501m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '33°C', condition: 'Dry & Clear', wind: '260° at 10 kt', visibility: '10,000m' },
    hubAirlines: ['Alliance Air'], lat: 23.2878, lng: 69.6700,
    features: ['White Rann of Kutch & Rann Utsav Gateway', 'Historic Brave Women of Madhapar Runway Heritage', 'Direct Mumbai Flights']
  },
  {
    code: 'JGA', icao: 'VAJM', name: 'Jamnagar Airport', city: 'Jamnagar', state: 'Gujarat',
    terminals: ['Civil Enclave'], defaultTerminal: 'Terminal 1', runways: '06/24 (2,512m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '30°C', condition: 'Sunny', wind: '270° at 10 kt', visibility: '10,000m' },
    hubAirlines: ['Air India', 'Star Air'], lat: 22.4661, lng: 70.0125,
    features: ['Reliance Refinery Industrial Access', 'Marine National Park Gateway', 'Dual-use IAF Airbase']
  },
  {
    code: 'PBD', icao: 'VAPR', name: 'Porbandar Airport', city: 'Porbandar', state: 'Gujarat',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '05/23 (1,372m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '30°C', condition: 'Breezy & Sunny', wind: '260° at 11 kt', visibility: '10,000m' },
    hubAirlines: ['SpiceJet'], lat: 21.6489, lng: 69.6572,
    features: ['Mahatma Gandhi Birthplace Gateway', 'Coast Guard Air Enclave', 'Direct Mumbai Flights']
  },
  {
    code: 'IXY', icao: 'VAKE', name: 'Kandla Airport', city: 'Gandhidham (Kandla)', state: 'Gujarat',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '05/23 (1,524m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '32°C', condition: 'Sunny', wind: '250° at 9 kt', visibility: '10,000m' },
    hubAirlines: ['SpiceJet'], lat: 23.1122, lng: 70.1006,
    features: ['Deendayal Port Trust & SEZ Access', 'Commercial Business Commuters', 'Direct Delhi & Mumbai Flights']
  },
  {
    code: 'IXK', icao: 'VAKS', name: 'Keshod Airport', city: 'Keshod (Junagadh)', state: 'Gujarat',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '05/23 (1,372m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '31°C', condition: 'Clear', wind: '240° at 9 kt', visibility: '10,000m' },
    hubAirlines: ['Alliance Air'], lat: 21.3167, lng: 70.2689,
    features: ['Gir National Park Asiatic Lion Sanctuary Gateway', 'Somnath Temple Nearest Air Route', 'Revitalized under UDAN']
  },

  // Daman and Diu
  {
    code: 'DIU', icao: 'VAID', name: 'Diu Airport', city: 'Diu', state: 'Daman and Diu',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '05/23 (1,829m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '29°C', condition: 'Ocean Breeze', wind: '230° at 10 kt', visibility: '10,000m' },
    hubAirlines: ['Alliance Air', 'IndiGo'], lat: 20.7133, lng: 70.9214,
    features: ['Island Coastal Tourism Haven', 'Portuguese Colonial Heritage', 'Direct Flights to Mumbai & Surat']
  },

  // Haryana
  {
    code: 'HSS', icao: 'VIHR', name: 'Maharaja Agrasen Airport', city: 'Hisar', state: 'Haryana',
    terminals: ['Passenger Terminal (New Phase 2)'], defaultTerminal: 'Terminal 1', runways: '12/30 (3,000m Cat-I ILS)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '28°C', condition: 'Sunny & Clear', wind: '300° at 6 kt', visibility: '8,000m' },
    hubAirlines: ['Alliance Air'], lat: 29.1794, lng: 75.7558,
    features: ['First Integrated Aviation Hub in Haryana', 'New 10,000-ft Runway', 'Flights to Ayodhya, Chandigarh, Ahmedabad']
  },
  {
    code: 'UTP', icao: 'VIAM', name: 'Ambala Civil Enclave', city: 'Ambala', state: 'Haryana',
    terminals: ['Civil Terminal'], defaultTerminal: 'Terminal 1', runways: '12/30 (2,743m IAF Base)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '27°C', condition: 'Clear', wind: '310° at 6 kt', visibility: '8,000m' },
    hubAirlines: ['Alliance Air'], lat: 30.3692, lng: 76.8164,
    features: ['Brand New Commercial Civil Enclave (2024)', 'UDAN Flights to Srinagar, Varanasi, Lucknow', 'Close to Ambala Cantt Rail Junction']
  },

  // Himachal Pradesh
  {
    code: 'DHM', icao: 'VIGG', name: 'Kangra Airport (Gaggal)', city: 'Dharamshala', state: 'Himachal Pradesh',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '15/33 (1,408m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '20°C', condition: 'Alpine Cool', wind: '360° at 5 kt', visibility: '10,000m' },
    hubAirlines: ['SpiceJet', 'IndiGo', 'Alliance Air'], lat: 32.1650, lng: 76.2633,
    features: ['Dhauladhar Mountain Range Backdrop', 'Dalai Lama & McLeod Ganj Gateway', 'Direct Delhi Flights']
  },
  {
    code: 'KUU', icao: 'VIBR', name: 'Kullu–Manali Airport (Bhuntar)', city: 'Kullu', state: 'Himachal Pradesh',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '16/34 (1,125m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '18°C', condition: 'Crisp & Sunny', wind: '170° at 5 kt', visibility: '10,000m' },
    hubAirlines: ['Alliance Air'], lat: 31.8767, lng: 77.1542,
    features: ['Beas River Gorge Approach', 'Manali Hill Station Gateway', 'ATR-42 Specialized Flights']
  },
  {
    code: 'SLV', icao: 'VISM', name: 'Shimla Airport (Jubbarhatti)', city: 'Shimla', state: 'Himachal Pradesh',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '10/28 (1,230m Tabletop)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '17°C', condition: 'Misty & Fresh', wind: '120° at 5 kt', visibility: '9,000m' },
    hubAirlines: ['Alliance Air'], lat: 31.0817, lng: 77.0678,
    features: ['Tabletop Mountain Runway (2,196m MSL)', 'Summer Capital of India Access', 'Daily Delhi Connection']
  },

  // Jammu & Kashmir
  {
    code: 'IXJ', icao: 'VIJU', name: 'Jammu Civil Enclave (Satwari)', city: 'Jammu', state: 'Jammu & Kashmir',
    terminals: ['Terminal 1 (Under Expansion)'], defaultTerminal: 'Terminal 1', runways: '18/36 (2,042m Cat-I ILS)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '26°C', condition: 'Sunny', wind: '340° at 6 kt', visibility: '9,000m' },
    hubAirlines: ['IndiGo', 'Air India', 'SpiceJet', 'Vistara'], lat: 32.6892, lng: 74.8375,
    features: ['Vaishno Devi Shrine Katra Gateway', 'High-Frequency Pilgrim Flights', 'State-of-the-art New Terminal underway']
  },

  // Jharkhand
  {
    code: 'DGH', icao: 'VEDO', name: 'Deoghar International Airport', city: 'Deoghar', state: 'Jharkhand',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '09/27 (2,500m Cat-I ILS)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '28°C', condition: 'Sunny', wind: '100° at 6 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo'], lat: 24.4439, lng: 86.7042,
    features: ['Baba Baidyanath Dham Jyotirlinga Gateway', 'Opened July 2022 by PM Modi', 'Direct Delhi, Kolkata, Bengaluru Flights']
  },
  {
    code: 'IXW', icao: 'VEJS', name: 'Sonari Airport', city: 'Jamshedpur', state: 'Jharkhand',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '08/26 (1,222m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '30°C', condition: 'Warm', wind: '090° at 5 kt', visibility: '9,000m' },
    hubAirlines: ['IndiaOne Air'], lat: 22.8153, lng: 86.1683,
    features: ['Tata Steel City Aviation Center', 'UDAN Connectivity to Kolkata & Bhubaneswar', 'Commercial Commuter Hub']
  },

  // Karnataka Regional
  {
    code: 'HBX', icao: 'VAHB', name: 'Hubballi Airport', city: 'Hubballi (Dharwad)', state: 'Karnataka',
    terminals: ['Integrated Terminal'], defaultTerminal: 'Terminal 1', runways: '08/26 (2,600m Cat-I ILS)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '27°C', condition: 'Pleasant', wind: '260° at 8 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'Star Air'], lat: 15.3617, lng: 75.0847,
    features: ['North Karnataka Commercial Hub', 'Solar-Powered Eco Terminal', 'Direct Flights to Mumbai, Delhi, Hyderabad, Bengaluru']
  },
  {
    code: 'IXG', icao: 'VABM', name: 'Belagavi Airport (Sambre)', city: 'Belagavi (Belgaum)', state: 'Karnataka',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '08/26 (2,300m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '26°C', condition: 'Pleasant', wind: '250° at 7 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'Star Air'], lat: 15.8592, lng: 74.6183,
    features: ['Oldest Airport in North Karnataka', 'Major Foundry & Precision Engineering Hub', 'Star Air Headquarters Hub']
  },
  {
    code: 'MYQ', icao: 'VOMY', name: 'Mysuru Airport (Mandakalli)', city: 'Mysuru', state: 'Karnataka',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '09/27 (1,740m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '25°C', condition: 'Pleasant', wind: '110° at 6 kt', visibility: '10,000m' },
    hubAirlines: ['Alliance Air', 'IndiGo'], lat: 12.2300, lng: 76.6500,
    features: ['Mysore Palace & Dasara Gateway', 'Undergoing Runway Expansion for A320s', 'Heritage Architectural Elements']
  },
  {
    code: 'RQY', icao: 'VOSH', name: 'Rashtrakavi Kuvempu Airport', city: 'Shivamogga', state: 'Karnataka',
    terminals: ['Lotus-Shaped Terminal'], defaultTerminal: 'Terminal 1', runways: '07/25 (3,200m Cat-I ILS)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '26°C', condition: 'Clear', wind: '240° at 7 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'Star Air'], lat: 13.8647, lng: 75.6425,
    features: ['Lotus-Shaped Modern Terminal (Opened 2023)', 'Jog Falls Gateway', '3.2km Long Runway for Widebody Aircraft']
  },
  {
    code: 'GBI', icao: 'VOGB', name: 'Kalaburagi Airport', city: 'Kalaburagi (Gulbarga)', state: 'Karnataka',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '09/27 (3,175m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '31°C', condition: 'Warm', wind: '270° at 7 kt', visibility: '10,000m' },
    hubAirlines: ['Star Air', 'Alliance Air'], lat: 17.3117, lng: 76.9583,
    features: ['Kalyana Karnataka Aviation Hub', 'Khwaja Bande Nawaz Dargah Access', 'Direct Bengaluru & Tirupati Flights']
  },
  {
    code: 'IXX', icao: 'VOBR', name: 'Bidar Airport', city: 'Bidar', state: 'Karnataka',
    terminals: ['Civil Terminal'], defaultTerminal: 'Terminal 1', runways: '08/26 (2,743m IAF Base)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '29°C', condition: 'Clear', wind: '260° at 6 kt', visibility: '10,000m' },
    hubAirlines: ['Star Air'], lat: 17.9061, lng: 77.4858,
    features: ['Historic Bahmani Kingdom Fort & Gurudwara Nanak Jhira Gateway', 'Bidriware Art Display', 'UDAN Daily Bengaluru Flight']
  },
  {
    code: 'VDY', icao: 'VOJV', name: 'Jindal Vijayanagar Airport', city: 'Ballari (Toranagallu)', state: 'Karnataka',
    terminals: ['Passenger Terminal'], defaultTerminal: 'Terminal 1', runways: '13/31 (1,500m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '31°C', condition: 'Warm', wind: '260° at 7 kt', visibility: '10,000m' },
    hubAirlines: ['Alliance Air'], lat: 15.1667, lng: 76.6333,
    features: ['UNESCO World Heritage Hampi Nearest Airport', 'JSW Steel Complex Commuter Access', 'Daily Bengaluru & Hyderabad Flights']
  },

  // Lakshadweep
  {
    code: 'AGX', icao: 'VOAT', name: 'Agatti Airport', city: 'Agatti Island', state: 'Lakshadweep',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '04/22 (1,204m Ocean Runway)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '29°C', condition: 'Oceanic Turquoise Breeze', wind: '220° at 11 kt', visibility: '10,000m' },
    hubAirlines: ['Alliance Air', 'Fly91', 'IndiGo'], lat: 10.8236, lng: 72.1764,
    features: ['Only Airport in Lakshadweep Archipelago', 'Spectacular Ocean Surrounded Runway Strip', 'Direct Daily Kochi & Goa Flights']
  },

  // Madhya Pradesh Regional
  {
    code: 'GWL', icao: 'VIGR', name: 'Rajmata Vijaya Raje Scindia Airport', city: 'Gwalior', state: 'Madhya Pradesh',
    terminals: ['New Integrated Terminal Building'], defaultTerminal: 'Terminal 1', runways: '04/22 (2,743m IAF Base)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '28°C', condition: 'Sunny', wind: '310° at 6 kt', visibility: '8,000m' },
    hubAirlines: ['IndiGo', 'Air India Express', 'Akasa Air'], lat: 26.2933, lng: 78.2278,
    features: ['Brand New Mega Terminal (Inaugurated 2024)', 'Historic Gwalior Fort & Tansen Music Heritage', 'Direct Delhi, Mumbai, Bengaluru Flights']
  },
  {
    code: 'JLR', icao: 'VAJB', name: 'Dumna Airport', city: 'Jabalpur', state: 'Madhya Pradesh',
    terminals: ['New Integrated Passenger Terminal'], defaultTerminal: 'Terminal 1', runways: '06/24 (2,750m Cat-I ILS)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '29°C', condition: 'Sunny', wind: '240° at 6 kt', visibility: '9,000m' },
    hubAirlines: ['IndiGo', 'Alliance Air', 'SpiceJet'], lat: 23.1778, lng: 80.0522,
    features: ['Brand New Terminal (Opened 2024)', 'Bhedaghat Marble Rocks & Kanha Tiger Reserve Access', 'Direct Mumbai, Delhi, Bilaspur Flights']
  },
  {
    code: 'HJR', icao: 'VEKO', name: 'Khajuraho Airport', city: 'Khajuraho', state: 'Madhya Pradesh',
    terminals: ['Integrated Terminal'], defaultTerminal: 'Terminal 1', runways: '01/19 (2,274m Cat-I ILS)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '29°C', condition: 'Sunny & Clear', wind: '280° at 6 kt', visibility: '10,000m' },
    hubAirlines: ['SpiceJet', 'IndiGo'], lat: 24.8172, lng: 79.9192,
    features: ['UNESCO World Heritage Khajuraho Temples', 'Chandela Dynasty Architectural Murals', 'Tourist Flight Circuit']
  },
  {
    code: 'REW', icao: 'VA1F', name: 'Rewa Airport', city: 'Rewa', state: 'Madhya Pradesh',
    terminals: ['Terminal 1 (Chorhata)'], defaultTerminal: 'Terminal 1', runways: '08/26 (1,800m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '29°C', condition: 'Sunny', wind: '260° at 6 kt', visibility: '9,000m' },
    hubAirlines: ['Fly91'], lat: 24.5367, lng: 81.2189,
    features: ['Newest Operational Airport in MP (2024)', 'Vindhya Region Connectivity', 'White Tiger Capital Access']
  },

  // Maharashtra Regional
  {
    code: 'SAG', icao: 'VASD', name: 'Shirdi International Airport', city: 'Shirdi (Kakadi)', state: 'Maharashtra',
    terminals: ['Integrated Terminal'], defaultTerminal: 'Terminal 1', runways: '09/27 (3,200m Cat-I ILS)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '29°C', condition: 'Sunny & Breezy', wind: '260° at 9 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'SpiceJet'], lat: 19.6894, lng: 74.3775,
    features: ['Sai Baba Pilgrimage Center Gateway', 'Night Landing & Cat-I Capable 3.2km Runway', 'Direct Flights to Delhi, Mumbai, Chennai, Bengaluru']
  },
  {
    code: 'IXU', icao: 'VAAU', name: 'Chhatrapati Sambhajinagar Airport', city: 'Chhatrapati Sambhajinagar (Aurangabad)', state: 'Maharashtra',
    terminals: ['Integrated Passenger Terminal'], defaultTerminal: 'Terminal 1', runways: '09/27 (2,835m Cat-I ILS)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '30°C', condition: 'Sunny', wind: '270° at 8 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'Air India'], lat: 19.8631, lng: 75.3981,
    features: ['UNESCO Ajanta & Ellora Caves Gateway', 'Automobile Manufacturing SEZ', 'Himroo Fabric Inspired Interiors']
  },
  {
    code: 'ISK', icao: 'VAOZ', name: 'Nashik Airport (Ozar)', city: 'Nashik', state: 'Maharashtra',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '08/26 (3,000m HAL Airbase)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '28°C', condition: 'Pleasant Breeze', wind: '250° at 8 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'SpiceJet'], lat: 20.1197, lng: 73.9133,
    features: ['Wine Capital of India & Trimbakeshwar Gateway', 'HAL Fighter Assembly Enclave', 'Direct Flights to Delhi, Hyderabad, Ahmedabad']
  },
  {
    code: 'KLH', icao: 'VAKP', name: 'Chhatrapati Rajaram Maharaj Airport', city: 'Kolhapur', state: 'Maharashtra',
    terminals: ['New Passenger Terminal'], defaultTerminal: 'Terminal 1', runways: '07/25 (1,930m Cat-I ILS)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '28°C', condition: 'Pleasant', wind: '240° at 8 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'Star Air'], lat: 16.6644, lng: 74.2819,
    features: ['Mahalakshmi Temple Gateway', 'Brand New Eco-Terminal (2024)', 'South Maharashtra Industrial Center']
  },
  {
    code: 'SDW', icao: 'VOSR', name: 'Sindhudurg Chipi Airport', city: 'Sindhudurg (Chipi)', state: 'Maharashtra',
    terminals: ['Passenger Terminal'], defaultTerminal: 'Terminal 1', runways: '09/27 (2,500m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '29°C', condition: 'Konkan Sea Breeze', wind: '260° at 10 kt', visibility: '10,000m' },
    hubAirlines: ['Alliance Air', 'Fly91'], lat: 16.0044, lng: 73.5261,
    features: ['South Konkan Pristine Coastline Access', 'Tarkarli Scuba & Forts Gateway', 'Direct Mumbai & Hyderabad Flights']
  },
  {
    code: 'JLG', icao: 'VAJL', name: 'Jalgaon Airport', city: 'Jalgaon', state: 'Maharashtra',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '09/27 (1,700m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '31°C', condition: 'Sunny', wind: '260° at 7 kt', visibility: '9,000m' },
    hubAirlines: ['Fly91'], lat: 20.9639, lng: 75.6294,
    features: ['Banana City & Gold Market Access', 'Ajanta Caves North Gateway', 'Commercial UDAN Flight Base']
  },
  {
    code: 'NDC', icao: 'VAND', name: 'Shri Guru Gobind Singh Ji Airport', city: 'Nanded', state: 'Maharashtra',
    terminals: ['Passenger Terminal'], defaultTerminal: 'Terminal 1', runways: '10/28 (2,300m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '31°C', condition: 'Warm', wind: '260° at 7 kt', visibility: '9,000m' },
    hubAirlines: ['Star Air', 'Fly91'], lat: 19.1844, lng: 77.3183,
    features: ['Hazur Sahib Holy Gurudwara Gateway', 'High Pilgrim Traffic from Punjab & Delhi', 'Refurbished Modern Concourse']
  },
  {
    code: 'GDB', icao: 'VAGD', name: 'Birsi Airport', city: 'Gondia', state: 'Maharashtra',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '04/22 (2,290m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '30°C', condition: 'Sunny', wind: '100° at 5 kt', visibility: '9,000m' },
    hubAirlines: ['Fly91'], lat: 21.5278, lng: 80.2917,
    features: ['National Flying Training Institute (NFTI)', 'Pench & Navegaon Tiger Reserve Access', 'UDAN Commercial Flights']
  },
  {
    code: 'SSE', icao: 'VASL', name: 'Solapur Airport', city: 'Solapur', state: 'Maharashtra',
    terminals: ['Passenger Terminal (Boramani/Civil)'], defaultTerminal: 'Terminal 1', runways: '15/33 (2,000m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '31°C', condition: 'Sunny', wind: '250° at 8 kt', visibility: '10,000m' },
    hubAirlines: ['Alliance Air', 'Fly91'], lat: 17.6289, lng: 75.9344,
    features: ['Solapuri Chaddar & Textile Hub', 'Pandharpur Vithoba Pilgrimage Gateway', 'Upgraded in 2024 for Commercial Flights']
  },

  // Northeast States: Meghalaya, Mizoram, Nagaland, Sikkim, Tripura
  {
    code: 'SHL', icao: 'VEBI', name: 'Shillong Airport (Umroi)', city: 'Shillong (Umroi)', state: 'Meghalaya',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '04/22 (1,829m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '19°C', condition: 'Pine Woods Misty', wind: '150° at 5 kt', visibility: '8,000m' },
    hubAirlines: ['IndiGo', 'Alliance Air'], lat: 25.7036, lng: 91.9789,
    features: ['Scotland of the East Gateway', 'Cherrapunji & Living Root Bridges Access', 'Direct Kolkata & Delhi Flights']
  },
  {
    code: 'AJL', icao: 'VELP', name: 'Lengpui Airport', city: 'Aizawl', state: 'Mizoram',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '17/35 (2,500m Cat-I ILS Tabletop)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '22°C', condition: 'Lush Green Breezy', wind: '180° at 5 kt', visibility: '9,000m' },
    hubAirlines: ['IndiGo', 'Air India'], lat: 23.8406, lng: 92.6197,
    features: ['India first large airport built by a State Government', 'Bamboo-Rich Hilltop View', 'Direct Kolkata & Guwahati Flights']
  },
  {
    code: 'DMU', icao: 'VEMR', name: 'Dimapur Airport', city: 'Dimapur', state: 'Nagaland',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '15/33 (2,290m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '25°C', condition: 'Humid & Mild', wind: '050° at 4 kt', visibility: '8,000m' },
    hubAirlines: ['IndiGo', 'Air India'], lat: 25.8839, lng: 93.7711,
    features: ['Only Commercial Airport in Nagaland', 'Hornbill Festival Kohima Gateway', 'Direct Delhi & Kolkata Connections']
  },
  {
    code: 'PYG', icao: 'VEPY', name: 'Pakyong Airport', city: 'Gangtok (Pakyong)', state: 'Sikkim',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '02/20 (1,700m Tabletop Mountain)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '16°C', condition: 'Himalayan Mountain Fresh', wind: '010° at 6 kt', visibility: '9,000m' },
    hubAirlines: ['SpiceJet', 'FlyBig'], lat: 27.2289, lng: 88.5878,
    features: ['Engineering Wonder 1,400m MSL Mountain Slope', '100th Operational Airport in India', 'Direct Gangtok Capital Access']
  },
  {
    code: 'IXA', icao: 'VEAT', name: 'Maharaja Bir Bikram Airport', city: 'Agartala', state: 'Tripura',
    terminals: ['New Integrated Terminal Building'], defaultTerminal: 'Terminal 1', runways: '18/36 (2,499m Cat-I ILS)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '27°C', condition: 'Sunny', wind: '120° at 5 kt', visibility: '9,000m' },
    hubAirlines: ['IndiGo', 'Air India'], lat: 23.8869, lng: 91.2403,
    features: ['Second Busiest Airport in Northeast India', 'Stunning New Bamboo & Stone Terminal', 'Direct Chittagong & Dhaka Cross-Border Link']
  },

  // Odisha Regional
  {
    code: 'JRG', icao: 'VEJH', name: 'Veer Surendra Sai Airport', city: 'Jharsuguda', state: 'Odisha',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '06/24 (2,390m Cat-I ILS)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '30°C', condition: 'Sunny', wind: '100° at 6 kt', visibility: '9,000m' },
    hubAirlines: ['IndiGo', 'Alliance Air'], lat: 21.9142, lng: 84.0506,
    features: ['Western Odisha Industrial Heartland Gateway', 'UDAN Mega Success Story', 'Direct Flights to Delhi, Bengaluru, Kolkata']
  },
  {
    code: 'RRK', icao: 'VERK', name: 'Rourkela Airport', city: 'Rourkela', state: 'Odisha',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '04/22 (1,820m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '30°C', condition: 'Warm', wind: '110° at 6 kt', visibility: '9,000m' },
    hubAirlines: ['Alliance Air'], lat: 22.2572, lng: 84.8142,
    features: ['SAIL Steel City & Birsa Munda Hockey Stadium Access', 'Upgraded for FIH Hockey Men World Cup', 'Direct Kolkata & Bhubaneswar Flights']
  },
  {
    code: 'PYB', icao: 'VEJP', name: 'Jeypore Airport', city: 'Jeypore (Koraput)', state: 'Odisha',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '08/26 (1,200m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '28°C', condition: 'Pleasant', wind: '090° at 5 kt', visibility: '9,000m' },
    hubAirlines: ['IndiaOne Air'], lat: 18.8789, lng: 82.5539,
    features: ['Southern Odisha Tribal Heartland Access', 'HAL Sunabeda Aerospace Complex Access', 'Direct Bhubaneswar Flight']
  },
  {
    code: 'UKE', icao: 'VEUK', name: 'Utkela Airport', city: 'Utkela (Kalahandi)', state: 'Odisha',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '05/23 (920m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '29°C', condition: 'Sunny', wind: '100° at 5 kt', visibility: '9,000m' },
    hubAirlines: ['IndiaOne Air'], lat: 20.0989, lng: 83.1878,
    features: ['Kalahandi District Commercial Air Access (Inaugurated 2023)', 'UDAN Fixed Wing Service', 'Bhubaneswar Air Link']
  },
  {
    code: 'MLG', icao: 'VEMK', name: 'Malkangiri Airport', city: 'Malkangiri', state: 'Odisha',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '09/27 (1,620m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '30°C', condition: 'Sunny', wind: '120° at 5 kt', visibility: '9,000m' },
    hubAirlines: ['IndiaOne Air'], lat: 18.3489, lng: 81.8900,
    features: ['Inaugurated January 2024', 'Brings Remote Border District on India Aviation Map', 'Direct State Capital Link']
  },

  // Puducherry
  {
    code: 'PNY', icao: 'VOTR', name: 'Puducherry Airport', city: 'Puducherry (Lawspet)', state: 'Puducherry',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '07/25 (1,500m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '31°C', condition: 'Coastal Sun', wind: '120° at 8 kt', visibility: '10,000m' },
    hubAirlines: ['SpiceJet'], lat: 11.9689, lng: 79.8117,
    features: ['French Quarter & Auroville Gateway', 'Picturesque Coastal Aerodrome', 'Direct Hyderabad & Bengaluru Flights']
  },

  // Punjab Regional
  {
    code: 'AIP', icao: 'VIAX', name: 'Adampur Airport (Jalandhar)', city: 'Jalandhar (Adampur)', state: 'Punjab',
    terminals: ['New Civil Terminal Building'], defaultTerminal: 'Terminal 1', runways: '13/31 (2,743m IAF Base)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '25°C', condition: 'Sunny', wind: '320° at 6 kt', visibility: '8,000m' },
    hubAirlines: ['SpiceJet', 'Star Air'], lat: 31.4336, lng: 75.7583,
    features: ['Doaba NRI Belt Gateway (Inaugurated New Terminal 2024)', 'Direct Flights to Delhi, Mumbai, Nanded, Hindon', 'IAF MiG-29 Airbase Support']
  },
  {
    code: 'BUP', icao: 'VIBT', name: 'Bathinda Airport', city: 'Bathinda (Virk Kalan)', state: 'Punjab',
    terminals: ['Civil Enclave'], defaultTerminal: 'Terminal 1', runways: '13/31 (2,800m IAF Base)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '26°C', condition: 'Sunny', wind: '300° at 6 kt', visibility: '8,000m' },
    hubAirlines: ['Alliance Air', 'FlyBig'], lat: 30.2708, lng: 74.7578,
    features: ['Malwa Cotton & Thermal Power Belt Gateway', 'AIIMS Bathinda Proximity', 'Hindon & Delhi Flights']
  },
  {
    code: 'LUH', icao: 'VILD', name: 'Sahnewal Airport', city: 'Ludhiana', state: 'Punjab',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '12/30 (1,463m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '26°C', condition: 'Clear', wind: '310° at 6 kt', visibility: '7,000m' },
    hubAirlines: ['Alliance Air'], lat: 30.8550, lng: 75.9536,
    features: ['Manchester of India Industrial City Gateway', 'Bicycle & Hosiery Manufacturing Hub Flights', 'Direct Delhi Connection']
  },
  {
    code: 'IXP', icao: 'VIPK', name: 'Pathankot Airport', city: 'Pathankot', state: 'Punjab',
    terminals: ['Civil Enclave'], defaultTerminal: 'Terminal 1', runways: '01/19 (2,743m IAF Base)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '24°C', condition: 'Clear', wind: '330° at 5 kt', visibility: '9,000m' },
    hubAirlines: ['Alliance Air'], lat: 32.2339, lng: 75.6342,
    features: ['Tri-junction of Punjab, Himachal & J&K', 'Gateway to Dalhousie & Chamba', 'Direct Delhi Flights']
  },

  // Rajasthan Regional
  {
    code: 'UDR', icao: 'VAUD', name: 'Maharana Pratap Airport (Dabok)', city: 'Udaipur', state: 'Rajasthan',
    terminals: ['Integrated Terminal'], defaultTerminal: 'Terminal 1', runways: '08/26 (2,743m Cat-I ILS)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '29°C', condition: 'Sunny & Clear', wind: '260° at 7 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'Air India', 'SpiceJet', 'Vistara'], lat: 24.6178, lng: 73.8961,
    features: ['City of Lakes Destination Wedding Capital', 'Mewar Royal Heritage Murals', 'Direct Flights to 8 Major Metros']
  },
  {
    code: 'JDH', icao: 'VIJO', name: 'Jodhpur Airport', city: 'Jodhpur', state: 'Rajasthan',
    terminals: ['Civil Enclave (Expanding New Terminal)'], defaultTerminal: 'Terminal 1', runways: '05/23 (2,745m IAF Base)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '32°C', condition: 'Blue Sky', wind: '280° at 8 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'Air India', 'Star Air'], lat: 26.2511, lng: 73.0489,
    features: ['Blue City & Mehrangarh Fort Gateway', 'Handicrafts Export Hub', 'Direct Flights to Mumbai, Delhi, Bengaluru, Pune']
  },
  {
    code: 'JSA', icao: 'VIJR', name: 'Jaisalmer Airport', city: 'Jaisalmer', state: 'Rajasthan',
    terminals: ['Civil Enclave'], defaultTerminal: 'Terminal 1', runways: '06/24 (2,743m IAF Base)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '33°C', condition: 'Golden Desert Sun', wind: '270° at 9 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'SpiceJet'], lat: 26.8889, lng: 70.8653,
    features: ['Golden City Thar Desert Dunes Gateway', 'Intricate Jali Sandstone Architecture', 'Seasonal High-Frequency Desert Festival Flights']
  },
  {
    code: 'BKB', icao: 'VIBK', name: 'Nal Airport (Bikaner)', city: 'Bikaner', state: 'Rajasthan',
    terminals: ['Civil Enclave'], defaultTerminal: 'Terminal 1', runways: '05/23 (2,660m IAF Base)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '32°C', condition: 'Sunny', wind: '280° at 8 kt', visibility: '10,000m' },
    hubAirlines: ['Alliance Air'], lat: 28.0706, lng: 73.2064,
    features: ['Junagarh Fort & Bhujia Capital of India', 'Desert Cultural Gateway', 'Daily Delhi Connection']
  },
  {
    code: 'KQH', icao: 'VIKG', name: 'Kishangarh Airport (Ajmer)', city: 'Ajmer (Kishangarh)', state: 'Rajasthan',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '05/23 (2,000m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '30°C', condition: 'Dry & Clear', wind: '270° at 7 kt', visibility: '10,000m' },
    hubAirlines: ['Star Air', 'SpiceJet'], lat: 26.6022, lng: 74.8136,
    features: ['Ajmer Sharif Dargah & Pushkar Brahma Temple Gateway', 'Marble City of India', 'Bani Thani Painting Interior Facade']
  },
  {
    code: 'KTU', icao: 'VIKO', name: 'Kota Airport', city: 'Kota', state: 'Rajasthan',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '08/26 (1,220m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '31°C', condition: 'Sunny', wind: '250° at 7 kt', visibility: '9,000m' },
    hubAirlines: ['Regional Carriers'], lat: 25.1603, lng: 75.8456,
    features: ['Coaching Capital of India', 'Chambal River Heritage Valley', 'New Greenfield Airport Shambhopura in Progress']
  },

  // Tamil Nadu Regional
  {
    code: 'TCR', icao: 'VOTK', name: 'Tuticorin Airport', city: 'Thoothukudi (Tuticorin)', state: 'Tamil Nadu',
    terminals: ['New Upgraded Terminal (2024)'], defaultTerminal: 'Terminal 1', runways: '10/28 (3,115m Cat-I ILS)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '31°C', condition: 'Coastal Sun', wind: '110° at 9 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo'], lat: 8.7244, lng: 78.0264,
    features: ['Pearl City Port Gateway', 'Brand New 3,115m Runway Capable of A321 Jets', 'Direct Flights to Chennai & Bengaluru']
  },
  {
    code: 'SXV', icao: 'VOSM', name: 'Salem Airport', city: 'Salem (Kamalapuram)', state: 'Tamil Nadu',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '04/22 (1,829m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '31°C', condition: 'Clear', wind: '130° at 7 kt', visibility: '10,000m' },
    hubAirlines: ['Alliance Air', 'IndiGo'], lat: 11.7828, lng: 78.0644,
    features: ['Steel & Sago City Gateway', 'Yercaud Hill Station Access', 'Daily Flights to Chennai, Bengaluru, Kochi']
  },
  {
    code: 'NVY', icao: 'VONY', name: 'Neyveli Airport', city: 'Neyveli', state: 'Tamil Nadu',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '09/27 (1,200m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '32°C', condition: 'Sunny', wind: '120° at 7 kt', visibility: '9,000m' },
    hubAirlines: ['Commercial UDAN'], lat: 11.6144, lng: 79.4447,
    features: ['NLC India Lignite Corporation Town Access', 'Chidambaram Nataraja Temple Gateway', 'Modernized Regional Aerodrome']
  },

  // Telangana
  {
    code: 'BPM', icao: 'VOHY', name: 'Begumpet Airport', city: 'Hyderabad (Begumpet)', state: 'Telangana',
    terminals: ['Old Commercial Terminal & VIP Terminal'], defaultTerminal: 'Terminal 1', runways: '09/27 (3,231m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '29°C', condition: 'Warm', wind: '090° at 7 kt', visibility: '9,000m' },
    hubAirlines: ['Aviation Academy', 'Wings India Airshow Base'], lat: 17.4531, lng: 78.4678,
    features: ['Heart of Hyderabad City', 'Host to Wings India Global Aviation Summit', 'VIP & Charter Flight Hub']
  },

  // Uttar Pradesh Regional
  {
    code: 'IXD', icao: 'VEAB', name: 'Prayagraj Airport (Bamrauli)', city: 'Prayagraj (Allahabad)', state: 'Uttar Pradesh',
    terminals: ['New Integrated Civil Terminal'], defaultTerminal: 'Terminal 1', runways: '12/30 (2,560m Cat-I ILS)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '29°C', condition: 'Sunny', wind: '080° at 6 kt', visibility: '8,000m' },
    hubAirlines: ['IndiGo', 'Alliance Air'], lat: 25.4400, lng: 81.7339,
    features: ['Triveni Sangam Maha Kumbh Mela Gateway', 'One of India Oldest Commercial Aviation Bases', 'Direct Flights to 12 Indian Cities']
  },
  {
    code: 'KNU', icao: 'VICX', name: 'Kanpur Airport (Chakeri)', city: 'Kanpur', state: 'Uttar Pradesh',
    terminals: ['New Integrated Civil Terminal (2023)'], defaultTerminal: 'Terminal 1', runways: '09/27 (2,743m IAF Base)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '29°C', condition: 'Warm', wind: '080° at 6 kt', visibility: '8,000m' },
    hubAirlines: ['IndiGo'], lat: 26.4028, lng: 80.4125,
    features: ['Brand New 6,000 sqm Civil Terminal (Opened 2023)', 'Leather City & IIT Kanpur Gateway', 'Direct Mumbai, Delhi, Bengaluru Flights']
  },
  {
    code: 'GOP', icao: 'VEGK', name: 'Mahayogi Gorakhnath Airport', city: 'Gorakhpur', state: 'Uttar Pradesh',
    terminals: ['Civil Enclave (Expanding Terminal)'], defaultTerminal: 'Terminal 1', runways: '11/29 (2,743m IAF Base)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '28°C', condition: 'Sunny', wind: '090° at 5 kt', visibility: '8,000m' },
    hubAirlines: ['IndiGo', 'SpiceJet', 'Alliance Air'], lat: 26.7397, lng: 83.4497,
    features: ['Gorakhnath Math & Eastern UP Hub', 'Gateway to Nepal Lumbini Border', 'Direct Delhi, Mumbai, Kolkata, Hyderabad Flights']
  },
  {
    code: 'AGR', icao: 'VIAG', name: 'Pandit Deen Dayal Upadhyay Airport (Kheria)', city: 'Agra', state: 'Uttar Pradesh',
    terminals: ['Civil Enclave (New Civil Enclave underway)'], defaultTerminal: 'Terminal 1', runways: '05/23 (2,743m IAF Base)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '29°C', condition: 'Dry & Sunny', wind: '300° at 6 kt', visibility: '8,000m' },
    hubAirlines: ['IndiGo'], lat: 27.1558, lng: 77.9608,
    features: ['Taj Mahal World Wonder Gateway', 'Mughal Architecture Art Exhibits', 'Direct Flights to Mumbai, Bengaluru, Ahmedabad, Lucknow']
  },
  {
    code: 'BEK', icao: 'VIBY', name: 'Bareilly Airport', city: 'Bareilly (Trisula)', state: 'Uttar Pradesh',
    terminals: ['Civil Enclave'], defaultTerminal: 'Terminal 1', runways: '11/29 (2,743m IAF Base)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '27°C', condition: 'Clear', wind: '310° at 5 kt', visibility: '8,000m' },
    hubAirlines: ['IndiGo', 'Alliance Air'], lat: 28.4222, lng: 79.4506,
    features: ['Rohilkhand Region Center', 'Jim Corbett & Kumaon Hills Proximity', 'Direct Flights to Mumbai, Bengaluru, Delhi']
  },
  {
    code: 'IXH', icao: 'VIAH', name: 'Aligarh Airport', city: 'Aligarh', state: 'Uttar Pradesh',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '11/29 (1,500m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '28°C', condition: 'Clear', wind: '290° at 5 kt', visibility: '8,000m' },
    hubAirlines: ['FlyBig'], lat: 27.9333, lng: 78.1333,
    features: ['Inaugurated March 2024 by PM Modi', 'Lock & Hardware City / AMU Access', 'UDAN Flights to Lucknow & Delhi']
  },
  {
    code: 'AZH', icao: 'VIAZ', name: 'Azamgarh Airport', city: 'Azamgarh (Manduri)', state: 'Uttar Pradesh',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '09/27 (1,500m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '29°C', condition: 'Sunny', wind: '090° at 5 kt', visibility: '8,000m' },
    hubAirlines: ['FlyBig'], lat: 26.1550, lng: 83.1850,
    features: ['Inaugurated March 2024 by PM Modi', 'Purvanchal Expressway Direct Link', 'Daily Lucknow Flight Connection']
  },
  {
    code: 'CWK', icao: 'VICI', name: 'Chitrakoot Airport', city: 'Chitrakoot', state: 'Uttar Pradesh',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '08/26 (1,475m Tabletop)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '29°C', condition: 'Sunny', wind: '100° at 5 kt', visibility: '9,000m' },
    hubAirlines: ['FlyBig'], lat: 25.1789, lng: 80.8653,
    features: ['Inaugurated March 2024', 'Lord Rama Exile Pilgrimage Heritage', 'Tabletop Airstrip on Vindhya Hills']
  },
  {
    code: 'MBD', icao: 'VIMB', name: 'Moradabad Airport', city: 'Moradabad', state: 'Uttar Pradesh',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '05/23 (1,500m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '27°C', condition: 'Clear', wind: '320° at 5 kt', visibility: '8,000m' },
    hubAirlines: ['FlyBig'], lat: 28.8350, lng: 78.7750,
    features: ['Inaugurated March 2024', 'Brass City of India Export Gateway', 'Direct Lucknow Flight Link']
  },
  {
    code: 'SHV', icao: 'VISV', name: 'Shravasti Airport', city: 'Shravasti', state: 'Uttar Pradesh',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '09/27 (1,500m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '28°C', condition: 'Clear', wind: '080° at 5 kt', visibility: '8,000m' },
    hubAirlines: ['FlyBig'], lat: 27.5117, lng: 81.8797,
    features: ['Inaugurated March 2024', 'Ancient Buddhist Anathapindika Jetavana Heritage', 'Purvanchal Regional Flight Connection']
  },

  // Uttarakhand
  {
    code: 'DED', icao: 'VIDN', name: 'Dehradun Jolly Grant Airport', city: 'Dehradun', state: 'Uttarakhand',
    terminals: ['New Integrated Terminal Building (2024)'], defaultTerminal: 'Terminal 1', runways: '08/26 (2,140m Cat-I ILS)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '22°C', condition: 'Valley Fresh & Sunny', wind: '350° at 6 kt', visibility: '10,000m' },
    hubAirlines: ['IndiGo', 'Air India', 'SpiceJet', 'Alliance Air'], lat: 30.1897, lng: 78.1803,
    features: ['Gateway to Rishikesh Yoga Capital, Mussoorie & Char Dham', 'Brand New Glass-Front Eco Terminal', 'Direct Flights to 10 Major Indian Metros']
  },
  {
    code: 'PGH', icao: 'VIPT', name: 'Pantnagar Airport', city: 'Pantnagar (Udham Singh Nagar)', state: 'Uttarakhand',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '10/28 (1,372m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '24°C', condition: 'Sunny', wind: '330° at 5 kt', visibility: '9,000m' },
    hubAirlines: ['IndiGo', 'Alliance Air'], lat: 29.0322, lng: 79.4739,
    features: ['Gateway to Nainital Lake District, Bhimtal & Jim Corbett', 'GB Pant University Agricultural Center', 'Direct Delhi & Dehradun Flights']
  },
  {
    code: 'NNS', icao: 'VIDX', name: 'Naini Saini Airport', city: 'Pithoragarh', state: 'Uttarakhand',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '14/32 (1,600m High Altitude)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '17°C', condition: 'Alpine Breeze', wind: '010° at 5 kt', visibility: '10,000m' },
    hubAirlines: ['FlyBig'], lat: 29.5819, lng: 80.2444,
    features: ['Gateway to Kailash Mansarovar & Himalayas', 'Commercial Flights Resumed in 2024', 'Direct Dehradun & Hindon Flights']
  },

  // West Bengal Regional
  {
    code: 'RDP', icao: 'VEDG', name: 'Kazi Nazrul Islam Airport', city: 'Durgapur (Andal)', state: 'West Bengal',
    terminals: ['Integrated Terminal'], defaultTerminal: 'Terminal 1', runways: '16/34 (2,800m Cat-I ILS)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '30°C', condition: 'Sunny', wind: '180° at 6 kt', visibility: '9,000m' },
    hubAirlines: ['IndiGo', 'SpiceJet'], lat: 23.6231, lng: 87.2425,
    features: ['India first private-sector greenfield airport', 'Industrial Asansol-Durgapur Coal & Steel Belt', 'Direct Delhi, Mumbai, Bengaluru, Hyderabad Flights']
  },
  {
    code: 'COH', icao: 'VECO', name: 'Cooch Behar Airport', city: 'Cooch Behar', state: 'West Bengal',
    terminals: ['Terminal 1'], defaultTerminal: 'Terminal 1', runways: '04/22 (1,067m)', category: 'DOMESTIC_REGIONAL',
    weather: { temp: '26°C', condition: 'Pleasant', wind: '050° at 4 kt', visibility: '8,000m' },
    hubAirlines: ['IndiaOne Air'], lat: 26.3314, lng: 89.4678,
    features: ['Historic Royal Palace of Cooch Behar Access', 'Revived UDAN Flight Service', 'Direct Kolkata Flight Connection']
  },

  // Global Hubs Connected with India
  {
    code: 'DXB', icao: 'OMDB', name: 'Dubai International Airport', city: 'Dubai', state: 'Dubai', country: 'United Arab Emirates',
    terminals: ['Terminal 1', 'Terminal 2', 'Terminal 3 (Emirates A380 Hub)'], defaultTerminal: 'Terminal 3',
    runways: '12L/30R & 12R/30L (4,450m Cat III-B)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '36°C', condition: 'Sunny & Warm', wind: '310° at 14 kt', visibility: '10,000m' },
    hubAirlines: ['Emirates', 'Flydubai'], lat: 25.2532, lng: 55.3657,
    features: ['Busiest International Airport in the World', 'World Largest Terminal 3', '24/7 Duty Free Mega Mall']
  },
  {
    code: 'SIN', icao: 'WSSS', name: 'Singapore Changi Airport', city: 'Singapore', state: 'Singapore', country: 'Singapore',
    terminals: ['Terminal 1', 'Terminal 2', 'Terminal 3', 'Terminal 4', 'Jewel Changi'], defaultTerminal: 'Terminal 3',
    runways: '02L/20R & 02C/20C (4,000m Cat III-B)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '30°C', condition: 'Tropical Warmth', wind: '060° at 8 kt', visibility: '10,000m' },
    hubAirlines: ['Singapore Airlines', 'Scoot'], lat: 1.3644, lng: 103.9915,
    features: ['World Famous Jewel Rain Vortex Waterfall', 'Skytrax Multi-Award Winning Hub', 'Indoor Butterfly Garden']
  },
  {
    code: 'LHR', icao: 'EGLL', name: 'London Heathrow Airport', city: 'London', state: 'Greater London', country: 'United Kingdom',
    terminals: ['Terminal 2 (Queens)', 'Terminal 3', 'Terminal 4', 'Terminal 5 (British Airways)'], defaultTerminal: 'Terminal 4',
    runways: '09L/27R & 09R/27L (3,902m Cat III-B)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '16°C', condition: 'Overcast & Mild', wind: '220° at 12 kt', visibility: '10,000m' },
    hubAirlines: ['British Airways', 'Virgin Atlantic'], lat: 51.4700, lng: -0.4543,
    features: ['Elizabeth Line & Heathrow Express to Central London', 'Europe Busiest International Hub', 'Plaza Premium Lounge T4']
  },
  {
    code: 'JFK', icao: 'KJFK', name: 'John F. Kennedy International Airport', city: 'New York', state: 'New York', country: 'United States',
    terminals: ['Terminal 1', 'Terminal 4', 'Terminal 5', 'Terminal 7', 'Terminal 8'], defaultTerminal: 'Terminal 4',
    runways: '04L/22R & 13L/31R & 04R/22L & 13R/31L (4,423m)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '18°C', condition: 'Clear & Breezy', wind: '310° at 15 kt', visibility: '10,000m' },
    hubAirlines: ['Delta Air Lines', 'American Airlines'], lat: 40.6413, lng: -73.7781,
    features: ['Flagship Transatlantic Hub', 'AirTrain JFK Connection to NYC Subway', 'Air India Direct Nonstop Base']
  },
  {
    code: 'DOH', icao: 'OTHH', name: 'Hamad International Airport', city: 'Doha', state: 'Doha', country: 'Qatar',
    terminals: ['Main Passenger Terminal (Concourses A - E)'], defaultTerminal: 'Terminal 1',
    runways: '16L/34R (4,850m) & 16R/34L (4,250m)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '35°C', condition: 'Clear & Warm', wind: '340° at 12 kt', visibility: '10,000m' },
    hubAirlines: ['Qatar Airways'], lat: 25.2731, lng: 51.6081,
    features: ['The Orchard Tropical Garden', 'Al Mourjan Business Lounge', 'Skytrax 5-Star Hub']
  },
  {
    code: 'BKK', icao: 'VTBS', name: 'Suvarnabhumi Airport', city: 'Bangkok', state: 'Samut Prakan', country: 'Thailand',
    terminals: ['Main Passenger Terminal & Satellite SAT-1'], defaultTerminal: 'Terminal 1',
    runways: '01R/19L (4,000m) & 01L/19R (3,700m)', category: 'INTERNATIONAL_HUB',
    weather: { temp: '32°C', condition: 'Tropical Humid', wind: '180° at 7 kt', visibility: '8,000m' },
    hubAirlines: ['Thai Airways', 'Bangkok Airways'], lat: 13.6900, lng: 100.7501,
    features: ['World Tallest Freestanding ATC Tower', 'Airport Rail Link to City', 'Southeast Asia Transit Mega Hub']
  }
];

const processedAirports = rawAirports.map(ap => ({
  code: ap.code,
  icao: ap.icao,
  name: ap.name,
  city: ap.city,
  stateOrCountry: ap.state,
  country: ap.country || 'India',
  terminals: ap.terminals,
  defaultTerminal: ap.defaultTerminal,
  runways: ap.runways,
  category: ap.category,
  timezone: ap.country && ap.country !== 'India' 
    ? (ap.code === 'DXB' || ap.code === 'DOH' ? 'GST (UTC+4:00)' : ap.code === 'SIN' ? 'SGT (UTC+8:00)' : ap.code === 'BKK' ? 'ICT (UTC+7:00)' : ap.code === 'LHR' ? 'GMT/BST' : 'EST (UTC-5:00)')
    : 'IST (UTC+5:30)',
  weather: ap.weather,
  hubAirlines: ap.hubAirlines,
  lat: ap.lat,
  lng: ap.lng,
  features: ap.features
}));

const popularRoutes = [
  { source: 'DEL', dest: 'BOM', label: 'Delhi ⇄ Mumbai', tag: 'Busiest Metro Corridor', distance: '1,148 km', duration: '2h 15m' },
  { source: 'DEL', dest: 'BLR', label: 'Delhi ⇄ Bengaluru', tag: 'Silicon Capital Route', distance: '1,740 km', duration: '2h 45m' },
  { source: 'BOM', dest: 'BLR', label: 'Mumbai ⇄ Bengaluru', tag: 'Commercial Express', distance: '842 km', duration: '1h 40m' },
  { source: 'DEL', dest: 'AYJ', label: 'Delhi ⇄ Ayodhya', tag: 'Pilgrimage Express', distance: '550 km', duration: '1h 20m' },
  { source: 'DEL', dest: 'SXR', label: 'Delhi ⇄ Srinagar', tag: 'Paradise Valley Corridor', distance: '645 km', duration: '1h 30m' },
  { source: 'BOM', dest: 'GOI', label: 'Mumbai ⇄ Goa (Dabolim)', tag: 'Beach Holiday Express', distance: '435 km', duration: '1h 15m' },
  { source: 'DEL', dest: 'GOX', label: 'Delhi ⇄ Goa (Mopa)', tag: 'North Goa Sunshine Shuttle', distance: '1,500 km', duration: '2h 30m' },
  { source: 'DEL', dest: 'IXL', label: 'Delhi ⇄ Leh (Ladakh)', tag: 'High Altitude Himalayan', distance: '610 km', duration: '1h 25m' },
  { source: 'DEL', dest: 'VNS', label: 'Delhi ⇄ Varanasi', tag: 'Kashi Heritage Corridor', distance: '680 km', duration: '1h 25m' },
  { source: 'MAA', dest: 'IXZ', label: 'Chennai ⇄ Port Blair', tag: 'Bay of Bengal Express', distance: '1,370 km', duration: '2h 15m' },
  { source: 'CCU', dest: 'GAU', label: 'Kolkata ⇄ Guwahati', tag: 'Northeast Gateway', distance: '510 km', duration: '1h 15m' },
  { source: 'BLR', dest: 'COK', label: 'Bengaluru ⇄ Kochi', tag: 'South Spice Route', distance: '365 km', duration: '1h 05m' },
  { source: 'DEL', dest: 'DXB', label: 'Delhi ⇄ Dubai', tag: 'Gulf Mega Hub', distance: '2,185 km', duration: '3h 50m' },
  { source: 'BLR', dest: 'SIN', label: 'Bengaluru ⇄ Singapore', tag: 'Global Tech Link', distance: '3,180 km', duration: '4h 35m' },
  { source: 'DEL', dest: 'LHR', label: 'Delhi ⇄ London', tag: 'Flagship Transcontinental', distance: '6,710 km', duration: '9h 10m' }
];

const fileContent = `export interface Airport {
  code: string;           // IATA code (e.g. DEL)
  icao: string;           // ICAO code (e.g. VIDP)
  name: string;           // Official name (e.g. Indira Gandhi International Airport)
  city: string;           // City (e.g. New Delhi)
  stateOrCountry: string; // State or Country
  country: string;        // Country
  terminals: string[];    // e.g. ["T1", "T2", "T3"]
  defaultTerminal: string;// Default terminal for domestic/international
  runways: string;        // Runway info
  category: 'DOMESTIC_METRO' | 'DOMESTIC_REGIONAL' | 'INTERNATIONAL_HUB';
  timezone: string;       // Timezone
  weather: {
    temp: string;
    condition: string;
    wind: string;
    visibility: string;
  };
  hubAirlines: string[];
  lat: number;
  lng: number;
  features: string[];
}

export const REALISTIC_AIRPORTS: Airport[] = ${JSON.stringify(processedAirports, null, 2)};

export const POPULAR_ROUTES = ${JSON.stringify(popularRoutes, null, 2)};

export function getAirportByCode(code: string): Airport | undefined {
  if (!code) return undefined;
  return REALISTIC_AIRPORTS.find(a => a.code.toUpperCase() === code.toUpperCase().trim());
}

export function getAirportDisplayName(code: string): string {
  const ap = getAirportByCode(code);
  if (!ap) return code;
  return \`\${ap.city} (\${ap.code})\`;
}

export function getAirportsByState(stateName: string): Airport[] {
  const q = stateName.toLowerCase().trim();
  return REALISTIC_AIRPORTS.filter(a => a.stateOrCountry.toLowerCase().includes(q));
}

export const INDIAN_AIRPORTS_COUNT = REALISTIC_AIRPORTS.filter(a => a.country === 'India').length;
`;

const targetPath = path.resolve(process.cwd(), 'src/data/airports.ts');
fs.writeFileSync(targetPath, fileContent, 'utf-8');
console.log(`Successfully generated airports.ts with ${processedAirports.length} total airports (${rawAirports.filter(a => !a.country || a.country === 'India').length} operational airports across all states and UTs in India).`);
