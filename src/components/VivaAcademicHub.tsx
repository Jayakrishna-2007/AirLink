import React, { useState } from 'react';
import {
  GraduationCap,
  Layers,
  Database,
  Code2,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileCode,
  Terminal,
  Cpu,
} from 'lucide-react';

export const VivaAcademicHub: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'ARCHITECTURE' | 'OOP' | 'DATABASE' | 'VIVA_QA' | 'CODE_SHOWCASE'>('ARCHITECTURE');
  const [expandedQa, setExpandedQa] = useState<number | null>(0);

  const VIVA_QUESTIONS = [
    {
      q: '1. What is the layered architecture used in this project and why is it preferred?',
      a: 'The project strictly adheres to Spring Boot Layered Architecture: Controller Layer (handles HTTP requests, validation, and returns DTOs) ➔ Service Layer (contains business logic, transactional boundaries @Transactional, and security checks) ➔ Repository Layer (extends JpaRepository for type-safe ORM queries) ➔ Database (relational storage). This separation of concerns ensures maintainability, testability with Mockito, and loose coupling.',
    },
    {
      q: '2. How does the system handle concurrent seat booking and prevent race conditions?',
      a: 'In SeatService and BookingService, seat reservation uses Spring transaction isolation level (Isolation.REPEATABLE_READ) combined with a composite database unique constraint on (flight_id, seat_number). If two users attempt to confirm seat 14A simultaneously, the database unique index together with transactional lock rejects the collision with a SeatAlreadyBookedException, guaranteeing ACID compliance.',
    },
    {
      q: '3. Why are monetary values stored in BigDecimal instead of float or double?',
      a: 'Float and double use IEEE-754 binary floating-point representation, which cannot accurately represent decimal fractions (e.g., 0.1 + 0.2 != 0.3). In financial aviation booking systems, even minor rounding errors cause ledger discrepancies. BigDecimal provides exact decimal arithmetic with configurable rounding modes (RoundingMode.HALF_UP) as mandated in enterprise software.',
    },
    {
      q: '4. How are OOP principles explicitly demonstrated in the Java backend code?',
      a: 'Encapsulation: Private entity fields with controlled getters/setters, DTOs separating persistence from presentation. Inheritance: AdminUser and CustomerUser extend the base abstract User entity utilizing JPA @Inheritance(strategy = InheritanceType.SINGLE_TABLE) and @DiscriminatorColumn. Polymorphism: PaymentServiceFactory instantiates PaymentStrategy implementations (UpiPaymentService, CardPaymentService, NetBankingPaymentService) uniformly via the IPaymentService interface. Abstraction: Controllers depend strictly on Service interfaces (IFlightService, IBookingService) rather than concrete implementations.',
    },
    {
      q: '5. How does stateless JWT authentication and Role-Based Access Control (RBAC) work?',
      a: 'Upon successful login via /api/auth/login, JwtUtils signs a cryptographic JWT token containing the username, role (ROLE_USER or ROLE_ADMIN), and expiry. The client transmits this token in the HTTP Authorization header (Bearer <token>). The AuthTokenFilter intercepts each request, validates signature and expiration with the HS256 secret key, and populates Spring SecurityContextHolder. Methods like /api/admin/** are guarded with @PreAuthorize("hasRole(\'ADMIN\')").',
    },
  ];

  const OOP_EXAMPLES = [
    {
      title: 'Inheritance & JPA Polymorphic Entities',
      description: 'Single Table Inheritance where specialized AdminUser extends base User with department metadata.',
      code: `@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "user_type", discriminatorType = DiscriminatorType.STRING)
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    // ...
}

@Entity
@DiscriminatorValue("ADMIN")
public class AdminUser extends User {
    private String adminDepartment;
    private String employeeCode;
}`,
    },
    {
      title: 'Polymorphic Strategy Pattern (Payment Processing)',
      description: 'Factory pattern selecting payment implementation dynamically at runtime without conditional spaghetti.',
      code: `public interface IPaymentService {
    PaymentResult processPayment(PaymentRequest request, BigDecimal amount);
}

@Service("upiPaymentService")
public class UpiPaymentService implements IPaymentService { ... }

@Service("cardPaymentService")
public class CardPaymentService implements IPaymentService { ... }

@Component
public class PaymentServiceFactory {
    public IPaymentService getPaymentService(PaymentMethod method) {
        return switch (method) {
            case UPI -> upiPaymentService;
            case CREDIT_CARD, DEBIT_CARD -> cardPaymentService;
            case NET_BANKING -> netBankingPaymentService;
        };
    }
}`,
    },
    {
      title: 'Encapsulation & DTO Transformation',
      description: 'Entities remain hidden behind DTOs. Passwords and internal state are never leaked to the client.',
      code: `public record BookingResponseDTO(
    Long id,
    String pnr,
    FlightSummaryDTO flight,
    List<PassengerDTO> passengers,
    BigDecimal totalAmount,
    BookingStatus bookingStatus,
    LocalDateTime bookingDate
) {}`,
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Title & Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
              <GraduationCap className="w-6 h-6 text-amber-400" />
              <span>B.Tech CSE Project Review & Viva Hub</span>
            </h2>
            <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Academic Defense
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Architecture diagrams, OOP proofs, database schemas, and examiner questions with verified answers
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Spring Boot 3.2 • JDK 17 • Hibernate ORM</span>
        </div>
      </div>

      {/* Hub Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
        {[
          { id: 'ARCHITECTURE', label: 'Layered Architecture', icon: Layers },
          { id: 'OOP', label: 'OOP Principles in Code', icon: Cpu },
          { id: 'DATABASE', label: 'Database & ER Schema', icon: Database },
          { id: 'VIVA_QA', label: 'Viva Voce Q&A (Examiner Prep)', icon: HelpCircle },
          { id: 'CODE_SHOWCASE', label: 'Spring Boot Code Viewer', icon: Code2 },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-2 ${
                activeSection === tab.id
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section: ARCHITECTURE */}
      {activeSection === 'ARCHITECTURE' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Layered Enterprise System Flow</h3>
            <p className="text-xs text-slate-400">
              Clean separation of concerns with unidirectional dependency inversion: Controller ➔ Service ➔ Repository ➔ DB.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/50 space-y-2">
              <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                <span>Controller Layer</span>
              </div>
              <p className="text-[11px] text-slate-300">
                REST API endpoints (FlightController, BookingController). Handles HTTP verbs, path variables, request validation, and converts DTOs.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/50 space-y-2">
              <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">2</span>
                <span>Service Layer</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Transactional business logic (@Transactional). Enforces seat locks, PNR generation, cancellation rules, and payment strategies.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">3</span>
                <span>Repository Layer</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Spring Data JPA Repositories (FlightRepository, BookingRepository). Custom JPQL queries with optimistic locking and index lookups.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/50 space-y-2">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">4</span>
                <span>Relational Database</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Normalized RDBMS (H2 in dev / MySQL 8.x in prod). Foreign keys with CASCADE, unique constraints, and ACID transactions.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
            <div className="text-slate-500">// Request Lifecycle:</div>
            <div>Browser React Client (Axios + JWT) ➔ AuthTokenFilter (Validate Bearer Token)</div>
            <div>➔ Spring SecurityContextHolder ➔ @PreAuthorize check ➔ @RestController</div>
            <div>➔ @Transactional Service ➔ JpaRepository ➔ SQL Query execution</div>
            <div>➔ Entity-to-DTO Mapper ➔ ResponseEntity&lt;ApiResponse&lt;T&gt;&gt; (HTTP 200 OK)</div>
          </div>
        </div>
      )}

      {/* Section: OOP */}
      {activeSection === 'OOP' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Demonstration of Object-Oriented Principles</h3>
            <p className="text-xs text-slate-400">
              Concrete Java code excerpts proving OOP compliance for academic examiners.
            </p>
          </div>

          <div className="space-y-4">
            {OOP_EXAMPLES.map((ex, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <span className="w-5 h-5 rounded bg-blue-600 text-white text-[10px] flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <span>{ex.title}</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">{ex.description}</p>
                </div>

                <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
                  <pre>{ex.code}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section: DATABASE */}
      {activeSection === 'DATABASE' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Relational Database ER Structure</h3>
            <p className="text-xs text-slate-400">
              Fully normalized schema adhering to 3rd Normal Form (3NF) with strict relational integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="text-blue-400 font-bold border-b border-slate-800 pb-1">TABLE: flights</div>
              <div className="text-slate-400 space-y-1">
                <div><span className="text-amber-400">PK</span> id (BIGINT)</div>
                <div>flight_number (VARCHAR UNIQUE)</div>
                <div>source, destination (VARCHAR)</div>
                <div>departure_date, departure_time</div>
                <div>total_seats, available_seats</div>
                <div>economy_fare (DECIMAL 10,2)</div>
                <div>business_fare (DECIMAL 10,2)</div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="text-indigo-400 font-bold border-b border-slate-800 pb-1">TABLE: bookings</div>
              <div className="text-slate-400 space-y-1">
                <div><span className="text-amber-400">PK</span> id (BIGINT)</div>
                <div>pnr (VARCHAR 6 UNIQUE)</div>
                <div><span className="text-blue-400">FK</span> user_id ➔ users(id)</div>
                <div><span className="text-blue-400">FK</span> flight_id ➔ flights(id)</div>
                <div>total_amount (DECIMAL 10,2)</div>
                <div>booking_status (ENUM)</div>
                <div>travel_class (ENUM)</div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="text-emerald-400 font-bold border-b border-slate-800 pb-1">TABLE: seats</div>
              <div className="text-slate-400 space-y-1">
                <div><span className="text-amber-400">PK</span> id (BIGINT)</div>
                <div><span className="text-blue-400">FK</span> flight_id ➔ flights(id)</div>
                <div>seat_number (VARCHAR 10)</div>
                <div>seat_class (ENUM)</div>
                <div>status (AVAILABLE/OCCUPIED)</div>
                <div className="text-amber-400 text-[10px]">UNIQUE(flight_id, seat_number)</div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="text-purple-400 font-bold border-b border-slate-800 pb-1">TABLE: passengers</div>
              <div className="text-slate-400 space-y-1">
                <div><span className="text-amber-400">PK</span> id (BIGINT)</div>
                <div><span className="text-blue-400">FK</span> booking_id ➔ bookings(id)</div>
                <div>full_name, date_of_birth</div>
                <div>gender, nationality</div>
                <div>passport_id (VARCHAR)</div>
                <div>seat_number (VARCHAR)</div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="text-teal-400 font-bold border-b border-slate-800 pb-1">TABLE: tickets</div>
              <div className="text-slate-400 space-y-1">
                <div><span className="text-amber-400">PK</span> id (BIGINT)</div>
                <div><span className="text-blue-400">FK</span> booking_id ➔ bookings(id)</div>
                <div>ticket_number (UNIQUE)</div>
                <div>barcode_data (VARCHAR)</div>
                <div>issued_at (TIMESTAMP)</div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="text-rose-400 font-bold border-b border-slate-800 pb-1">TABLE: payments</div>
              <div className="text-slate-400 space-y-1">
                <div><span className="text-amber-400">PK</span> id (BIGINT)</div>
                <div><span className="text-blue-400">FK</span> booking_id ➔ bookings(id)</div>
                <div>payment_id (UNIQUE)</div>
                <div>payment_method (UPI/CARD/NET_BANKING)</div>
                <div>amount (DECIMAL 10,2)</div>
                <div>payment_status (SUCCESS)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section: VIVA_QA */}
      {activeSection === 'VIVA_QA' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Viva Voce Preparation Guide</h3>
            <p className="text-xs text-slate-400">
              High-frequency questions asked by external academic examiners, paired with model answers.
            </p>
          </div>

          <div className="space-y-3">
            {VIVA_QUESTIONS.map((item, idx) => {
              const isOpen = expandedQa === idx;
              return (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden transition-all">
                  <button
                    onClick={() => setExpandedQa(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-white hover:bg-slate-900/50 transition-colors"
                  >
                    <span>{item.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3 bg-slate-900/40">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section: CODE_SHOWCASE */}
      {activeSection === 'CODE_SHOWCASE' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white mb-1">Production Spring Boot Code Excerpts</h3>
              <p className="text-xs text-slate-400">
                Explore key Java source files powering the backend.
              </p>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Directory: /backend/src/main/java/com/airbooking/
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono text-xs">
            <div className="text-blue-400 font-bold flex items-center space-x-2">
              <FileCode className="w-4 h-4" />
              <span>BookingService.java - Concurrency & Booking Transaction</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl text-slate-300 overflow-x-auto text-[11px]">
              <pre>{`@Transactional(isolation = Isolation.REPEATABLE_READ)
public BookingResponseDTO createBooking(CreateBookingRequest request, String userEmail) {
    Flight flight = flightRepository.findById(request.getFlightId())
        .orElseThrow(() -> new ResourceNotFoundException("Flight not found"));

    // Verify seat availability atomically
    for (PassengerRequestDTO pax : request.getPassengers()) {
        Seat seat = seatRepository.findByFlightIdAndSeatNumber(flight.getId(), pax.getSeatNumber())
            .orElseThrow(() -> new ResourceNotFoundException("Seat not found: " + pax.getSeatNumber()));
        if (seat.getStatus() == SeatStatus.OCCUPIED) {
            throw new BadRequestException("Seat already booked: " + pax.getSeatNumber());
        }
        seat.setStatus(SeatStatus.OCCUPIED);
        seatRepository.save(seat);
    }

    // Generate unique 6-character PNR
    String pnr = generateUniquePNR();
    Booking booking = new Booking();
    booking.setPnr(pnr);
    booking.setFlight(flight);
    // ... Calculate BigDecimal fare with 12% tax & security fee
    return convertToDTO(bookingRepository.save(booking));
}`}</pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
