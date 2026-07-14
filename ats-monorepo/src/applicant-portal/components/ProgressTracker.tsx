import React, { useState } from 'react';
import { useAppState } from '../../shared/StateContext';
import { ApplicationStage } from '../../shared/types';
import { Check, Clipboard, Clock, Award, Users, AlertTriangle, ChevronRight, RefreshCw, LogOut, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface ProgressTrackerProps {
  onNavigateToTab: (tab: string) => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ onNavigateToTab }) => {
  const { applications, activeApplicationId, setActiveApplicationId } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const activeApp = applications.find(app => app.id === activeApplicationId || app.applicantEmail.toLowerCase() === activeApplicationId?.toLowerCase());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const found = applications.find(
      app => app.id.toLowerCase() === searchQuery.trim().toLowerCase() || 
             app.applicantEmail.toLowerCase() === searchQuery.trim().toLowerCase()
    );

    if (found) {
      setActiveApplicationId(found.id);
      setErrorMsg('');
    } else {
      setErrorMsg('No application found with that ID or Email. Please try again.');
    }
  };

  const handleSignOut = () => {
    setActiveApplicationId(null);
    setSearchQuery('');
  };

  // List of all stages for the timeline
  const stagesList = [
    { stage: ApplicationStage.Applied, label: 'Applied', desc: 'Application received and logged.' },
    { stage: ApplicationStage.TechnicalScreening, label: 'Technical Screening', desc: 'HR and engineering team review.' },
    { stage: ApplicationStage.CodingAssessment, label: 'Coding Assessment', desc: 'Interactive developer assessment.' },
    { stage: ApplicationStage.Interview, label: 'Technical Interview', desc: '1-on-1 architecture & coding discussion.' },
  ];

  // Helper to check stage order
  const getStageStatus = (stageItem: ApplicationStage): 'completed' | 'current' | 'upcoming' | 'rejected' => {
    if (!activeApp) return 'upcoming';

    if (activeApp.currentStage === ApplicationStage.Rejected) {
      // Find where in history they failed
      const failedIdx = activeApp.stageHistory.findIndex(h => h.stage === ApplicationStage.Rejected);
      const isPostReject = stagesList.findIndex(s => s.stage === stageItem) >= stagesList.length;
      return 'rejected';
    }

    const currentIdx = stagesList.findIndex(s => s.stage === activeApp.currentStage);
    const itemIdx = stagesList.findIndex(s => s.stage === stageItem);

    if (activeApp.currentStage === ApplicationStage.Offered) {
      return 'completed';
    }

    if (itemIdx < currentIdx) return 'completed';
    if (itemIdx === currentIdx) return 'current';
    return 'upcoming';
  };

  const currentStatusStyle = (status: string) => {
    switch (status) {
      case ApplicationStage.Offered:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case ApplicationStage.Rejected:
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case ApplicationStage.CodingAssessment:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case ApplicationStage.Interview:
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div id="progress-tracker-root" className="max-w-4xl mx-auto space-y-6">
      {!activeApp ? (
        /* Sign-In / ID Entry Panel */
        <div className="bg-white rounded-3xl border border-slate-100 p-8 md:p-12 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Clipboard className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Track Your Application</h2>
          <p className="text-slate-500 text-sm mt-2">
            Enter the Application ID provided after submission, or the email address you used to apply.
          </p>

          <form onSubmit={handleSearch} className="mt-8 space-y-4">
            <div className="relative">
              <input
                id="search-id-input"
                type="text"
                required
                placeholder="e.g. app-170000000000 or email@domain.com"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-center font-medium"
              />
            </div>
            {errorMsg && (
              <p className="text-rose-600 text-xs flex items-center gap-1 justify-center">
                <AlertTriangle className="w-3.5 h-3.5" />
                {errorMsg}
              </p>
            )}
            <button
              id="track-submit-btn"
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
            >
              Search & Retrieve File
            </button>
          </form>

          {/* Quick Demo Assist */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-left">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">Demo Helper</p>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <button
                onClick={() => {
                  setActiveApplicationId('app-demo-1');
                }}
                className="p-2.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-100 rounded-lg text-left text-slate-600 flex items-center justify-between transition-colors"
              >
                <span>Demo 1: Evelyn Miller (Coding Assessment)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setActiveApplicationId('app-demo-2');
                }}
                className="p-2.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-100 rounded-lg text-left text-slate-600 flex items-center justify-between transition-colors"
              >
                <span>Demo 2: Alex Thorne (Interview Scheduled)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Actual Tracker Page */
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${currentStatusStyle(activeApp.currentStage)}`}>
                  {activeApp.currentStage}
                </span>
                <span className="text-slate-400 text-xs font-mono">ID: {activeApp.id}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-800 mt-2">{activeApp.jobTitle}</h2>
              <p className="text-slate-500 text-xs mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>Applicant: <span className="font-semibold text-slate-700">{activeApp.applicantName}</span></span>
                <span className="text-slate-300">•</span>
                <span>Applied on {new Date(activeApp.appliedAt).toLocaleDateString()}</span>
                {activeApp.resumeUrl && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="inline-flex items-center gap-1 text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded text-[10px] font-mono font-medium">
                      <FileText className="w-3 h-3" />
                      {activeApp.resumeUrl}
                    </span>
                  </>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSignOut}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Disconnect File
              </button>
            </div>
          </div>

          {/* Action Trigger Box (Alerts candidates if they have pending items) */}
          {activeApp.currentStage === ApplicationStage.CodingAssessment && !activeApp.codingSubmission && (
            <div className="bg-gradient-to-r from-indigo-500 to-violet-600 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-bold text-base">Next Step: Complete Coding Assessment</h3>
                <p className="text-indigo-100 text-xs">Prove your software engineering chops in our interactive live coding challenge.</p>
              </div>
              <button
                onClick={() => onNavigateToTab('coding')}
                className="px-5 py-2.5 bg-white text-indigo-600 text-xs font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors shrink-0"
              >
                Launch Coding Assessment
              </button>
            </div>
          )}

          {activeApp.currentStage === ApplicationStage.Interview && !activeApp.interviewDate && (
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-bold text-base">Next Step: Schedule Technical Interview</h3>
                <p className="text-emerald-100 text-xs">Choose a convenient date & time slot for your face-to-face developer panel.</p>
              </div>
              <button
                onClick={() => onNavigateToTab('scheduler')}
                className="px-5 py-2.5 bg-white text-emerald-600 text-xs font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors shrink-0"
              >
                Schedule Technical Interview
              </button>
            </div>
          )}

          {/* Core Pipeline Tracker */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6">Application Pipeline Status</h3>
            
            <div className="relative">
              {/* Vertical timeline connector */}
              <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-slate-100" />

              <div className="space-y-8">
                {stagesList.map((stg, index) => {
                  const status = getStageStatus(stg.stage);
                  
                  return (
                    <div key={index} className="relative flex items-start gap-5 pl-1.5">
                      {/* Timeline icon */}
                      <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 z-10 transition-all ${
                        status === 'completed'
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : status === 'current'
                          ? 'bg-indigo-600 border-indigo-600 text-white ring-4 ring-indigo-100'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}>
                        {status === 'completed' ? (
                          <Check className="w-5 h-5 stroke-[3]" />
                        ) : status === 'current' ? (
                          <Clock className="w-5 h-5 animate-pulse" />
                        ) : (
                          <span className="text-xs font-semibold">{index + 1}</span>
                        )}
                      </div>

                      {/* Timeline details */}
                      <div className="space-y-1">
                        <h4 className={`text-sm font-bold transition-colors ${
                          status === 'current' ? 'text-indigo-600' : 'text-slate-800'
                        }`}>
                          {stg.label}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{stg.desc}</p>
                        
                        {/* If current and there is an interactive prompt */}
                        {status === 'current' && (
                          <span className="inline-block mt-2 px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded-md text-[10px] font-semibold text-indigo-600 uppercase tracking-wider animate-pulse">
                            Active Stage
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Offer / Reject terminal step */}
                <div className="relative flex items-start gap-5 pl-1.5">
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 z-10 transition-all ${
                    activeApp.currentStage === ApplicationStage.Offered
                      ? 'bg-emerald-600 border-emerald-600 text-white ring-4 ring-emerald-100'
                      : activeApp.currentStage === ApplicationStage.Rejected
                      ? 'bg-rose-500 border-rose-500 text-white ring-4 ring-rose-100'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    {activeApp.currentStage === ApplicationStage.Offered ? (
                      <Award className="w-5 h-5" />
                    ) : activeApp.currentStage === ApplicationStage.Rejected ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : (
                      <Award className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800">
                      {activeApp.currentStage === ApplicationStage.Rejected 
                        ? 'Application Finished' 
                        : 'Recruitment Evaluation'
                      }
                    </h4>
                    
                    {activeApp.currentStage === ApplicationStage.Offered ? (
                      <div>
                        <p className="text-xs text-emerald-600 font-semibold">Offer Extended!</p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          We are looking forward to you joining our developer team! Check your email inbox to review your official offer terms and complete onboarding.
                        </p>
                      </div>
                    ) : activeApp.currentStage === ApplicationStage.Rejected ? (
                      <div>
                        <p className="text-xs text-rose-600 font-semibold">Application Closed</p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Thank you for your time. The hiring team has concluded the process for this opening.
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Final review and decision by engineering leadership.
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Status Timeline logs */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Application Audit History</h3>
            <div className="space-y-3">
              {activeApp.stageHistory.slice().reverse().map((hist, index) => (
                <div key={index} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-indigo-600">{hist.stage}</span>
                    <span className="text-slate-400">{new Date(hist.updatedAt).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">"{hist.notes || 'Status updated by recruiter.'}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
