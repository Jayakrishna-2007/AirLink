package com.airbooking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Main Application Class for Airplane Ticket Booking Management System.
 * B.Tech Computer Science Academic Project.
 */
@SpringBootApplication
@EnableTransactionManagement
public class AirBookingApplication {

    public static void main(String[] args) {
        SpringApplication.run(AirBookingApplication.class, args);
    }
}
