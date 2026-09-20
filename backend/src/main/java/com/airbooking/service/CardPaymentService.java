package com.airbooking.service;

import com.airbooking.dto.BookingRequest;
import com.airbooking.enums.PaymentMethod;
import com.airbooking.enums.PaymentStatus;
import com.airbooking.exception.BadRequestException;
import com.airbooking.model.Booking;
import com.airbooking.model.Payment;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Concrete implementation for Credit & Debit Card payment simulation.
 */
@Service("cardPaymentService")
public class CardPaymentService implements PaymentService {

    @Override
    public Payment processPayment(Booking booking, BookingRequest request) {
        String cardNumber = request.getCardNumber();
        if (cardNumber == null || cardNumber.replaceAll("\\s+", "").length() < 12) {
            throw new BadRequestException("Invalid card number format. Minimum 12-16 digits required.");
        }
        if (request.getCardExpiry() == null || !request.getCardExpiry().matches("^(0[1-9]|1[0-2])/?([0-9]{2})$")) {
            throw new BadRequestException("Invalid card expiration date. Expected MM/YY format.");
        }
        if (request.getCardCvv() == null || request.getCardCvv().length() < 3) {
            throw new BadRequestException("Invalid CVV format.");
        }

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : PaymentMethod.CREDIT_CARD);
        payment.setAmount(booking.getTotalAmount());
        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentId("PAY-CRD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        
        String cleanNumber = cardNumber.replaceAll("\\s+", "");
        String masked = "XXXX-XXXX-XXXX-" + cleanNumber.substring(cleanNumber.length() - 4);
        payment.setTransactionReference("CARD-AUTH-" + masked);
        return payment;
    }

    @Override
    public boolean processRefund(Payment payment) {
        payment.setPaymentStatus(PaymentStatus.REFUNDED);
        return true;
    }
}
