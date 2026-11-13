import React, { useState } from 'react';
import { useAppState } from '../shared/StateContext';
import { JobBoard } from './components/JobBoard';
import { ProgressTracker } from './components/ProgressTracker';
import { CodingAssessment } from './components/CodingAssessment';
import { InterviewScheduler } from './components/InterviewScheduler';
import { AuthPage } from '../shared/AuthPage';
import {
  Briefcase,
  Clipboard,
  FileCode,
  Calendar,
  Bell,
  ChevronDown,
  Check,
  Trash2,
  HelpCircle,
  MapPin,
  User,
  LogOut,
  X,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CompanyLogo } from '../shared/CompanyLogo';

export const ApplicantPortal: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    clearNotifications,
    activeApplicationId,
    currentUser,
    signOut
  } = useAppState();

  const [activeTab, setActiveTab] = useState<'jobs' | 'tracker' | 'coding' | 'scheduler'>('jobs');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'jobs':
        return <JobBoard onNavigateToTab={tab => setActiveTab(tab as any)} />;
      case 'tracker':
        return <ProgressTracker onNavigateToTab={tab => setActiveTab(tab as any)} />;
      case 'coding':
        return <CodingAssessment />;
      case 'scheduler':
        return <InterviewScheduler />;
      default:
        return <JobBoard onNavigateToTab={tab => setActiveTab(tab as any)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <CompanyLogo variant="horizontal" size="md" lightTheme={true} />
            <div className="hidden sm:flex items-center gap-1 pl-3.5 ml-3.5 border-l border-slate-200 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-sky-500" />
              <span>Pretoria, South Africa</span>
            </div>
          </div>

          {/* Navigation Tab list (Pill labels) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/60">
            <button
              id="jobs-tab-btn"
              onClick={() => setActiveTab('jobs')}
              className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'jobs' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Open Positions
            </button>
            <button
              id="tracker-tab-btn"
              onClick={() => setActiveTab('tracker')}
              className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'tracker' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clipboard className="w-3.5 h-3.5" />
              Track Progress
            </button>
            <button
              id="coding-tab-btn"
              onClick={() => setActiveTab('coding')}
              className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'coding' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              Coding Assessment
            </button>
            <button
              id="scheduler-tab-btn"
              onClick={() => setActiveTab('scheduler')}
              className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'scheduler' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Interview Scheduler
            </button>
          </nav>

          {/* Right Area: Alerts Bell & User Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Active app indicator */}
            {activeApplicationId && (
              <button
                onClick={() => setActiveTab('tracker')}
                className="hidden lg:flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-3 py-1.5 rounded-xl text-[11px] transition-all cursor-pointer"
                title="View active application in progress tracker"
              >
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                <span className="text-indigo-700 font-bold font-mono">{activeApplicationId}</span>
              </button>
            )}

            {/* Bell Icon dropdown */}
            <div className="relative">
              <button
                id="applicant-bell-btn"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition-colors relative border border-slate-200 cursor-pointer"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </button>

              {/* Notification Overlay Panel */}
              <AnimatePresence>
                {isNotifOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden z-40">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Notifications ({unreadNotifs.length})</span>
                      {notifications.length > 0 && (
                        <button
                          onClick={clearNotifications}
                          className="text-[10px] text-rose-500 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          Clear all
                        </button>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400">No notifications yet.</div>
                      ) : (
                        notifications.map(notif => (
                          <div
                            key={notif.id}
                            onClick={() => markNotificationAsRead(notif.id)}
                            className={`p-3.5 text-left transition-colors cursor-pointer ${
                              notif.read ? 'bg-white hover:bg-slate-50' : 'bg-indigo-50/50 hover:bg-indigo-50/70'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1.5">
                              <h4 className="text-xs font-bold text-slate-800">{notif.title}</h4>
                              {!notif.read && <span className="w-2 h-2 bg-indigo-600 rounded-full shrink-0 mt-1" />}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{notif.message}</p>
                            <span className="text-[9px] text-slate-400 mt-1 block">
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Candidate User Profile / Sign In */}
            {currentUser ? (
              <div className="flex items-center gap-3 border-l border-slate-200 pl-3">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-800 leading-none">{currentUser.name}</span>
                  <span className="text-[9px] text-slate-400 mt-0.5 font-medium leading-none">{currentUser.email}</span>
                </div>
                <button
                  id="applicant-logout-btn"
                  onClick={signOut}
                  className="text-xs font-bold text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 bg-slate-50 hover:bg-rose-50 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>Candidate Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden border-t border-slate-100 flex overflow-x-auto p-1.5 bg-slate-50">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex-1 min-w-[70px] text-center p-2 rounded-xl text-[10px] font-bold ${
              activeTab === 'jobs' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Positions
          </button>
          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex-1 min-w-[70px] text-center p-2 rounded-xl text-[10px] font-bold ${
              activeTab === 'tracker' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Tracker
          </button>
          <button
            onClick={() => setActiveTab('coding')}
            className={`flex-1 min-w-[70px] text-center p-2 rounded-xl text-[10px] font-bold ${
              activeTab === 'coding' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Coding
          </button>
          <button
            onClick={() => setActiveTab('scheduler')}
            className={`flex-1 min-w-[70px] text-center p-2 rounded-xl text-[10px] font-bold ${
              activeTab === 'scheduler' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Scheduler
          </button>
        </div>
      </header>

      {/* Main Container Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {renderActiveTab()}
      </main>

      {/* AUTH MODAL FOR APPLICANTS */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md">
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute right-4 top-4 z-50 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
              <AuthPage onSuccess={() => setIsAuthModalOpen(false)} />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default ApplicantPortal;
