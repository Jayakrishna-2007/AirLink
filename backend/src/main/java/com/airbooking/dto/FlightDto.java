package com.airbooking.dto;

import com.airbooking.enums.FlightStatus;
import com.airbooking.model.Flight;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public class FlightDto {

    private Long id;
    private String airline;
    private String flightNumber;
    private String source;
    private String destination;
    private LocalDate departureDate;
    private LocalTime departureTime;
    private LocalDate arrivalDate;
    private LocalTime arrivalTime;
    private String duration;
    private String aircraft;
    private Integer totalSeats;
    private Integer availableSeats;
    private BigDecimal economyFare;
    private BigDecimal premiumFare;
    private BigDecimal businessFare;
    private BigDecimal firstClassFare;
    private FlightStatus status;

    public FlightDto() {
    }

    public static FlightDto fromEntity(Flight f) {
        FlightDto dto = new FlightDto();
        dto.setId(f.getId());
        dto.setAirline(f.getAirline());
        dto.setFlightNumber(f.getFlightNumber());
        dto.setSource(f.getSource());
        dto.setDestination(f.getDestination());
        dto.setDepartureDate(f.getDepartureDate());
        dto.setDepartureTime(f.getDepartureTime());
        dto.setArrivalDate(f.getArrivalDate());
        dto.setArrivalTime(f.getArrivalTime());
        dto.setDuration(f.getDuration());
        dto.setAircraft(f.getAircraft());
        dto.setTotalSeats(f.getTotalSeats());
        dto.setAvailableSeats(f.getAvailableSeats());
        dto.setEconomyFare(f.getEconomyFare());
        dto.setPremiumFare(f.getPremiumFare());
        dto.setBusinessFare(f.getBusinessFare());
        dto.setFirstClassFare(f.getFirstClassFare());
        dto.setStatus(f.getStatus());
        return dto;
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
}
