import React, { useState } from 'react';
import { useAppState } from '../../shared/StateContext';
import { ApplicationStage } from '../../shared/types';
import {
  Check,
  Clipboard,
  Clock,
  Award,
  Users,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
  LogOut,
  FileText,
  Calendar,
  Code,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileCode,
  PartyPopper,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';

interface ProgressTrackerProps {
  onNavigateToTab: (tab: string) => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ onNavigateToTab }) => {
  const { applications, activeApplicationId, setActiveApplicationId, currentUser } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showManualLookup, setShowManualLookup] = useState(false);

  const userApps = currentUser
    ? applications.filter(app => app.applicantEmail.toLowerCase() === currentUser.email.toLowerCase())
    : [];

  const activeApp = applications.find(
    app =>
      app.id.toLowerCase() === activeApplicationId?.toLowerCase() ||
      app.applicantEmail.toLowerCase() === activeApplicationId?.toLowerCase()
  ) || (currentUser && userApps.length > 0 ? userApps[0] : null);

  // Auto-sync active application ID if missing but user has applications
  React.useEffect(() => {
    if (currentUser && userApps.length > 0 && !activeApplicationId) {
      setActiveApplicationId(userApps[0].id);
    }
  }, [currentUser, userApps, activeApplicationId, setActiveApplicationId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setErrorMsg('Please enter your Application Reference ID or email address.');
      return;
    }

    const found = applications.find(
      app =>
        app.id.toLowerCase() === searchQuery.trim().toLowerCase() ||
        app.applicantEmail.toLowerCase() === searchQuery.trim().toLowerCase()
    );

    if (found) {
      setActiveApplicationId(found.id);
      setErrorMsg('');
      setShowManualLookup(false);
    } else {
      setErrorMsg('No application found with that ID or email. Please check your reference and try again.');
    }
  };

  const handleSignOut = () => {
    setActiveApplicationId(null);
    setSearchQuery('');
  };

  // List of all stages for the timeline
  const stagesList = [
    { stage: ApplicationStage.Applied, label: 'Applied', desc: 'Application received & logged' },
    { stage: ApplicationStage.TechnicalScreening, label: 'Technical Screening', desc: 'Resume & portfolio evaluation' },
    { stage: ApplicationStage.CodingAssessment, label: 'Coding Assessment', desc: 'Interactive developer challenge' },
    { stage: ApplicationStage.Interview, label: 'Technical Interview', desc: '1-on-1 architecture & coding interview' },
    { stage: ApplicationStage.Offered, label: 'Offer & Decision', desc: 'Official offer letter extended' }
  ];

  // Helper to check stage order
  const getStageStatus = (stageItem: ApplicationStage): 'completed' | 'current' | 'upcoming' | 'rejected' => {
    if (!activeApp) return 'upcoming';

    if (activeApp.currentStage === ApplicationStage.Rejected) {
      return 'rejected';
    }

    if (activeApp.currentStage === ApplicationStage.Offered) {
      return 'completed';
    }

    const currentIdx = stagesList.findIndex(s => s.stage === activeApp.currentStage);
    const itemIdx = stagesList.findIndex(s => s.stage === stageItem);

    if (itemIdx < currentIdx) return 'completed';
    if (itemIdx === currentIdx) return 'current';
    return 'upcoming';
  };

  const currentStatusStyle = (stage: ApplicationStage) => {
    switch (stage) {
      case ApplicationStage.Offered:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case ApplicationStage.Rejected:
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case ApplicationStage.CodingAssessment:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case ApplicationStage.Interview:
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case ApplicationStage.TechnicalScreening:
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div id="progress-tracker-root" className="max-w-4xl mx-auto space-y-6">
      {!activeApp ? (
        currentUser ? (
          /* Logged In Candidate: Calm Empty State when no applications submitted yet */
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 md:p-12 text-center max-w-lg mx-auto shadow-xs space-y-6">
            <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center mx-auto">
              <Clipboard className="w-6 h-6 text-slate-600" strokeWidth={1.5} />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">You Haven't Applied to Any Roles Yet</h2>
              <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
                Welcome, {currentUser.name ? currentUser.name.split(' ')[0] : 'Candidate'}. Once you submit an application or general CV drop, your real-time stage progression, technical screening, and interview status will appear here.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => onNavigateToTab('jobs')}
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Browse Open Positions</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100">
              {!showManualLookup ? (
                <button
                  type="button"
                  onClick={() => setShowManualLookup(true)}
                  className="text-[11px] text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
                >
                  Have an application reference ID from another email? Click to search
                </button>
              ) : (
                <form onSubmit={handleSearch} className="space-y-3 pt-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => {
                      setSearchQuery(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="e.g. Reference ID or your email address"
                    className={`w-full text-xs font-medium px-4 py-3 rounded-xl border bg-slate-50/50 focus:bg-white outline-none transition-all text-center ${
                      errorMsg
                        ? 'border-rose-400 focus:border-rose-500 ring-2 ring-rose-100'
                        : 'border-slate-200 focus:border-slate-800'
                    }`}
                  />
                  {errorMsg && (
                    <p className="text-xs text-rose-600 font-medium text-center">{errorMsg}</p>
                  )}
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    Lookup Application
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          /* Anonymous Visitor: Search By Reference ID / Email */
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 md:p-12 text-center max-w-lg mx-auto shadow-xs space-y-6">
            <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center mx-auto">
              <Clipboard className="w-6 h-6 text-slate-600" strokeWidth={1.5} />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Track Your Application</h2>
              <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
                Enter your Application Reference ID or the email address you applied with to inspect your real-time stage progress.
              </p>
            </div>

            <form onSubmit={handleSearch} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="e.g. Reference ID or your email address"
                  className={`w-full text-xs font-medium px-4 py-3 rounded-xl border bg-slate-50/50 focus:bg-white outline-none transition-all text-center ${
                    errorMsg
                      ? 'border-rose-400 focus:border-rose-500 ring-2 ring-rose-100'
                      : 'border-slate-200 focus:border-slate-800'
                  }`}
                />
              </div>
              {errorMsg && (
                <p className="text-xs text-rose-600 font-medium text-center">{errorMsg}</p>
              )}
              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Application Status</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </form>
          </div>
        )
      ) : (
        /* Active Application Dashboard View */
        <div className="space-y-6">
          {/* Multiple applications selector for candidate */}
          {userApps.length > 1 && (
            <div className="bg-white p-3 rounded-2xl border border-slate-200/80 flex items-center gap-2 overflow-x-auto text-xs shadow-xs">
              <span className="font-semibold text-slate-500 shrink-0 px-2">Your Applications:</span>
              {userApps.map(app => (
                <button
                  key={app.id}
                  onClick={() => setActiveApplicationId(app.id)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 cursor-pointer ${
                    app.id === activeApp.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {app.jobTitle} ({app.id})
                </button>
              ))}
            </div>
          )}

          {/* Header Banner */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Reference ID:</span>
                <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                  {activeApp.id}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">{activeApp.applicantName}</h2>
              <p className="text-xs text-slate-500">
                Applied for <strong className="text-slate-700">{activeApp.jobTitle}</strong> • Submitted on{' '}
                {new Date(activeApp.appliedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <div className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 ${currentStatusStyle(activeApp.currentStage)}`}>
                <span className="w-2 h-2 rounded-full bg-current" />
                <span>Stage: {activeApp.currentStage}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl text-xs transition-all cursor-pointer"
                title="Disconnect application view"
              >
                <LogOut className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Review Turnaround Card for Applied & Screening */}
          {(activeApp.currentStage === ApplicationStage.Applied || activeApp.currentStage === ApplicationStage.TechnicalScreening) && (
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-sm border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-xl text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                  Application Under Review
                </div>
                <h3 className="text-lg font-bold text-white">Engineering Review in Progress</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Our Pretoria engineering team is evaluating your application for <strong>{activeApp.jobTitle}</strong>. Once screening is complete, you will receive an invitation to the interactive coding challenge.
                </p>
              </div>
              <div className="px-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-slate-300 shrink-0">
                Turnaround: 2–3 business days
              </div>
            </div>
          )}

          {/* Current Stage Action Callout Card */}
          {activeApp.currentStage === ApplicationStage.CodingAssessment && !activeApp.codingSubmission && (
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-sm border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-xl text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700">
                  <FileCode className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                  Action Required
                </div>
                <h3 className="text-lg font-bold text-white">Coding Assessment Unlocked</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your profile has passed initial screening. Complete the technical problem challenge to advance to the architecture interview round.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToTab('coding')}
                className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Launch Coding Challenge</span>
                <ArrowRight className="w-4 h-4 text-slate-900" strokeWidth={1.5} />
              </button>
            </div>
          )}

          {activeApp.currentStage === ApplicationStage.Interview && !activeApp.interviewDate && (
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-sm border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-xl text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                  Interview Invitation
                </div>
                <h3 className="text-lg font-bold text-white">Schedule Technical Interview</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  You passed the coding round. Select an available time slot to discuss system architecture with our engineering team.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToTab('scheduler')}
                className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Choose Interview Slot</span>
                <ArrowRight className="w-4 h-4 text-slate-900" strokeWidth={1.5} />
              </button>
            </div>
          )}

          {activeApp.currentStage === ApplicationStage.Interview && activeApp.interviewDate && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-5 rounded-2xl flex items-center justify-between gap-4 text-left">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" strokeWidth={1.5} />
                <div className="text-xs">
                  <span className="font-semibold text-emerald-900 block text-sm">Technical Interview Confirmed</span>
                  <span className="text-emerald-700">
                    Scheduled for <strong>{activeApp.interviewDate}</strong> at <strong>{activeApp.interviewTimeSlot}</strong>.
                  </span>
                </div>
              </div>
              <button
                onClick={() => onNavigateToTab('scheduler')}
                className="text-xs font-semibold text-emerald-900 hover:underline shrink-0"
              >
                View details
              </button>
            </div>
          )}

          {activeApp.currentStage === ApplicationStage.Offered && (
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-sm border border-slate-800 space-y-2 text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-900/60 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-700/60">
                Official Offer Extended
              </div>
              <h3 className="text-xl font-bold">Offer Extended</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                We are pleased to extend an offer for the position of <strong>{activeApp.jobTitle}</strong>. Our hiring team has sent your formal offer documentation to <strong>{activeApp.applicantEmail}</strong>.
              </p>
            </div>
          )}

          {/* Stepper Timeline Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Recruitment Pipeline Stages</h3>

            <div className="space-y-4">
              {stagesList.map((step, idx) => {
                const status = getStageStatus(step.stage);
                return (
                  <div key={idx} className="flex items-start gap-4 relative">
                    {/* Connecting line */}
                    {idx < stagesList.length - 1 && (
                      <div
                        className={`absolute left-4 top-8 w-0.5 h-12 -ml-px ${
                          status === 'completed' ? 'bg-indigo-600' : 'bg-slate-200'
                        }`}
                      />
                    )}

                    {/* Step Icon */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 font-bold text-xs ${
                        status === 'completed'
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-50'
                          : status === 'current'
                          ? 'bg-sky-500 text-white ring-4 ring-sky-100 animate-pulse'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {status === 'completed' ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-xs font-bold ${
                            status === 'current'
                              ? 'text-indigo-600 text-sm'
                              : status === 'completed'
                              ? 'text-slate-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </h4>
                        {status === 'completed' && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                            Completed
                          </span>
                        )}
                        {status === 'current' && (
                          <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
                            In Progress
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coding Assessment Submission Card (if present) */}
          {activeApp.codingSubmission && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Coding Assessment Report</h3>
                </div>
                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                  Score: {activeApp.codingSubmission.score}%
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Language</span>
                  <span className="font-semibold text-slate-700 capitalize">{activeApp.codingSubmission.language}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Unit Tests</span>
                  <span className="font-semibold text-emerald-600">
                    {activeApp.codingSubmission.testCasesPassed} / {activeApp.codingSubmission.testCasesTotal} Passed
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Submitted</span>
                  <span className="font-semibold text-slate-700">
                    {new Date(activeApp.codingSubmission.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {activeApp.codingSubmission.feedback && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-600">
                  <span className="font-bold text-slate-700 block mb-1">Evaluator Feedback:</span>
                  <p className="italic">"{activeApp.codingSubmission.feedback}"</p>
                </div>
              )}
            </div>
          )}

          {/* Stage Audit History */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Activity & Audit Timeline</h3>
            <div className="divide-y divide-slate-100">
              {activeApp.stageHistory.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-start justify-between text-xs gap-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800">{item.stage}</span>
                    <p className="text-slate-500 text-[11px]">{item.notes}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {new Date(item.updatedAt).toLocaleDateString()} {new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
