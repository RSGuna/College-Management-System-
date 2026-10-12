export type RoleType = 'ROLE_ADMIN' | 'ROLE_FACULTY' | 'ROLE_STUDENT';

export interface Department {
  id: number;
  code: string;
  name: string;
  hodName: string;
  contactEmail: string;
  totalStudents: number;
  totalFaculty: number;
}

export interface Student {
  id: number;
  rollNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: number;
  departmentName: string;
  semester: number;
  gpa: number;
  attendancePercent: number;
  feeStatus: 'PAID' | 'PARTIAL' | 'PENDING';
  enrolledCoursesCount: number;
  admissionDate: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Faculty {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: number;
  departmentName: string;
  designation: string;
  specialization: string;
  assignedCourses: string[];
  status: 'ACTIVE' | 'ON_LEAVE';
}

export interface Course {
  id: number;
  courseCode: string;
  title: string;
  departmentId: number;
  departmentName: string;
  credits: number;
  semester: number;
  facultyId?: number;
  facultyName?: string;
  capacity: number;
  enrolledCount: number;
  schedule: string;
}

export interface AttendanceRecord {
  id: number;
  studentId: number;
  studentName: string;
  rollNumber: string;
  courseId: number;
  courseCode: string;
  courseName: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  facultyId: number;
}

export interface FeeRecord {
  id: number;
  studentId: number;
  studentName: string;
  rollNumber: string;
  invoiceNumber: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  status: 'PAID' | 'PARTIAL' | 'PENDING';
  lastTransactionDate?: string;
  transactionRef?: string;
}

export interface ExamGrade {
  id: number;
  studentId: number;
  courseId: number;
  courseCode: string;
  courseTitle: string;
  credits: number;
  midtermMarks: number;
  finalMarks: number;
  totalMarks: number;
  letterGrade: string;
  gpaPoint: number;
}

export interface CodeFile {
  id: string;
  filename: string;
  path: string;
  category: 'Configuration' | 'Entity' | 'Repository' | 'Security' | 'Service' | 'Controller' | 'DTO' | 'Exception';
  description: string;
  code: string;
}

export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  authRequired: boolean;
  requiredRole?: string;
  description: string;
  requestBody?: string;
  responseSample: string;
  curlExample: string;
  mobileUsageNote: string;
}
