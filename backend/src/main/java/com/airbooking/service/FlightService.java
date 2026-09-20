package com.airbooking.service;

import com.airbooking.dto.FlightDto;
import com.airbooking.dto.FlightSearchRequest;
import com.airbooking.enums.FlightStatus;
import com.airbooking.enums.SeatStatus;
import com.airbooking.enums.TravelClass;
import com.airbooking.exception.BadRequestException;
import com.airbooking.exception.ResourceNotFoundException;
import com.airbooking.model.Flight;
import com.airbooking.model.Seat;
import com.airbooking.repository.FlightRepository;
import com.airbooking.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FlightService {

    private final FlightRepository flightRepository;
    private final SeatRepository seatRepository;

    @Autowired
    public FlightService(FlightRepository flightRepository, SeatRepository seatRepository) {
        this.flightRepository = flightRepository;
        this.seatRepository = seatRepository;
    }

    @Transactional(readOnly = true)
    public List<FlightDto> getAllFlights() {
        return flightRepository.findAll().stream()
                .map(FlightDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FlightDto getFlightById(Long id) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with ID: " + id));
        return FlightDto.fromEntity(flight);
    }

    public Flight getFlightEntity(Long id) {
        return flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<FlightDto> searchFlights(FlightSearchRequest req) {
        if (req.getSource().equalsIgnoreCase(req.getDestination())) {
            throw new BadRequestException("Source and Destination airports cannot be identical.");
        }

        List<Flight> flights = flightRepository.searchFlights(
                req.getSource(),
                req.getDestination(),
                req.getDepartureDate(),
                req.getPassengers() != null ? req.getPassengers() : 1,
                FlightStatus.SCHEDULED
        );

        // In-memory stream filtering for optional dynamic filters
        return flights.stream()
                .filter(f -> req.getAirline() == null || req.getAirline().trim().isEmpty() || f.getAirline().equalsIgnoreCase(req.getAirline()))
                .filter(f -> {
                    if (req.getMaxPrice() == null) return true;
                    BigDecimal fare = getFareByClass(f, req.getTravelClass());
                    return fare.compareTo(BigDecimal.valueOf(req.getMaxPrice())) <= 0;
                })
                .filter(f -> {
                    if (req.getDepartureTimeSlot() == null || req.getDepartureTimeSlot().equalsIgnoreCase("ALL")) return true;
                    int hour = f.getDepartureTime().getHour();
                    switch (req.getDepartureTimeSlot().toUpperCase()) {
                        case "MORNING": return hour >= 4 && hour < 12;
                        case "AFTERNOON": return hour >= 12 && hour < 17;
                        case "EVENING": return hour >= 17 && hour < 21;
                        case "NIGHT": return hour >= 21 || hour < 4;
                        default: return true;
                    }
                })
                .sorted((f1, f2) -> {
                    if (req.getSortBy() == null) return 0;
                    switch (req.getSortBy().toUpperCase()) {
                        case "PRICE_ASC":
                            return getFareByClass(f1, req.getTravelClass()).compareTo(getFareByClass(f2, req.getTravelClass()));
                        case "PRICE_DESC":
                            return getFareByClass(f2, req.getTravelClass()).compareTo(getFareByClass(f1, req.getTravelClass()));
                        case "DURATION_ASC":
                            return f1.getDuration().compareTo(f2.getDuration());
                        case "TIME_ASC":
                            return f1.getDepartureTime().compareTo(f2.getDepartureTime());
                        default:
                            return 0;
                    }
                })
                .map(FlightDto::fromEntity)
                .collect(Collectors.toList());
    }

    public BigDecimal getFareByClass(Flight f, TravelClass travelClass) {
        if (travelClass == null) travelClass = TravelClass.ECONOMY;
        switch (travelClass) {
            case PREMIUM_ECONOMY:
                return f.getPremiumFare();
            case BUSINESS:
                return f.getBusinessFare();
            case FIRST_CLASS:
                return f.getFirstClassFare();
            case ECONOMY:
            default:
                return f.getEconomyFare();
        }
    }

    public FlightDto createFlight(Flight flight) {
        if (flightRepository.findByFlightNumber(flight.getFlightNumber()).isPresent()) {
            throw new BadRequestException("Flight number " + flight.getFlightNumber() + " already exists.");
        }
        
        flight.setAvailableSeats(flight.getTotalSeats());
        Flight saved = flightRepository.save(flight);

        // Generate initial seat layout (e.g. 30 rows x 6 seats: A,B,C,D,E,F)
        initializeSeatsForFlight(saved);
        
        return FlightDto.fromEntity(saved);
    }

    public FlightDto updateFlight(Long id, Flight updated) {
        Flight existing = getFlightEntity(id);
        existing.setAirline(updated.getAirline());
        existing.setFlightNumber(updated.getFlightNumber());
        existing.setSource(updated.getSource());
        existing.setDestination(updated.getDestination());
        existing.setDepartureDate(updated.getDepartureDate());
        existing.setDepartureTime(updated.getDepartureTime());
        existing.setArrivalDate(updated.getArrivalDate());
        existing.setArrivalTime(updated.getArrivalTime());
        existing.setDuration(updated.getDuration());
        existing.setAircraft(updated.getAircraft());
        existing.setEconomyFare(updated.getEconomyFare());
        existing.setPremiumFare(updated.getPremiumFare());
        existing.setBusinessFare(updated.getBusinessFare());
        existing.setFirstClassFare(updated.getFirstClassFare());
        existing.setStatus(updated.getStatus());

        return FlightDto.fromEntity(flightRepository.save(existing));
    }

    public void deleteFlight(Long id) {
        Flight flight = getFlightEntity(id);
        flightRepository.delete(flight);
    }

    public void initializeSeatsForFlight(Flight flight) {
        List<Seat> seats = new ArrayList<>();
        int rows = Math.max(10, flight.getTotalSeats() / 6);
        String[] cols = {"A", "B", "C", "D", "E", "F"};

        for (int r = 1; r <= rows; r++) {
            TravelClass seatClass;
            if (r <= 2) {
                seatClass = TravelClass.FIRST_CLASS;
            } else if (r <= 5) {
                seatClass = TravelClass.BUSINESS;
            } else if (r <= 8) {
                seatClass = TravelClass.PREMIUM_ECONOMY;
            } else {
                seatClass = TravelClass.ECONOMY;
            }

            for (String col : cols) {
                Seat s = new Seat();
                s.setFlight(flight);
                s.setSeatNumber(r + col);
                s.setSeatClass(seatClass);
                s.setStatus(SeatStatus.AVAILABLE);
                seats.add(s);
            }
        }
        seatRepository.saveAll(seats);
    }
}
