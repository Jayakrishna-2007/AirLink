package com.airbooking.service;

import com.airbooking.enums.SeatStatus;
import com.airbooking.exception.ResourceNotFoundException;
import com.airbooking.exception.SeatUnavailableException;
import com.airbooking.model.Flight;
import com.airbooking.model.Seat;
import com.airbooking.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SeatService {

    private final SeatRepository seatRepository;

    @Autowired
    public SeatService(SeatRepository seatRepository) {
        this.seatRepository = seatRepository;
    }

    @Transactional(readOnly = true)
    public List<Seat> getSeatsByFlight(Long flightId) {
        return seatRepository.findByFlightIdOrderBySeatNumberAsc(flightId);
    }

    /**
     * Transactional seat reservation with SERIALIZABLE/REPEATABLE_READ isolation
     * to prevent race conditions when concurrent users select the same seat.
     */
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public void allocateSeats(Flight flight, List<String> seatNumbers) {
        List<Seat> seats = seatRepository.findByFlightAndSeatNumberIn(flight, seatNumbers);

        if (seats.size() != seatNumbers.size()) {
            throw new ResourceNotFoundException("One or more selected seats do not exist on flight " + flight.getFlightNumber());
        }

        for (Seat seat : seats) {
            if (seat.getStatus() == SeatStatus.OCCUPIED) {
                throw new SeatUnavailableException("Seat " + seat.getSeatNumber() + " is already occupied. Please select another seat.");
            }
            seat.setStatus(SeatStatus.OCCUPIED);
        }

        seatRepository.saveAll(seats);
    }

    /**
     * Release seats upon booking cancellation.
     */
    @Transactional
    public void releaseSeats(Flight flight, List<String> seatNumbers) {
        List<Seat> seats = seatRepository.findByFlightAndSeatNumberIn(flight, seatNumbers);
        for (Seat seat : seats) {
            seat.setStatus(SeatStatus.AVAILABLE);
        }
        seatRepository.saveAll(seats);
    }
}
