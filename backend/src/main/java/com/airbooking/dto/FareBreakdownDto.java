package com.airbooking.dto;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Monetary breakdown calculating Base Fare, Taxes, and Service Fee using BigDecimal.
 */
public class FareBreakdownDto {

    private BigDecimal perPassengerBaseFare;
    private Integer passengerCount;
    private BigDecimal baseFareSubtotal;
    private BigDecimal taxAmount;
    private BigDecimal serviceFee;
    private BigDecimal totalAmount;

    public FareBreakdownDto() {
    }

    public static FareBreakdownDto calculate(BigDecimal perPassengerFare, int count) {
        FareBreakdownDto fb = new FareBreakdownDto();
        fb.perPassengerBaseFare = perPassengerFare.setScale(2, RoundingMode.HALF_UP);
        fb.passengerCount = count;
        
        BigDecimal countDec = BigDecimal.valueOf(count);
        fb.baseFareSubtotal = fb.perPassengerBaseFare.multiply(countDec).setScale(2, RoundingMode.HALF_UP);
        
        // 12% Aviation & GST Taxes
        fb.taxAmount = fb.baseFareSubtotal.multiply(new BigDecimal("0.12")).setScale(2, RoundingMode.HALF_UP);
        
        // Fixed Service/Convenience Fee per passenger ($250 or $3.50)
        fb.serviceFee = new BigDecimal("250.00").multiply(countDec).setScale(2, RoundingMode.HALF_UP);
        
        fb.totalAmount = fb.baseFareSubtotal.add(fb.taxAmount).add(fb.serviceFee).setScale(2, RoundingMode.HALF_UP);
        return fb;
    }

    public BigDecimal getPerPassengerBaseFare() {
        return perPassengerBaseFare;
    }

    public Integer getPassengerCount() {
        return passengerCount;
    }

    public BigDecimal getBaseFareSubtotal() {
        return baseFareSubtotal;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public BigDecimal getServiceFee() {
        return serviceFee;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }
}
