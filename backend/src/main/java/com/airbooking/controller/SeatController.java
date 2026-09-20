package com.airbooking.controller;

import com.airbooking.model.Seat;
import com.airbooking.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights/{flightId}/seats")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SeatController {

    private final SeatService seatService;

    @Autowired
    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping
    public ResponseEntity<List<Seat>> getSeatsForFlight(@PathVariable Long flightId) {
        return ResponseEntity.ok(seatService.getSeatsByFlight(flightId));
    }
}
