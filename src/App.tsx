import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SkyBookSidebar, ActiveNav } from './components/SkyBookSidebar';
import { SkyBookTopBar } from './components/SkyBookTopBar';
import { SearchStepView } from './components/SearchStepView';
import { SelectFlightStepView } from './components/SelectFlightStepView';
import { PassengerAndPaymentStepView } from './components/PassengerAndPaymentStepView';
import { BookingConfirmationStepView } from './components/BookingConfirmationStepView';
import { MyBookings } from './components/MyBookings';
import { AdminDashboard } from './components/AdminDashboard';
import { VivaAcademicHub } from './components/VivaAcademicHub';
import { LoginPage } from './components/LoginPage';
import { TicketViewModal } from './components/TicketViewModal';
import { AirportGuideModal } from './components/AirportGuideModal';
import { ProfileModal } from './components/ProfileModal';
import { RealtimeFlightsView } from './components/RealtimeFlightsView';
import { WebsiteWatermarkFooter } from './components/WebsiteWatermarkFooter';
import { Flight, Booking, FlightSearchParams } from './types';
import { api } from './services/api';

function SkyBookMain() {
  const { user, isAuthenticated, logout } = useAuth();

  // Navigation State
  const [currentNav, setCurrentNav] = useState<ActiveNav>('HOME');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // 4-Step Booking Process State (1: Search, 2: Select Flight, 3: Passenger & Payment, 4: Confirmation)
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3 | 4>(1);

  // Search Parameters (defaults to Chennai MAA -> Bengaluru BLR as shown in user's design)
  const [searchParams, setSearchParams] = useState<FlightSearchParams>({
    source: 'MAA',
    destination: 'BLR',
    departureDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    passengers: 1,
    travelClass: 'ECONOMY',
  });

  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoadingFlights, setIsLoadingFlights] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Modals
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isAirportGuideOpen, setIsAirportGuideOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Initial load
  useEffect(() => {
    handleSearchFlights(searchParams, false);
  }, []);

  const handleSearchFlights = async (params: FlightSearchParams, advanceStep = true) => {
    setIsLoadingFlights(true);
    setSearchParams(params);
    try {
      const results = await api.searchFlights(params);
      setFlights(results);
      if (results.length > 0) {
        setSelectedFlight(results[0]);
      }
      if (advanceStep) {
        setBookingStep(2);
        setCurrentNav('SEARCH');
      }
    } catch (err) {
      console.error('Flight search error:', err);
    } finally {
      setIsLoadingFlights(false);
    }
  };

  const handleSelectFlightAndContinue = (flight: Flight) => {
    setSelectedFlight(flight);
    setBookingStep(3);
  };

  const handleBookingSuccess = (booking: Booking) => {
    setConfirmedBooking(booking);
    setBookingStep(4);
  };

  const handleCancelBooking = async (bookingId: number) => {
    try {
      await api.cancelBooking(bookingId);
      if (confirmedBooking && confirmedBooking.id === bookingId) {
        setConfirmedBooking({
          ...confirmedBooking,
          bookingStatus: 'CANCELLED',
        });
      }
      alert('Booking cancelled successfully and seats have been restored.');
    } catch (err: any) {
      alert('Cancellation failed: ' + (err.message || 'Server error'));
    }
  };

  const handleResetToSearch = () => {
    setBookingStep(1);
    setCurrentNav('HOME');
  };

  const handleBookRealtimeRoute = (sourceCode: string, destCode: string) => {
    const updatedParams: FlightSearchParams = {
      ...searchParams,
      source: sourceCode,
      destination: destCode,
    };
    handleSearchFlights(updatedParams, true);
  };

  const handleNavClick = (nav: ActiveNav) => {
    setCurrentNav(nav);
    setIsMobileSidebarOpen(false);
    if (nav === 'HOME') {
      setBookingStep(1);
    } else if (nav === 'SEARCH') {
      if (flights.length > 0 && selectedFlight) {
        setBookingStep(2);
      } else {
        setBookingStep(1);
      }
    } else if (nav === 'PROFILE') {
      setIsProfileModalOpen(true);
    }
  };

  // When opening website, open Login/Register page first, then continue booking if credentials are correct
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 bg-[#0B1E36] overflow-hidden">
        {/* Ambient Flight Sunset Clouds Backdrop */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/assets/aircraft-hero.jpg"
            alt="Airlink flight sky backdrop"
            className="w-full h-full object-cover opacity-20 filter blur-xs scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E36] via-[#0B1E36]/90 to-[#0B1E36]/75" />
        </div>

        <div className="relative z-10 w-full flex-1 flex items-center justify-center">
          <LoginPage
            onSuccessNavigate={() => {
              setBookingStep(1);
              setCurrentNav('HOME');
            }}
          />
        </div>
        <div className="relative z-10 w-full max-w-5xl">
          <WebsiteWatermarkFooter variant="dark" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FA] text-slate-900 flex flex-row selection:bg-blue-600 selection:text-white">
      
      {/* Desktop Left Deep Navy Sidebar */}
      <div className="hidden md:block">
        <SkyBookSidebar
          currentNav={currentNav}
          onNavigate={handleNavClick}
          onOpenAirportGuide={() => setIsAirportGuideOpen(true)}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileSidebarOpen(false)}
          ></div>
          <div className="relative z-10">
            <SkyBookSidebar
              currentNav={currentNav}
              onNavigate={handleNavClick}
              onOpenAirportGuide={() => {
                setIsMobileSidebarOpen(false);
                setIsAirportGuideOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Right View Canvas */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header Bar with Avatar in Top Right */}
        <SkyBookTopBar
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onNavigateToLogin={() => logout()}
          onNavigateToRealtime={() => setCurrentNav('REALTIME')}
        />

        {/* Dynamic Body Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          
          {/* Main 4-Step Flight Search & Booking Journey */}
          {(currentNav === 'HOME' || currentNav === 'SEARCH') && (
            <>
              {/* Step 1: Search Flights */}
              {bookingStep === 1 && (
                <SearchStepView
                  initialParams={searchParams}
                  onSearch={(params) => handleSearchFlights(params, true)}
                  isLoading={isLoadingFlights}
                  onNavigateToRealtime={() => setCurrentNav('REALTIME')}
                  onOpenProfile={() => setIsProfileModalOpen(true)}
                />
              )}

              {/* Step 2: Select Flight & Seat */}
              {bookingStep === 2 && (
                <SelectFlightStepView
                  searchParams={searchParams}
                  flights={flights}
                  selectedFlight={selectedFlight}
                  onSelectFlight={setSelectedFlight}
                  onBack={() => setBookingStep(1)}
                  onContinue={handleSelectFlightAndContinue}
                />
              )}

              {/* Step 3: Passenger Details & Payment */}
              {bookingStep === 3 && selectedFlight && (
                <PassengerAndPaymentStepView
                  flight={selectedFlight}
                  searchParams={searchParams}
                  onBack={() => setBookingStep(2)}
                  onBookingSuccess={handleBookingSuccess}
                />
              )}

              {/* Step 4: Booking Confirmation */}
              {bookingStep === 4 && confirmedBooking && (
                <BookingConfirmationStepView
                  booking={confirmedBooking}
                  onDownloadTicket={() => setIsTicketModalOpen(true)}
                  onManageBooking={() => setCurrentNav('BOOKINGS')}
                  onCancelBooking={handleCancelBooking}
                  onBookAnother={handleResetToSearch}
                />
              )}
            </>
          )}

          {/* Nav View: Realtime Flights & Radar */}
          {currentNav === 'REALTIME' && (
            <RealtimeFlightsView onBookFlightRoute={handleBookRealtimeRoute} />
          )}

          {/* Nav View: My Bookings */}
          {currentNav === 'BOOKINGS' && (
            <MyBookings onNavigateToSearch={handleResetToSearch} />
          )}

          {/* Nav View: Admin Portal */}
          {currentNav === 'ADMIN' && (
            <AdminDashboard />
          )}

          {/* Nav View: Academic Viva Hub */}
          {currentNav === 'VIVA' && (
            <VivaAcademicHub />
          )}

          {/* Website Bottom Watermark */}
          <WebsiteWatermarkFooter variant="light" />

        </main>
      </div>

      {/* Global Printable Boarding Pass Modal */}
      {isTicketModalOpen && confirmedBooking && (
        <TicketViewModal
          booking={confirmedBooking}
          onClose={() => setIsTicketModalOpen(false)}
          onCancelBooking={handleCancelBooking}
        />
      )}

      {/* Realistic Airport Radar Directory Modal */}
      {isAirportGuideOpen && (
        <AirportGuideModal
          isOpen={isAirportGuideOpen}
          onClose={() => setIsAirportGuideOpen(false)}
          onSelectAsOrigin={(code: string) => {
            setIsAirportGuideOpen(false);
            setSearchParams((prev) => ({
              ...prev,
              source: code,
            }));
            setBookingStep(1);
            setCurrentNav('HOME');
          }}
          onSelectAsDestination={(code: string) => {
            setIsAirportGuideOpen(false);
            setSearchParams((prev) => ({
              ...prev,
              destination: code,
            }));
            setBookingStep(1);
            setCurrentNav('HOME');
          }}
        />
      )}

      {/* User Profile Modal */}
      {isProfileModalOpen && (
        <ProfileModal
          onClose={() => setIsProfileModalOpen(false)}
          onOpenAdmin={() => setCurrentNav('ADMIN')}
          onNavigateToLogin={() => {
            setIsProfileModalOpen(false);
            logout();
          }}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SkyBookMain />
    </AuthProvider>
  );
}
