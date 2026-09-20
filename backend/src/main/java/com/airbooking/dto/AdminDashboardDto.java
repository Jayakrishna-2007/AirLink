package com.airbooking.dto;

import java.math.BigDecimal;

public class AdminDashboardDto {

    private long totalUsers;
    private long totalFlights;
    private long totalBookings;
    private long confirmedBookings;
    private long cancelledBookings;
    private BigDecimal totalRevenue;

    public AdminDashboardDto() {
    }

    public AdminDashboardDto(long totalUsers, long totalFlights, long totalBookings, long confirmedBookings, long cancelledBookings, BigDecimal totalRevenue) {
        this.totalUsers = totalUsers;
        this.totalFlights = totalFlights;
        this.totalBookings = totalBookings;
        this.confirmedBookings = confirmedBookings;
        this.cancelledBookings = cancelledBookings;
        this.totalRevenue = totalRevenue;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalFlights() {
        return totalFlights;
    }

    public void setTotalFlights(long totalFlights) {
        this.totalFlights = totalFlights;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public long getConfirmedBookings() {
        return confirmedBookings;
    }

    public void setConfirmedBookings(long confirmedBookings) {
        this.confirmedBookings = confirmedBookings;
    }

    public long getCancelledBookings() {
        return cancelledBookings;
    }

    public void setCancelledBookings(long cancelledBookings) {
        this.cancelledBookings = cancelledBookings;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}
