-- ===================================================================
-- Initial Database Seed Script for Airplane Ticket Booking System
-- ===================================================================

-- 1. Insert Initial Users
-- Passwords are encrypted with BCrypt (password: 'Password@123')
-- Admin: admin@airbooking.com / Password@123
-- User: user@airbooking.com / Password@123

INSERT INTO users (id, user_type, name, email, phone, password, role, status, created_at)
VALUES 
(1, 'ADMIN', 'System Administrator', 'admin@airbooking.com', '+91 9876543210', '$2a$10$wKkSgJ216432098765432u8bQ/e07v7G16fF4n2Z0x3k4Q2h0R7yC', 'ADMIN', 'ACTIVE', CURRENT_TIMESTAMP),
(2, 'USER', 'Rahul Sharma', 'rahul.sharma@example.com', '+91 9811223344', '$2a$10$wKkSgJ216432098765432u8bQ/e07v7G16fF4n2Z0x3k4Q2h0R7yC', 'USER', 'ACTIVE', CURRENT_TIMESTAMP),
(3, 'USER', 'Priya Patel', 'priya.patel@example.com', '+91 9822334455', '$2a$10$wKkSgJ216432098765432u8bQ/e07v7G16fF4n2Z0x3k4Q2h0R7yC', 'USER', 'ACTIVE', CURRENT_TIMESTAMP);

-- 2. Insert Scheduled Flights
INSERT INTO flights (id, airline, flight_number, source, destination, departure_date, departure_time, arrival_date, arrival_time, duration, aircraft, total_seats, available_seats, economy_fare, premium_fare, business_fare, first_class_fare, status)
VALUES
(1, 'Air India', 'AI-102', 'DEL', 'BOM', '2026-09-22', '06:00:00', '2026-09-22', '08:15:00', '2h 15m', 'Airbus A320neo', 180, 168, 5400.00, 8200.00, 16500.00, 24000.00, 'SCHEDULED'),
(2, 'IndiGo', '6E-503', 'DEL', 'BOM', '2026-09-22', '09:30:00', '2026-09-22', '11:45:00', '2h 15m', 'Airbus A321neo', 220, 204, 4950.00, 7500.00, 14200.00, 21000.00, 'SCHEDULED'),
(3, 'Vistara', 'UK-945', 'DEL', 'BLR', '2026-09-22', '07:15:00', '2026-09-22', '10:05:00', '2h 50m', 'Boeing 737-800', 168, 150, 6200.00, 9400.00, 18900.00, 28000.00, 'SCHEDULED'),
(4, 'Air India', 'AI-804', 'BOM', 'BLR', '2026-09-22', '14:20:00', '2026-09-22', '16:00:00', '1h 40m', 'Airbus A320', 180, 172, 4200.00, 6800.00, 13500.00, 19500.00, 'SCHEDULED'),
(5, 'SpiceJet', 'SG-291', 'DEL', 'GOI', '2026-09-22', '11:00:00', '2026-09-22', '13:35:00', '2h 35m', 'Boeing 737 MAX', 186, 178, 5800.00, 8600.00, 15900.00, 23000.00, 'SCHEDULED'),
(6, 'IndiGo', '6E-712', 'BLR', 'HYD', '2026-09-22', '17:45:00', '2026-09-22', '18:55:00', '1h 10m', 'Airbus A320', 180, 175, 3100.00, 5200.00, 11000.00, 16000.00, 'SCHEDULED'),
(7, 'Emirates', 'EK-511', 'DEL', 'DXB', '2026-09-23', '04:15:00', '2026-09-23', '06:45:00', '4h 00m', 'Boeing 777-300ER', 354, 320, 19800.00, 29500.00, 58000.00, 95000.00, 'SCHEDULED');
