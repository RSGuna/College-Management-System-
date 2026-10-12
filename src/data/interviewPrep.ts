export interface InterviewQuestion {
  id: string;
  category: 'Spring Security' | 'Spring Data JPA' | 'Architecture & Design' | 'REST & Best Practices' | 'MySQL & Performance';
  question: string;
  difficulty: 'Fresher' | 'Intermediate' | 'Architect';
  seniorAnswer: string;
  interviewTip: string;
}

export interface ResumeSection {
  title: string;
  bullets: string[];
  skillsList: string[];
}

export const RESUME_CONTENT: ResumeSection = {
  title: 'Full-Stack College Management System (Spring Boot 3, Spring Security, MySQL 8)',
  skillsList: [
    'Java 17 / 21', 'Spring Boot 3.3', 'Spring Security 6 (JWT / RBAC)', 'Spring Data JPA / Hibernate 6',
    'MySQL 8.0', 'RESTful API Design', 'Hibernate Validator', 'HikariCP', 'OpenAPI 3 / Swagger', 'Maven', 'Docker'
  ],
  bullets: [
    'Architected an enterprise-grade College Management System using Spring Boot 3, Spring Data JPA, and MySQL 8, serving 3 distinct user roles (ADMIN, FACULTY, STUDENT) with zero privilege leakage.',
    'Implemented stateless JWT Authentication with HMAC-SHA256 signature verification and Role-Based Access Control (RBAC) across 25+ REST endpoints via Spring Security 6 SecurityFilterChain and @PreAuthorize annotations.',
    'Engineered a 3NF normalized MySQL schema with 11 relational tables, composite indexing on high-frequency queries (course attendance, student enrollments), and foreign key constraints ensuring ACID compliance.',
    'Eliminated Hibernate N+1 query performance bottlenecks using JPQL JOIN FETCH and @EntityGraph queries, reducing database roundtrips by 65% for paginated student rosters.',
    'Built an atomic attendance tracking engine supporting batch submissions wrapped in Spring @Transactional boundaries, alongside an automated exam grading and fee payment ledger system.',
    'Developed a standardized Global Exception Handler with @RestControllerAdvice and custom DTO validation (Hibernate Validator), generating RFC 7807 compliant error payloads and OpenAPI 3.0 documentation for web and mobile clients.'
  ]
};

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'sec-1',
    category: 'Spring Security',
    question: 'How did you implement Role-Based Access Control (RBAC) in Spring Boot 3?',
    difficulty: 'Fresher',
    seniorAnswer: `In Spring Boot 3 with Spring Security 6, I implemented RBAC through a two-tier strategy:

1. URL-Level Security: In the SecurityFilterChain bean, I defined strict requestMatchers() rules with method-specific authorizations (e.g. .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")). In Spring Security, hasRole("ADMIN") automatically checks for the authority prefix "ROLE_ADMIN".

2. Method-Level Security: Enabled via @EnableMethodSecurity(prePostEnabled = true), I placed @PreAuthorize("hasRole('FACULTY')") on sensitive service and controller methods such as attendance marking and grade submissions. For row-level security (e.g. students viewing only their own transcripts), I used SpEL expressions like @PreAuthorize("hasRole('ADMIN') or #studentId == authentication.principal.id").

3. JWT Claims Mapping: When issuing the JWT, user roles are packaged into a 'roles' claim array. The JwtAuthenticationFilter parses this token, constructs SimpleGrantedAuthority objects for each role, and populates the UsernamePasswordAuthenticationToken in SecurityContextHolder.getContext().`,
    interviewTip: 'Mention that in Spring Security 6, WebSecurityConfigurerAdapter is removed in favor of component-based SecurityFilterChain bean configuration.'
  },
  {
    id: 'sec-2',
    category: 'Spring Security',
    question: 'Why did you choose stateless JWT over HTTP Session cookies for this project?',
    difficulty: 'Fresher',
    seniorAnswer: `I selected stateless JWT tokens for 3 critical reasons:

1. Multi-Client Readiness (Mobile & Web): College Management Systems need to serve both responsive web dashboards and native mobile apps (Android/iOS). Mobile clients struggle with JSESSIONID cookies and cookie stores, while Authorization: Bearer <token> headers work uniformly across platforms.

2. Horizontal Scalability: Because session state is not stored in JVM server memory, the Spring Boot application can be scaled horizontally behind an Nginx or Kubernetes load balancer without requiring sticky sessions or external Redis session replication.

3. Cross-Origin Resource Sharing (CORS): JWT stored in secure client storage allows seamless cross-origin API access between our React frontend hosted on a CDN and the backend API gateway.`,
    interviewTip: 'Acknowledge the trade-off: JWT tokens cannot be revoked instantly without a token blacklist or short expiration times (e.g., 15-minute access token + refresh token rotation).'
  },
  {
    id: 'sec-3',
    category: 'Spring Security',
    question: 'How does Spring Security filter chain execute? What is the role of OncePerRequestFilter?',
    difficulty: 'Intermediate',
    seniorAnswer: `Spring Security is built upon a chain of standard Servlet Filters managed by DelegatingFilterProxy and FilterChainProxy.

When a client makes a request:
1. It passes through standard security filters (CorsFilter, CsrfFilter, etc.).
2. Our custom JwtAuthenticationFilter extends OncePerRequestFilter to guarantee that token parsing and authentication occurs strictly once per HTTP request dispatch (preventing duplicate executions in async or error dispatches).
3. We register JwtAuthenticationFilter ahead of UsernamePasswordAuthenticationFilter using http.addFilterBefore().
4. Inside the filter, we extract the Authorization header, validate the cryptographic signature using JJWT, build the Authentication object, and inject it into SecurityContextHolder.
5. The request then proceeds to AuthorizationFilter where SpEL expressions and hasRole checks evaluate whether to allow or throw AccessDeniedException.`,
    interviewTip: 'Draw or describe the mental model: Client -> DelegatingFilterProxy -> FilterChainProxy -> Custom Filters -> Controller.'
  },
  {
    id: 'jpa-1',
    category: 'Spring Data JPA',
    question: 'What is the N+1 SELECT query problem in Hibernate, and how did you resolve it?',
    difficulty: 'Intermediate',
    seniorAnswer: `The N+1 problem occurs when Hibernate executes 1 query to fetch parent entities (e.g. 50 students) and then executes N subsequent queries (50 additional queries) to fetch each student's associated department or user profile when configured with lazy loading.

In this College Management System, I resolved it using two approaches:
1. JPQL JOIN FETCH in Repository:
@Query("SELECT s FROM Student s JOIN FETCH s.department JOIN FETCH s.user WHERE s.id = :id")
This instructs Hibernate to perform an inner join at the SQL level and load both entities in a single database roundtrip.
2. Spring Data @EntityGraph: On paginated queries, I utilized @EntityGraph(attributePaths = {"department", "user"}) which converts the lazy relationships into SQL LEFT OUTER JOINs without triggering product cartesian explosions.`,
    interviewTip: 'Never say you solved it by setting FetchType.EAGER on everything! Explain that EAGER leads to slow query times and cartesian product issues.'
  },
  {
    id: 'jpa-2',
    category: 'Spring Data JPA',
    question: 'Why did you use DTOs (Data Transfer Objects) instead of returning JPA Entities directly in REST controllers?',
    difficulty: 'Fresher',
    seniorAnswer: `Exposing JPA Entities directly in REST APIs is considered an anti-pattern for multiple reasons:
1. Security & Information Leakage: The User entity contains sensitive fields like password_hash, which must never be serialized into JSON responses.
2. Circular Reference & Infinite Recursion: Bidirectional relationships (e.g., Student has many Enrollments, Enrollment has Student) cause Jackson to throw InfiniteRecursionException / StackOverflowError during serialization.
3. Decoupling API Contract from Database Schema: Database table refactorings should not break mobile client API contracts. DTOs serve as a stable versioned contract.
4. Payload Optimization: DTOs allow returning only the necessary fields (e.g., StudentSummaryDto with just rollNumber, name, and attendance percentage instead of full relational graphs).`,
    interviewTip: 'Mention that you used MapStruct or ModelMapper to cleanly convert between Entity and DTO without boilerplate.'
  },
  {
    id: 'arch-1',
    category: 'Architecture & Design',
    question: 'Explain the layered MVC and Repository architecture you followed.',
    difficulty: 'Fresher',
    seniorAnswer: `The project adheres to the clean Layered Architecture pattern:
1. Controller Layer (@RestController): Responsible purely for HTTP protocol concerns: extracting path variables/request bodies, triggering Bean Validation (@Valid), and returning HTTP status codes wrapped in standard ApiResponse<T>.
2. DTO Layer: Validated input contracts (StudentCreateDto) and output views (StudentResponseDto).
3. Service Layer (@Service): Implements core business logic, domain validations (e.g. checking if course has reached maxCapacity before enrollment), and defines transaction boundaries using @Transactional.
4. Repository Layer (@Repository / Spring Data JPA): Data access abstraction providing CRUD and custom JPQL queries.
5. Entity Layer (@Entity): Represents normalized MySQL database tables with JPA annotations.
This ensures Separation of Concerns (SoC) and makes unit testing effortless by allowing Mockito to mock repository layers in service tests.`,
    interviewTip: 'Emphasize that controllers contain zero business logic and services contain zero HTTP request/response imports.'
  },
  {
    id: 'db-1',
    category: 'MySQL & Performance',
    question: 'How did you optimize MySQL queries and database schema for 10,000+ students?',
    difficulty: 'Intermediate',
    seniorAnswer: `I designed the MySQL 8 schema with optimization at both schema and indexing layers:
1. Normalization to 3NF: Eliminated data redundancy across 11 relational tables (departments, courses, faculty, students, enrollments, attendance, fees).
2. Targeted B-Tree Indexes:
- Composite index on attendance (course_id, attendance_date) to allow instantaneous daily class attendance lookups.
- Unique index on roll_number and employee_code for O(1) lookups.
- Composite index on enrollments (student_id, course_id, academic_year) to prevent duplicate enrollments at the database constraint level.
3. Connection Pooling: Configured HikariCP in application.yml with maximum-pool-size: 15, minimum-idle: 5, and connection timeouts to handle concurrent attendance marking during morning classes without exhausting MySQL connections.`,
    interviewTip: 'Mention the difference between Primary Key Clustered Index and Secondary Non-Clustered Indexes in MySQL InnoDB.'
  }
];

