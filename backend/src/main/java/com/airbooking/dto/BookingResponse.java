package com.airbooking.dto;

import com.airbooking.enums.BookingStatus;
import com.airbooking.enums.PaymentMethod;
import com.airbooking.enums.PaymentStatus;
import com.airbooking.enums.TravelClass;
import com.airbooking.model.Booking;
import com.airbooking.model.Passenger;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class BookingResponse {

    private Long id;
    private String pnr;
    private BookingStatus bookingStatus;
    private LocalDateTime bookingDate;
    private TravelClass travelClass;
    private BigDecimal totalAmount;

    // User summary
    private Long userId;
    private String userName;
    private String userEmail;

    // Flight summary
    private FlightDto flight;

    // Passengers
    private List<PassengerDto> passengers;

    // Payment details
    private String paymentId;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;

    // Ticket details
    private String ticketNumber;
    private LocalDateTime ticketIssuedAt;

    public BookingResponse() {
    }

    public static BookingResponse fromEntity(Booking b) {
        BookingResponse res = new BookingResponse();
        res.setId(b.getId());
        res.setPnr(b.getPnr());
        res.setBookingStatus(b.getBookingStatus());
        res.setBookingDate(b.getBookingDate());
        res.setTravelClass(b.getTravelClass());
        res.setTotalAmount(b.getTotalAmount());

        if (b.getUser() != null) {
            res.setUserId(b.getUser().getId());
            res.setUserName(b.getUser().getName());
            res.setUserEmail(b.getUser().getEmail());
        }

        if (b.getFlight() != null) {
            res.setFlight(FlightDto.fromEntity(b.getFlight()));
        }

        if (b.getPassengers() != null) {
            res.setPassengers(b.getPassengers().stream().map(p -> {
                PassengerDto pd = new PassengerDto();
                pd.setId(p.getId());
                pd.setFullName(p.getFullName());
                pd.setDateOfBirth(p.getDateOfBirth());
                pd.setGender(p.getGender());
                pd.setNationality(p.getNationality());
                pd.setPassportId(p.getPassportId());
                pd.setEmail(p.getEmail());
                pd.setPhone(p.getPhone());
                pd.setSeatNumber(p.getSeatNumber());
                return pd;
            }).collect(Collectors.toList()));
        }

        if (b.getPayment() != null) {
            res.setPaymentId(b.getPayment().getPaymentId());
            res.setPaymentMethod(b.getPayment().getPaymentMethod());
            res.setPaymentStatus(b.getPayment().getPaymentStatus());
        }

        if (b.getTicket() != null) {
            res.setTicketNumber(b.getTicket().getTicketNumber());
            res.setTicketIssuedAt(b.getTicket().getIssuedAt());
        }

        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPnr() {
        return pnr;
    }

    public void setPnr(String pnr) {
        this.pnr = pnr;
    }

    public BookingStatus getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(BookingStatus bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }

    public TravelClass getTravelClass() {
        return travelClass;
    }

    public void setTravelClass(TravelClass travelClass) {
        this.travelClass = travelClass;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public FlightDto getFlight() {
        return flight;
    }

    public void setFlight(FlightDto flight) {
        this.flight = flight;
    }

    public List<PassengerDto> getPassengers() {
        return passengers;
    }

    public void setPassengers(List<PassengerDto> passengers) {
        this.passengers = passengers;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getTicketNumber() {
        return ticketNumber;
    }

    public void setTicketNumber(String ticketNumber) {
        this.ticketNumber = ticketNumber;
    }

    public LocalDateTime getTicketIssuedAt() {
        return ticketIssuedAt;
    }

    public void setTicketIssuedAt(LocalDateTime ticketIssuedAt) {
        this.ticketIssuedAt = ticketIssuedAt;
    }
}
