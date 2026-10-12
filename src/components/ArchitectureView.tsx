import React, { useState } from 'react';
import { Layers, Folder, FileCode, CheckCircle2, ChevronRight, Server, Database, Smartphone, ShieldCheck, ArrowRight } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<string>('security');

  const layersInfo = {
    client: {
      name: 'Client Applications (Web & Mobile)',
      color: 'border-cyan-500/80 bg-cyan-950/20 text-cyan-300',
      description: 'Responsive React Web SPA and Mobile App (React Native or Android Java/Kotlin).',
      responsibilities: [
        'Stores JWT Bearer token securely in HttpOnly storage or Android EncryptedSharedPreferences / Keychain.',
        'Injects "Authorization: Bearer <token>" on every HTTP API invocation via Axios/Retrofit interceptors.',
        'Handles 401 Unauthorized by clearing stale tokens and redirecting to the login screen.',
        'Presents role-tailored dashboards (Dean/Admin view, Professor attendance register, Student grade card).'
      ]
    },
    security: {
      name: 'Spring Security 6 & Filter Chain Gateway',
      color: 'border-rose-500/80 bg-rose-950/20 text-rose-300',
      description: 'Stateless JWT Authentication and Authorization Filter pipeline.',
      responsibilities: [
        'CorsFilter and CsrfFilter (disabled for stateless REST architecture).',
        'JwtAuthenticationFilter intercepts requests, extracts Bearer header, validates HMAC-SHA256 signature.',
        'Extracts user roles claim and builds UsernamePasswordAuthenticationToken in SecurityContextHolder.',
        'SecurityFilterChain authorizes URL path matchers (.requestMatchers("/api/v1/admin/**").hasRole("ADMIN")).',
        'CustomAccessDeniedHandler catches unauthorized calls and returns standardized RFC 7807 JSON errors.'
      ]
    },
    controller: {
      name: 'REST Controller Layer (@RestController)',
      color: 'border-indigo-500/80 bg-indigo-950/20 text-indigo-300',
      description: 'Protocol-level entry point exposing versioned REST endpoints (/api/v1/*).',
      responsibilities: [
        'Enforces method-level security with @PreAuthorize("hasRole(\'FACULTY\')").',
        'Triggers input validation via Jakarta @Valid annotations on incoming DTO request bodies.',
        'Extracts path parameters, query parameters, and pagination specs (Pageable).',
        'Wraps service results into uniform ApiResponse<T> envelopes with standard HTTP status codes (200, 201, 204).'
      ]
    },
    dto: {
      name: 'DTO & Validation Layer (Hibernate Validator)',
      color: 'border-amber-500/80 bg-amber-950/20 text-amber-300',
      description: 'Data Transfer Objects cleanly decoupling API payload contracts from database schema.',
      responsibilities: [
        'Prevents security vulnerabilities like mass-assignment and sensitive data leakage (e.g. password_hash).',
        'Prevents Jackson InfiniteRecursionException on bidirectional JPA entity relationships.',
        'Applies strict validation annotations (@NotBlank, @Email, @Min, @Pattern).',
        'Transforms between DTOs and JPA Entities cleanly using MapStruct or manual builders.'
      ]
    },
    service: {
      name: 'Business Service Layer (@Service)',
      color: 'border-emerald-500/80 bg-emerald-950/20 text-emerald-300',
      description: 'Core institutional business logic and transactional integrity boundaries.',
      responsibilities: [
        'Manages atomic database transactions with Spring @Transactional(rollbackFor = Exception.class).',
        'Validates business rules: e.g. verify course has available capacity before registering student enrollment.',
        'Calculates academic aggregates: attendance percentage, low-attendance warnings (<75%), semester GPA points.',
        'Throws domain-specific exceptions (ResourceNotFoundException, InsufficientCapacityException) handled by GlobalExceptionHandler.'
      ]
    },
    repository: {
      name: 'Repository Layer (@Repository / Spring Data JPA)',
      color: 'border-purple-500/80 bg-purple-950/20 text-purple-300',
      description: 'Data access abstraction generating optimized SQL statements for MySQL.',
      responsibilities: [
        'Provides standard CRUD operations extending JpaRepository<Student, Long>.',
        'Declares derived query methods: findByRollNumber, findByDepartmentId.',
        'Resolves the Hibernate N+1 query problem using JPQL JOIN FETCH and @EntityGraph queries.',
        'Executes native count and aggregate queries for analytics dashboards.'
      ]
    },
    database: {
      name: 'Database Engine (MySQL 8.0+ InnoDB)',
      color: 'border-blue-500/80 bg-blue-950/20 text-blue-300',
      description: 'Relational data store in Third Normal Form (3NF) with ACID compliance.',
      responsibilities: [
        '11 normalized relational tables linked with Foreign Keys and ON DELETE CASCADE/RESTRICT rules.',
        'Composite B-Tree indexes on high-throughput queries: (course_id, attendance_date), (student_id, course_id).',
        'HikariCP high-performance connection pool handling concurrent HTTP traffic.',
        'Guarantees ACID transactions across enrollments, fee payments, and attendance registers.'
      ]
    }
  };

  const projectFolderTree = [
    {
      name: 'src/main/java/com/apex/cms',
      type: 'folder',
      desc: 'Root package',
      children: [
        {
          name: 'CollegeManagementSystemApplication.java',
          type: 'file',
          desc: 'Spring Boot main entry point (@SpringBootApplication)'
        },
        {
          name: 'config',
          type: 'folder',
          desc: 'Configuration beans',
          children: [
            { name: 'OpenApiConfig.java', type: 'file', desc: 'Swagger OpenAPI 3.0 metadata & JWT security scheme' },
            { name: 'AuditConfig.java', type: 'file', desc: 'JPA Auditing (@EnableJpaAuditing) for createdAt & updatedAt' }
          ]
        },
        {
          name: 'security',
          type: 'folder',
          desc: 'Spring Security 6 & RBAC',
          children: [
            { name: 'SecurityConfig.java', type: 'file', desc: 'SecurityFilterChain, SessionCreationPolicy.STATELESS, CORS' },
            { name: 'JwtTokenProvider.java', type: 'file', desc: 'JJWT HMAC-SHA256 generator, claims parser & validator' },
            { name: 'JwtAuthenticationFilter.java', type: 'file', desc: 'OncePerRequestFilter extracting Bearer authorization token' },
            { name: 'CustomUserDetailsService.java', type: 'file', desc: 'Loads UserDetails and assigns SimpleGrantedAuthority roles' },
            { name: 'JwtAuthenticationEntryPoint.java', type: 'file', desc: '401 Unauthorized JSON response generator' },
            { name: 'CustomAccessDeniedHandler.java', type: 'file', desc: '403 Forbidden JSON response generator' }
          ]
        },
        {
          name: 'controller',
          type: 'folder',
          desc: 'REST API Controllers',
          children: [
            { name: 'AuthController.java', type: 'file', desc: 'Public /api/v1/auth/login and user registration' },
            { name: 'StudentController.java', type: 'file', desc: 'Student CRUD, pagination, department filters' },
            { name: 'FacultyController.java', type: 'file', desc: 'Faculty directory and course assignments' },
            { name: 'CourseController.java', type: 'file', desc: 'Curriculum creation, syllabus and enrollments' },
            { name: 'AttendanceController.java', type: 'file', desc: 'Faculty class marking and student analytics' },
            { name: 'FeeController.java', type: 'file', desc: 'Semester invoices and student payment gateway' }
          ]
        },
        {
          name: 'dto',
          type: 'folder',
          desc: 'Data Transfer Objects',
          children: [
            { name: 'ApiResponse.java', type: 'file', desc: 'Standard generic envelope {status, message, data, timestamp}' },
            { name: 'AuthDtos.java', type: 'file', desc: 'LoginRequest and JwtAuthResponse models' },
            { name: 'StudentDtos.java', type: 'file', desc: 'StudentCreateDto, StudentResponseDto with validation annotations' },
            { name: 'AttendanceDtos.java', type: 'file', desc: 'Batch attendance mark payloads' }
          ]
        },
        {
          name: 'service',
          type: 'folder',
          desc: 'Service interfaces and implementations',
          children: [
            { name: 'StudentService.java', type: 'file', desc: 'Interface defining student business contracts' },
            { name: 'impl/StudentServiceImpl.java', type: 'file', desc: '@Service implementation with @Transactional' },
            { name: 'AttendanceService.java', type: 'file', desc: 'Class attendance calculation and low attendance alarms' }
          ]
        },
        {
          name: 'repository',
          type: 'folder',
          desc: 'Spring Data JPA Repositories',
          children: [
            { name: 'UserRepository.java', type: 'file', desc: 'findByUsername with Eager roles' },
            { name: 'StudentRepository.java', type: 'file', desc: 'JOIN FETCH queries eliminating N+1 issue' },
            { name: 'AttendanceRepository.java', type: 'file', desc: 'Aggregate count queries for student attendance' }
          ]
        },
        {
          name: 'entity',
          type: 'folder',
          desc: 'JPA Relational Entities',
          children: [
            { name: 'User.java', type: 'file', desc: 'Credentials & roles' },
            { name: 'Student.java', type: 'file', desc: 'Profile, rollNumber, department' },
            { name: 'Course.java', type: 'file', desc: 'Curriculum & credits' },
            { name: 'Attendance.java', type: 'file', desc: 'Presence status & date' }
          ]
        },
        {
          name: 'exception',
          type: 'folder',
          desc: 'Global Exception Handling',
          children: [
            { name: 'GlobalExceptionHandler.java', type: 'file', desc: '@RestControllerAdvice catching exceptions' },
            { name: 'ResourceNotFoundException.java', type: 'file', desc: 'Custom 404 domain exception' }
          ]
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Visual System Architecture Pipeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-semibold text-white">
            Enterprise Layered MVC &amp; Service-Repository Pattern
          </h2>
        </div>
        <p className="text-xs text-slate-400 max-w-3xl mb-6">
          Architectural dataflow for incoming HTTP requests: from client applications through Spring Security authentication filters, validation, business transactions, and ORM persistence. Click any layer to inspect its architectural purpose and interview talking points.
        </p>

        {/* Interactive Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 text-center text-xs">
          <button
            onClick={() => setSelectedLayer('client')}
            className={`p-3 rounded-lg border transition-all ${
              selectedLayer === 'client'
                ? 'border-cyan-400 bg-cyan-950/50 shadow-sm ring-1 ring-cyan-500'
                : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
            }`}
          >
            <Smartphone className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
            <div className="font-semibold text-slate-200">1. Client</div>
            <div className="text-[10px] text-slate-400">Web / Mobile</div>
          </button>

          <button
            onClick={() => setSelectedLayer('security')}
            className={`p-3 rounded-lg border transition-all ${
              selectedLayer === 'security'
                ? 'border-rose-400 bg-rose-950/50 shadow-sm ring-1 ring-rose-500'
                : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
            }`}
          >
            <ShieldCheck className="w-5 h-5 mx-auto mb-1 text-rose-400" />
            <div className="font-semibold text-slate-200">2. Security</div>
            <div className="text-[10px] text-slate-400">JWT &amp; RBAC</div>
          </button>

          <button
            onClick={() => setSelectedLayer('controller')}
            className={`p-3 rounded-lg border transition-all ${
              selectedLayer === 'controller'
                ? 'border-indigo-400 bg-indigo-950/50 shadow-sm ring-1 ring-indigo-500'
                : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
            }`}
          >
            <Server className="w-5 h-5 mx-auto mb-1 text-indigo-400" />
            <div className="font-semibold text-slate-200">3. Controller</div>
            <div className="text-[10px] text-slate-400">REST API</div>
          </button>

          <button
            onClick={() => setSelectedLayer('dto')}
            className={`p-3 rounded-lg border transition-all ${
              selectedLayer === 'dto'
                ? 'border-amber-400 bg-amber-950/50 shadow-sm ring-1 ring-amber-500'
                : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
            }`}
          >
            <FileCode className="w-5 h-5 mx-auto mb-1 text-amber-400" />
            <div className="font-semibold text-slate-200">4. DTO</div>
            <div className="text-[10px] text-slate-400">Validation</div>
          </button>

          <button
            onClick={() => setSelectedLayer('service')}
            className={`p-3 rounded-lg border transition-all ${
              selectedLayer === 'service'
                ? 'border-emerald-400 bg-emerald-950/50 shadow-sm ring-1 ring-emerald-500'
                : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
            <div className="font-semibold text-slate-200">5. Service</div>
            <div className="text-[10px] text-slate-400">@Transactional</div>
          </button>

          <button
            onClick={() => setSelectedLayer('repository')}
            className={`p-3 rounded-lg border transition-all ${
              selectedLayer === 'repository'
                ? 'border-purple-400 bg-purple-950/50 shadow-sm ring-1 ring-purple-500'
                : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
            }`}
          >
            <Layers className="w-5 h-5 mx-auto mb-1 text-purple-400" />
            <div className="font-semibold text-slate-200">6. Repository</div>
            <div className="text-[10px] text-slate-400">Spring Data JPA</div>
          </button>

          <button
            onClick={() => setSelectedLayer('database')}
            className={`p-3 rounded-lg border transition-all ${
              selectedLayer === 'database'
                ? 'border-blue-400 bg-blue-950/50 shadow-sm ring-1 ring-blue-500'
                : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
            }`}
          >
            <Database className="w-5 h-5 mx-auto mb-1 text-blue-400" />
            <div className="font-semibold text-slate-200">7. MySQL 8</div>
            <div className="text-[10px] text-slate-400">InnoDB 3NF</div>
          </button>
        </div>

        {/* Selected Layer Details Card */}
        {layersInfo[selectedLayer as keyof typeof layersInfo] && (
          <div className="mt-5 p-4 rounded-lg bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 text-sm font-semibold text-white mb-1">
              <span>{layersInfo[selectedLayer as keyof typeof layersInfo].name}</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              {layersInfo[selectedLayer as keyof typeof layersInfo].description}
            </p>
            <div className="text-xs space-y-1.5">
              <span className="font-semibold text-indigo-400 text-[11px] uppercase tracking-wider">
                Architectural Responsibilities &amp; Fresher Interview Points:
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {layersInfo[selectedLayer as keyof typeof layersInfo].responsibilities.map((resp, i) => (
                  <li key={i}>{resp}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Directory & Package Structure */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-semibold text-white">
              Production Maven Project Directory Hierarchy
            </h3>
            <p className="text-xs text-slate-400">
              Standard layered packaging (<code className="text-indigo-400">com.apex.cms.*</code>) following Spring Boot best practices.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto space-y-2">
          {projectFolderTree.map((root, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                <Folder className="w-4 h-4 text-indigo-400" />
                <span>{root.name}</span>
              </div>
              {root.children?.map((pkg, j) => (
                <div key={j} className="ml-5 space-y-1">
                  {pkg.type === 'folder' ? (
                    <div>
                      <div className="flex items-center gap-1.5 text-amber-300 font-medium">
                        <Folder className="w-3.5 h-3.5 text-amber-400" />
                        <span>{pkg.name}</span>
                        <span className="text-[11px] text-slate-500 font-sans">({pkg.desc})</span>
                      </div>
                      <div className="ml-5 border-l border-slate-800 pl-3 space-y-1 py-1">
                        {pkg.children?.map((file, k) => (
                          <div key={k} className="flex items-center justify-between text-[11px] text-slate-300 py-0.5 hover:text-white">
                            <span className="flex items-center gap-1.5">
                              <FileCode className="w-3 h-3 text-slate-400" />
                              <span>{file.name}</span>
                            </span>
                            <span className="text-slate-500 text-[10px] font-sans">{file.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <FileCode className="w-3 h-3 text-slate-400" />
                        <span>{pkg.name}</span>
                      </span>
                      <span className="text-slate-500 text-[10px] font-sans">{pkg.desc}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
