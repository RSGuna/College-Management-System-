import React from 'react';
import { Shield, GraduationCap, Database, Code2, Network, FileText, CheckCircle2, UserCheck } from 'lucide-react';
import { RoleType } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: RoleType;
  setCurrentRole: (role: RoleType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentRole,
  setCurrentRole
}) => {
  const tabs = [
    { id: 'portal', label: 'Live CMS Portal', icon: GraduationCap },
    { id: 'rbac', label: 'RBAC Security Studio', icon: Shield },
    { id: 'architecture', label: 'Architecture & Structure', icon: Network },
    { id: 'schema', label: 'MySQL Schema & ER', icon: Database },
    { id: 'code', label: 'Spring Boot 3 Code', icon: Code2 },
    { id: 'api', label: 'API & Mobile Client', icon: CheckCircle2 },
    { id: 'resume', label: 'Resume & Interview Prep', icon: FileText },
  ];

  const roleLabels: Record<RoleType, { label: string; badge: string; desc: string }> = {
    ROLE_ADMIN: {
      label: 'Admin (Dean / Registrar)',
      badge: 'bg-rose-950 text-rose-300 border border-rose-800',
      desc: 'Full CRUD, admissions, fee structures, faculty assignments'
    },
    ROLE_FACULTY: {
      label: 'Faculty (Professor)',
      badge: 'bg-amber-950 text-amber-300 border border-amber-800',
      desc: 'Attendance register, course syllabus, grade submissions'
    },
    ROLE_STUDENT: {
      label: 'Student (Undergraduate)',
      badge: 'bg-emerald-950 text-emerald-300 border border-emerald-800',
      desc: 'View personal attendance, grades, enrolled subjects, fee payments'
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-50">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
            CMS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold tracking-tight text-white">
                College Management System
              </h1>
              <span className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded">
                Spring Boot 3.3 · Spring Security 6 · MySQL 8
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Senior Java Architect & Fresher Resume Portfolio Reference System
            </p>
          </div>
        </div>

        {/* Global Active Role Selector */}
        <div className="flex items-center gap-3 bg-slate-950/80 px-3.5 py-1.5 rounded-lg border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <UserCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Simulated Identity:</span>
          </div>
          <div className="flex items-center gap-1">
            {(['ROLE_ADMIN', 'ROLE_FACULTY', 'ROLE_STUDENT'] as RoleType[]).map((role) => (
              <button
                key={role}
                onClick={() => setCurrentRole(role)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${
                  currentRole === role
                    ? roleLabels[role].badge + ' font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {role === 'ROLE_ADMIN' ? 'Admin' : role === 'ROLE_FACULTY' ? 'Faculty' : 'Student'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
        <nav className="flex space-x-1 border-t border-slate-800/70 pt-1" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'border-indigo-500 text-indigo-400 bg-slate-800/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
