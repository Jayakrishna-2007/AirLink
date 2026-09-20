package com.airbooking.repository;

import com.airbooking.enums.SeatStatus;
import com.airbooking.model.Flight;
import com.airbooking.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByFlight(Flight flight);

    List<Seat> findByFlightIdOrderBySeatNumberAsc(Long flightId);

    Optional<Seat> findByFlightAndSeatNumber(Flight flight, String seatNumber);

    List<Seat> findByFlightAndSeatNumberIn(Flight flight, List<String> seatNumbers);

    long countByFlightAndStatus(Flight flight, SeatStatus status);
}
