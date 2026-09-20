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
 * Concrete implementation for Net Banking payment simulation.
 */
@Service("netBankingPaymentService")
public class NetBankingPaymentService implements PaymentService {

    @Override
    public Payment processPayment(Booking booking, BookingRequest request) {
        String bank = request.getBankName();
        if (bank == null || bank.trim().isEmpty()) {
            throw new BadRequestException("Selected bank name is required for Net Banking payment.");
        }

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setPaymentMethod(PaymentMethod.NET_BANKING);
        payment.setAmount(booking.getTotalAmount());
        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentId("PAY-NB-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setTransactionReference("NETBANK-" + bank.replaceAll("\\s+", "").toUpperCase() + "-" + System.currentTimeMillis() % 100000);
        return payment;
    }

    @Override
    public boolean processRefund(Payment payment) {
        payment.setPaymentStatus(PaymentStatus.REFUNDED);
        return true;
    }
}
