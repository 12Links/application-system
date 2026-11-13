import React, { useState } from 'react';
import { useAppState } from '../shared/StateContext';
import { ApplicationStage } from '../shared/types';
import { CandidatePipeline } from './components/CandidatePipeline';
import { JobPostingsManager } from './components/JobPostingsManager';
import { CodingQuestionsManager } from './components/CodingQuestionsManager';
import { AdminLogin } from './components/AdminLogin';
import { Users, Briefcase, FileCode, Layers, MapPin, LogOut } from 'lucide-react';
import { CompanyLogo } from '../shared/CompanyLogo';

interface AdminPortalProps {
  onNavigateToPublic?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onNavigateToPublic }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => !!localStorage.getItem('ats_admin_session'));
  const { applications, jobs } = useAppState();
  const [adminTab, setAdminTab] = useState('pipeline');

  // Compute stats counters
  const totalPostings = jobs.length;
  const totalCandidates = applications.length;
  const awaitingAssessment = applications.filter(
    app => app.currentStage === ApplicationStage.CodingAssessment && !app.codingSubmission
  ).length;
  const interviewsScheduled = applications.filter(app => !!app.interviewDate).length;
  const offersExtended = applications.filter(app => app.currentStage === ApplicationStage.Offered).length;

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
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <CompanyLogo variant="horizontal" size="md" lightTheme={true} />
            <div className="hidden sm:flex flex-col pl-3.5 ml-3.5 border-l border-slate-200 text-left">
              <span className="text-xs font-bold text-slate-800">Hiring Console</span>
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" strokeWidth={1.5} /> Pretoria, South Africa
              </span>
            </div>
          </div>

          {/* Navigation Tab list */}
          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/60">
            <button
              id="admin-pipeline-tab-btn"
              onClick={() => setAdminTab('pipeline')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                adminTab === 'pipeline' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" strokeWidth={1.5} />
              Candidate Pipeline
            </button>
            <button
              id="admin-jobs-tab-btn"
              onClick={() => setAdminTab('jobs')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                adminTab === 'jobs' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" strokeWidth={1.5} />
              Manage Openings
            </button>
            <button
              id="admin-questions-tab-btn"
              onClick={() => setAdminTab('questions')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                adminTab === 'questions' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" strokeWidth={1.5} />
              Coding Tasks
            </button>
          </nav>

          {/* Staff controls */}
          <div className="flex items-center gap-3">
            {onNavigateToPublic && (
              <button
                type="button"
                onClick={onNavigateToPublic}
                className="hidden sm:inline-flex px-3 py-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-medium transition-all cursor-pointer"
              >
                Careers Site
              </button>
            )}

            <div className="hidden md:block text-right">
              <p className="text-[10px] text-slate-500 font-medium">Administrator</p>
              <p className="text-xs font-semibold text-slate-800">{localStorage.getItem('ats_admin_email') || 'Administrator'}</p>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem('ats_admin_session');
                localStorage.removeItem('ats_admin_email');
                localStorage.removeItem('ats_admin_name');
                setIsAdminLoggedIn(false);
              }}
              className="px-3 py-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/60 hover:border-rose-200 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Secure Staff Logout"
            >
              <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Stats Counter Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4 text-left">
            <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Active Openings</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{totalPostings}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4 text-left">
            <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Pipeline</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{totalCandidates}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4 text-left">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Awaiting Tests</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{awaitingAssessment}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4 text-left">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Interviews Booked</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{interviewsScheduled}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4 text-left col-span-2 lg:col-span-1">
            <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Offers Extended</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{offersExtended}</p>
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
    </div>
  );
};
export default AdminPortal;
