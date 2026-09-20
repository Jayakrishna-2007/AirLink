package com.airbooking.repository;

import com.airbooking.model.Booking;
import com.airbooking.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Optional<Ticket> findByTicketNumber(String ticketNumber);
    Optional<Ticket> findByBooking(Booking booking);
}
