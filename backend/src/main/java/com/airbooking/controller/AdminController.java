package com.airbooking.controller;

import com.airbooking.dto.AdminDashboardDto;
import com.airbooking.dto.BookingResponse;
import com.airbooking.dto.UserDto;
import com.airbooking.repository.BookingRepository;
import com.airbooking.service.AdminService;
import com.airbooking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    private final AdminService adminService;
    private final UserService userService;
    private final BookingRepository bookingRepository;

    @Autowired
    public AdminController(AdminService adminService, UserService userService, BookingRepository bookingRepository) {
        this.adminService = adminService;
        this.userService = userService;
        this.bookingRepository = bookingRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDto> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<UserDto> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.getOrDefault("status", "ACTIVE");
        return ResponseEntity.ok(userService.updateUserStatus(id, status));
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        List<BookingResponse> list = bookingRepository.findAll().stream()
                .map(BookingResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }
}