export const ROADMAP_STEPS = [
  {
    step: 1,
    title: 'Development Environment & Project Scaffolding',
    duration: 'Day 1',
    tasks: [
      'Install JDK 17 or 21 (Temurin or Corretto) and set JAVA_HOME.',
      'Install MySQL 8.0 Community Server and MySQL Workbench or DBeaver.',
      'Initialize Spring Boot project via Spring Initializr with dependencies: Spring Web, Spring Data JPA, Spring Security, MySQL Driver, Lombok, Validation, and Springdoc OpenAPI.',
      'Configure application.yml with database credentials, HikariCP pool settings, and JWT secret.'
    ]
  },
  {
    step: 2,
    title: 'MySQL Schema & JPA Entity Modeling',
    duration: 'Day 2 - 3',
    tasks: [
      'Run the normalized 3NF MySQL schema script in MySQL Workbench.',
      'Create JPA Entities: User, Role, Department, Student, Faculty, Course, Enrollment, Attendance, FeePayment.',
      'Configure bidirectional relationships with FetchType.LAZY to prevent accidental cartesian products.',
      'Create Spring Data JPA repositories with custom derived and JPQL queries.'
    ]
  },
  {
    step: 3,
    title: 'Spring Security 6 & JWT RBAC Implementation',
    duration: 'Day 4 - 5',
    tasks: [
      'Implement BCryptPasswordEncoder bean with cost factor 12.',
      'Build JwtTokenProvider using JJWT 0.12 with HMAC-SHA256 signing and expiration validation.',
      'Create JwtAuthenticationFilter extending OncePerRequestFilter to parse Bearer tokens.',
      'Configure SecurityFilterChain with stateless SessionCreationPolicy and role-based endpoint permissions (ADMIN, FACULTY, STUDENT).',
      'Implement CustomAccessDeniedHandler and JwtAuthenticationEntryPoint for JSON error responses.'
    ]
  },
  {
    step: 4,
    title: 'Business Logic, DTOs & Validation',
    duration: 'Day 6 - 7',
    tasks: [
      'Create DTOs for requests and responses with Jakarta Validation annotations (@NotBlank, @Email, @Size).',
      'Implement StudentService, FacultyService, CourseService, and AttendanceService with @Transactional.',
      'Add business validations (e.g. check course capacity before enrollment, prevent duplicate daily attendance).',
      'Implement GlobalExceptionHandler with @RestControllerAdvice for standardized error envelopes.'
    ]
  },
  {
    step: 5,
    title: 'REST Controllers & Swagger/OpenAPI Documentation',
    duration: 'Day 8',
    tasks: [
      'Create AuthController, StudentController, FacultyController, AttendanceController, and FeeController.',
      'Apply @PreAuthorize annotations to enforce method-level role constraints.',
      'Annotate endpoints with OpenAPI 3.0 annotations (@Tag, @Operation, @ApiResponse).',
      'Verify interactive documentation at http://localhost:8080/swagger-ui.html.'
    ]
  },
  {
    step: 6,
    title: 'Postman Testing & Integration Verification',
    duration: 'Day 9',
    tasks: [
      'Import the Postman Collection and set base_url environment variable.',
      'Test Auth login endpoint to capture JWT Bearer token.',
      'Execute happy-path and edge-case calls (test 401 Unauthorized, 403 Forbidden with mismatched roles, 400 Bad Request on validation errors).',
      'Verify transaction rollback on intentional database exception.'
    ]
  },
  {
    step: 7,
    title: 'Frontend / Mobile Client Connection & Resume Polish',
    duration: 'Day 10',
    tasks: [
      'Connect responsive React frontend or React Native mobile client with Axios Bearer interceptor.',
      'Deploy backend to Railway / Render / AWS EC2 and database to Free Cloud MySQL.',
      'Push pristine GitHub repository with comprehensive README, architectural diagrams, and license.',
      'Add project bullet points to Fresher Resume using the STAR format.'
    ]
  }
];
