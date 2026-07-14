import React, { useState } from 'react';
import { useAppState } from '../../shared/StateContext';
import { ApplicationStage } from '../../shared/types';
import { Calendar as CalendarIcon, Clock, CheckCircle, AlertCircle, FileCode, Users, Video, MapPin, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const InterviewScheduler: React.FC = () => {
  const { applications, activeApplicationId, scheduleInterviewSlot } = useAppState();
  const [selectedDate, setSelectedDate] = useState('2026-07-16');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [scheduledSuccess, setScheduledSuccess] = useState(false);

  const activeApp = applications.find(app => app.id === activeApplicationId || app.applicantEmail.toLowerCase() === activeApplicationId?.toLowerCase());

  if (!activeApp) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center max-w-lg mx-auto shadow-sm">
        <CalendarIcon className="w-14 h-14 text-indigo-100 mx-auto mb-4 stroke-[1.5]" />
        <h3 className="text-lg font-bold text-slate-800">No Active Application</h3>
        <p className="text-sm text-slate-500 mt-2">
          Please search and connect your application file in the <span className="font-semibold text-indigo-600">Track Progress</span> tab first.
        </p>
      </div>
    );
  }

  const isEligible = activeApp.currentStage === ApplicationStage.Interview;
  const isAlreadyScheduled = !!activeApp.interviewDate;

  if (!isEligible && !isAlreadyScheduled) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center max-w-lg mx-auto shadow-sm space-y-4">
        <AlertCircle className="w-14 h-14 text-amber-500 mx-auto stroke-[1.5]" />
        <h3 className="text-lg font-bold text-slate-800">Interview Scheduling Locked</h3>
        <p className="text-sm text-slate-500">
          Your current application stage is <span className="px-2 py-0.5 bg-slate-100 border rounded font-semibold text-slate-700">{activeApp.currentStage}</span>.
        </p>
        <p className="text-xs text-slate-400">
          This round becomes accessible once you pass the Coding Assessment stage with a qualifying score.
        </p>
      </div>
    );
  }

  const upcomingDates = [
    { value: '2026-07-14', label: 'Tuesday, Jul 14', slotsLeft: 3 },
    { value: '2026-07-15', label: 'Wednesday, Jul 15', slotsLeft: 1 },
    { value: '2026-07-16', label: 'Thursday, Jul 16', slotsLeft: 5 },
    { value: '2026-07-17', label: 'Friday, Jul 17', slotsLeft: 2 }
  ];

  const timeSlots = [
    { value: '09:00 AM - 10:00 AM', available: true },
    { value: '10:00 AM - 11:00 AM', available: selectedDate !== '2026-07-15' }, // Busy on Wednesday
    { value: '11:00 AM - 12:00 PM', available: true },
    { value: '01:00 PM - 02:00 PM', available: selectedDate !== '2026-07-17' }, // Busy on Friday afternoon
    { value: '02:00 PM - 03:00 PM', available: true },
    { value: '04:00 PM - 05:00 PM', available: selectedDate !== '2026-07-14' } // Busy on Tuesday evening
  ];

  const handleConfirmSchedule = () => {
    if (!selectedDate || !selectedSlot) {
      alert('Please select both an interview date and time slot!');
      return;
    }

    scheduleInterviewSlot(activeApp.id, selectedDate, selectedSlot);
    setScheduledSuccess(true);
  };

  return (
    <div id="interview-scheduler-root" className="max-w-4xl mx-auto space-y-6">
      
      {isAlreadyScheduled ? (
        /* Confirmed Interview Card */
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Technical Interview Confirmed</h3>
              <p className="text-slate-400 text-xs mt-0.5">Application ID: {activeApp.id}</p>
            </div>
          </div>

          {/* Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 text-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-slate-600">
                <CalendarIcon className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
                <span>
                  Date: <span className="font-bold text-slate-800">
                    {upcomingDates.find(d => d.value === activeApp.interviewDate)?.label || activeApp.interviewDate}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600">
                <Clock className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
                <span>
                  Time: <span className="font-bold text-slate-800">{activeApp.interviewTimeSlot}</span>
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-slate-600">
                <Video className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
                <span>
                  Format: <span className="font-bold text-slate-800">Google Meet (Live Coding)</span>
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600">
                <Users className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
                <span>
                  Interviewers: <span className="font-bold text-slate-800">Engineering Panel</span>
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-5">
            <h4 className="font-bold text-slate-700 uppercase tracking-wider">How to Prepare</h4>
            <p>
              The 60-minute session will involve sharing your screen to build a responsive React layout or optimize a Python dataset utility. 
              Be sure to test your webcam, microphone, and internet connection prior to the session.
            </p>
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={() => {
                const el = document.getElementById('tracker-tab-btn');
                if (el) el.click();
              }}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/10 flex items-center gap-1.5"
            >
              Track Application Progress
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Scheduler Form screen */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
          
          {/* Calendar side */}
          <div className="md:col-span-5 space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-800">1. Select Interview Date</h3>
              <p className="text-slate-500 text-xs mt-1">Available slots for the next 4 business days.</p>
            </div>

            <div className="space-y-2.5">
              {upcomingDates.map((dateItem) => {
                const isSelected = selectedDate === dateItem.value;
                return (
                  <button
                    key={dateItem.value}
                    onClick={() => {
                      setSelectedDate(dateItem.value);
                      setSelectedSlot(''); // Reset slot on date shift
                    }}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/10'
                        : 'border-slate-100 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-500'
                      }`}>
                        <CalendarIcon className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{dateItem.label}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">2026</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {dateItem.slotsLeft} slots
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots side */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-800">2. Select Time Slot</h3>
                <p className="text-slate-500 text-xs mt-1">Times are shown in your local timezone.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {timeSlots.map((slot) => {
                  const isSelected = selectedSlot === slot.value;
                  return (
                    <button
                      key={slot.value}
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot.value)}
                      className={`p-3.5 rounded-xl border text-center transition-all text-xs font-semibold flex items-center justify-center gap-2 ${
                        !slot.available
                          ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed line-through'
                          : isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      {slot.value}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Confirm Actions */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                {selectedSlot ? (
                  <p className="text-xs text-slate-500">
                    Selected: <span className="font-bold text-indigo-600">
                      {upcomingDates.find(d => d.value === selectedDate)?.label} at {selectedSlot}
                    </span>
                  </p>
                ) : (
                  <p className="text-xs text-slate-400">Please choose a date and slot to finalize.</p>
                )}
              </div>
              
              <button
                id="schedule-confirm-btn"
                onClick={handleConfirmSchedule}
                disabled={!selectedSlot}
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
              >
                Book Interview Slot
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Booking confirmation modal */}
      <AnimatePresence>
        {scheduledSuccess && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md p-8 text-center shadow-2xl border border-slate-100 space-y-5"
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-800">Booking Confirmed!</h4>
                <p className="text-sm text-slate-500 mt-2">
                  Your developer screen has been added to our calendars. Google Meet links have been sent to you!
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs text-slate-700 font-semibold space-y-1">
                <p>Date: {upcomingDates.find(d => d.value === selectedDate)?.label}</p>
                <p>Time Slot: {selectedSlot}</p>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  onClick={() => {
                    setScheduledSuccess(false);
                    const el = document.getElementById('tracker-tab-btn');
                    if (el) el.click();
                  }}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md"
                >
                  Return to Progress Tracker
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
