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
  const { applications, activeApplicationId, setActiveApplicationId } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const activeApp = applications.find(
    app =>
      app.id.toLowerCase() === activeApplicationId?.toLowerCase() ||
      app.applicantEmail.toLowerCase() === activeApplicationId?.toLowerCase()
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const found = applications.find(
      app =>
        app.id.toLowerCase() === searchQuery.trim().toLowerCase() ||
        app.applicantEmail.toLowerCase() === searchQuery.trim().toLowerCase()
    );

    if (found) {
      setActiveApplicationId(found.id);
      setErrorMsg('');
    } else {
      setErrorMsg('No application found with that ID or Email. Please check and try again.');
    }
  };

  const handleSelectDemoApp = (appId: string) => {
    setActiveApplicationId(appId);
    setErrorMsg('');
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
        /* Sign-In / ID Entry Panel */
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 md:p-12 text-center max-w-lg mx-auto shadow-sm space-y-6">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Clipboard className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Track Your Application</h2>
            <p className="text-slate-500 text-xs mt-2 max-w-sm mx-auto">
              Enter your Application ID (e.g. APP-801) or the email address you used when applying to view real-time stage progress.
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="e.g. APP-801 or thabo.mokoena@example.com"
                className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-center"
              />
            </div>
            {errorMsg && <p className="text-xs text-rose-600 font-semibold">{errorMsg}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Application Status</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Candidates pills */}
          <div className="pt-4 border-t border-slate-100 space-y-2 text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Or inspect a sample candidate:
            </span>
            <div className="flex flex-col gap-1.5">
              {applications.slice(0, 3).map(demoApp => (
                <button
                  key={demoApp.id}
                  onClick={() => handleSelectDemoApp(demoApp.id)}
                  className="p-2.5 bg-slate-50 hover:bg-indigo-50/60 border border-slate-100 hover:border-indigo-200 rounded-xl flex items-center justify-between text-xs transition-all cursor-pointer"
                >
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-slate-800">{demoApp.applicantName}</span>
                    <span className="text-[10px] text-slate-400">{demoApp.jobTitle}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentStatusStyle(demoApp.currentStage)}`}>
                    {demoApp.currentStage}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Active Application Dashboard View */
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Application File:</span>
                <span className="font-mono text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                  {activeApp.id}
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900">{activeApp.applicantName}</h2>
              <p className="text-xs text-slate-500">
                Applied for <strong className="text-slate-700">{activeApp.jobTitle}</strong> • Submitted on{' '}
                {new Date(activeApp.appliedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <div className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${currentStatusStyle(activeApp.currentStage)}`}>
                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                <span>Stage: {activeApp.currentStage}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl text-xs transition-all cursor-pointer"
                title="Disconnect application view"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Current Stage Action Callout Card */}
          {activeApp.currentStage === ApplicationStage.CodingAssessment && !activeApp.codingSubmission && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white p-6 rounded-3xl shadow-lg border border-indigo-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-indigo-500/30 text-indigo-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-indigo-400/30">
                  <FileCode className="w-3.5 h-3.5 text-sky-400" />
                  Action Required
                </div>
                <h3 className="text-lg font-black text-white">Coding Assessment Unlocked!</h3>
                <p className="text-xs text-indigo-200 leading-relaxed">
                  Your resume has passed initial technical screening. Please complete the interactive developer coding challenge to advance to the final interview round.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToTab('coding')}
                className="px-5 py-3 bg-white hover:bg-indigo-50 text-indigo-900 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Launch Coding Challenge</span>
                <ArrowRight className="w-4 h-4 text-indigo-600" />
              </button>
            </motion.div>
          )}

          {activeApp.currentStage === ApplicationStage.Interview && !activeApp.interviewDate && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-sky-900 to-indigo-900 text-white p-6 rounded-3xl shadow-lg border border-sky-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-sky-500/30 text-sky-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-sky-400/30">
                  <Calendar className="w-3.5 h-3.5 text-sky-300" />
                  Interview Invitation
                </div>
                <h3 className="text-lg font-black text-white">Schedule Your Technical Interview</h3>
                <p className="text-xs text-sky-200 leading-relaxed">
                  You passed the coding assessment! Select an available date and time slot to meet with our senior engineering team.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToTab('scheduler')}
                className="px-5 py-3 bg-white hover:bg-sky-50 text-sky-900 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Choose Interview Slot</span>
                <ArrowRight className="w-4 h-4 text-sky-600" />
              </button>
            </motion.div>
          )}

          {activeApp.currentStage === ApplicationStage.Interview && activeApp.interviewDate && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-5 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-emerald-800 block text-sm">Live Technical Interview Confirmed</span>
                  <span className="text-emerald-700">
                    Scheduled for <strong>{activeApp.interviewDate}</strong> at <strong>{activeApp.interviewTimeSlot}</strong>.
                  </span>
                </div>
              </div>
              <button
                onClick={() => onNavigateToTab('scheduler')}
                className="text-xs font-bold text-emerald-800 hover:underline shrink-0"
              >
                View Details
              </button>
            </div>
          )}

          {activeApp.currentStage === ApplicationStage.Offered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-900 text-white p-6 rounded-3xl shadow-xl border border-emerald-700 space-y-3"
            >
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                <PartyPopper className="w-5 h-5 text-emerald-400" /> Official Job Offer Extended!
              </div>
              <h3 className="text-xl font-black">Welcome to 12 Links Future Technologies!</h3>
              <p className="text-xs text-emerald-100 leading-relaxed max-w-2xl">
                We are thrilled to offer you the position of <strong>{activeApp.jobTitle}</strong>. Our HR team has sent your formal offer letter and compensation package to <strong>{activeApp.applicantEmail}</strong>.
              </p>
            </motion.div>
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
