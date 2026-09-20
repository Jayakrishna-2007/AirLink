package com.airbooking.service;

import com.airbooking.dto.AdminDashboardDto;
import com.airbooking.enums.BookingStatus;
import com.airbooking.repository.BookingRepository;
import com.airbooking.repository.FlightRepository;
import com.airbooking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@Transactional(readOnly = true)
public class AdminService {

    private final UserRepository userRepository;
    private final FlightRepository flightRepository;
    private final BookingRepository bookingRepository;

    @Autowired
    public AdminService(
            UserRepository userRepository,
            FlightRepository flightRepository,
            BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.flightRepository = flightRepository;
        this.bookingRepository = bookingRepository;
    }

    /**
     * Compute real-time analytics from database aggregates.
     */
    public AdminDashboardDto getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalFlights = flightRepository.count();
        long totalBookings = bookingRepository.count();
        long confirmed = bookingRepository.countByBookingStatus(BookingStatus.CONFIRMED);
        long cancelled = bookingRepository.countByBookingStatus(BookingStatus.CANCELLED);
        BigDecimal revenue = bookingRepository.calculateTotalRevenue();

        return new AdminDashboardDto(
                totalUsers,
                totalFlights,
                totalBookings,
                confirmed,
                cancelled,
                revenue != null ? revenue : BigDecimal.ZERO
        );
    }
}
