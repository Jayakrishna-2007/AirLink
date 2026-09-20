package com.airbooking.service;

import com.airbooking.dto.RegisterRequest;
import com.airbooking.dto.UserDto;
import com.airbooking.enums.UserRole;
import com.airbooking.exception.BadRequestException;
import com.airbooking.exception.ResourceNotFoundException;
import com.airbooking.model.User;
import com.airbooking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(RegisterRequest req) {
        if (!req.getPassword().equals(req.getConfirmPassword())) {
            throw new BadRequestException("Password and confirm password do not match.");
        }

        if (userRepository.existsByEmail(req.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("Email " + req.getEmail() + " is already registered.");
        }

        User user = new User();
        user.setName(req.getName().trim());
        user.setEmail(req.getEmail().toLowerCase().trim());
        user.setPhone(req.getPhone().trim());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(UserRole.USER);
        user.setStatus("ACTIVE");

        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User findByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Transactional(readOnly = true)
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    public UserDto updateUserStatus(Long id, String status) {
        User user = findById(id);
        user.setStatus(status.toUpperCase());
        return UserDto.fromEntity(userRepository.save(user));
    }
}
