# Airplane Ticket Booking Management System
**B.Tech Computer Science and Engineering Academic Project**

---

## ✈️ 1. Project Overview

The **Airplane Ticket Booking Management System** is an enterprise-grade full-stack flight reservation system developed for B.Tech CSE academic evaluations. It simulates a commercial airline reservation platform featuring flight search with dynamic filters, real-time aircraft seat map selection, passenger manifests, simulated multi-rail payment processing (UPI, Credit/Debit Cards, Net Banking), instantaneous 6-character PNR generation, digital e-ticket generation, booking cancellations with automated inventory release, and a comprehensive role-based administrator dashboard.

---

## 🏛️ 2. Architecture & Layered Design

The system implements the **Layered Architectural Pattern** following Spring Boot best practices:

```
[ Client / React Frontend ] (Single Page Application)
          │  REST APIs (JSON / JWT Bearer)
          ▼
[ Controller Layer ] (@RestController, Request Validation, HTTP Response Mapping)
          │  DTOs & Model entities
          ▼
[ Service Layer ] (Business Logic, Transaction Management, Polymorphic Payment)
          │  Spring Data Interfaces
          ▼
[ Repository Layer ] (Spring Data JPA, Hibernate ORM, Custom JPQL Queries)
          │  JDBC / Connection Pooling
          ▼
[ Database Layer ] (H2 in-memory for testing / MySQL for production)
```

---

## 🧩 3. Object-Oriented Programming (OOP) Demonstration

During project defense and viva, this codebase demonstrates core OOP paradigms:

### 1. Encapsulation
- All entity fields (`User`, `Flight`, `Booking`, `Seat`, etc.) use private access modifiers with public getters and setters.
- Sensitive fields like passwords are annotated with `@JsonIgnore` and hashed via BCrypt before persistence.
- Currency computations are encapsulated inside `FareBreakdownDto` with `BigDecimal` rounding scales.

### 2. Inheritance
- `Admin.java` extends `User.java` using JPA Single Table Inheritance (`@DiscriminatorColumn(name = "user_type")`).
- Specializes administrative attributes (e.g., `adminDepartment`, `employeeCode`) while inheriting authentication credentials and profile information.

### 3. Abstraction
- The `PaymentService` interface exposes high-level contracts `processPayment()` and `processRefund()`.
- Controllers and booking services interact only with the `PaymentService` abstraction, decoupled from specific gateway implementation details.

### 4. Polymorphism
- Multiple concrete implementations:
  - `UpiPaymentService` (validates VPA format, simulates UPI tokenization)
  - `CardPaymentService` (validates card length, expiration, CVV, masks PAN)
  - `NetBankingPaymentService` (validates partner banking institution)
- Dynamically resolved at runtime using `PaymentServiceFactory`.

---

## 🗄️ 4. Database Schema & Entities

| Entity | Primary Key | Key Relationships | Purpose |
| :--- | :--- | :--- | :--- |
| **User** | `id` (Long) | Base class for `Admin` | Registered customer accounts |
| **Admin** | `id` (Long) | Inherits from `User` | Privileged system administrators |
| **Flight** | `id` (Long) | `@OneToMany` Seats | Schedules, routes, multi-tier fares |
| **Seat** | `id` (Long) | `@ManyToOne` Flight | Aircraft cabin seat map (1A - 30F) |
| **Booking** | `id` (Long) | `@ManyToOne` User, `@ManyToOne` Flight, `@OneToMany` Passengers, `@OneToOne` Payment, `@OneToOne` Ticket | Confirmed reservation record with unique PNR |
| **Passenger** | `id` (Long) | `@ManyToOne` Booking | Individual traveler passport & seat info |
| **Payment** | `id` (Long) | `@OneToOne` Booking | Simulated transaction logs & audit trail |
| **Ticket** | `id` (Long) | `@OneToOne` Booking | Issued digital boarding pass & e-ticket |

---

## 🚀 5. How to Run the Java Backend Locally

### Prerequisites
- JDK 17 or later
- Apache Maven 3.8+
- (Optional) MySQL 8.0+

### Steps:
```bash
# Navigate to backend folder
cd backend

# Compile and package application
mvn clean package -DskipTests

# Run Spring Boot application (defaults to H2 in-memory profile)
mvn spring-boot:run
```
The backend starts on `http://localhost:8080`.
- H2 Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:airbookingdb`, User: `sa`, Password: empty)
- Swagger OpenAPI Docs: `http://localhost:8080/swagger-ui/index.html`

### Switching to MySQL:
Open `backend/src/main/resources/application.properties` and uncomment the MySQL section while configuring your local credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/air_booking_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
```

---

## 🛡️ 6. Default Credentials for Viva Demonstration

- **Administrator**: `admin@airbooking.com` / `Password@123`
- **Passenger**: `user@airbooking.com` / `Password@123`
- Self-registration is also supported via `/api/auth/register`.
