import React, { useState } from 'react';
import { Header } from './components/Header';
import { RbacSecurityMatrix } from './components/RbacSecurityMatrix';
import { ArchitectureView } from './components/ArchitectureView';
import { SchemaStudioView } from './components/SchemaStudioView';
import { JavaCodeViewer } from './components/JavaCodeViewer';
import { ApiExplorerView } from './components/ApiExplorerView';
import { LivePortalView } from './components/LivePortalView';
import { ResumeInterviewView } from './components/ResumeInterviewView';
import { RoleType } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('portal');
  const [currentRole, setCurrentRole] = useState<RoleType>('ROLE_ADMIN');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Global Interactive Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'portal' && (
          <LivePortalView
            currentRole={currentRole}
            setCurrentRole={setCurrentRole}
          />
        )}

        {activeTab === 'rbac' && (
          <RbacSecurityMatrix
            currentRole={currentRole}
            setCurrentRole={setCurrentRole}
          />
        )}

        {activeTab === 'architecture' && <ArchitectureView />}

        {activeTab === 'schema' && <SchemaStudioView />}

        {activeTab === 'code' && <JavaCodeViewer />}

        {activeTab === 'api' && <ApiExplorerView currentRole={currentRole} />}

        {activeTab === 'resume' && <ResumeInterviewView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>College Management System — Senior Java Software Architect Reference</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Spring Boot 3.3.2</span>
            <span>·</span>
            <span>Spring Security 6</span>
            <span>·</span>
            <span>MySQL 8.0</span>
            <span>·</span>
            <span>React SPA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
