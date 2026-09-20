package com.airbooking.service;

import com.airbooking.enums.PaymentMethod;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

/**
 * Factory and Polymorphic dispatcher selecting appropriate PaymentService implementation.
 */
@Component
public class PaymentServiceFactory {

    private final PaymentService upiPaymentService;
    private final PaymentService cardPaymentService;
    private final PaymentService netBankingPaymentService;

    @Autowired
    public PaymentServiceFactory(
            @Qualifier("upiPaymentService") PaymentService upiPaymentService,
            @Qualifier("cardPaymentService") PaymentService cardPaymentService,
            @Qualifier("netBankingPaymentService") PaymentService netBankingPaymentService) {
        this.upiPaymentService = upiPaymentService;
        this.cardPaymentService = cardPaymentService;
        this.netBankingPaymentService = netBankingPaymentService;
    }

    /**
     * Polymorphic resolution of PaymentService based on chosen payment method.
     */
    public PaymentService getPaymentService(PaymentMethod method) {
        if (method == null) {
            return upiPaymentService;
        }
        switch (method) {
            case UPI:
                return upiPaymentService;
            case CREDIT_CARD:
            case DEBIT_CARD:
                return cardPaymentService;
            case NET_BANKING:
                return netBankingPaymentService;
            default:
                return upiPaymentService;
        }
    }
}
