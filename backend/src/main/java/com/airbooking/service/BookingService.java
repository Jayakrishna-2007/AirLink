package com.airbooking.service;

import com.airbooking.dto.BookingRequest;
import com.airbooking.dto.BookingResponse;
import com.airbooking.dto.FareBreakdownDto;
import com.airbooking.dto.PassengerDto;
import com.airbooking.enums.BookingStatus;
import com.airbooking.enums.UserRole;
import com.airbooking.exception.BadRequestException;
import com.airbooking.exception.ResourceNotFoundException;
import com.airbooking.exception.UnauthorizedException;
import com.airbooking.model.*;
import com.airbooking.repository.BookingRepository;
import com.airbooking.repository.FlightRepository;
import com.airbooking.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;
    private final FlightRepository flightRepository;
    private final FlightService flightService;
    private final SeatService seatService;
    private final PaymentServiceFactory paymentServiceFactory;
    private final PaymentRepository paymentRepository;
    private final TicketService ticketService;

    private static final String PNR_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    @Autowired
    public BookingService(
            BookingRepository bookingRepository,
            FlightRepository flightRepository,
            FlightService flightService,
            SeatService seatService,
            PaymentServiceFactory paymentServiceFactory,
            PaymentRepository paymentRepository,
            TicketService ticketService) {
        this.bookingRepository = bookingRepository;
        this.flightRepository = flightRepository;
        this.flightService = flightService;
        this.seatService = seatService;
        this.paymentServiceFactory = paymentServiceFactory;
        this.paymentRepository = paymentRepository;
        this.ticketService = ticketService;
    }

    /**
     * Complete transactional flight reservation pipeline.
     */
    public BookingResponse createBooking(User user, BookingRequest req) {
        if (req.getPassengers() == null || req.getPassengers().isEmpty()) {
            throw new BadRequestException("At least one passenger must be specified.");
        }

        // 1. Retrieve and validate flight
        Flight flight = flightService.getFlightEntity(req.getFlightId());
        int passengerCount = req.getPassengers().size();

        if (flight.getAvailableSeats() < passengerCount) {
            throw new BadRequestException("Insufficient seats available on this flight. Available: " + flight.getAvailableSeats());
        }

        // 2. Validate seat selection uniqueness
        List<String> seatNumbers = req.getPassengers().stream()
                .map(PassengerDto::getSeatNumber)
                .collect(Collectors.toList());

        long distinctSeats = seatNumbers.stream().distinct().count();
        if (distinctSeats != passengerCount) {
            throw new BadRequestException("Duplicate seats assigned to passengers in the same booking.");
        }

        // 3. Atomically reserve seats
        seatService.allocateSeats(flight, seatNumbers);

        // 4. Calculate exact monetary fare
        BigDecimal baseFare = flightService.getFareByClass(flight, req.getTravelClass());
        FareBreakdownDto breakdown = FareBreakdownDto.calculate(baseFare, passengerCount);

        // 5. Generate unique 6-character PNR
        String pnr = generateUniquePnr();

        // 6. Assemble Booking Entity
        Booking booking = new Booking();
        booking.setPnr(pnr);
        booking.setUser(user);
        booking.setFlight(flight);
        booking.setBookingDate(LocalDateTime.now());
        booking.setTravelClass(req.getTravelClass());
        booking.setTotalAmount(breakdown.getTotalAmount());
        booking.setBookingStatus(BookingStatus.CONFIRMED);

        // 7. Associate Passengers
        List<Passenger> passengers = new ArrayList<>();
        for (PassengerDto dto : req.getPassengers()) {
            Passenger p = new Passenger();
            p.setBooking(booking);
            p.setFullName(dto.getFullName());
            p.setDateOfBirth(dto.getDateOfBirth());
            p.setGender(dto.getGender());
            p.setNationality(dto.getNationality());
            p.setPassportId(dto.getPassportId());
            p.setEmail(dto.getEmail());
            p.setPhone(dto.getPhone());
            p.setSeatNumber(dto.getSeatNumber());
            passengers.add(p);
        }
        booking.setPassengers(passengers);

        // 8. Process Polymorphic Payment
        PaymentService paymentService = paymentServiceFactory.getPaymentService(req.getPaymentMethod());
        Payment payment = paymentService.processPayment(booking, req);
        booking.setPayment(payment);

        // 9. Update flight inventory
        flight.setAvailableSeats(flight.getAvailableSeats() - passengerCount);
        flightRepository.save(flight);

        // 10. Persist Booking
        Booking savedBooking = bookingRepository.save(booking);

        // 11. Generate Digital Ticket
        Ticket ticket = ticketService.generateTicket(savedBooking);
        savedBooking.setTicket(ticket);

        return BookingResponse.fromEntity(savedBooking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getUserBookings(User user) {
        return bookingRepository.findByUserOrderByBookingDateDesc(user).stream()
                .map(BookingResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingByPnr(String pnr, User user) {
        Booking booking = bookingRepository.findByPnr(pnr)
                .orElseThrow(() -> new ResourceNotFoundException("No booking found with PNR: " + pnr));

        // Authorization check: only owner or admin can view
        if (user.getRole() != UserRole.ADMIN && !booking.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to view this booking.");
        }

        return BookingResponse.fromEntity(booking);
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long id, User user) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        if (user.getRole() != UserRole.ADMIN && !booking.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to access this booking.");
        }

        return BookingResponse.fromEntity(booking);
    }

    /**
     * Cancel an existing booking, release seats, and issue simulated refund.
     */
    public BookingResponse cancelBooking(Long id, User user) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        // Authorization check
        if (user.getRole() != UserRole.ADMIN && !booking.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only cancel your own bookings.");
        }

        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("This booking has already been cancelled.");
        }

        // Release seats back to available inventory
        Flight flight = booking.getFlight();
        List<String> seatNumbers = booking.getPassengers().stream()
                .map(Passenger::getSeatNumber)
                .filter(s -> s != null && !s.isEmpty())
                .collect(Collectors.toList());

        if (!seatNumbers.isEmpty()) {
            seatService.releaseSeats(flight, seatNumbers);
            flight.setAvailableSeats(flight.getAvailableSeats() + seatNumbers.size());
            flightRepository.save(flight);
        }

        // Trigger payment refund simulation
        if (booking.getPayment() != null) {
            PaymentService paymentService = paymentServiceFactory.getPaymentService(booking.getPayment().getPaymentMethod());
            paymentService.processRefund(booking.getPayment());
            paymentRepository.save(booking.getPayment());
        }

        booking.setBookingStatus(BookingStatus.CANCELLED);
        Booking updated = bookingRepository.save(booking);

        return BookingResponse.fromEntity(updated);
    }

    private String generateUniquePnr() {
        for (int attempt = 0; attempt < 100; attempt++) {
            StringBuilder sb = new StringBuilder(6);
            for (int i = 0; i < 6; i++) {
                sb.append(PNR_CHARS.charAt(RANDOM.nextInt(PNR_CHARS.length())));
            }
            String candidate = sb.toString();
            if (!bookingRepository.existsByPnr(candidate)) {
                return candidate;
            }
        }
        return "BK" + (System.currentTimeMillis() % 10000);
    }
}
