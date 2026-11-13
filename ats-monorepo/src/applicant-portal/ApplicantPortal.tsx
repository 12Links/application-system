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
  MapPin,
  User,
  LogOut,
  X,
  Check
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { CompanyLogo } from '../shared/CompanyLogo';

interface ApplicantPortalProps {
  onNavigateToAdmin?: () => void;
}

export const ApplicantPortal: React.FC<ApplicantPortalProps> = ({ onNavigateToAdmin }) => {
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
        return <CodingAssessment onNavigateToTab={tab => setActiveTab(tab as any)} />;
      case 'scheduler':
        return <InterviewScheduler onNavigateToTab={tab => setActiveTab(tab as any)} />;
      default:
        return <JobBoard onNavigateToTab={tab => setActiveTab(tab as any)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <CompanyLogo variant="horizontal" size="md" lightTheme={true} />
            <div className="hidden sm:flex items-center gap-1.5 pl-3.5 ml-3.5 border-l border-slate-200 text-xs text-slate-500 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
              <span>Pretoria, South Africa</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/60">
            <button
              id="jobs-tab-btn"
              onClick={() => setActiveTab('jobs')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'jobs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.5} />
              Open Vacancies
            </button>
            <button
              id="tracker-tab-btn"
              onClick={() => setActiveTab('tracker')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'tracker' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clipboard className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.5} />
              Track Application
            </button>

            {/* Assessment and Interview tabs only surface when applicant has an active profile */}
            {activeApplicationId && (
              <>
                <button
                  id="coding-tab-btn"
                  onClick={() => setActiveTab('coding')}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'coding' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.5} />
                  Coding Assessment
                </button>
                <button
                  id="scheduler-tab-btn"
                  onClick={() => setActiveTab('scheduler')}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'scheduler' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.5} />
                  Interview Scheduler
                </button>
              </>
            )}
          </nav>

          {/* Right Area: Alerts Bell & User Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Active app indicator */}
            {activeApplicationId && (
              <button
                onClick={() => setActiveTab('tracker')}
                className="hidden lg:flex items-center gap-2 bg-slate-100 hover:bg-slate-200/70 border border-slate-200 px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer"
                title="View active application in progress tracker"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-slate-700 font-semibold font-mono text-[11px]">{activeApplicationId}</span>
              </button>
            )}

            {/* Bell Icon dropdown */}
            <div className="relative">
              <button
                id="applicant-bell-btn"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition-colors relative border border-slate-200/80 cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" strokeWidth={1.5} />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
                )}
              </button>

              {/* Notification Drawer */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 text-left space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-900 text-xs">Notifications</span>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="text-[10px] text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-6">No notifications yet.</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-3 rounded-xl border text-xs space-y-1 transition-all cursor-pointer ${
                            n.read ? 'bg-white border-slate-100 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-slate-900">{n.title}</span>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-slate-600">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Candidate Authentication Status */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-semibold text-slate-800 line-clamp-1">{currentUser.name || currentUser.email}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Candidate</p>
                </div>
                <button
                  onClick={signOut}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/80 rounded-xl transition-all cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <User className="w-3.5 h-3.5 text-slate-300" strokeWidth={1.5} />
                <span>Candidate Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden border-t border-slate-100 flex overflow-x-auto p-1.5 bg-slate-50">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex-1 min-w-[70px] text-center p-2 rounded-xl text-[11px] font-semibold ${
              activeTab === 'jobs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            Vacancies
          </button>
          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex-1 min-w-[70px] text-center p-2 rounded-xl text-[11px] font-semibold ${
              activeTab === 'tracker' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            Track Status
          </button>
          {activeApplicationId && (
            <>
              <button
                onClick={() => setActiveTab('coding')}
                className={`flex-1 min-w-[70px] text-center p-2 rounded-xl text-[11px] font-semibold ${
                  activeTab === 'coding' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                Coding
              </button>
              <button
                onClick={() => setActiveTab('scheduler')}
                className={`flex-1 min-w-[70px] text-center p-2 rounded-xl text-[11px] font-semibold ${
                  activeTab === 'scheduler' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                Interview
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Container Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {renderActiveTab()}
      </main>

      {/* Auth Modal for Applicants */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="relative w-full max-w-md">
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute right-4 top-4 z-50 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
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
