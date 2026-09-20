package com.airbooking.dto;

import com.airbooking.enums.TravelClass;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

public class FlightSearchRequest {

    @NotBlank(message = "Source airport code is required")
    private String source;

    @NotBlank(message = "Destination airport code is required")
    private String destination;

    @NotNull(message = "Departure date is required")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate departureDate;

    @Min(value = 1, message = "Passenger count must be at least 1")
    private Integer passengers = 1;

    private TravelClass travelClass = TravelClass.ECONOMY;

    // Optional filters
    private String airline;
    private Double maxPrice;
    private String departureTimeSlot; // MORNING, AFTERNOON, EVENING, NIGHT
    private String sortBy; // PRICE_ASC, PRICE_DESC, DURATION_ASC, TIME_ASC

    public FlightSearchRequest() {
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

    public Integer getPassengers() {
        return passengers;
    }

    public void setPassengers(Integer passengers) {
        this.passengers = passengers;
    }

    public TravelClass getTravelClass() {
        return travelClass;
    }

    public void setTravelClass(TravelClass travelClass) {
        this.travelClass = travelClass;
    }

    public String getAirline() {
        return airline;
    }

    public void setAirline(String airline) {
        this.airline = airline;
    }

    public Double getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(Double maxPrice) {
        this.maxPrice = maxPrice;
    }

    public String getDepartureTimeSlot() {
        return departureTimeSlot;
    }

    public void setDepartureTimeSlot(String departureTimeSlot) {
        this.departureTimeSlot = departureTimeSlot;
    }

    public String getSortBy() {
        return sortBy;
    }

    public void setSortBy(String sortBy) {
        this.sortBy = sortBy;
    }
}
