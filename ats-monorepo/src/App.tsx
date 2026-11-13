/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StateProvider, useAppState } from './shared/StateContext';
import { ApplicantPortal } from './applicant-portal/ApplicantPortal';
import { AdminPortal } from './admin-portal/AdminPortal';
import {
  Shield,
  MapPin,
  UserCheck,
  Briefcase,
  Users
} from 'lucide-react';
import { CompanyLogo } from './shared/CompanyLogo';

export default function App() {
  return (
    <StateProvider>
      <AppContent />
    </StateProvider>
  );
}

function AppContent() {
  const [currentPortal, setCurrentPortal] = useState<'applicant' | 'admin'>('applicant');
  const { jobs, applications } = useAppState();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500/10 selection:text-indigo-600">
      {/* TOP SYSTEM PORTAL SWITCHER BAR */}
      <div className="bg-slate-900 text-white px-4 py-2 border-b border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {/* Left badge & status */}
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-extrabold tracking-wide uppercase text-[10px] text-slate-300">
              12 Links Recruitment System
            </span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:flex items-center gap-1 text-[11px] text-slate-400">
              <Briefcase className="w-3 h-3 text-sky-400" /> {jobs.length} Advertised Vacancies
            </span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:flex items-center gap-1 text-[11px] text-slate-400">
              <Users className="w-3 h-3 text-indigo-400" /> {applications.length} Candidates in Pipeline
            </span>
          </div>

          {/* Right Mode Switcher Tabs */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 hidden sm:inline">Active Portal View:</span>
            <div className="inline-flex bg-slate-800 p-0.5 rounded-xl border border-slate-700">
              <button
                id="select-applicant-portal-btn"
                onClick={() => setCurrentPortal('applicant')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentPortal === 'applicant'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Applicant Side</span>
              </button>

              <button
                id="select-admin-portal-btn"
                onClick={() => setCurrentPortal('admin')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentPortal === 'admin'
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-sky-400" />
                <span>Admin Site</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN VIEW AREA */}
      <div className="flex-1 flex flex-col">
        {currentPortal === 'applicant' ? <ApplicantPortal /> : <AdminPortal />}
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sky-500" /> 12 Links Future Technologies (Pty) Ltd
            </span>
            <span className="hidden sm:inline">•</span>
            <span>Pretoria, South Africa</span>
            <span className="hidden sm:inline">•</span>
            <span>Applicant & Recruitment Platform</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPortal(currentPortal === 'applicant' ? 'admin' : 'applicant')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {currentPortal === 'applicant' ? (
                <>
                  <Shield className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Switch to Admin Site</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-sky-600" />
                  <span>Switch to Applicant Site</span>
                </>
              )}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
