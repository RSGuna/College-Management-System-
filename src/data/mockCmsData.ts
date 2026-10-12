import { Department, Faculty, Student, Course, AttendanceRecord, FeeRecord, ExamGrade } from '../types';

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 1,
    code: 'CSE',
    name: 'Computer Science & Engineering',
    hodName: 'Dr. Anand Sharma',
    contactEmail: 'cse.hod@apexcollege.edu',
    totalStudents: 140,
    totalFaculty: 12
  },
  {
    id: 2,
    code: 'ECE',
    name: 'Electronics & Communication',
    hodName: 'Dr. Radhika Sen',
    contactEmail: 'ece.hod@apexcollege.edu',
    totalStudents: 95,
    totalFaculty: 9
  },
  {
    id: 3,
    code: 'MECH',
    name: 'Mechanical Engineering',
    hodName: 'Dr. Vikram Patel',
    contactEmail: 'mech.hod@apexcollege.edu',
    totalStudents: 80,
    totalFaculty: 8
  },
  {
    id: 4,
    code: 'IT',
    name: 'Information Technology',
    hodName: 'Dr. Marcus Vance',
    contactEmail: 'it.hod@apexcollege.edu',
    totalStudents: 110,
    totalFaculty: 10
  }
];

export const INITIAL_FACULTY: Faculty[] = [
  {
    id: 1,
    employeeCode: 'EMP-CSE-101',
    firstName: 'Anand',
    lastName: 'Sharma',
    email: 'asharma@apexcollege.edu',
    departmentId: 1,
    departmentName: 'Computer Science & Engineering',
    designation: 'Professor & HOD',
    specialization: 'Distributed Systems & Cloud Computing',
    assignedCourses: ['CS-402 (Distributed Cloud)', 'CS-404 (Security)'],
    status: 'ACTIVE'
  },
  {
    id: 2,
    employeeCode: 'EMP-CSE-102',
    firstName: 'Clara',
    lastName: 'Fernandez',
    email: 'cclara@apexcollege.edu',
    departmentId: 1,
    departmentName: 'Computer Science & Engineering',
    designation: 'Associate Professor',
    specialization: 'Relational DBs & Big Data',
    assignedCourses: ['CS-401 (Advanced DBMS)', 'CS-403 (Data Structures)'],
    status: 'ACTIVE'
  },
  {
    id: 3,
    employeeCode: 'EMP-ECE-201',
    firstName: 'Radhika',
    lastName: 'Sen',
    email: 'rsen@apexcollege.edu',
    departmentId: 2,
    departmentName: 'Electronics & Communication',
    designation: 'Professor & HOD',
    specialization: 'VLSI & Embedded Systems',
    assignedCourses: ['EC-301 (Signals & Systems)'],
    status: 'ACTIVE'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 1,
    rollNumber: 'CS2026-001',
    firstName: 'Alex',
    lastName: 'Chen',
    email: 'alex.chen@student.apexcollege.edu',
    departmentId: 1,
    departmentName: 'Computer Science & Engineering',
    semester: 4,
    gpa: 3.82,
    attendancePercent: 91.5,
    feeStatus: 'PAID',
    enrolledCoursesCount: 4,
    admissionDate: '2024-08-10',
    status: 'ACTIVE'
  },
  {
    id: 2,
    rollNumber: 'CS2026-002',
    firstName: 'Priya',
    lastName: 'Nair',
    email: 'priya.nair@student.apexcollege.edu',
    departmentId: 1,
    departmentName: 'Computer Science & Engineering',
    semester: 4,
    gpa: 3.94,
    attendancePercent: 96.0,
    feeStatus: 'PARTIAL',
    enrolledCoursesCount: 4,
    admissionDate: '2024-08-10',
    status: 'ACTIVE'
  },
  {
    id: 3,
    rollNumber: 'CS2026-003',
    firstName: 'Jordan',
    lastName: 'Miller',
    email: 'jordan.m@student.apexcollege.edu',
    departmentId: 1,
    departmentName: 'Computer Science & Engineering',
    semester: 4,
    gpa: 3.25,
    attendancePercent: 68.2, // Low attendance warning!
    feeStatus: 'PENDING',
    enrolledCoursesCount: 3,
    admissionDate: '2024-08-10',
    status: 'ACTIVE'
  },
  {
    id: 4,
    rollNumber: 'EC2026-015',
    firstName: 'Rohan',
    lastName: 'Deshmukh',
    email: 'rohan.d@student.apexcollege.edu',
    departmentId: 2,
    departmentName: 'Electronics & Communication',
    semester: 4,
    gpa: 3.65,
    attendancePercent: 88.0,
    feeStatus: 'PAID',
    enrolledCoursesCount: 4,
    admissionDate: '2024-08-10',
    status: 'ACTIVE'
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 1,
    courseCode: 'CS-401',
    title: 'Advanced Database Management Systems',
    departmentId: 1,
    departmentName: 'Computer Science & Engineering',
    credits: 4,
    semester: 4,
    facultyId: 2,
    facultyName: 'Dr. Clara Fernandez',
    capacity: 60,
    enrolledCount: 52,
    schedule: 'Mon, Wed 10:00 - 11:30 AM (Hall 3B)'
  },
  {
    id: 2,
    courseCode: 'CS-402',
    title: 'Distributed Cloud Architecture & Microservices',
    departmentId: 1,
    departmentName: 'Computer Science & Engineering',
    credits: 4,
    semester: 4,
    facultyId: 1,
    facultyName: 'Dr. Anand Sharma',
    capacity: 60,
    enrolledCount: 58,
    schedule: 'Tue, Thu 09:00 - 10:30 AM (Hall 1A)'
  },
  {
    id: 3,
    courseCode: 'CS-403',
    title: 'Algorithms & Data Structures in Java',
    departmentId: 1,
    departmentName: 'Computer Science & Engineering',
    credits: 3,
    semester: 4,
    facultyId: 2,
    facultyName: 'Dr. Clara Fernandez',
    capacity: 60,
    enrolledCount: 49,
    schedule: 'Wed, Fri 02:00 - 03:30 PM (Lab 4)'
  },
  {
    id: 4,
    courseCode: 'CS-404',
    title: 'Web Application Security & Cryptography',
    departmentId: 1,
    departmentName: 'Computer Science & Engineering',
    credits: 3,
    semester: 4,
    facultyId: 1,
    facultyName: 'Dr. Anand Sharma',
    capacity: 50,
    enrolledCount: 45,
    schedule: 'Mon, Thu 01:00 - 02:30 PM (Hall 2)'
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 1,
    studentId: 1,
    studentName: 'Alex Chen',
    rollNumber: 'CS2026-001',
    courseId: 1,
    courseCode: 'CS-401',
    courseName: 'Advanced Database Management Systems',
    date: '2026-10-12',
    status: 'PRESENT',
    facultyId: 2
  },
  {
    id: 2,
    studentId: 2,
    studentName: 'Priya Nair',
    rollNumber: 'CS2026-002',
    courseId: 1,
    courseCode: 'CS-401',
    courseName: 'Advanced Database Management Systems',
    date: '2026-10-12',
    status: 'PRESENT',
    facultyId: 2
  },
  {
    id: 3,
    studentId: 3,
    studentName: 'Jordan Miller',
    rollNumber: 'CS2026-003',
    courseId: 1,
    courseCode: 'CS-401',
    courseName: 'Advanced Database Management Systems',
    date: '2026-10-12',
    status: 'ABSENT',
    facultyId: 2
  },
  {
    id: 4,
    studentId: 1,
    studentName: 'Alex Chen',
    rollNumber: 'CS2026-001',
    courseId: 2,
    courseCode: 'CS-402',
    courseName: 'Distributed Cloud Architecture',
    date: '2026-10-11',
    status: 'PRESENT',
    facultyId: 1
  },
  {
    id: 5,
    studentId: 3,
    studentName: 'Jordan Miller',
    rollNumber: 'CS2026-003',
    courseId: 2,
    courseCode: 'CS-402',
    courseName: 'Distributed Cloud Architecture',
    date: '2026-10-11',
    status: 'ABSENT',
    facultyId: 1
  }
];

