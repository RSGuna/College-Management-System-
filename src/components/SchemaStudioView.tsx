import React, { useState } from 'react';
import { Database, Copy, Check, Download, Table, Key, Link2, Sparkles } from 'lucide-react';
import { MYSQL_SCHEMA_SQL } from '../data/schemaSql';

export const SchemaStudioView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string>('students');

  const copySql = () => {
    navigator.clipboard.writeText(MYSQL_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSql = () => {
    const element = document.createElement('a');
    const file = new Blob([MYSQL_SCHEMA_SQL], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'college_management_schema.sql';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const tables = [
    {
      name: 'users',
      category: 'Security',
      pk: 'id (BIGINT)',
      columns: [
        { name: 'id', type: 'BIGINT AUTO_INCREMENT', key: 'PK' },
        { name: 'username', type: 'VARCHAR(60)', key: 'UNIQUE' },
        { name: 'email', type: 'VARCHAR(100)', key: 'UNIQUE' },
        { name: 'password_hash', type: 'VARCHAR(255)', key: 'BCrypt' },
        { name: 'is_active', type: 'BOOLEAN', key: 'DEFAULT TRUE' }
      ],
      relations: '1:M with user_roles, 1:1 with students, 1:1 with faculty'
    },
    {
      name: 'roles',
      category: 'Security',
      pk: 'id (BIGINT)',
      columns: [
        { name: 'id', type: 'BIGINT AUTO_INCREMENT', key: 'PK' },
        { name: 'name', type: 'VARCHAR(50)', key: 'UNIQUE' },
        { name: 'description', type: 'VARCHAR(255)', key: '' }
      ],
      relations: '1:M with user_roles (ROLE_ADMIN, ROLE_FACULTY, ROLE_STUDENT)'
    },
    {
      name: 'departments',
      category: 'Academic',
      pk: 'id (BIGINT)',
      columns: [
        { name: 'id', type: 'BIGINT AUTO_INCREMENT', key: 'PK' },
        { name: 'code', type: 'VARCHAR(10)', key: 'UNIQUE' },
        { name: 'name', type: 'VARCHAR(100)', key: '' },
        { name: 'hod_name', type: 'VARCHAR(100)', key: '' },
        { name: 'contact_email', type: 'VARCHAR(100)', key: '' }
      ],
      relations: '1:M with students, 1:M with faculty, 1:M with courses'
    },
    {
      name: 'students',
      category: 'Academic',
      pk: 'id (BIGINT)',
      columns: [
        { name: 'id', type: 'BIGINT AUTO_INCREMENT', key: 'PK' },
        { name: 'user_id', type: 'BIGINT', key: 'FK -> users.id' },
        { name: 'roll_number', type: 'VARCHAR(30)', key: 'UNIQUE' },
        { name: 'first_name', type: 'VARCHAR(60)', key: '' },
        { name: 'last_name', type: 'VARCHAR(60)', key: '' },
        { name: 'department_id', type: 'BIGINT', key: 'FK -> departments.id' },
        { name: 'current_semester', type: 'INT', key: 'INDEX (dept, sem)' },
        { name: 'admission_date', type: 'DATE', key: '' }
      ],
      relations: '1:1 with users, M:1 with departments, 1:M with enrollments, attendance, fees'
    },
    {
      name: 'faculty',
      category: 'Academic',
      pk: 'id (BIGINT)',
      columns: [
        { name: 'id', type: 'BIGINT AUTO_INCREMENT', key: 'PK' },
        { name: 'user_id', type: 'BIGINT', key: 'FK -> users.id' },
        { name: 'employee_code', type: 'VARCHAR(30)', key: 'UNIQUE' },
        { name: 'first_name', type: 'VARCHAR(60)', key: '' },
        { name: 'last_name', type: 'VARCHAR(60)', key: '' },
        { name: 'department_id', type: 'BIGINT', key: 'FK -> departments.id' },
        { name: 'designation', type: 'VARCHAR(60)', key: '' },
        { name: 'hire_date', type: 'DATE', key: '' }
      ],
      relations: '1:1 with users, M:1 with departments, 1:M with courses taught, attendance'
    },
    {
      name: 'courses',
      category: 'Academic',
      pk: 'id (BIGINT)',
      columns: [
        { name: 'id', type: 'BIGINT AUTO_INCREMENT', key: 'PK' },
        { name: 'course_code', type: 'VARCHAR(20)', key: 'UNIQUE' },
        { name: 'title', type: 'VARCHAR(120)', key: '' },
        { name: 'department_id', type: 'BIGINT', key: 'FK -> departments.id' },
        { name: 'faculty_id', type: 'BIGINT', key: 'FK -> faculty.id (NULLABLE)' },
        { name: 'credits', type: 'INT', key: '' },
        { name: 'max_capacity', type: 'INT', key: 'DEFAULT 60' }
      ],
      relations: 'M:1 with departments, M:1 with faculty, 1:M with enrollments, attendance'
    },
    {
      name: 'attendance',
      category: 'Operations',
      pk: 'id (BIGINT)',
      columns: [
        { name: 'id', type: 'BIGINT AUTO_INCREMENT', key: 'PK' },
        { name: 'student_id', type: 'BIGINT', key: 'FK -> students.id' },
        { name: 'course_id', type: 'BIGINT', key: 'FK -> courses.id' },
        { name: 'faculty_id', type: 'BIGINT', key: 'FK -> faculty.id' },
        { name: 'attendance_date', type: 'DATE', key: 'COMPOSITE INDEX' },
        { name: 'status', type: "ENUM('PRESENT','ABSENT','LATE')", key: '' }
      ],
      relations: 'Composite unique key: (student_id, course_id, attendance_date)'
    },
    {
      name: 'fee_payments',
      category: 'Finance',
      pk: 'id (BIGINT)',
      columns: [
        { name: 'id', type: 'BIGINT AUTO_INCREMENT', key: 'PK' },
        { name: 'student_id', type: 'BIGINT', key: 'FK -> students.id' },
        { name: 'invoice_number', type: 'VARCHAR(40)', key: 'UNIQUE' },
        { name: 'total_amount', type: 'DECIMAL(10,2)', key: '' },
        { name: 'paid_amount', type: 'DECIMAL(10,2)', key: '' },
        { name: 'due_amount', type: 'DECIMAL(10,2)', key: '' },
        { name: 'payment_status', type: "ENUM('PAID','PARTIAL','PENDING')", key: 'INDEX' }
      ],
      relations: 'M:1 with students'
    }
  ];

  const currentTbl = tables.find((t) => t.name === selectedTable) || tables[3];

  return (
    <div className="space-y-6">
      {/* Schema Header & Action Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-semibold text-white">
                MySQL 8.0 Normalized 3NF Database Schema &amp; ER Architecture
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              11 relational tables with strict foreign keys, composite B-Tree indexes, and referential integrity constraints. Ready for MySQL 8, Amazon RDS, or Docker containers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copySql}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied SQL!' : 'Copy schema.sql'}</span>
            </button>
            <button
              onClick={downloadSql}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .sql</span>
            </button>
          </div>
        </div>

        {/* ER Table Nodes Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-5 pt-3 border-t border-slate-800/80">
          {tables.map((tbl) => (
            <button
              key={tbl.name}
              onClick={() => setSelectedTable(tbl.name)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all border ${
                selectedTable === tbl.name
                  ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300 font-semibold'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Table className="w-3 h-3 text-slate-500" />
              <span>{tbl.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Table Inspector & Complete SQL DDL Script */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Entity-Relationship Table Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white font-mono">
                Table: {currentTbl.name}
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {currentTbl.category}
            </span>
          </div>

          <div className="text-xs space-y-1">
            <div className="text-slate-400">
              Primary Key: <code className="text-amber-400 font-mono">{currentTbl.pk}</code>
            </div>
            <div className="text-slate-400">
              Foreign Key Relations: <span className="text-slate-300">{currentTbl.relations}</span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Column</th>
                  <th className="py-2.5 px-3">Datatype</th>
                  <th className="py-2.5 px-3">Constraint / Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                {currentTbl.columns.map((col, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="py-2 px-3 text-slate-200 font-medium">{col.name}</td>
                    <td className="py-2 px-3 text-slate-400">{col.type}</td>
                    <td className="py-2 px-3">
                      {col.key.includes('PK') ? (
                        <span className="text-rose-400 font-bold flex items-center gap-1">
                          <Key className="w-3 h-3" /> PK
                        </span>
                      ) : col.key.includes('FK') ? (
                        <span className="text-sky-400 flex items-center gap-1">
                          <Link2 className="w-3 h-3" /> {col.key}
                        </span>
                      ) : col.key.includes('UNIQUE') ? (
                        <span className="text-amber-400 font-semibold">{col.key}</span>
                      ) : (
                        <span className="text-slate-500">{col.key || '-'}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MySQL 8 Senior Architect Optimization Notes */}
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1.5">
            <div className="font-semibold text-indigo-400 text-[11px] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fresher Viva Tip: Why B-Tree Indexes on this Table?</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              In high-traffic systems, querying student attendance by date without an index forces MySQL into an O(N) full-table scan. By declaring <code className="text-amber-300">INDEX (course_id, attendance_date)</code>, MySQL traverses a B-Tree in O(log N) disk reads, serving 1,000s of concurrent requests instantaneously.
            </p>
          </div>
        </div>

        {/* Right: Full Copyable MySQL DDL Script (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              Complete MySQL 8 DDL Script (schema.sql)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">220 lines · UTF8MB4</span>
          </div>

          <div className="relative">
            <pre className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-[520px] leading-relaxed">
              {MYSQL_SCHEMA_SQL}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
