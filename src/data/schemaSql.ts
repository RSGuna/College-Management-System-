export const MYSQL_SCHEMA_SQL = `-- =========================================================================
-- DATABASE: College Management System (CMS)
-- Engine: MySQL 8.0+ | Character Set: utf8mb4 | Collation: utf8mb4_unicode_ci
-- Normalized Design: Third Normal Form (3NF) with Foreign Keys & B-Tree Indexes
-- Architect: Senior Java & Spring Boot Mentor
-- =========================================================================

CREATE DATABASE IF NOT EXISTS college_management_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE college_management_db;

-- Disable Foreign Key checks temporarily for clean initialization
SET FOREIGN_KEY_CHECKS = 0;

-- -------------------------------------------------------------------------
-- 1. ROLES TABLE (RBAC Security)
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;
CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -------------------------------------------------------------------------
-- 2. USERS TABLE (Spring Security Auth Credentials)
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(60) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- BCrypt encoded (cost factor 10+)
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_username (username),
    INDEX idx_users_email (email)
) ENGINE=InnoDB;

-- -------------------------------------------------------------------------
-- 3. USER_ROLES JOIN TABLE (Many-to-Many Mapping)
-- -------------------------------------------------------------------------
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) 
        REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) 
        REFERENCES roles (id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- -------------------------------------------------------------------------
-- 4. DEPARTMENTS TABLE (Academic Divisions)
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS departments;
CREATE TABLE departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,      -- e.g. 'CSE', 'ECE', 'MECH'
    name VARCHAR(100) NOT NULL,
    hod_name VARCHAR(100),
    contact_email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_dept_code (code)
) ENGINE=InnoDB;

-- -------------------------------------------------------------------------
-- 5. FACULTY TABLE (Professors and Instructors)
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS faculty;
CREATE TABLE faculty (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    employee_code VARCHAR(30) NOT NULL UNIQUE,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    department_id BIGINT NOT NULL,
    designation VARCHAR(60) NOT NULL,       -- e.g. 'Associate Professor'
    specialization VARCHAR(100),
    phone VARCHAR(20),
    hire_date DATE NOT NULL,
    status ENUM('ACTIVE', 'ON_LEAVE', 'RESIGNED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_faculty_user FOREIGN KEY (user_id) 
        REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_faculty_dept FOREIGN KEY (department_id) 
        REFERENCES departments (id) ON DELETE RESTRICT,
    INDEX idx_faculty_emp_code (employee_code),
    INDEX idx_faculty_dept (department_id)
) ENGINE=InnoDB;

-- -------------------------------------------------------------------------
-- 6. STUDENTS TABLE (Undergraduate & Postgraduate Enrollees)
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS students;
CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    roll_number VARCHAR(30) NOT NULL UNIQUE, -- e.g. 'CS2026-042'
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    department_id BIGINT NOT NULL,
    current_semester INT NOT NULL DEFAULT 1,
    admission_date DATE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    status ENUM('ACTIVE', 'SUSPENDED', 'ALUMNI') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) 
        REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_student_dept FOREIGN KEY (department_id) 
        REFERENCES departments (id) ON DELETE RESTRICT,
    INDEX idx_student_roll (roll_number),
    INDEX idx_student_dept_sem (department_id, current_semester)
) ENGINE=InnoDB;

-- -------------------------------------------------------------------------
-- 7. COURSES TABLE (Academic Subjects Offered)
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS courses;
CREATE TABLE courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(20) NOT NULL UNIQUE, -- e.g. 'CS401'
    title VARCHAR(120) NOT NULL,
    department_id BIGINT NOT NULL,
    faculty_id BIGINT NULL,
    credits INT NOT NULL DEFAULT 3,
    semester INT NOT NULL,
    max_capacity INT NOT NULL DEFAULT 60,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_course_dept FOREIGN KEY (department_id) 
        REFERENCES departments (id) ON DELETE RESTRICT,
    CONSTRAINT fk_course_faculty FOREIGN KEY (faculty_id) 
        REFERENCES faculty (id) ON DELETE SET NULL,
    INDEX idx_course_code (course_code),
    INDEX idx_course_dept_sem (department_id, semester)
) ENGINE=InnoDB;

-- -------------------------------------------------------------------------
-- 8. ENROLLMENTS TABLE (Student Course Registration with Unique Guard)
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS enrollments;
CREATE TABLE enrollments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    academic_year VARCHAR(10) NOT NULL,     -- e.g. '2026-2027'
    semester INT NOT NULL,
    status ENUM('ENROLLED', 'DROPPED', 'COMPLETED') DEFAULT 'ENROLLED',
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_course UNIQUE (student_id, course_id, academic_year),
    CONSTRAINT fk_enrollment_student FOREIGN KEY (student_id) 
        REFERENCES students (id) ON DELETE CASCADE,
    CONSTRAINT fk_enrollment_course FOREIGN KEY (course_id) 
        REFERENCES courses (id) ON DELETE RESTRICT,
    INDEX idx_enrollment_course (course_id),
    INDEX idx_enrollment_student (student_id)
) ENGINE=InnoDB;

-- -------------------------------------------------------------------------
-- 9. ATTENDANCE TABLE (Daily Class Attendance Tracking)
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS attendance;
CREATE TABLE attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    faculty_id BIGINT NOT NULL,
    attendance_date DATE NOT NULL,
    status ENUM('PRESENT', 'ABSENT', 'LATE') NOT NULL,
    remarks VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_attendance UNIQUE (student_id, course_id, attendance_date),
    CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) 
        REFERENCES students (id) ON DELETE CASCADE,
    CONSTRAINT fk_attendance_course FOREIGN KEY (course_id) 
        REFERENCES courses (id) ON DELETE RESTRICT,
    CONSTRAINT fk_attendance_faculty FOREIGN KEY (faculty_id) 
        REFERENCES faculty (id) ON DELETE RESTRICT,
    INDEX idx_attendance_course_date (course_id, attendance_date),
    INDEX idx_attendance_student_date (student_id, attendance_date)
) ENGINE=InnoDB;

-- -------------------------------------------------------------------------
-- 10. EXAM_GRADES TABLE (Midterm, Final & Grade Evaluation)
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS exam_grades;
CREATE TABLE exam_grades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    semester INT NOT NULL,
    midterm_marks DECIMAL(5, 2) DEFAULT 0.00,
    final_marks DECIMAL(5, 2) DEFAULT 0.00,
    total_marks DECIMAL(5, 2) GENERATED ALWAYS AS (midterm_marks + final_marks) STORED,
    letter_grade VARCHAR(2), -- 'A+', 'A', 'B', 'C', 'F'
    gpa_point DECIMAL(3, 2), -- 4.0 scale
    evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_exam UNIQUE (student_id, course_id, semester),
    CONSTRAINT fk_grades_student FOREIGN KEY (student_id) 
        REFERENCES students (id) ON DELETE CASCADE,
    CONSTRAINT fk_grades_course FOREIGN KEY (course_id) 
        REFERENCES courses (id) ON DELETE RESTRICT,
    INDEX idx_grades_student (student_id)
) ENGINE=InnoDB;

-- -------------------------------------------------------------------------
-- 11. FEE_PAYMENTS TABLE (Finance & Ledger)
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS fee_payments;
CREATE TABLE fee_payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    invoice_number VARCHAR(40) NOT NULL UNIQUE,
    semester INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    paid_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    due_amount DECIMAL(10, 2) NOT NULL,
    payment_status ENUM('PAID', 'PARTIAL', 'PENDING') DEFAULT 'PENDING',
    due_date DATE NOT NULL,
    last_paid_at TIMESTAMP NULL,
    transaction_ref VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fees_student FOREIGN KEY (student_id) 
        REFERENCES students (id) ON DELETE CASCADE,
    INDEX idx_fee_student (student_id),
    INDEX idx_fee_status (payment_status)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================================
-- SEED DATA (For Immediate Development & Testing)
-- =========================================================================

-- Roles
INSERT INTO roles (id, name, description) VALUES
(1, 'ROLE_ADMIN', 'Super administrator with full institutional privileges'),
(2, 'ROLE_FACULTY', 'Teaching faculty with course, attendance and grading authority'),
(3, 'ROLE_STUDENT', 'Enrolled student with view access to classes, grades and fee ledgers');

-- Passwords are BCrypt hash for "Password@123"
-- $2a$10$7zB3HlG8mP8tX2vD1r4sOuZ5P1a.v5T1yQ8hY7rZ4sZ9jV2kX5eGq
INSERT INTO users (id, username, email, password_hash, is_active) VALUES
(1, 'admin', 'admin@apexcollege.edu', '$2a$10$7zB3HlG8mP8tX2vD1r4sOuZ5P1a.v5T1yQ8hY7rZ4sZ9jV2kX5eGq', 1),
(2, 'dr_sharma', 'asharma@apexcollege.edu', '$2a$10$7zB3HlG8mP8tX2vD1r4sOuZ5P1a.v5T1yQ8hY7rZ4sZ9jV2kX5eGq', 1),
(3, 'prof_clara', 'cclara@apexcollege.edu', '$2a$10$7zB3HlG8mP8tX2vD1r4sOuZ5P1a.v5T1yQ8hY7rZ4sZ9jV2kX5eGq', 1),
(4, 'alex_chen', 'alex.chen@student.apexcollege.edu', '$2a$10$7zB3HlG8mP8tX2vD1r4sOuZ5P1a.v5T1yQ8hY7rZ4sZ9jV2kX5eGq', 1),
(5, 'priya_nair', 'priya.nair@student.apexcollege.edu', '$2a$10$7zB3HlG8mP8tX2vD1r4sOuZ5P1a.v5T1yQ8hY7rZ4sZ9jV2kX5eGq', 1);

INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1),
(2, 2),
(3, 2),
(4, 3),
(5, 3);

-- Departments
INSERT INTO departments (id, code, name, hod_name, contact_email) VALUES
(1, 'CSE', 'Computer Science & Engineering', 'Dr. Anand Sharma', 'cse.hod@apexcollege.edu'),
(2, 'ECE', 'Electronics & Communication', 'Dr. Radhika Sen', 'ece.hod@apexcollege.edu'),
(3, 'MECH', 'Mechanical Engineering', 'Dr. Vikram Patel', 'mech.hod@apexcollege.edu'),
(4, 'IT', 'Information Technology', 'Dr. Marcus Vance', 'it.hod@apexcollege.edu');

-- Faculty
INSERT INTO faculty (id, user_id, employee_code, first_name, last_name, department_id, designation, specialization, phone, hire_date) VALUES
(1, 2, 'EMP-CSE-101', 'Anand', 'Sharma', 1, 'Professor & HOD', 'Distributed Systems & Cloud Computing', '+1-555-0192', '2018-06-15'),
(2, 3, 'EMP-CSE-102', 'Clara', 'Fernandez', 1, 'Associate Professor', 'Database Systems & Big Data', '+1-555-0198', '2020-08-01');

-- Students
INSERT INTO students (id, user_id, roll_number, first_name, last_name, department_id, current_semester, admission_date, phone) VALUES
(1, 4, 'CS2026-001', 'Alex', 'Chen', 1, 4, '2024-08-10', '+1-555-0321'),
(2, 5, 'CS2026-002', 'Priya', 'Nair', 1, 4, '2024-08-10', '+1-555-0344');

-- Courses
INSERT INTO courses (id, course_code, title, department_id, faculty_id, credits, semester, max_capacity) VALUES
(1, 'CS-401', 'Advanced Database Management Systems', 1, 2, 4, 4, 60),
(2, 'CS-402', 'Distributed Cloud Architecture & Microservices', 1, 1, 4, 4, 60),
(3, 'CS-403', 'Algorithms & Data Structures in Java', 1, 2, 3, 4, 60),
(4, 'CS-404', 'Web Application Security & Cryptography', 1, 1, 3, 4, 60);

-- Enrollments
INSERT INTO enrollments (student_id, course_id, academic_year, semester, status) VALUES
(1, 1, '2025-2026', 4, 'ENROLLED'),
(1, 2, '2025-2026', 4, 'ENROLLED'),
(1, 3, '2025-2026', 4, 'ENROLLED'),
(2, 1, '2025-2026', 4, 'ENROLLED'),
(2, 2, '2025-2026', 4, 'ENROLLED');

-- Fees
INSERT INTO fee_payments (student_id, invoice_number, semester, total_amount, paid_amount, due_amount, payment_status, due_date, transaction_ref) VALUES
(1, 'INV-2026-001', 4, 4500.00, 4500.00, 0.00, 'PAID', '2026-02-15', 'TXN-STRIPE-89312'),
(2, 'INV-2026-002', 4, 4500.00, 2500.00, 2000.00, 'PARTIAL', '2026-02-15', 'TXN-STRIPE-89390');
`;
