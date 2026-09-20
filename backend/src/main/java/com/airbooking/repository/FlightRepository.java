package com.airbooking.repository;

import com.airbooking.enums.FlightStatus;
import com.airbooking.model.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    Optional<Flight> findByFlightNumber(String flightNumber);

    @Query("SELECT f FROM Flight f WHERE LOWER(f.source) = LOWER(:source) " +
           "AND LOWER(f.destination) = LOWER(:destination) " +
           "AND f.departureDate = :departureDate " +
           "AND f.availableSeats >= :passengers " +
           "AND f.status = :status " +
           "ORDER BY f.departureTime ASC")
    List<Flight> searchFlights(
            @Param("source") String source,
            @Param("destination") String destination,
            @Param("departureDate") LocalDate departureDate,
            @Param("passengers") Integer passengers,
            @Param("status") FlightStatus status
    );

    List<Flight> findByStatus(FlightStatus status);

    long countByStatus(FlightStatus status);
}
