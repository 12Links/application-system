/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StateProvider, useAppState } from './shared/StateContext';
import { ApplicantPortal } from './applicant-portal/ApplicantPortal';
import { AdminPortal } from './admin-portal/AdminPortal';
import { AuthPage } from './shared/AuthPage';
import { Shield, Sparkles, HelpCircle, MapPin, UserCheck } from 'lucide-react';
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
  const { currentUser } = useAppState();

  const handleAuthSuccess = () => {
    // Managed natively inside context
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-sky-500/10 selection:text-sky-600">
      
      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {currentPortal === 'applicant' ? (
          currentUser ? (
            <ApplicantPortal />
          ) : (
            <div className="flex-1 flex flex-col bg-slate-50">
              {/* Header for Auth Page */}
              <header className="bg-white border-b border-slate-100 py-4 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                  <div className="flex items-center">
                    <CompanyLogo variant="horizontal" size="md" lightTheme={true} />
                    <div className="hidden sm:flex items-center gap-1 pl-3.5 ml-3.5 border-l border-slate-200 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <MapPin className="w-3.5 h-3.5 text-sky-500" />
                      <span>Pretoria, South Africa</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-sky-50 text-sky-700 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                    Careers Node
                  </span>
                </div>
              </header>
              <div className="flex-1 flex items-center justify-center py-6">
                <AuthPage onSuccess={handleAuthSuccess} />
              </div>
            </div>
          )
        ) : (
          <AdminPortal />
        )}
      </div>

      {/* Dynamic Simulation Instructions Panel & Bottom Portal Switcher */}
      <footer className="bg-white border-t border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400 space-y-4">
          <div className="flex items-center justify-center gap-1.5 text-slate-500 font-medium">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Demonstration recruitment flow checklist:</span>
          </div>
          <p className="max-w-3xl mx-auto leading-relaxed text-[11px] text-slate-400">
            1. Create a candidate profile on the <strong>Sign Up tab</strong> or click one of our test candidates. <br />
            2. Choose an active vacancy and apply. Form fields are pre-filled automatically! <br />
            3. Scroll down here to access the **Admin Panel** (hidden from the top to simulate standard applicant experience). <br />
            4. In the **Admin Panel**, select the candidate, review their details, and advance them to the <strong>Coding Assessment</strong> stage. <br />
            5. Switch back to the **Applicant Portal** at the bottom, complete and submit the interactive coding challenge. <br />
            6. Grade the assessment inside the **Admin Panel** and advance them to the <strong>Interview</strong> round. <br />
            7. Complete the loop by booking a slot on the integrated schedule selector.
          </p>
          
          <div className="w-24 h-[1px] bg-slate-100 mx-auto" />

          {/* Bottom Link To Admin / Portal Switcher */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-[10px] text-slate-400 flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <span className="font-bold text-slate-600 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-sky-500" /> 12 Links Future Technologies (Pty) Ltd
              </span>
              <span className="hidden sm:inline">•</span>
              <span>Pretoria, South Africa</span>
              <span className="hidden sm:inline">•</span>
              <span>Developer Recruitment Portal © 2026</span>
            </div>

            {/* Link to Admin is placed exclusively here at the bottom */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-slate-400">Staff access:</span>
              <button
                id="toggle-portal-bottom-btn"
                onClick={() => setCurrentPortal(currentPortal === 'applicant' ? 'admin' : 'applicant')}
                className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-sky-200 hover:bg-sky-50 text-slate-600 hover:text-sky-600 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                {currentPortal === 'applicant' ? (
                  <>
                    <Shield className="w-3.5 h-3.5 text-sky-500" />
                    Access Company Admin Panel
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                    Switch to Careers/Applicant View
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
