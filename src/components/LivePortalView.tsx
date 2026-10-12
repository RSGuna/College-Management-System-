import React, { useState } from 'react';
import {
  GraduationCap, Users, BookOpen, CreditCard, CalendarCheck, CheckCircle2,
  AlertTriangle, Plus, Search, Shield, UserCheck, DollarSign, Award
} from 'lucide-react';
import { RoleType, Student, Faculty, Course, AttendanceRecord, FeeRecord } from '../types';
import {
  INITIAL_STUDENTS, INITIAL_FACULTY, INITIAL_COURSES,
  INITIAL_ATTENDANCE, INITIAL_FEES, INITIAL_DEPARTMENTS, INITIAL_GRADES
} from '../data/mockCmsData';

interface LivePortalViewProps {
  currentRole: RoleType;
  setCurrentRole: (role: RoleType) => void;
}

export const LivePortalView: React.FC<LivePortalViewProps> = ({ currentRole, setCurrentRole }) => {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [courses] = useState<Course[]>(INITIAL_COURSES);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [fees, setFees] = useState<FeeRecord[]>(INITIAL_FEES);
  const [grades] = useState(INITIAL_GRADES);

  // Filter & Search states
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');

  // Admin New Student Modal state
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);
  const [newRoll, setNewRoll] = useState('');
  const [newFirst, setNewFirst] = useState('');
  const [newLast, setNewLast] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Faculty Attendance Marking state
  const [selectedCourseForAttendance, setSelectedCourseForAttendance] = useState<number>(1);
  const [attendanceDate, setAttendanceDate] = useState<string>('2026-10-12');
  const [liveMarkings, setLiveMarkings] = useState<Record<number, 'PRESENT' | 'ABSENT' | 'LATE'>>({
    1: 'PRESENT',
    2: 'PRESENT',
    3: 'ABSENT',
    4: 'PRESENT'
  });
  const [attendanceSavedMessage, setAttendanceSavedMessage] = useState<string | null>(null);

  // Student Fee Payment State
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);

  // Handle Admin Student Admission
  const handleAdmitStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoll || !newFirst || !newLast) return;

    const newStudent: Student = {
      id: students.length + 1,
      rollNumber: newRoll,
      firstName: newFirst,
      lastName: newLast,
      email: newEmail || `${newFirst.toLowerCase()}.${newLast.toLowerCase()}@student.apexcollege.edu`,
      departmentId: 1,
      departmentName: 'Computer Science & Engineering',
      semester: 1,
      gpa: 4.0,
      attendancePercent: 100.0,
      feeStatus: 'PENDING',
      enrolledCoursesCount: 4,
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE'
    };

    setStudents([newStudent, ...students]);
    setIsAdmitModalOpen(false);
    setNewRoll('');
    setNewFirst('');
    setNewLast('');
    setNewEmail('');
  };

  // Handle Faculty Attendance Save
  const handleSaveAttendance = () => {
    const targetCourse = courses.find((c) => c.id === selectedCourseForAttendance);
    const newRecords: AttendanceRecord[] = Object.entries(liveMarkings).map(([studentIdStr, status]) => {
      const sId = Number(studentIdStr);
      const student = students.find((s) => s.id === sId);
      return {
        id: attendance.length + Math.random(),
        studentId: sId,
        studentName: student ? `${student.firstName} ${student.lastName}` : `Student #${sId}`,
        rollNumber: student?.rollNumber || 'UNKNOWN',
        courseId: selectedCourseForAttendance,
        courseCode: targetCourse?.courseCode || 'CS-401',
        courseName: targetCourse?.title || 'Course',
        date: attendanceDate,
        status,
        facultyId: 2
      };
    });

    setAttendance([...newRecords, ...attendance]);
    setAttendanceSavedMessage(`Attendance successfully recorded for ${newRecords.length} students in ${targetCourse?.courseCode}!`);
    setTimeout(() => setAttendanceSavedMessage(null), 3000);
  };

  // Handle Student Fee Pay
  const handlePayFee = (recordId: number) => {
    setFees(
      fees.map((f) => {
        if (f.id === recordId) {
          return {
            ...f,
            paidAmount: f.totalAmount,
            dueAmount: 0,
            status: 'PAID',
            lastTransactionDate: new Date().toISOString().split('T')[0],
            transactionRef: 'TXN-PAY-' + Math.floor(100000 + Math.random() * 900000)
          };
        }
        return f;
      })
    );
    setPaymentSuccessMessage('Semester Tuition Fee paid successfully! Receipt generated.');
    setTimeout(() => setPaymentSuccessMessage(null), 3500);
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.firstName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.lastName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesDept = selectedDeptFilter === 'ALL' || s.departmentName.includes(selectedDeptFilter);
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Role State Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 font-bold">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-slate-200 font-medium flex items-center gap-2">
              <span>Logged In Identity:</span>
              <span className="font-semibold text-white">
                {currentRole === 'ROLE_ADMIN' ? 'Dr. Robert Vance (Dean of Academics)' : currentRole === 'ROLE_FACULTY' ? 'Dr. Clara Fernandez (Faculty / HOD)' : 'Alex Chen (Student - CS2026-001)'}
              </span>
            </div>
            <div className="text-slate-400">
              Authority granted: <code className="text-indigo-300 font-mono">{currentRole}</code>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-slate-500">Switch Perspective:</span>
          {(['ROLE_ADMIN', 'ROLE_FACULTY', 'ROLE_STUDENT'] as RoleType[]).map((r) => (
            <button
              key={r}
              onClick={() => setCurrentRole(r)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                currentRole === r
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {r === 'ROLE_ADMIN' ? 'Admin' : r === 'ROLE_FACULTY' ? 'Faculty' : 'Student'}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. ADMIN PERSPECTIVE VIEW */}
      {/* ========================================================================= */}
      {currentRole === 'ROLE_ADMIN' && (
        <div className="space-y-6">
          {/* Institutional KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-slate-100">
              <div className="text-xs text-slate-400 font-medium mb-1">Total Enrolled Students</div>
              <div className="text-2xl font-bold text-white flex items-center justify-between">
                <span>{students.length * 105}</span>
                <Users className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
                <span>+8.4% YoY admissions</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-slate-100">
              <div className="text-xs text-slate-400 font-medium mb-1">Active Faculty Members</div>
              <div className="text-2xl font-bold text-white flex items-center justify-between">
                <span>38</span>
                <GraduationCap className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                Across 4 departments
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-slate-100">
              <div className="text-xs text-slate-400 font-medium mb-1">Courses Offered This Term</div>
              <div className="text-2xl font-bold text-white flex items-center justify-between">
                <span>{courses.length}</span>
                <BookOpen className="w-5 h-5 text-sky-400" />
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                100% faculty allocated
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-slate-100">
              <div className="text-xs text-slate-400 font-medium mb-1">Fee Collection Rate</div>
              <div className="text-2xl font-bold text-white flex items-center justify-between">
                <span>92.6%</span>
                <CreditCard className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-[11px] text-emerald-400 mt-2">
                $384,500 collected
              </div>
            </div>
          </div>

          {/* Student Admissions & Registry Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-slate-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-white">Student Admissions &amp; Roster Management</h3>
                <p className="text-xs text-slate-400">
                  Enforces Spring Security <code className="text-indigo-400">@PreAuthorize("hasRole('ADMIN')")</code> on create/update operations.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAdmitModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Admit New Student</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by student name or roll number..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none"
              >
                <option value="ALL">All Departments</option>
                <option value="Computer Science">Computer Science (CSE)</option>
                <option value="Electronics">Electronics (ECE)</option>
              </select>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Roll Number</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Semester</th>
                    <th className="py-2.5 px-3">GPA</th>
                    <th className="py-2.5 px-3">Attendance</th>
                    <th className="py-2.5 px-3">Fee Status</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-200">
                        {student.rollNumber}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-white">{student.firstName} {student.lastName}</div>
                        <div className="text-[10px] text-slate-500">{student.email}</div>
                      </td>
                      <td className="py-2.5 px-3">{student.departmentName}</td>
                      <td className="py-2.5 px-3 font-mono">Sem {student.semester}</td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-indigo-300">{student.gpa.toFixed(2)}</td>
                      <td className="py-2.5 px-3 font-mono">
                        <span className={student.attendancePercent < 75 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                          {student.attendancePercent}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          student.feeStatus === 'PAID'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : student.feeStatus === 'PARTIAL'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}>
                          {student.feeStatus}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded">
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Admission Modal */}
          {isAdmitModalOpen && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
              <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-semibold text-white">Admit New Student Profile</h4>
                  <button
                    onClick={() => setIsAdmitModalOpen(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleAdmitStudent} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Roll Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CS2026-050"
                      value={newRoll}
                      onChange={(e) => setNewRoll(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 mb-1">First Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John"
                        value={newFirst}
                        onChange={(e) => setNewFirst(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Last Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Doe"
                        value={newLast}
                        onChange={(e) => setNewLast(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="john.doe@student.apexcollege.edu"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAdmitModalOpen(false)}
                      className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded text-xs"
                    >
                      Save &amp; Provision User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FACULTY PERSPECTIVE VIEW */}
      {/* ========================================================================= */}
      {currentRole === 'ROLE_FACULTY' && (
        <div className="space-y-6">
          {/* Faculty Header Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Classroom Attendance Register &amp; Grade Posting
                </h3>
                <p className="text-xs text-slate-400">
                  Secured with <code className="text-indigo-400">@PreAuthorize("hasRole('FACULTY')")</code>. Submits atomic batch updates to the MySQL attendance table.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Class Date:</span>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded px-2.5 py-1 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Course Selector Tabs */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800">
              {courses.slice(0, 2).map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCourseForAttendance(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCourseForAttendance === c.id
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {c.courseCode}: {c.title}
                </button>
              ))}
            </div>
          </div>

          {/* Attendance Feedback Alert */}
          {attendanceSavedMessage && (
            <div className="p-3.5 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{attendanceSavedMessage}</span>
            </div>
          )}

          {/* Interactive Attendance Register */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white">
                Student Roster for {courses.find((c) => c.id === selectedCourseForAttendance)?.courseCode}
              </div>
              <button
                onClick={handleSaveAttendance}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow transition-colors flex items-center gap-1.5"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Submit Class Attendance</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Roll Number</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Current Percentage</th>
                    <th className="py-2.5 px-3 text-right">Attendance Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {students.map((student) => {
                    const currentStatus = liveMarkings[student.id] || 'PRESENT';
                    return (
                      <tr key={student.id} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-200">
                          {student.rollNumber}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-white">
                          {student.firstName} {student.lastName}
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          <span className={student.attendancePercent < 75 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                            {student.attendancePercent}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="inline-flex rounded-lg border border-slate-800 bg-slate-950 p-0.5">
                            {(['PRESENT', 'ABSENT', 'LATE'] as const).map((st) => (
                              <button
                                key={st}
                                onClick={() => setLiveMarkings({ ...liveMarkings, [student.id]: st })}
                                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                                  currentStatus === st
                                    ? st === 'PRESENT'
                                      ? 'bg-emerald-600 text-white'
                                      : st === 'ABSENT'
                                      ? 'bg-rose-600 text-white'
                                      : 'bg-amber-600 text-white'
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. STUDENT PERSPECTIVE VIEW */}
      {/* ========================================================================= */}
      {currentRole === 'ROLE_STUDENT' && (
        <div className="space-y-6">
          {paymentSuccessMessage && (
            <div className="p-3.5 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{paymentSuccessMessage}</span>
            </div>
          )}

          {/* Student Profile & Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-slate-100">
              <div className="text-xs text-slate-400 font-medium mb-1">Academic Status</div>
              <div className="text-lg font-bold text-white">Alex Chen</div>
              <div className="font-mono text-xs text-slate-400 mt-1">Roll: CS2026-001 · Semester 4</div>
              <div className="text-xs text-indigo-400 mt-2">Computer Science &amp; Engineering</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-slate-100">
              <div className="text-xs text-slate-400 font-medium mb-1">Overall Attendance Meter</div>
              <div className="text-2xl font-bold text-emerald-400 flex items-center justify-between">
                <span>91.5%</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                Eligible for final examinations (Threshold: &ge; 75%)
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-slate-100">
              <div className="text-xs text-slate-400 font-medium mb-1">Cumulative GPA</div>
              <div className="text-2xl font-bold text-indigo-400 flex items-center justify-between">
                <span>3.82 / 4.0</span>
                <Award className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                Dean&apos;s Honor List Standing
              </div>
            </div>
          </div>

          {/* Enrolled Courses & Grades */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-slate-100 space-y-4">
            <h3 className="text-base font-semibold text-white">Enrolled Subjects &amp; Grade Transcript</h3>

            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Course Code</th>
                    <th className="py-2.5 px-3">Course Title</th>
                    <th className="py-2.5 px-3">Credits</th>
                    <th className="py-2.5 px-3">Midterm</th>
                    <th className="py-2.5 px-3">Final</th>
                    <th className="py-2.5 px-3">Total Marks</th>
                    <th className="py-2.5 px-3">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                  {grades.map((gr) => (
                    <tr key={gr.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-semibold text-slate-200">{gr.courseCode}</td>
                      <td className="py-2.5 px-3 font-sans text-white">{gr.courseTitle}</td>
                      <td className="py-2.5 px-3">{gr.credits}</td>
                      <td className="py-2.5 px-3">{gr.midtermMarks} / 50</td>
                      <td className="py-2.5 px-3">{gr.finalMarks} / 50</td>
                      <td className="py-2.5 px-3 font-bold text-slate-100">{gr.totalMarks}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                          {gr.letterGrade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fee Payments Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Semester Tuition &amp; Fee Ledger</h3>
                <p className="text-xs text-slate-400">
                  Row-level security ensures students can only view and settle their own invoices.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Invoice Number</th>
                    <th className="py-2.5 px-3">Total Amount</th>
                    <th className="py-2.5 px-3">Paid Amount</th>
                    <th className="py-2.5 px-3">Due Balance</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Payment Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {fees.slice(0, 1).map((fee) => (
                    <tr key={fee.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-200">
                        {fee.invoiceNumber}
                      </td>
                      <td className="py-2.5 px-3 font-mono">${fee.totalAmount.toFixed(2)}</td>
                      <td className="py-2.5 px-3 font-mono text-emerald-400">${fee.paidAmount.toFixed(2)}</td>
                      <td className="py-2.5 px-3 font-mono text-rose-400 font-semibold">${fee.dueAmount.toFixed(2)}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          fee.status === 'PAID'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {fee.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {fee.dueAmount > 0 ? (
                          <button
                            onClick={() => handlePayFee(fee.id)}
                            className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
                          >
                            Pay Balance (${fee.dueAmount})
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-400 flex items-center gap-1 justify-end">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
