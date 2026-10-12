import { ApiEndpoint } from '../types';

export const API_ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'auth-login',
    method: 'POST',
    path: '/api/v1/auth/login',
    summary: 'Authenticate User & Issue JWT Token',
    authRequired: false,
    description: 'Validates username and BCrypt password. Returns a signed JWT token with claims, user roles, and expiration timestamp.',
    requestBody: JSON.stringify({
      username: 'admin',
      password: 'Password@123'
    }, null, 2),
    responseSample: JSON.stringify({
      status: 200,
      message: 'Authentication successful',
      data: {
        accessToken: 'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGV4LWNvbGxlZ2Utc3lzdGVtIiwic3ViIjoiYWRtaW4iLCJyb2xlcyI6WyJST0xFX0FETUlOIl19.signatureSample',
        tokenType: 'Bearer',
        username: 'admin',
        roles: ['ROLE_ADMIN'],
        userId: 1,
        expiresInMs: 86400000
      }
    }, null, 2),
    curlExample: `curl -X POST http://localhost:8080/api/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"username": "admin", "password": "Password@123"}'`,
    mobileUsageNote: 'Call on initial login screen. Store accessToken securely in Keychain (iOS) / EncryptedSharedPreferences (Android) or Expo SecureStore. Include in subsequent HTTP headers as "Authorization: Bearer <token>".'
  },
  {
    id: 'students-list',
    method: 'GET',
    path: '/api/v1/students?page=0&size=10&departmentId=1',
    summary: 'List Students (Paginated)',
    authRequired: true,
    requiredRole: 'ROLE_ADMIN, ROLE_FACULTY',
    description: 'Fetches paginated list of students filtered by department with metadata like totalPages, totalElements, and current page.',
    responseSample: JSON.stringify({
      status: 200,
      message: 'Students retrieved successfully',
      data: {
        content: [
          {
            id: 1,
            rollNumber: 'CS2026-001',
            firstName: 'Alex',
            lastName: 'Chen',
            email: 'alex.chen@student.apexcollege.edu',
            department: { id: 1, code: 'CSE', name: 'Computer Science' },
            currentSemester: 4,
            attendancePercent: 92.4,
            status: 'ACTIVE'
          }
        ],
        pageNumber: 0,
        pageSize: 10,
        totalElements: 48,
        totalPages: 5,
        last: false
      }
    }, null, 2),
    curlExample: `curl -X GET "http://localhost:8080/api/v1/students?page=0&size=10" \\
  -H "Authorization: Bearer \${JWT_TOKEN}"`,
    mobileUsageNote: 'Implement infinite scroll or pull-to-refresh in FlatList using pageNumber increments until "last" === true.'
  },
  {
    id: 'students-create',
    method: 'POST',
    path: '/api/v1/students',
    summary: 'Admit New Student',
    authRequired: true,
    requiredRole: 'ROLE_ADMIN',
    description: 'Registers a new student profile and provisions their system user login account.',
    requestBody: JSON.stringify({
      rollNumber: 'CS2026-045',
      firstName: 'Samantha',
      lastName: 'Ray',
      email: 'samantha.ray@student.apexcollege.edu',
      departmentId: 1,
      currentSemester: 1,
      admissionDate: '2026-08-15',
      phone: '+1-555-0819'
    }, null, 2),
    responseSample: JSON.stringify({
      status: 201,
      message: 'Student admitted successfully',
      data: {
        id: 12,
        rollNumber: 'CS2026-045',
        firstName: 'Samantha',
        lastName: 'Ray',
        department: { id: 1, code: 'CSE', name: 'Computer Science' },
        status: 'ACTIVE'
      }
    }, null, 2),
    curlExample: `curl -X POST http://localhost:8080/api/v1/students \\
  -H "Authorization: Bearer \${JWT_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d '{"rollNumber":"CS2026-045","firstName":"Samantha","lastName":"Ray","email":"samantha.ray@student.apexcollege.edu","departmentId":1,"currentSemester":1,"admissionDate":"2026-08-15"}'`,
    mobileUsageNote: 'Form validation with Hibernate Validator. Check 400 Bad Request to display inline field error messages.'
  },
  {
    id: 'attendance-record',
    method: 'POST',
    path: '/api/v1/attendance/mark',
    summary: 'Mark Course Attendance (Batch)',
    authRequired: true,
    requiredRole: 'ROLE_FACULTY',
    description: 'Allows faculty to submit attendance records for multiple students in a single atomic database transaction.',
    requestBody: JSON.stringify({
      courseId: 1,
      attendanceDate: '2026-10-12',
      records: [
        { studentId: 1, status: 'PRESENT', remarks: 'On time' },
        { studentId: 2, status: 'ABSENT', remarks: 'Sick leave' }
      ]
    }, null, 2),
    responseSample: JSON.stringify({
      status: 200,
      message: 'Attendance recorded successfully for 2 students',
      data: {
        courseCode: 'CS-401',
        date: '2026-10-12',
        totalMarked: 2,
        presentCount: 1,
        absentCount: 1
      }
    }, null, 2),
    curlExample: `curl -X POST http://localhost:8080/api/v1/attendance/mark \\
  -H "Authorization: Bearer \${JWT_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d '{"courseId":1,"attendanceDate":"2026-10-12","records":[{"studentId":1,"status":"PRESENT"}]}'`,
    mobileUsageNote: 'Perfect for quick mobile Faculty tap-to-mark interface with offline queue sync.'
  },
  {
    id: 'student-attendance-summary',
    method: 'GET',
    path: '/api/v1/attendance/student/{studentId}/summary',
    summary: 'Get Student Attendance Analytics',
    authRequired: true,
    requiredRole: 'ROLE_STUDENT, ROLE_FACULTY, ROLE_ADMIN',
    description: 'Calculates aggregate attendance percentage per course and flags subjects below the mandatory 75% attendance threshold.',
    responseSample: JSON.stringify({
      status: 200,
      message: 'Attendance summary retrieved',
      data: {
        studentId: 1,
        overallPercentage: 88.5,
        isEligibleForExams: true,
        breakdown: [
          { courseCode: 'CS-401', totalClasses: 30, attended: 28, percentage: 93.3, lowAttendanceWarning: false },
          { courseCode: 'CS-402', totalClasses: 28, attended: 20, percentage: 71.4, lowAttendanceWarning: true }
        ]
      }
    }, null, 2),
    curlExample: `curl -X GET http://localhost:8080/api/v1/attendance/student/1/summary \\
  -H "Authorization: Bearer \${JWT_TOKEN}"`,
    mobileUsageNote: 'Powers the student circular progress ring and badge alerts on the mobile student home screen.'
  },
  {
    id: 'fee-pay',
    method: 'POST',
    path: '/api/v1/fees/{invoiceNumber}/pay',
    summary: 'Process Fee Payment',
    authRequired: true,
    requiredRole: 'ROLE_STUDENT, ROLE_ADMIN',
    description: 'Updates fee invoice balances and issues payment receipts with idempotency checking.',
    requestBody: JSON.stringify({
      amount: 2000.00,
      paymentMethod: 'CREDIT_CARD',
      transactionReference: 'TXN-STRIPE-MOBILE-99882'
    }, null, 2),
    responseSample: JSON.stringify({
      status: 200,
      message: 'Fee payment processed successfully',
      data: {
        invoiceNumber: 'INV-2026-002',
        paidAmount: 4500.00,
        dueAmount: 0.00,
        paymentStatus: 'PAID',
        receiptUrl: 'https://apexcollege.edu/receipts/INV-2026-002.pdf'
      }
    }, null, 2),
    curlExample: `curl -X POST http://localhost:8080/api/v1/fees/INV-2026-002/pay \\
  -H "Authorization: Bearer \${JWT_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d '{"amount":2000.00,"paymentMethod":"UPI","transactionReference":"TXN-12345"}'`,
    mobileUsageNote: 'Integrate with Razorpay/Stripe Mobile SDK. Pass verified payment reference to this endpoint.'
  }
];

