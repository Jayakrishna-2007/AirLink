package com.airbooking.repository;

import com.airbooking.enums.BookingStatus;
import com.airbooking.model.Booking;
import com.airbooking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByPnr(String pnr);

    boolean existsByPnr(String pnr);

    List<Booking> findByUserOrderByBookingDateDesc(User user);

    List<Booking> findByUserIdOrderByBookingDateDesc(Long userId);

    long countByBookingStatus(BookingStatus status);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.bookingStatus = 'CONFIRMED'")
    BigDecimal calculateTotalRevenue();
}
