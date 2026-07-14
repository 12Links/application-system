import React, { useState } from 'react';
import { useAppState } from '../shared/StateContext';
import { JobBoard } from './components/JobBoard';
import { ProgressTracker } from './components/ProgressTracker';
import { CodingAssessment } from './components/CodingAssessment';
import { InterviewScheduler } from './components/InterviewScheduler';
import { Briefcase, Clipboard, FileCode, Calendar, Bell, ChevronDown, Check, Trash2, HelpCircle, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CompanyLogo } from '../shared/CompanyLogo';

export const ApplicantPortal: React.FC = () => {
  const { 
    notifications, 
    markNotificationAsRead, 
    clearNotifications, 
    activeApplicationId, 
    resetAllData,
    currentUser,
    signOut
  } = useAppState();
  const [activeTab, setActiveTab] = useState('jobs');
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'jobs':
        return <JobBoard />;
      case 'tracker':
        return <ProgressTracker onNavigateToTab={(tab) => setActiveTab(tab)} />;
      case 'coding':
        return <CodingAssessment />;
      case 'scheduler':
        return <InterviewScheduler />;
      default:
        return <JobBoard />;
    }
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <CompanyLogo variant="horizontal" size="md" lightTheme={true} />
            <div className="hidden sm:flex items-center gap-1 pl-3.5 ml-3.5 border-l border-slate-200 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-sky-500" />
              <span>Pretoria, South Africa</span>
            </div>
          </div>

          {/* Navigation Tab list (Aesthetic pill labels) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/50">
            <button
              id="jobs-tab-btn"
              onClick={() => handleTabClick('jobs')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'jobs' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Open Positions
            </button>
            <button
              id="tracker-tab-btn"
              onClick={() => handleTabClick('tracker')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'tracker' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Clipboard className="w-3.5 h-3.5" />
              Track Progress
            </button>
            <button
              id="coding-tab-btn"
              onClick={() => handleTabClick('coding')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'coding' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              Coding Assessment
            </button>
            <button
              id="scheduler-tab-btn"
              onClick={() => handleTabClick('scheduler')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'scheduler' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Interview Scheduler
            </button>
          </nav>

          {/* Right Area: Alerts Bell, Connect Status & User Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Quick tracker helper info */}
            {activeApplicationId && (
              <div className="hidden lg:flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                <span className="text-indigo-600 font-semibold">Active Application Connected</span>
              </div>
            )}

            {/* Bell Icon dropdown */}
            <div className="relative">
              <button
                id="applicant-bell-btn"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition-colors relative border border-slate-100"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </button>

              {/* Notification Overlay Panel */}
              <AnimatePresence>
                {isNotifOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden z-40 animate-fade-in">
                    <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Notifications ({unreadNotifs.length})</span>
                      {notifications.length > 0 && (
                        <button
                          onClick={clearNotifications}
                          className="text-[10px] text-rose-500 hover:underline font-semibold flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Clear all
                        </button>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto divide-y divide-slate-50">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => markNotificationAsRead(notif.id)}
                            className={`p-3 text-left transition-colors cursor-pointer ${
                              notif.read ? 'bg-white hover:bg-slate-50' : 'bg-indigo-50/35 hover:bg-indigo-50/50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1.5">
                              <h4 className="text-xs font-bold text-slate-800">{notif.title}</h4>
                              {!notif.read && <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full shrink-0 mt-1" />}
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{notif.message}</p>
                            <span className="text-[9px] text-slate-400 mt-1.5 block">
                              {new Date(notif.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Signed-in User Display & Log Out */}
            {currentUser && (
              <div className="flex items-center gap-3 border-l border-slate-200 pl-3 sm:pl-4">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-800 leading-none">{currentUser.name}</span>
                  <span className="text-[9px] text-slate-400 mt-0.5 font-medium leading-none">{currentUser.email}</span>
                </div>
                <button
                  id="applicant-logout-btn"
                  onClick={signOut}
                  className="text-[10px] sm:text-xs font-bold text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 bg-slate-50 hover:bg-rose-50 px-2.5 py-1.5 rounded-xl transition-all"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Tabs (visible only on narrow screens) */}
        <div className="md:hidden border-t border-slate-100 flex overflow-x-auto p-1.5 bg-slate-50">
          <button
            onClick={() => handleTabClick('jobs')}
            className={`flex-1 min-w-[70px] text-center p-2 rounded-lg text-[10px] font-bold ${
              activeTab === 'jobs' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Positions
          </button>
          <button
            onClick={() => handleTabClick('tracker')}
            className={`flex-1 min-w-[70px] text-center p-2 rounded-lg text-[10px] font-bold ${
              activeTab === 'tracker' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Tracker
          </button>
          <button
            onClick={() => handleTabClick('coding')}
            className={`flex-1 min-w-[70px] text-center p-2 rounded-lg text-[10px] font-bold ${
              activeTab === 'coding' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Coding
          </button>
          <button
            onClick={() => handleTabClick('scheduler')}
            className={`flex-1 min-w-[70px] text-center p-2 rounded-lg text-[10px] font-bold ${
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

      {/* Subtle Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-100 flex items-center justify-between text-slate-400 text-[11px]">
        <span>© 12Links Future Technologies. All rights reserved.</span>
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
export default ApplicantPortal;
