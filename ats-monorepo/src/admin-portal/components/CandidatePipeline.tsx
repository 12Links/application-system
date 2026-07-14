import React, { useState } from 'react';
import { useAppState } from '../../shared/StateContext';
import { ApplicationStage, Application } from '../../shared/types';
import { Check, Mail, Phone, ExternalLink, Calendar, Code, FileText, ArrowRight, UserCheck, AlertTriangle, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CandidatePipeline: React.FC = () => {
  const { applications, updateApplicationStage, addFeedback } = useAppState();
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [filterStage, setFilterStage] = useState<string>('All');
  
  // Evaluation updates states
  const [stageNotes, setStageNotes] = useState('');
  const [isUpdatingStage, setIsUpdatingStage] = useState<ApplicationStage | null>(null);

  // Manual code review states
  const [gradeScore, setGradeScore] = useState<number>(100);
  const [manualFeedback, setManualFeedback] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const activeApp = applications.find(app => app.id === selectedAppId);

  const filteredApps = applications.filter(app => {
    if (filterStage === 'All') return true;
    return app.currentStage === filterStage;
  });

  const handleStageChange = (stage: ApplicationStage) => {
    setIsUpdatingStage(stage);
    setStageNotes('');
  };

  const submitStageChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeApp || !isUpdatingStage) return;

    updateApplicationStage(activeApp.id, isUpdatingStage, stageNotes.trim() || undefined);
    setIsUpdatingStage(null);
    setStageNotes('');
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeApp) return;

    addFeedback(activeApp.id, gradeScore, manualFeedback);
    setManualFeedback('');
    setShowFeedbackModal(false);
  };

  const getStageColorBadge = (stage: ApplicationStage) => {
    switch (stage) {
      case ApplicationStage.Applied:
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case ApplicationStage.TechnicalScreening:
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case ApplicationStage.CodingAssessment:
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case ApplicationStage.Interview:
        return 'bg-cyan-50 text-cyan-700 border-cyan-100';
      case ApplicationStage.Offered:
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case ApplicationStage.Rejected:
        return 'bg-rose-50 text-rose-700 border-rose-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div id="candidate-pipeline-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[76vh]">
      
      {/* LEFT COLUMN: Candidate roster with stage filters (4 columns) */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        {/* Roster Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">Recruitment Roster</h3>
            <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">
              {applications.length} Candidates
            </span>
          </div>

          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="w-full bg-white text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="All">All Stages</option>
            <option value={ApplicationStage.Applied}>Applied</option>
            <option value={ApplicationStage.TechnicalScreening}>Technical Screening</option>
            <option value={ApplicationStage.CodingAssessment}>Coding Assessment</option>
            <option value={ApplicationStage.Interview}>Technical Interview</option>
            <option value={ApplicationStage.Offered}>Offered</option>
            <option value={ApplicationStage.Rejected}>Rejected</option>
          </select>
        </div>

        {/* Candidate List (Scrollable) */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {filteredApps.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No candidates in this stage.
            </div>
          ) : (
            filteredApps.map((app) => {
              const isSelected = selectedAppId === app.id;
              return (
                <div
                  id={`pipeline-candidate-item-${app.id}`}
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-4 text-left transition-colors cursor-pointer ${
                    isSelected ? 'bg-indigo-50/40 border-l-4 border-indigo-600' : 'hover:bg-slate-50/55'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{app.applicantName}</h4>
                    <span className="text-[9px] text-slate-400 uppercase shrink-0">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{app.jobTitle}</p>
                  
                  <div className="flex items-center justify-between gap-2 mt-3.5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getStageColorBadge(app.currentStage)}`}>
                      {app.currentStage}
                    </span>
                    {app.codingSubmission && (
                      <span className="text-[9px] text-emerald-600 font-semibold flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded">
                        Code: {app.codingSubmission.score}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Active details review board (8 columns) */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-y-auto p-6 md:p-8 flex flex-col justify-between">
        {activeApp ? (
          <div className="space-y-6">
            
            {/* Header / Personal info panel */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStageColorBadge(activeApp.currentStage)}`}>
                  {activeApp.currentStage}
                </span>
                <h2 className="text-xl font-bold text-slate-800 mt-2.5">{activeApp.applicantName}</h2>
                <p className="text-slate-500 text-xs mt-1">Applying for: <span className="font-semibold text-slate-700">{activeApp.jobTitle}</span></p>
              </div>

              {/* Contacts */}
              <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                <a href={`mailto:${activeApp.applicantEmail}`} className="flex items-center gap-2 hover:text-indigo-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{activeApp.applicantEmail}</span>
                </a>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{activeApp.applicantPhone}</span>
                </div>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  {activeApp.githubUrl && (
                    <a href={activeApp.githubUrl} target="_blank" referrerPolicy="no-referrer" className="text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-semibold text-[11px]">
                      <ExternalLink className="w-3.5 h-3.5" />
                      GitHub
                    </a>
                  )}
                  {activeApp.portfolioUrl && (
                    <a href={activeApp.portfolioUrl} target="_blank" referrerPolicy="no-referrer" className="text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-semibold text-[11px]">
                      <ExternalLink className="w-3.5 h-3.5" />
                      Portfolio
                    </a>
                  )}
                  {activeApp.resumeUrl && (
                    <span className="text-slate-500 flex items-center gap-1 font-semibold text-[11px]">
                      <FileText className="w-3.5 h-3.5 text-indigo-500" />
                      CV: <span className="text-slate-700 font-mono bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded text-[10px]">{activeApp.resumeUrl}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* PIPELINE STAGE REGISTRATION BUTTONS */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fast-Advance Application Stage</h4>
              
              <div className="flex flex-wrap gap-2">
                {Object.values(ApplicationStage).map((stage) => {
                  const isActive = activeApp.currentStage === stage;
                  return (
                    <button
                      key={stage}
                      onClick={() => handleStageChange(stage)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isActive
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/10'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                    >
                      {stage}
                    </button>
                  );
                })}
              </div>

              {/* Notes expansion */}
              <AnimatePresence>
                {isUpdatingStage && (
                  <motion.form
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    onSubmit={submitStageChange}
                    className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Confirm Shift to: <span className="text-indigo-600">{isUpdatingStage}</span></span>
                      <button
                        type="button"
                        onClick={() => setIsUpdatingStage(null)}
                        className="text-[10px] text-slate-400 hover:text-slate-600 font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                    <textarea
                      id="stage-notes-input"
                      rows={2}
                      placeholder="Enter reviewer feedback comments, screening reasons, or stage instructions (Sent to applicant timeline)..."
                      value={stageNotes}
                      onChange={(e) => setStageNotes(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                    />
                    <div className="flex justify-end">
                      <button
                        id="stage-submit-btn"
                        type="submit"
                        className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors"
                      >
                        Confirm Stage & Send Alert
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* CODING SUBMISSION DISPLAY BOX */}
            {activeApp.codingSubmission ? (
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3.5 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">Developer Sandbox Submission</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Written in {activeApp.codingSubmission.language} • {new Date(activeApp.codingSubmission.submittedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                      {activeApp.codingSubmission.score}% Score
                    </span>
                    <button
                      onClick={() => {
                        setGradeScore(activeApp.codingSubmission?.score || 100);
                        setManualFeedback(activeApp.codingSubmission?.feedback || '');
                        setShowFeedbackModal(true);
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded-lg transition-colors border border-slate-700"
                    >
                      Evaluate Code
                    </button>
                  </div>
                </div>

                {/* Code viewport block */}
                <pre className="p-3 bg-slate-950 rounded-xl overflow-x-auto font-mono text-[10px] leading-relaxed text-emerald-300 max-h-48 scrollbar-thin">
                  <code>{activeApp.codingSubmission.code}</code>
                </pre>

                {/* Automated Feedback notes */}
                {activeApp.codingSubmission.feedback && (
                  <div className="p-3 bg-slate-950/45 rounded-lg text-[10px] text-slate-400 flex items-start gap-2 border border-slate-800/30">
                    <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed"><span className="font-semibold text-slate-300 uppercase tracking-wide">Grading Review:</span> {activeApp.codingSubmission.feedback}</p>
                  </div>
                )}
              </div>
            ) : (
              activeApp.currentStage === ApplicationStage.CodingAssessment && (
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-700">Awaiting Coding Assessment</p>
                    <p className="text-[11px] text-slate-400">The candidate has unlocked the coding task, but has not completed submission.</p>
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md animate-pulse">
                    PULSE ACTIVE
                  </span>
                </div>
              )
            )}

            {/* INTERVIEW DETAIL CARD */}
            {activeApp.interviewDate && (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scheduled Live Technical Interview</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2.5 text-xs text-slate-700">
                    <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Date: <span className="font-bold">{activeApp.interviewDate}</span></span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700">
                    <UserCheck className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Time Slot: <span className="font-bold">{activeApp.interviewTimeSlot}</span></span>
                  </div>
                </div>
              </div>
            )}

            {/* DETAILED TIMELINE LOGS FOR INTERNAL RECRUITER AUDITING */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Application Trail log</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {activeApp.stageHistory.map((hist, index) => (
                  <div key={index} className="flex items-start gap-2.5 text-[11px] text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                    <p className="leading-relaxed">
                      <span className="font-semibold text-slate-800">{hist.stage}</span> - {hist.notes || 'Stage initialized.'}
                      <span className="text-[9px] text-slate-400 ml-1.5">({new Date(hist.updatedAt).toLocaleString()})</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-20 text-slate-400 text-xs">
            No candidates registered in workspace yet.
          </div>
        )}
      </div>

      {/* Manual Grading and feedback dialog */}
      <AnimatePresence>
        {showFeedbackModal && activeApp && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100"
            >
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-3">Evaluate Developer Code</h3>
              
              <form onSubmit={handleGradeSubmit} className="space-y-4 mt-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Manual Grade / Correction (0 - 100%)</label>
                  <input
                    id="grade-score-input"
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={gradeScore}
                    onChange={(e) => setGradeScore(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Review Comments & Evaluation Notes</label>
                  <textarea
                    id="grade-feedback-input"
                    required
                    rows={4}
                    placeholder="Provide detailed feedback on algorithm choices, time-complexity, styling details..."
                    value={manualFeedback}
                    onChange={(e) => setManualFeedback(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="flex justify-end gap-3.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    id="submit-grade-btn"
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-sm"
                  >
                    Apply Review & Send Notification
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
export default CandidatePipeline;
