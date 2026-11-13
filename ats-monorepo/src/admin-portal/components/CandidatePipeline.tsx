import React, { useState } from 'react';
import { useAppState } from '../../shared/StateContext';
import { ApplicationStage, Application } from '../../shared/types';
import {
  Check,
  Mail,
  Phone,
  ExternalLink,
  Calendar,
  Code,
  FileText,
  ArrowRight,
  UserCheck,
  AlertTriangle,
  MessageSquare,
  Search,
  Kanban,
  List,
  Sparkles,
  Award,
  ChevronRight,
  Trash2,
  Github,
  Globe,
  Linkedin,
  Clock,
  CheckCircle2,
  XCircle,
  Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CandidatePipeline: React.FC = () => {
  const { applications, updateApplicationStage, addFeedback, deleteApplication } = useAppState();

  const [viewMode, setViewMode] = useState<'kanban' | 'detail'>('kanban');
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [filterStage, setFilterStage] = useState<string>('All');
  const [filterRole, setFilterRole] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Evaluation updates states
  const [stageNotes, setStageNotes] = useState('');
  const [isUpdatingStage, setIsUpdatingStage] = useState<ApplicationStage | null>(null);

  // Manual code review states
  const [gradeScore, setGradeScore] = useState<number>(90);
  const [manualFeedback, setManualFeedback] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const activeApp = applications.find(app => app.id === selectedAppId) || applications[0];

  // Unique roles for filter dropdown
  const uniqueRoles = ['All', ...Array.from(new Set(applications.map(a => a.jobTitle)))];

  const filteredApps = applications.filter(app => {
    const matchesStage = filterStage === 'All' || app.currentStage === filterStage;
    const matchesRole = filterRole === 'All' || app.jobTitle === filterRole;
    const matchesSearch =
      searchQuery === '' ||
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStage && matchesRole && matchesSearch;
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

  const handleQuickAdvance = (app: Application) => {
    let nextStage: ApplicationStage | null = null;
    switch (app.currentStage) {
      case ApplicationStage.Applied:
        nextStage = ApplicationStage.TechnicalScreening;
        break;
      case ApplicationStage.TechnicalScreening:
        nextStage = ApplicationStage.CodingAssessment;
        break;
      case ApplicationStage.CodingAssessment:
        nextStage = ApplicationStage.Interview;
        break;
      case ApplicationStage.Interview:
        nextStage = ApplicationStage.Offered;
        break;
      default:
        nextStage = null;
    }

    if (nextStage) {
      updateApplicationStage(app.id, nextStage, `Quick advanced from recruiter pipeline board.`);
    }
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
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case ApplicationStage.TechnicalScreening:
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case ApplicationStage.CodingAssessment:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case ApplicationStage.Interview:
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case ApplicationStage.Offered:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case ApplicationStage.Rejected:
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const kanbanColumns: { stage: ApplicationStage; title: string; color: string }[] = [
    { stage: ApplicationStage.Applied, title: 'New Applications', color: 'border-blue-400' },
    { stage: ApplicationStage.TechnicalScreening, title: 'Tech Screening', color: 'border-amber-400' },
    { stage: ApplicationStage.CodingAssessment, title: 'Coding Challenge', color: 'border-indigo-400' },
    { stage: ApplicationStage.Interview, title: 'Technical Interview', color: 'border-sky-400' },
    { stage: ApplicationStage.Offered, title: 'Offer Extended', color: 'border-emerald-400' },
    { stage: ApplicationStage.Rejected, title: 'Rejected', color: 'border-rose-400' }
  ];

  return (
    <div id="candidate-pipeline-root" className="space-y-6">
      {/* Top Filter and View Mode Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[200px] flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, role, email, or ID..."
              className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none text-slate-700"
          >
            {uniqueRoles.map(role => (
              <option key={role} value={role}>
                {role === 'All' ? 'All Job Openings' : role}
              </option>
            ))}
          </select>

          <select
            value={filterStage}
            onChange={e => setFilterStage(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none text-slate-700"
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

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'kanban' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Kanban Pipeline</span>
          </button>
          <button
            onClick={() => setViewMode('detail')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'detail' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Candidate Dossier</span>
          </button>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
          {kanbanColumns.map(col => {
            const colApps = filteredApps.filter(a => a.currentStage === col.stage);
            return (
              <div key={col.stage} className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200/80 space-y-3 min-w-[220px]">
                {/* Column Header */}
                <div className={`border-t-4 ${col.color} pt-2 flex items-center justify-between`}>
                  <h4 className="text-xs font-bold text-slate-800">{col.title}</h4>
                  <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-600">
                    {colApps.length}
                  </span>
                </div>

                {/* Candidate Cards in Column */}
                <div className="space-y-2.5">
                  {colApps.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-[11px] border border-dashed border-slate-200 rounded-xl bg-white/50">
                      No candidates
                    </div>
                  ) : (
                    colApps.map(app => (
                      <div
                        key={app.id}
                        className="bg-white p-3.5 rounded-xl border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-md transition-all text-left space-y-2.5 group"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <span className="text-[9px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
                              {app.id}
                            </span>
                            <h5 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{app.applicantName}</h5>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500 font-medium line-clamp-1">{app.jobTitle}</p>

                        {/* Extra indicators */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                          {app.codingSubmission && (
                            <span className="bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-100 flex items-center gap-0.5">
                              <Code className="w-3 h-3 text-emerald-600" />
                              {app.codingSubmission.score}%
                            </span>
                          )}
                          {app.interviewDate && (
                            <span className="bg-sky-50 text-sky-700 font-bold px-1.5 py-0.5 rounded border border-sky-100 flex items-center gap-0.5">
                              <Calendar className="w-3 h-3 text-sky-600" />
                              {app.interviewDate}
                            </span>
                          )}
                        </div>

                        {/* Card footer buttons */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-[10px]">
                          <button
                            onClick={() => {
                              setSelectedAppId(app.id);
                              setViewMode('detail');
                            }}
                            className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline cursor-pointer"
                          >
                            Dossier →
                          </button>

                          {col.stage !== ApplicationStage.Offered && col.stage !== ApplicationStage.Rejected && (
                            <button
                              onClick={() => handleQuickAdvance(app)}
                              className="px-2 py-1 bg-slate-100 hover:bg-indigo-600 hover:text-white rounded-md font-bold text-slate-600 transition-all flex items-center gap-0.5 cursor-pointer"
                              title="Advance to next pipeline stage"
                            >
                              <span>Next</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* DETAIL DOSSIER VIEW (2-column master-detail) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[650px]">
          {/* LEFT COLUMN: Candidate Roster */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Candidates ({filteredApps.length})</span>
              <span className="text-[10px] text-slate-400">Click to inspect</span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[600px]">
              {filteredApps.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">No matching candidates found.</div>
              ) : (
                filteredApps.map(app => {
                  const isSelected = selectedAppId === app.id;
                  return (
                    <div
                      key={app.id}
                      onClick={() => setSelectedAppId(app.id)}
                      className={`p-4 text-left transition-all cursor-pointer ${
                        isSelected ? 'bg-indigo-50/60 border-l-4 border-indigo-600' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <span className="text-[9px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
                            {app.id}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 mt-0.5 line-clamp-1">{app.applicantName}</h4>
                        </div>
                        <span className="text-[9px] text-slate-400">{new Date(app.appliedAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{app.jobTitle}</p>

                      <div className="flex items-center justify-between mt-2.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getStageColorBadge(app.currentStage)}`}>
                          {app.currentStage}
                        </span>
                        {app.codingSubmission && (
                          <span className="text-[10px] text-emerald-600 font-bold">
                            Score: {app.codingSubmission.score}%
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Active Candidate Dossier */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 overflow-y-auto space-y-6 text-left">
            {activeApp ? (
              <div className="space-y-6">
                {/* Dossier Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {activeApp.id}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStageColorBadge(activeApp.currentStage)}`}>
                        {activeApp.currentStage}
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mt-1">{activeApp.applicantName}</h2>
                    <p className="text-xs text-slate-500">
                      Applied for <strong className="text-slate-800">{activeApp.jobTitle}</strong> • {new Date(activeApp.appliedAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Stage Advance Buttons */}
                  <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
                    <button
                      onClick={() => handleStageChange(ApplicationStage.TechnicalScreening)}
                      className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-[11px] font-bold border border-amber-200 transition-all cursor-pointer"
                    >
                      Screening
                    </button>
                    <button
                      onClick={() => handleStageChange(ApplicationStage.CodingAssessment)}
                      className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-xl text-[11px] font-bold border border-indigo-200 transition-all cursor-pointer"
                    >
                      Coding Challenge
                    </button>
                    <button
                      onClick={() => handleStageChange(ApplicationStage.Interview)}
                      className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-xl text-[11px] font-bold border border-sky-200 transition-all cursor-pointer"
                    >
                      Interview
                    </button>
                    <button
                      onClick={() => handleStageChange(ApplicationStage.Offered)}
                      className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-[11px] font-bold border border-emerald-200 transition-all cursor-pointer"
                    >
                      Offer Job
                    </button>
                    <button
                      onClick={() => handleStageChange(ApplicationStage.Rejected)}
                      className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-[11px] font-bold border border-rose-200 transition-all cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </div>

                {/* Stage Notes Prompt Modal */}
                <AnimatePresence>
                  {isUpdatingStage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                        <span>Update Stage to: {isUpdatingStage}</span>
                        <button onClick={() => setIsUpdatingStage(null)} className="text-slate-400 hover:text-slate-600">
                          Cancel
                        </button>
                      </div>
                      <form onSubmit={submitStageChange} className="space-y-2">
                        <textarea
                          rows={2}
                          value={stageNotes}
                          onChange={e => setStageNotes(e.target.value)}
                          placeholder="Optional audit notes or reason for advancing..."
                          className="w-full text-xs font-medium p-2.5 rounded-xl border border-indigo-200 bg-white outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all cursor-pointer"
                        >
                          Confirm Stage Transition
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Contact and Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" /> Email
                    </span>
                    <a href={`mailto:${activeApp.applicantEmail}`} className="font-bold text-slate-800 hover:text-indigo-600 truncate block">
                      {activeApp.applicantEmail}
                    </a>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" /> Phone
                    </span>
                    <a href={`tel:${activeApp.applicantPhone}`} className="font-bold text-slate-800 hover:text-indigo-600 block">
                      {activeApp.applicantPhone}
                    </a>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> Experience
                    </span>
                    <span className="font-bold text-slate-800 block">
                      {activeApp.experienceYears || '3+ Years'}
                    </span>
                  </div>
                </div>

                {/* Profile Links & Resume */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {activeApp.portfolioUrl && (
                    <a
                      href={activeApp.portfolioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <Globe className="w-3.5 h-3.5 text-sky-500" /> Portfolio Website <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}
                  {activeApp.githubUrl && (
                    <a
                      href={activeApp.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <Github className="w-3.5 h-3.5 text-slate-800" /> GitHub Profile <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}
                  {activeApp.linkedinUrl && (
                    <a
                      href={activeApp.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <Linkedin className="w-3.5 h-3.5 text-blue-600" /> LinkedIn <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}
                  <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl font-semibold flex items-center gap-1.5 border border-indigo-100">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" /> {activeApp.resumeFileName || 'Resume.pdf'} (Verified)
                  </span>
                </div>

                {/* Cover Note */}
                {activeApp.coverLetter && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-1">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Candidate Cover Statement:</span>
                    <p className="text-slate-700 leading-relaxed italic">"{activeApp.coverLetter}"</p>
                  </div>
                )}

                {/* Coding Assessment Submission Review */}
                {activeApp.codingSubmission ? (
                  <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4 text-sky-400" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          Candidate Code Submission ({activeApp.codingSubmission.language})
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                          Score: {activeApp.codingSubmission.score}%
                        </span>
                        <button
                          onClick={() => {
                            setGradeScore(activeApp.codingSubmission?.score || 90);
                            setManualFeedback(activeApp.codingSubmission?.feedback || '');
                            setShowFeedbackModal(true);
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" /> Adjust Score
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl font-mono text-[11px] text-sky-200 overflow-x-auto max-h-48 leading-relaxed">
                      <pre>{activeApp.codingSubmission.code}</pre>
                    </div>

                    {activeApp.codingSubmission.feedback && (
                      <p className="text-xs text-slate-300 italic pt-1">
                        Reviewer feedback: "{activeApp.codingSubmission.feedback}"
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                    <span>No coding challenge submitted yet.</span>
                    {activeApp.currentStage === ApplicationStage.CodingAssessment && (
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        Awaiting Candidate Submission
                      </span>
                    )}
                  </div>
                )}

                {/* Technical Interview Information */}
                {activeApp.interviewDate && (
                  <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 text-xs text-sky-900 space-y-1">
                    <span className="font-bold block uppercase tracking-wider text-[10px] text-sky-700">Scheduled Technical Interview</span>
                    <p className="font-semibold">
                      Date: <strong>{activeApp.interviewDate}</strong> at <strong>{activeApp.interviewTimeSlot}</strong>
                    </p>
                    {activeApp.interviewNotes && (
                      <p className="text-[11px] text-sky-700">Notes: {activeApp.interviewNotes}</p>
                    )}
                  </div>
                )}

                {/* Timeline History */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Application Stage Audit</h4>
                  <div className="space-y-2">
                    {activeApp.stageHistory.map((h, i) => (
                      <div key={i} className="flex items-start justify-between text-xs p-2.5 bg-slate-50 rounded-xl">
                        <div>
                          <span className="font-bold text-slate-800">{h.stage}</span>
                          <p className="text-[11px] text-slate-500">{h.notes}</p>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(h.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Candidate Deletion */}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => {
                      if (confirm(`Remove candidate ${activeApp.applicantName} from recruitment pipeline?`)) {
                        deleteApplication(activeApp.id);
                      }
                    }}
                    className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Candidate Record</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 text-xs space-y-2">
                <Users className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-700 text-sm">No Candidates in Pipeline</p>
                <p className="text-slate-400 text-[11px]">Applications submitted by applicants will appear here for review and evaluation.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADJUST SCORE MODAL */}
      <AnimatePresence>
        {showFeedbackModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-left"
            >
              <h3 className="text-base font-black text-slate-900">Adjust Candidate Evaluation Score</h3>
              <form onSubmit={handleGradeSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Score Percentage (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={gradeScore}
                    onChange={e => setGradeScore(Number(e.target.value))}
                    className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Reviewer Notes & Feedback</label>
                  <textarea
                    rows={3}
                    value={manualFeedback}
                    onChange={e => setManualFeedback(e.target.value)}
                    placeholder="e.g. Elegant recursive logic, solid test coverage..."
                    className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl shadow-sm hover:bg-indigo-700"
                  >
                    Save Grade & Feedback
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
