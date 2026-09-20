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
 * Concrete implementation for UPI payment simulation.
 */
@Service("upiPaymentService")
public class UpiPaymentService implements PaymentService {

    @Override
    public Payment processPayment(Booking booking, BookingRequest request) {
        String vpa = request.getUpiVpa();
        if (vpa == null || !vpa.contains("@")) {
            throw new BadRequestException("Invalid UPI ID / VPA format. Example: username@okhdfcbank");
        }

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setPaymentMethod(PaymentMethod.UPI);
        payment.setAmount(booking.getTotalAmount());
        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentId("PAY-UPI-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setTransactionReference("UPI-REF-" + System.currentTimeMillis());
        return payment;
    }

    @Override
    public boolean processRefund(Payment payment) {
        payment.setPaymentStatus(PaymentStatus.REFUNDED);
        return true;
    }
}