export const INITIAL_FEES: FeeRecord[] = [
  {
    id: 1,
    studentId: 1,
    studentName: 'Alex Chen',
    rollNumber: 'CS2026-001',
    invoiceNumber: 'INV-2026-001',
    totalAmount: 4500,
    paidAmount: 4500,
    dueAmount: 0,
    dueDate: '2026-11-15',
    status: 'PAID',
    lastTransactionDate: '2026-09-01',
    transactionRef: 'TXN-STRIPE-89101'
  },
  {
    id: 2,
    studentId: 2,
    studentName: 'Priya Nair',
    rollNumber: 'CS2026-002',
    invoiceNumber: 'INV-2026-002',
    totalAmount: 4500,
    paidAmount: 2500,
    dueAmount: 2000,
    dueDate: '2026-11-15',
    status: 'PARTIAL',
    lastTransactionDate: '2026-09-05',
    transactionRef: 'TXN-STRIPE-89390'
  },
  {
    id: 3,
    studentId: 3,
    studentName: 'Jordan Miller',
    rollNumber: 'CS2026-003',
    invoiceNumber: 'INV-2026-003',
    totalAmount: 4500,
    paidAmount: 0,
    dueAmount: 4500,
    dueDate: '2026-11-15',
    status: 'PENDING'
  }
];

export const INITIAL_GRADES: ExamGrade[] = [
  {
    id: 1,
    studentId: 1,
    courseId: 1,
    courseCode: 'CS-401',
    courseTitle: 'Advanced Database Management Systems',
    credits: 4,
    midtermMarks: 46.5,
    finalMarks: 48.0,
    totalMarks: 94.5,
    letterGrade: 'A+',
    gpaPoint: 4.0
  },
  {
    id: 2,
    studentId: 1,
    courseId: 2,
    courseCode: 'CS-402',
    courseTitle: 'Distributed Cloud Architecture',
    credits: 4,
    midtermMarks: 42.0,
    finalMarks: 45.0,
    totalMarks: 87.0,
    letterGrade: 'A',
    gpaPoint: 3.75
  },
  {
    id: 3,
    studentId: 1,
    courseId: 3,
    courseCode: 'CS-403',
    courseTitle: 'Algorithms & Data Structures in Java',
    credits: 3,
    midtermMarks: 41.0,
    finalMarks: 44.0,
    totalMarks: 85.0,
    letterGrade: 'A',
    gpaPoint: 3.75
  }
];