export const MOBILE_INTEGRATION_SNIPPETS = {
  reactNative: `// React Native / Expo: services/apiClient.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'http://10.0.2.2:8080'; // 10.0.2.2 for Android Emulator, localhost for iOS simulator

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Automatic JWT Interceptor
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('user_token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// Response Interceptor for 401 handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear token & redirect to Login screen
      await SecureStore.deleteItemAsync('user_token');
    }
    return Promise.reject(error);
  }
);`,

  androidKotlin: `// Android (Kotlin): network/ApiService.kt
package com.apex.cms.mobile.network

import retrofit2.Response
import retrofit2.http.*

interface ApiService {
    @POST("/api/v1/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<ApiResponse<JwtAuthResponse>>

    @GET("/api/v1/students")
    suspend fun getStudents(
        @Query("page") page: Int,
        @Query("size") size: Int,
        @Header("Authorization") token: String
    ): Response<ApiResponse<PageResponse<StudentDto>>>

    @POST("/api/v1/attendance/mark")
    suspend fun markAttendance(
        @Body request: AttendanceBatchRequest,
        @Header("Authorization") token: String
    ): Response<ApiResponse<AttendanceSummaryDto>>
}`
};

export const POSTMAN_COLLECTION_JSON = {
  info: {
    name: "College Management System - Spring Boot 3 API",
    description: "Production Postman Collection with Environment Variables and Pre-request Scripts for College Management System",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  item: [
    {
      name: "Authentication",
      item: [
        {
          name: "POST Login (Admin)",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({ username: "admin", password: "Password@123" })
            },
            url: { raw: "{{base_url}}/api/v1/auth/login", host: ["{{base_url}}"], path: ["api", "v1", "auth", "login"] }
          }
        }
      ]
    },
    {
      name: "Students",
      item: [
        {
          name: "GET All Students (Paginated)",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/api/v1/students?page=0&size=10", host: ["{{base_url}}"], path: ["api", "v1", "students"] }
          }
        },
        {
          name: "POST Admit Student",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{token}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                rollNumber: "CS2026-099",
                firstName: "Rohan",
                lastName: "Gupta",
                email: "rohan.gupta@student.apexcollege.edu",
                departmentId: 1,
                currentSemester: 1,
                admissionDate: "2026-08-10"
              })
            },
            url: { raw: "{{base_url}}/api/v1/students", host: ["{{base_url}}"], path: ["api", "v1", "students"] }
          }
        }
      ]
    },
    {
      name: "Attendance",
      item: [
        {
          name: "POST Mark Attendance (Faculty)",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{token}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                courseId: 1,
                attendanceDate: "2026-10-12",
                records: [{ studentId: 1, status: "PRESENT" }]
              })
            },
            url: { raw: "{{base_url}}/api/v1/attendance/mark", host: ["{{base_url}}"], path: ["api", "v1", "attendance", "mark"] }
          }
        }
      ]
    }
  ]
};
