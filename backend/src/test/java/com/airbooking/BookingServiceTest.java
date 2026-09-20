package com.airbooking;

import com.airbooking.dto.FareBreakdownDto;
import com.airbooking.enums.BookingStatus;
import com.airbooking.enums.TravelClass;
import com.airbooking.model.Booking;
import com.airbooking.model.Flight;
import com.airbooking.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Unit Tests for Airplane Booking Domain Logic")
class BookingServiceTest {

    private Flight sampleFlight;
    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleFlight = new Flight();
        sampleFlight.setId(1L);
        sampleFlight.setAirline("Air India");
        sampleFlight.setFlightNumber("AI-102");
        sampleFlight.setSource("DEL");
        sampleFlight.setDestination("BOM");
        sampleFlight.setDepartureDate(LocalDate.now().plusDays(2));
        sampleFlight.setDepartureTime(LocalTime.of(6, 0));
        sampleFlight.setArrivalDate(LocalDate.now().plusDays(2));
        sampleFlight.setArrivalTime(LocalTime.of(8, 15));
        sampleFlight.setDuration("2h 15m");
        sampleFlight.setAircraft("Airbus A320neo");
        sampleFlight.setTotalSeats(180);
        sampleFlight.setAvailableSeats(180);
        sampleFlight.setEconomyFare(new BigDecimal("5000.00"));
        sampleFlight.setPremiumFare(new BigDecimal("8000.00"));
        sampleFlight.setBusinessFare(new BigDecimal("15000.00"));
        sampleFlight.setFirstClassFare(new BigDecimal("22000.00"));

        sampleUser = new User();
        sampleUser.setId(2L);
        sampleUser.setName("Test Passenger");
        sampleUser.setEmail("passenger@test.com");
        sampleUser.setPhone("+919876543210");
    }

    @Test
    @DisplayName("Test Fare Calculation with BigDecimal Precision: Base + Taxes + Service Fee")
    void testFareBreakdownCalculation() {
        BigDecimal perPassengerFare = sampleFlight.getEconomyFare(); // 5000.00
        int passengers = 2;

        FareBreakdownDto breakdown = FareBreakdownDto.calculate(perPassengerFare, passengers);

        // Subtotal = 5000 * 2 = 10000.00
        assertEquals(new BigDecimal("10000.00"), breakdown.getBaseFareSubtotal());
        // Tax = 12% of 10000 = 1200.00
        assertEquals(new BigDecimal("1200.00"), breakdown.getTaxAmount());
        // Service fee = 250 * 2 = 500.00
        assertEquals(new BigDecimal("500.00"), breakdown.getServiceFee());
        // Total = 10000 + 1200 + 500 = 11700.00
        assertEquals(new BigDecimal("11700.00"), breakdown.getTotalAmount());
    }

    @Test
    @DisplayName("Test Booking Entity Invariants and Status")
    void testBookingStatusTransitions() {
        Booking booking = new Booking();
        booking.setPnr("AB12CD");
        booking.setUser(sampleUser);
        booking.setFlight(sampleFlight);
        booking.setTravelClass(TravelClass.ECONOMY);
        booking.setTotalAmount(new BigDecimal("5850.00"));
        booking.setBookingStatus(BookingStatus.CONFIRMED);

        assertEquals("AB12CD", booking.getPnr());
        assertEquals(BookingStatus.CONFIRMED, booking.getBookingStatus());

        // Cancel booking
        booking.setBookingStatus(BookingStatus.CANCELLED);
        assertEquals(BookingStatus.CANCELLED, booking.getBookingStatus());
    }
}
