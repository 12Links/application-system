import React, { useState } from 'react';
import { useAppState } from '../shared/StateContext';
import { ApplicationStage } from '../shared/types';
import { CandidatePipeline } from './components/CandidatePipeline';
import { JobPostingsManager } from './components/JobPostingsManager';
import { CodingQuestionsManager } from './components/CodingQuestionsManager';
import { AdminLogin } from './components/AdminLogin';
import { Users, Briefcase, FileCode, Calendar, RefreshCw, Layers, MapPin, LogOut, Shield } from 'lucide-react';
import { CompanyLogo } from '../shared/CompanyLogo';

export const AdminPortal: React.FC = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => !!localStorage.getItem('ats_admin_session'));
  const { applications, jobs, resetAllData } = useAppState();
  const [adminTab, setAdminTab] = useState('pipeline');

  // Compute stats counters
  const totalPostings = jobs.length;
  const totalCandidates = applications.length;
  const awaitingAssessment = applications.filter(app => app.currentStage === ApplicationStage.CodingAssessment && !app.codingSubmission).length;
  const interviewsScheduled = applications.filter(app => !!app.interviewDate).length;

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12">
        <AdminLogin onLoginSuccess={() => setIsAdminLoggedIn(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <CompanyLogo variant="horizontal" size="md" lightTheme={true} />
            <div className="hidden sm:flex flex-col pl-3.5 ml-3.5 border-l border-slate-200 text-left">
              <span className="text-[10px] text-indigo-600 uppercase font-extrabold tracking-wider">Recruitment Admin</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-0.5 mt-0.5">
                <MapPin className="w-3 h-3 text-sky-500" /> Pretoria, South Africa
              </span>
            </div>
          </div>

          {/* Navigation Tab list (Aesthetic pill labels) */}
          <nav className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/50">
            <button
              id="admin-pipeline-tab-btn"
              onClick={() => setAdminTab('pipeline')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                adminTab === 'pipeline' 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Candidate Pipeline
            </button>
            <button
              id="admin-jobs-tab-btn"
              onClick={() => setAdminTab('jobs')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                adminTab === 'jobs' 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Manage Openings
            </button>
            <button
              id="admin-questions-tab-btn"
              onClick={() => setAdminTab('questions')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                adminTab === 'questions' 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              Coding Tasks
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-[9px] text-indigo-600 uppercase font-extrabold tracking-wider">Staff Credentials</p>
              <p className="text-xs font-bold text-slate-700">{localStorage.getItem('ats_admin_email') || 'admin@12links.com'}</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('ats_admin_session');
                localStorage.removeItem('ats_admin_email');
                setIsAdminLoggedIn(false);
              }}
              className="px-3 py-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/60 hover:border-rose-150 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Secure Staff Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Stats Counter Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active Openings</p>
              <p className="text-lg font-black text-slate-800 mt-1">{totalPostings}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Pipeline</p>
              <p className="text-lg font-black text-slate-800 mt-1">{totalCandidates}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Awaiting Tests</p>
              <p className="text-lg font-black text-slate-800 mt-1">{awaitingAssessment}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Interviews Scheduled</p>
              <p className="text-lg font-black text-slate-800 mt-1">{interviewsScheduled}</p>
            </div>
          </div>
        </div>

        {/* Core Workspace content */}
        <div className="mt-8">
          {adminTab === 'pipeline' ? (
            <CandidatePipeline />
          ) : adminTab === 'jobs' ? (
            <JobPostingsManager />
          ) : (
            <CodingQuestionsManager />
          )}
        </div>
      </div>

      {/* Subtle Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-100 flex items-center justify-between text-slate-400 text-[11px]">
        <span>© 12Links Future Technologies. All Admin Tools.</span>
        <button 
          onClick={resetAllData} 
          className="hover:text-slate-700 transition-colors bg-slate-50 border border-slate-200 hover:border-slate-300 px-2.5 py-1 rounded-lg"
        >
          Reset Simulation Data
        </button>
      </footer>
    </div>
  );
};
export default AdminPortal;
