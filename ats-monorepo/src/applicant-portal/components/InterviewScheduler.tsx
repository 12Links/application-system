import React, { useState } from 'react';
import { useAppState } from '../../shared/StateContext';
import { ApplicationStage } from '../../shared/types';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Video,
  MapPin,
  ArrowRight,
  Sparkles,
  Link2,
  CalendarCheck,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InterviewSchedulerProps {
  onNavigateToTab?: (tab: string) => void;
}

export const InterviewScheduler: React.FC<InterviewSchedulerProps> = ({ onNavigateToTab }) => {
  const { applications, activeApplicationId, scheduleInterviewSlot } = useAppState();

  const [selectedDate, setSelectedDate] = useState('2026-07-16');
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM - 11:00 AM');
  const [prepNotes, setPrepNotes] = useState('');
  const [scheduledSuccess, setScheduledSuccess] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);

  const activeApp = applications.find(
    app =>
      app.id.toLowerCase() === activeApplicationId?.toLowerCase() ||
      app.applicantEmail.toLowerCase() === activeApplicationId?.toLowerCase()
  );

  if (!activeApp) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs space-y-6">
        <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center mx-auto">
          <CalendarIcon className="w-6 h-6 text-slate-600" strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Technical Interview Overview</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Candidates who complete the technical assessment are invited to an interactive architecture and systems conversation with our engineering leads.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
            <span className="text-xs font-semibold text-slate-800 block">Duration</span>
            <p className="text-[11px] text-slate-500 leading-relaxed">45–60 minutes focused on live problem solving and code review.</p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
            <span className="text-xs font-semibold text-slate-800 block">Format</span>
            <p className="text-[11px] text-slate-500 leading-relaxed">Online via Google Meet or on-site at our Pretoria office.</p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
            <span className="text-xs font-semibold text-slate-800 block">Preparation</span>
            <p className="text-[11px] text-slate-500 leading-relaxed">Review your previous submission and past architectural decisions.</p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onNavigateToTab?.('tracker')}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Track Existing Application</span>
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => onNavigateToTab?.('jobs')}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <span>Browse Vacancies</span>
          </button>
        </div>
      </div>
    );
  }

  const isEligible = activeApp.currentStage === ApplicationStage.Interview || activeApp.currentStage === ApplicationStage.Offered;
  const isAlreadyScheduled = !!activeApp.interviewDate && !isRescheduling;

  if (!isEligible && !activeApp.interviewDate) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm space-y-4">
        <AlertCircle className="w-14 h-14 text-amber-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">Interview Scheduling Locked</h3>
        <p className="text-xs text-slate-500">
          Your current application stage is{' '}
          <span className="px-2 py-0.5 bg-slate-100 border rounded font-semibold text-slate-700">
            {activeApp.currentStage}
          </span>
          .
        </p>
        <p className="text-[11px] text-slate-400">
          This round becomes accessible once your Coding Assessment is completed and approved.
        </p>
      </div>
    );
  }

  const upcomingDates = [
    { value: '2026-07-16', label: 'Thursday, Jul 16', slotsLeft: 4 },
    { value: '2026-07-17', label: 'Friday, Jul 17', slotsLeft: 2 },
    { value: '2026-07-20', label: 'Monday, Jul 20', slotsLeft: 5 },
    { value: '2026-07-21', label: 'Tuesday, Jul 21', slotsLeft: 3 }
  ];

  const timeSlots = [
    { value: '09:00 AM - 10:00 AM', available: true },
    { value: '10:00 AM - 11:00 AM', available: true },
    { value: '11:00 AM - 12:00 PM', available: true },
    { value: '02:00 PM - 03:00 PM', available: true },
    { value: '03:30 PM - 04:30 PM', available: true },
    { value: '04:30 PM - 05:30 PM', available: false }
  ];

  const handleConfirmSchedule = () => {
    if (!selectedDate || !selectedSlot) {
      alert('Please select both an interview date and time slot!');
      return;
    }

    scheduleInterviewSlot(activeApp.id, selectedDate, selectedSlot, prepNotes || undefined);
    setScheduledSuccess(true);
    setIsRescheduling(false);
  };

  return (
    <div id="interview-scheduler-root" className="max-w-3xl mx-auto space-y-6">
      {isAlreadyScheduled ? (
        /* Confirmed Interview Card */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6 text-left"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Confirmed
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Technical Interview Confirmed</h3>
                <p className="text-xs text-slate-500">Position: {activeApp.jobTitle}</p>
              </div>
            </div>

            <button
              onClick={() => setIsRescheduling(true)}
              className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 p-2 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reschedule</span>
            </button>
          </div>

          {/* Details Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <CalendarIcon className="w-3.5 h-3.5 text-indigo-500" /> Date & Time
              </span>
              <p className="text-sm font-black text-slate-800">{activeApp.interviewDate}</p>
              <p className="text-xs text-indigo-600 font-bold">{activeApp.interviewTimeSlot}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Video className="w-3.5 h-3.5 text-sky-500" /> Meeting Format
              </span>
              <p className="text-sm font-black text-slate-800">Google Meet (Live Video)</p>
              <a
                href="#meet"
                onClick={e => {
                  e.preventDefault();
                  alert('Video meeting link will open 10 minutes prior to scheduled start.');
                }}
                className="text-xs text-sky-600 font-bold hover:underline inline-flex items-center gap-1"
              >
                <Link2 className="w-3 h-3" /> https://meet.google.com/ats-12links-dev
              </a>
            </div>
          </div>

          {/* Interviewer & Prep Guidance */}
          <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-xs text-slate-700 space-y-2">
            <span className="font-bold text-indigo-900 block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Interview Format & What to Expect
            </span>
            <ul className="space-y-1 text-slate-600 text-[11px]">
              <li>• 10 min: Introductions and discussion of your past projects & architecture experiences.</li>
              <li>• 35 min: Collaborative technical problem-solving & system design walk-through.</li>
              <li>• 15 min: Open Q&A about 12 Links team culture, roadmap, and technologies.</li>
            </ul>
          </div>
        </motion.div>
      ) : (
        /* Booking Interface */
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6 text-left">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
              Live Technical Round
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">Book Your Technical Interview</h2>
            <p className="text-xs text-slate-500 mt-1">
              Candidate: <strong>{activeApp.applicantName}</strong> • Role: <strong>{activeApp.jobTitle}</strong>
            </p>
          </div>

          {/* Date Selector */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              1. Choose an Available Date
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {upcomingDates.map(d => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setSelectedDate(d.value)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedDate === d.value
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-200'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold block">{d.label}</span>
                  <span className={`text-[10px] mt-0.5 block ${selectedDate === d.value ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {d.slotsLeft} slots remaining
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Slot Selector */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              2. Select a Time Slot (SAST - South Africa Standard Time)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {timeSlots.map(slot => (
                <button
                  key={slot.value}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => setSelectedSlot(slot.value)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    !slot.available
                      ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                      : selectedSlot === slot.value
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-200'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 font-semibold'
                  }`}
                >
                  <span className="text-xs font-bold block">{slot.value}</span>
                  <span className={`text-[9px] mt-0.5 block ${!slot.available ? 'text-slate-400' : selectedSlot === slot.value ? 'text-indigo-200' : 'text-emerald-600'}`}>
                    {slot.available ? 'Available' : 'Booked'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Notes */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              3. Preparation Notes or Questions for the Interview Panel (Optional)
            </label>
            <textarea
              rows={2}
              value={prepNotes}
              onChange={e => setPrepNotes(e.target.value)}
              placeholder="e.g. I would love to discuss the real-time websocket architecture during the call..."
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none focus:border-indigo-500"
            />
          </div>

          {/* Confirm Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Selected: <strong className="text-slate-800">{selectedDate}</strong> at <strong className="text-indigo-600">{selectedSlot}</strong>
            </div>

            <button
              type="button"
              onClick={handleConfirmSchedule}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Confirm & Send Calendar Invite</span>
            </button>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      <AnimatePresence>
        {scheduledSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 text-center space-y-5"
            >
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-9 h-9 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">Interview Scheduled!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  We look forward to meeting you! A calendar invitation with video conference coordinates has been dispatched to your email.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Confirmed Slot</span>
                <p className="text-sm font-black text-indigo-600">{selectedDate}</p>
                <p className="text-xs font-bold text-slate-700">{selectedSlot}</p>
              </div>

              <button
                type="button"
                onClick={() => setScheduledSuccess(false)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Close & View Confirmation
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
