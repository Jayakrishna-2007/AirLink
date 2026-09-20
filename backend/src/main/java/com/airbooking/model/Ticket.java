package com.airbooking.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

/**
 * Ticket Entity issued upon confirmed booking.
 * Generates official ticket number and issuance timestamp.
 */
@Entity
@Table(name = "tickets", uniqueConstraints = {
        @UniqueConstraint(columnNames = "ticket_number")
})
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @NotBlank
    @Column(name = "ticket_number", nullable = false, unique = true, length = 30)
    private String ticketNumber;

    @NotNull
    @Column(name = "issued_at", nullable = false)
    private LocalDateTime issuedAt = LocalDateTime.now();

    @Column(name = "barcode_data")
    private String barcodeData;

    public Ticket() {
    }

    public Ticket(Booking booking, String ticketNumber) {
        this.booking = booking;
        this.ticketNumber = ticketNumber;
        this.issuedAt = LocalDateTime.now();
        this.barcodeData = "TKT-" + booking.getPnr() + "-" + ticketNumber;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public String getTicketNumber() {
        return ticketNumber;
    }

    public void setTicketNumber(String ticketNumber) {
        this.ticketNumber = ticketNumber;
    }

    public LocalDateTime getIssuedAt() {
        return issuedAt;
    }

    public void setIssuedAt(LocalDateTime issuedAt) {
        this.issuedAt = issuedAt;
    }

    public String getBarcodeData() {
        return barcodeData;
    }

    public void setBarcodeData(String barcodeData) {
        this.barcodeData = barcodeData;
    }
}
