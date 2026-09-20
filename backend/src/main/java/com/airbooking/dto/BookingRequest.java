package com.airbooking.dto;

import com.airbooking.enums.PaymentMethod;
import com.airbooking.enums.TravelClass;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class BookingRequest {

    @NotNull(message = "Flight ID is required")
    private Long flightId;

    @NotNull(message = "Travel class is required")
    private TravelClass travelClass = TravelClass.ECONOMY;

    @NotEmpty(message = "At least one passenger is required")
    @Valid
    private List<PassengerDto> passengers;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod = PaymentMethod.UPI;

    // Simulated payment fields
    private String upiVpa;
    private String cardNumber;
    private String cardExpiry;
    private String cardCvv;
    private String cardHolderName;
    private String bankName;

    public BookingRequest() {
    }

    public Long getFlightId() {
        return flightId;
    }

    public void setFlightId(Long flightId) {
        this.flightId = flightId;
    }

    public TravelClass getTravelClass() {
        return travelClass;
    }

    public void setTravelClass(TravelClass travelClass) {
        this.travelClass = travelClass;
    }

    public List<PassengerDto> getPassengers() {
        return passengers;
    }

    public void setPassengers(List<PassengerDto> passengers) {
        this.passengers = passengers;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getUpiVpa() {
        return upiVpa;
    }

    public void setUpiVpa(String upiVpa) {
        this.upiVpa = upiVpa;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getCardExpiry() {
        return cardExpiry;
    }

    public void setCardExpiry(String cardExpiry) {
        this.cardExpiry = cardExpiry;
    }

    public String getCardCvv() {
        return cardCvv;
    }

    public void setCardCvv(String cardCvv) {
        this.cardCvv = cardCvv;
    }

    public String getCardHolderName() {
        return cardHolderName;
    }

    public void setCardHolderName(String cardHolderName) {
        this.cardHolderName = cardHolderName;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }
}