export interface RbacPermission {
  module: string;
  action: string;
  endpoint: string;
  method: string;
  adminAllowed: boolean;
  facultyAllowed: boolean;
  studentAllowed: boolean;
  springSecurityAnnotation: string;
  notes: string;
}

export const RBAC_PERMISSIONS_MATRIX: RbacPermission[] = [
  {
    module: 'Authentication',
    action: 'Login & Obtain JWT Token',
    endpoint: '/api/v1/auth/login',
    method: 'POST',
    adminAllowed: true,
    facultyAllowed: true,
    studentAllowed: true,
    springSecurityAnnotation: '.permitAll()',
    notes: 'Public endpoint. Returns role claims inside the signed JWT payload.'
  },
  {
    module: 'Student Admissions',
    action: 'Admit New Student & Create Account',
    endpoint: '/api/v1/students',
    method: 'POST',
    adminAllowed: true,
    facultyAllowed: false,
    studentAllowed: false,
    springSecurityAnnotation: "@PreAuthorize(\"hasRole('ADMIN')\")",
    notes: 'Only administrators can provision new student records and bind initial login credentials.'
  },
  {
    module: 'Student Directory',
    action: 'View All Students List & Filters',
    endpoint: '/api/v1/students',
    method: 'GET',
    adminAllowed: true,
    facultyAllowed: true,
    studentAllowed: false,
    springSecurityAnnotation: "@PreAuthorize(\"hasAnyRole('ADMIN', 'FACULTY')\")",
    notes: 'Faculty can view student roster for class coordination; students cannot view overall directory.'
  },
  {
    module: 'Student Profile',
    action: 'View Own Student Profile',
    endpoint: '/api/v1/students/{id}',
    method: 'GET',
    adminAllowed: true,
    facultyAllowed: true,
    studentAllowed: true,
    springSecurityAnnotation: "@PreAuthorize(\"hasRole('ADMIN') or hasRole('FACULTY') or #id == principal.studentId\")",
    notes: 'Students can only access their own profile (row-level security verification).'
  },
  {
    module: 'Course Management',
    action: 'Create & Assign Courses',
    endpoint: '/api/v1/courses',
    method: 'POST',
    adminAllowed: true,
    facultyAllowed: false,
    studentAllowed: false,
    springSecurityAnnotation: "@PreAuthorize(\"hasRole('ADMIN')\")",
    notes: 'Curriculum creation and faculty assignments are restricted to College Administrators.'
  },
  {
    module: 'Attendance Recording',
    action: 'Take / Update Daily Class Attendance',
    endpoint: '/api/v1/attendance/mark',
    method: 'POST',
    adminAllowed: false,
    facultyAllowed: true,
    studentAllowed: false,
    springSecurityAnnotation: "@PreAuthorize(\"hasRole('FACULTY')\")",
    notes: 'Only faculty members assigned to the subject can mark attendance sheets.'
  },
  {
    module: 'Attendance View',
    action: 'View Own Attendance Summary',
    endpoint: '/api/v1/attendance/student/{id}/summary',
    method: 'GET',
    adminAllowed: true,
    facultyAllowed: true,
    studentAllowed: true,
    springSecurityAnnotation: "@PreAuthorize(\"hasAnyRole('ADMIN', 'FACULTY') or #id == principal.studentId\")",
    notes: 'Students see personal percentage with low attendance (<75%) warning.'
  },
  {
    module: 'Exam Grading',
    action: 'Submit Midterm & Final Grades',
    endpoint: '/api/v1/grades/submit',
    method: 'POST',
    adminAllowed: true,
    facultyAllowed: true,
    studentAllowed: false,
    springSecurityAnnotation: "@PreAuthorize(\"hasAnyRole('ADMIN', 'FACULTY')\")",
    notes: 'Faculty submit course grades; Admin has moderation rights.'
  },
  {
    module: 'Fee Management',
    action: 'Configure Fee Invoices & Dues',
    endpoint: '/api/v1/fees/invoices',
    method: 'POST',
    adminAllowed: true,
    facultyAllowed: false,
    studentAllowed: false,
    springSecurityAnnotation: "@PreAuthorize(\"hasRole('ADMIN')\")",
    notes: 'Fee structure management is strictly an administrative function.'
  },
  {
    module: 'Fee Payment',
    action: 'Pay Fee Balance & Download Receipt',
    endpoint: '/api/v1/fees/{invoiceNumber}/pay',
    method: 'POST',
    adminAllowed: true,
    facultyAllowed: false,
    studentAllowed: true,
    springSecurityAnnotation: "@PreAuthorize(\"hasAnyRole('ADMIN', 'STUDENT')\")",
    notes: 'Students pay their own semester fees; Admins can record offline counter payments.'
  }
];
