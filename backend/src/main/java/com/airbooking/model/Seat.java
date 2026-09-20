package com.airbooking.model;

import com.airbooking.enums.SeatStatus;
import com.airbooking.enums.TravelClass;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

/**
 * Seat Entity for visual seat selection and aircraft cabin layout.
 */
@Entity
@Table(name = "seats", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"flight_id", "seat_number"})
})
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    @Column(name = "seat_number", nullable = false, length = 10)
    private String seatNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "seat_class", nullable = false)
    private TravelClass seatClass = TravelClass.ECONOMY;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeatStatus status = SeatStatus.AVAILABLE;

    public Seat() {
    }

    public Seat(Flight flight, String seatNumber, TravelClass seatClass, SeatStatus status) {
        this.flight = flight;
        this.seatNumber = seatNumber;
        this.seatClass = seatClass;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Flight getFlight() {
        return flight;
    }

    public void setFlight(Flight flight) {
        this.flight = flight;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public TravelClass getSeatClass() {
        return seatClass;
    }

    public void setSeatClass(TravelClass seatClass) {
        this.seatClass = seatClass;
    }

    public SeatStatus getStatus() {
        return status;
    }

    public void setStatus(SeatStatus status) {
        this.status = status;
    }
}
