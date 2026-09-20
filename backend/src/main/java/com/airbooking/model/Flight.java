package com.airbooking.model;

import com.airbooking.enums.FlightStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Flight Entity representing scheduled flights with fare models.
 * Monetary amounts use BigDecimal for financial precision.
 */
@Entity
@Table(name = "flights")
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Airline name is required")
    @Column(nullable = false)
    private String airline;

    @NotBlank(message = "Flight number is required")
    @Column(name = "flight_number", nullable = false)
    private String flightNumber;

    @NotBlank(message = "Source airport is required")
    @Column(nullable = false, length = 10)
    private String source;

    @NotBlank(message = "Destination airport is required")
    @Column(nullable = false, length = 10)
    private String destination;

    @NotNull(message = "Departure date is required")
    @Column(name = "departure_date", nullable = false)
    private LocalDate departureDate;

    @NotNull(message = "Departure time is required")
    @Column(name = "departure_time", nullable = false)
    private LocalTime departureTime;

    @NotNull(message = "Arrival date is required")
    @Column(name = "arrival_date", nullable = false)
    private LocalDate arrivalDate;

    @NotNull(message = "Arrival time is required")
    @Column(name = "arrival_time", nullable = false)
    private LocalTime arrivalTime;

    @NotBlank(message = "Duration is required")
    @Column(nullable = false)
    private String duration;

    @NotBlank(message = "Aircraft type is required")
    @Column(nullable = false)
    private String aircraft;

    @NotNull
    @Column(name = "total_seats", nullable = false)
    private Integer totalSeats = 180;

    @NotNull
    @Column(name = "available_seats", nullable = false)
    private Integer availableSeats = 180;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(name = "economy_fare", nullable = false, precision = 10, scale = 2)
    private BigDecimal economyFare;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(name = "premium_fare", nullable = false, precision = 10, scale = 2)
    private BigDecimal premiumFare;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(name = "business_fare", nullable = false, precision = 10, scale = 2)
    private BigDecimal businessFare;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(name = "first_class_fare", nullable = false, precision = 10, scale = 2)
    private BigDecimal firstClassFare;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FlightStatus status = FlightStatus.SCHEDULED;

    @OneToMany(mappedBy = "flight", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Seat> seats = new ArrayList<>();

    public Flight() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAirline() {
        return airline;
    }

    public void setAirline(String airline) {
        this.airline = airline;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public LocalDate getDepartureDate() {
        return departureDate;
    }

    public void setDepartureDate(LocalDate departureDate) {
        this.departureDate = departureDate;
    }

    public LocalTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalTime departureTime) {
        this.departureTime = departureTime;
    }

    public LocalDate getArrivalDate() {
        return arrivalDate;
    }

    public void setArrivalDate(LocalDate arrivalDate) {
        this.arrivalDate = arrivalDate;
    }

    public LocalTime getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(LocalTime arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getAircraft() {
        return aircraft;
    }

    public void setAircraft(String aircraft) {
        this.aircraft = aircraft;
    }

    public Integer getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }

    public BigDecimal getEconomyFare() {
        return economyFare;
    }

    public void setEconomyFare(BigDecimal economyFare) {
        this.economyFare = economyFare;
    }

    public BigDecimal getPremiumFare() {
        return premiumFare;
    }

    public void setPremiumFare(BigDecimal premiumFare) {
        this.premiumFare = premiumFare;
    }

    public BigDecimal getBusinessFare() {
        return businessFare;
    }

    public void setBusinessFare(BigDecimal businessFare) {
        this.businessFare = businessFare;
    }

    public BigDecimal getFirstClassFare() {
        return firstClassFare;
    }

    public void setFirstClassFare(BigDecimal firstClassFare) {
        this.firstClassFare = firstClassFare;
    }

    public FlightStatus getStatus() {
        return status;
    }

    public void setStatus(FlightStatus status) {
        this.status = status;
    }

    public List<Seat> getSeats() {
        return seats;
    }

    public void setSeats(List<Seat> seats) {
        this.seats = seats;
    }
}
