import React, { useState } from 'react';
import { Shield, ShieldAlert, CheckCircle, XCircle, Lock, Key, Copy, Check, Terminal } from 'lucide-react';
import { RoleType } from '../types';
import { RBAC_PERMISSIONS_MATRIX, RbacPermission } from '../data/mockCmsData';

interface RbacSecurityMatrixProps {
  currentRole: RoleType;
  setCurrentRole: (role: RoleType) => void;
}

export const RbacSecurityMatrix: React.FC<RbacSecurityMatrixProps> = ({
  currentRole,
  setCurrentRole
}) => {
  const [selectedPermission, setSelectedPermission] = useState<RbacPermission>(RBAC_PERMISSIONS_MATRIX[1]);
  const [testResult, setTestResult] = useState<{ allowed: boolean; message: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleTestEndpoint = (perm: RbacPermission) => {
    setSelectedPermission(perm);
    const isAllowed =
      (currentRole === 'ROLE_ADMIN' && perm.adminAllowed) ||
      (currentRole === 'ROLE_FACULTY' && perm.facultyAllowed) ||
      (currentRole === 'ROLE_STUDENT' && perm.studentAllowed);

    if (isAllowed) {
      setTestResult({
        allowed: true,
        message: `HTTP 200 OK: Access Granted. Role [${currentRole}] matches authorization requirement: ${perm.springSecurityAnnotation}`
      });
    } else {
      setTestResult({
        allowed: false,
        message: `HTTP 403 FORBIDDEN: Access Denied. Role [${currentRole}] lacks authority for [${perm.action}]. Spring Security AccessDeniedHandler intercepted request.`
      });
    }
  };

  const copySnippet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const tokenPayload = {
    iss: 'apex-college-system',
    sub: currentRole === 'ROLE_ADMIN' ? 'admin' : currentRole === 'ROLE_FACULTY' ? 'dr_sharma' : 'alex_chen',
    roles: [currentRole],
    userId: currentRole === 'ROLE_ADMIN' ? 1 : currentRole === 'ROLE_FACULTY' ? 2 : 4,
    studentId: currentRole === 'ROLE_STUDENT' ? 1 : null,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400
  };

  return (
    <div className="space-y-6">
      {/* Architect Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800">
                <Shield className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-semibold text-white">
                Spring Security 6 Role-Based Access Control (RBAC) Architecture
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-3xl">
              Strict multi-tier enforcement preventing privilege escalation. Enforces the Principle of Least Privilege (PoLP) via stateless JWT tokens, Servlet Filter Chains, and SpEL-based method security annotations.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400">Current Role Test:</span>
            <span className="font-mono font-semibold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
              {currentRole}
            </span>
          </div>
        </div>

        {/* Roles Definition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 pt-4 border-t border-slate-800/80">
          <div
            onClick={() => setCurrentRole('ROLE_ADMIN')}
            className={`p-4 rounded-lg cursor-pointer border transition-all ${
              currentRole === 'ROLE_ADMIN'
                ? 'bg-rose-950/40 border-rose-600/70 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-900/50 text-rose-300 border border-rose-700/60">
                ROLE_ADMIN
              </span>
              {currentRole === 'ROLE_ADMIN' && <span className="text-xs text-rose-400 font-medium">Active</span>}
            </div>
            <h3 className="text-sm font-medium text-white mb-1">College Administrator</h3>
            <p className="text-xs text-slate-400">
              Authority to admit students, hire faculty, create courses, set semester fee invoices, and oversee institutional records.
            </p>
          </div>

          <div
            onClick={() => setCurrentRole('ROLE_FACULTY')}
            className={`p-4 rounded-lg cursor-pointer border transition-all ${
              currentRole === 'ROLE_FACULTY'
                ? 'bg-amber-950/40 border-amber-600/70 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-900/50 text-amber-300 border border-amber-700/60">
                ROLE_FACULTY
              </span>
              {currentRole === 'ROLE_FACULTY' && <span className="text-xs text-amber-400 font-medium">Active</span>}
            </div>
            <h3 className="text-sm font-medium text-white mb-1">Academic Faculty / Professor</h3>
            <p className="text-xs text-slate-400">
              Authority to take class attendance, submit midterm/final grades, view student roster, and manage course syllabus.
            </p>
          </div>

          <div
            onClick={() => setCurrentRole('ROLE_STUDENT')}
            className={`p-4 rounded-lg cursor-pointer border transition-all ${
              currentRole === 'ROLE_STUDENT'
                ? 'bg-emerald-950/40 border-emerald-600/70 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-900/50 text-emerald-300 border border-emerald-700/60">
                ROLE_STUDENT
              </span>
              {currentRole === 'ROLE_STUDENT' && <span className="text-xs text-emerald-400 font-medium">Active</span>}
            </div>
            <h3 className="text-sm font-medium text-white mb-1">Enrolled Student</h3>
            <p className="text-xs text-slate-400">
              Row-level access to personal grades, attendance percentages (&lt;75% alert), course enrollments, and fee payments.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Permissions Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-semibold text-white">System Functionalities &amp; Access Control Matrix</h3>
            <p className="text-xs text-slate-400">
              Click any row to test if your currently active identity (<strong className="text-indigo-400">{currentRole}</strong>) is permitted or rejected.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> Allowed
            </span>
            <span className="flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-400" /> Denied (403 Forbidden)
            </span>
          </div>
        </div>

        {/* Live Simulation Feedback Banner */}
        {testResult && (
          <div
            className={`mb-4 p-3.5 rounded-lg border flex items-start gap-3 transition-all ${
              testResult.allowed
                ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
                : 'bg-rose-950/40 border-rose-800/80 text-rose-200'
            }`}
          >
            {testResult.allowed ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="text-xs">
              <div className="font-semibold text-sm mb-0.5">
                {testResult.allowed ? 'Permission Verified: Access Granted' : 'Access Denied: HTTP 403 Forbidden'}
              </div>
              <p className="font-mono text-xs opacity-90">{testResult.message}</p>
            </div>
          </div>
        )}

        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">System Functionality / Action</th>
                <th className="py-3 px-4">REST Endpoint &amp; Method</th>
                <th className="py-3 px-4 text-center">ADMIN</th>
                <th className="py-3 px-4 text-center">FACULTY</th>
                <th className="py-3 px-4 text-center">STUDENT</th>
                <th className="py-3 px-4">Spring Security Constraint</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {RBAC_PERMISSIONS_MATRIX.map((perm, idx) => {
                const isSelected = selectedPermission.endpoint === perm.endpoint && selectedPermission.method === perm.method;
                return (
                  <tr
                    key={idx}
                    onClick={() => handleTestEndpoint(perm)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-indigo-950/30 font-medium'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-100">{perm.action}</div>
                      <div className="text-[11px] text-slate-500">{perm.module}</div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold mr-1.5 ${
                        perm.method === 'GET'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : perm.method === 'POST'
                          ? 'bg-sky-950 text-sky-400 border border-sky-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {perm.method}
                      </span>
                      <span className="text-slate-300">{perm.endpoint}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {perm.adminAllowed ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 inline" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500 inline opacity-60" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {perm.facultyAllowed ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 inline" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500 inline opacity-60" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {perm.studentAllowed ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 inline" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500 inline opacity-60" />
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-amber-300">
                      <code>{perm.springSecurityAnnotation}</code>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTestEndpoint(perm);
                        }}
                        className="px-2.5 py-1 text-[11px] font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                      >
                        Simulate
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Grid: Controller Securing Patterns & JWT Token Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Controller Securing Code Patterns */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">
                Spring Security Controller Securing Patterns
              </h3>
            </div>
            <button
              onClick={() => copySnippet(selectedPermission.springSecurityAnnotation, 'annotation')}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
            >
              {copiedCode === 'annotation' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Pattern</span>
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {/* Pattern 1: Admin-Only Onboarding */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between text-slate-300 mb-1 font-semibold">
                <span>1. Strict Admin Operations (Admissions &amp; Hiring)</span>
                <span className="text-[10px] text-rose-400 font-mono">ROLE_ADMIN only</span>
              </div>
              <pre className="font-mono text-[11px] text-indigo-300 overflow-x-auto p-2 bg-slate-900 rounded border border-slate-800/80">
{`@PostMapping("/students")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<ApiResponse<StudentDto>> admitStudent(
        @Valid @RequestBody StudentCreateDto dto) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(studentService.admitStudent(dto));
}`}
              </pre>
            </div>

            {/* Pattern 2: Faculty Attendance Recording */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between text-slate-300 mb-1 font-semibold">
                <span>2. Faculty Classroom Attendance Marking</span>
                <span className="text-[10px] text-amber-400 font-mono">ROLE_FACULTY only</span>
              </div>
              <pre className="font-mono text-[11px] text-indigo-300 overflow-x-auto p-2 bg-slate-900 rounded border border-slate-800/80">
{`@PostMapping("/attendance/mark")
@PreAuthorize("hasRole('FACULTY')")
@Transactional
public ResponseEntity<ApiResponse<AttendanceSummary>> markAttendance(
        @Valid @RequestBody AttendanceBatchDto batchDto,
        @AuthenticationPrincipal CustomUserDetails userDetails) {
    return ResponseEntity.ok(attendanceService.markDailyBatch(batchDto, userDetails.getFacultyId()));
}`}
              </pre>
            </div>

            {/* Pattern 3: Row-Level Student Transcript Access */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between text-slate-300 mb-1 font-semibold">
                <span>3. Row-Level Security: Student Own Data Guard</span>
                <span className="text-[10px] text-emerald-400 font-mono">SpEL Row-Level</span>
              </div>
              <pre className="font-mono text-[11px] text-indigo-300 overflow-x-auto p-2 bg-slate-900 rounded border border-slate-800/80">
{`@GetMapping("/students/{studentId}/grades")
@PreAuthorize("hasAnyRole('ADMIN', 'FACULTY') or #studentId == principal.studentId")
public ResponseEntity<ApiResponse<List<GradeDto>>> getGrades(
        @PathVariable Long studentId) {
    return ResponseEntity.ok(gradeService.getStudentGrades(studentId));
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Right: Simulated JWT Token & Claims Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">
                Stateless JWT Token &amp; Claims Inspector
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">HMAC-SHA256 (JJWT 0.12)</span>
          </div>

          <p className="text-xs text-slate-400">
            When a user authenticates at <code className="text-indigo-300">/api/v1/auth/login</code>, Spring Security issues this payload signed with the secret key. The <code className="text-indigo-300">JwtAuthenticationFilter</code> unpacks these claims on every request.
          </p>

          <div className="space-y-3 font-mono text-xs">
            {/* Decoded Claims Payload */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1.5">
                <span>Decoded Claims (Payload)</span>
                <span className="text-emerald-400 font-semibold">Signature: Verified</span>
              </div>
              <pre className="text-indigo-300 text-[11px] overflow-x-auto">
                {JSON.stringify(tokenPayload, null, 2)}
              </pre>
            </div>

            {/* HTTP Header Preview */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[11px] mb-1">HTTP Authorization Header</div>
              <div className="text-slate-200 text-[11px] break-all bg-slate-900 p-2 rounded border border-slate-800/60 text-amber-300">
                Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.{btoa(JSON.stringify(tokenPayload)).substring(0, 40)}...
              </div>
            </div>

            {/* Custom Access Denied Handler snippet */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px]">
              <div className="text-slate-400 mb-1 flex items-center justify-between">
                <span>CustomAccessDeniedHandler (RFC 7807 Error Envelope)</span>
              </div>
              <pre className="text-slate-400 text-[10px] overflow-x-auto">
{`response.setStatus(HttpServletResponse.SC_FORBIDDEN);
response.setContentType("application/json");
response.getWriter().write("""
  {
    "status": 403,
    "error": "FORBIDDEN",
    "message": "Access Denied: Insufficient Role Authorities",
    "timestamp": "${new Date().toISOString()}"
  }
""");`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
