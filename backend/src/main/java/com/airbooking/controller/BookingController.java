package com.airbooking.controller;

import com.airbooking.dto.BookingRequest;
import com.airbooking.dto.BookingResponse;
import com.airbooking.model.User;
import com.airbooking.service.BookingService;
import com.airbooking.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BookingController {

    private final BookingService bookingService;
    private final UserService userService;

    @Autowired
    public BookingController(BookingService bookingService, UserService userService) {
        this.bookingService = bookingService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest req, Principal principal) {
        User user = userService.findByEmail(principal.getName());
        BookingResponse res = bookingService.createBooking(user, req);
        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings(Principal principal) {
        User user = userService.findByEmail(principal.getName());
        return ResponseEntity.ok(bookingService.getUserBookings(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long id, Principal principal) {
        User user = userService.findByEmail(principal.getName());
        return ResponseEntity.ok(bookingService.getBookingById(id, user));
    }

    @GetMapping("/pnr/{pnr}")
    public ResponseEntity<BookingResponse> getBookingByPnr(@PathVariable String pnr, Principal principal) {
        User user = userService.findByEmail(principal.getName());
        return ResponseEntity.ok(bookingService.getBookingByPnr(pnr, user));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable Long id, Principal principal) {
        User user = userService.findByEmail(principal.getName());
        return ResponseEntity.ok(bookingService.cancelBooking(id, user));
    }
}
