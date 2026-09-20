package com.airbooking.service;

import com.airbooking.dto.BookingRequest;
import com.airbooking.model.Booking;
import com.airbooking.model.Payment;

/**
 * OOP Abstraction: Interface defining contract for polymorphic payment implementations.
 */
public interface PaymentService {

    /**
     * Process simulated payment transaction.
     *
     * @param booking the booking entity
     * @param request the booking and payment request details
     * @return initialized and processed Payment entity
     */
    Payment processPayment(Booking booking, BookingRequest request);

    /**
     * Verify refund capability for cancelled reservations.
     *
     * @param payment the payment record to refund
     * @return status confirmation
     */
    boolean processRefund(Payment payment);
}
