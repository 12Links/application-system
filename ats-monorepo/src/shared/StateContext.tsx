import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job, Application, ApplicationStage, Notification, CodingSubmission, User, CodingQuestion, JobStatus } from './types';
import { INITIAL_JOBS, INITIAL_APPLICATIONS, INITIAL_QUESTIONS, INITIAL_USERS } from './mockData';

interface StateContextType {
  jobs: Job[];
  applications: Application[];
  notifications: Notification[];
  activeApplicationId: string | null;
  setActiveApplicationId: (id: string | null) => void;
  currentUser: User | null;
  users: User[];
  signUp: (userData: Omit<User, 'id'>) => { success: boolean; message: string };
  signIn: (email: string, password?: string) => { success: boolean; message: string };
  signOut: () => void;
  addJob: (job: Omit<Job, 'id' | 'createdAt'>) => void;
  updateJob: (id: string, updatedFields: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  toggleJobStatus: (id: string) => void;
  applyToJob: (appData: {
    id?: string;
    jobId: string;
    jobTitle: string;
    applicantName: string;
    applicantEmail: string;
    applicantPhone: string;
    portfolioUrl?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    resumeUrl?: string;
    resumeFileName?: string;
    experienceYears?: string;
    coverLetter?: string;
  }) => string;
  updateApplicationStage: (appId: string, stage: ApplicationStage, notes?: string) => void;
  submitCoding: (appId: string, submission: CodingSubmission) => void;
  scheduleInterviewSlot: (appId: string, date: string, timeSlot: string, notes?: string) => void;
  addFeedback: (appId: string, score: number, feedback: string) => void;
  deleteApplication: (appId: string) => void;
  addNotification: (applicationId: string, title: string, message: string, type: Notification['type']) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  restoreDemoData: () => void;
  resetAllData: () => void;
  questions: CodingQuestion[];
  saveQuestion: (question: Omit<CodingQuestion, 'id'> & { id?: string }) => void;
  deleteQuestion: (id: string) => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Jobs
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('ats_jobs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_JOBS;
  });

  // Applications
  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('ats_applications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_APPLICATIONS;
  });

  // Questions
  const [questions, setQuestions] = useState<CodingQuestion[]>(() => {
    const saved = localStorage.getItem('ats_questions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_QUESTIONS;
  });

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('ats_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'notif-welcome',
        applicationId: 'APP-801',
        title: 'Interview Stage Unlocked',
        message: 'Your coding challenge passed with 92%! Your live technical interview is confirmed for July 16, 2026.',
        type: 'success',
        createdAt: new Date().toISOString(),
        read: false
      }
    ];
  });

  // Active Application ID
  const [activeApplicationId, setActiveApplicationIdState] = useState<string | null>(() => {
    return localStorage.getItem('ats_active_app_id') || 'APP-801';
  });

  // Users
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('ats_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USERS;
  });

  // Current User
  const [currentUser, setCurrentUserState] = useState<User | null>(() => {
    const saved = localStorage.getItem('ats_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  const setCurrentUser = (user: User | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem('ats_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ats_current_user');
    }
  };

  const setActiveApplicationId = (id: string | null) => {
    setActiveApplicationIdState(id);
    if (id) {
      localStorage.setItem('ats_active_app_id', id);
    } else {
      localStorage.removeItem('ats_active_app_id');
    }
  };

  useEffect(() => {
    localStorage.setItem('ats_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('ats_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('ats_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('ats_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('ats_questions', JSON.stringify(questions));
  }, [questions]);

  // Auth Functions
  const signUp = (userData: Omit<User, 'id'>) => {
    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this email already exists!' };
    }

    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setCurrentUser(newUser);

    const existingApp = applications.find(app => app.applicantEmail.toLowerCase() === userData.email.toLowerCase());
    if (existingApp) {
      setActiveApplicationId(existingApp.id);
    }

    return { success: true, message: 'Profile created successfully!' };
  };

  const signIn = (email: string, password?: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, message: 'No registered applicant found with this email. Please check or sign up!' };
    }

    if (password && user.password && user.password !== password) {
      return { success: false, message: 'Incorrect password entered.' };
    }

    setCurrentUser(user);

    const existingApp = applications.find(app => app.applicantEmail.toLowerCase() === email.toLowerCase());
    if (existingApp) {
      setActiveApplicationId(existingApp.id);
    }

    return { success: true, message: 'Signed in successfully!' };
  };

  const signOut = () => {
    setCurrentUser(null);
  };

  // Job Management
  const addJob = (jobData: Omit<Job, 'id' | 'createdAt'>) => {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      status: jobData.status || 'Active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setJobs(prev => [newJob, ...prev]);
  };

  const updateJob = (id: string, updatedFields: Partial<Job>) => {
    setJobs(prev => prev.map(job => (job.id === id ? { ...job, ...updatedFields } : job)));
  };

  const deleteJob = (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const toggleJobStatus = (id: string) => {
    setJobs(prev =>
      prev.map(j => {
        if (j.id !== id) return j;
        const nextStatus: JobStatus = j.status === 'Active' ? 'Paused' : 'Active';
        return { ...j, status: nextStatus };
      })
    );
  };

  // Question Management
  const saveQuestion = (qData: Omit<CodingQuestion, 'id'> & { id?: string }) => {
    if (qData.id) {
      setQuestions(prev => prev.map(q => (q.id === qData.id ? ({ ...q, ...qData } as CodingQuestion) : q)));
    } else {
      const newQuestion: CodingQuestion = {
        ...qData,
        id: `q-${Date.now()}`
      };
      setQuestions(prev => [...prev, newQuestion]);
    }
  };

  const deleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  // Applications
  const applyToJob = (appData: {
    id?: string;
    jobId: string;
    jobTitle: string;
    applicantName: string;
    applicantEmail: string;
    applicantPhone: string;
    portfolioUrl?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    resumeUrl?: string;
    resumeFileName?: string;
    experienceYears?: string;
    coverLetter?: string;
  }) => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newId = appData.id || `APP-${randomSuffix}`;

    const newApp: Application = {
      id: newId,
      jobId: appData.jobId,
      jobTitle: appData.jobTitle,
      applicantName: appData.applicantName,
      applicantEmail: appData.applicantEmail,
      applicantPhone: appData.applicantPhone,
      portfolioUrl: appData.portfolioUrl,
      githubUrl: appData.githubUrl,
      linkedinUrl: appData.linkedinUrl,
      resumeUrl: appData.resumeUrl,
      resumeFileName: appData.resumeFileName || 'Resume_Document.pdf',
      experienceYears: appData.experienceYears || '1-3 Years',
      coverLetter: appData.coverLetter,
      appliedAt: new Date().toISOString(),
      currentStage: ApplicationStage.Applied,
      stageHistory: [
        {
          stage: ApplicationStage.Applied,
          updatedAt: new Date().toISOString(),
          notes: 'Application received via 12 Links Careers portal.'
        }
      ]
    };

    setApplications(prev => [newApp, ...prev]);
    setActiveApplicationId(newId);

    addNotification(
      newId,
      'Application Submitted Successfully!',
      `Thank you for applying to the ${appData.jobTitle} position. Your application ID is ${newId}.`,
      'success'
    );

    return newId;
  };

  const updateApplicationStage = (appId: string, stage: ApplicationStage, notes?: string) => {
    setApplications(prev =>
      prev.map(app => {
        if (app.id !== appId) return app;

        const stageChanged = app.currentStage !== stage;
        const updatedHistory = [...app.stageHistory];

        if (stageChanged || notes) {
          updatedHistory.push({
            stage,
            updatedAt: new Date().toISOString(),
            notes: notes || `Application moved to ${stage} stage.`
          });
        }

        return {
          ...app,
          currentStage: stage,
          stageHistory: updatedHistory
        };
      })
    );

    const targetApp = applications.find(a => a.id === appId);
    if (targetApp) {
      let notifTitle = '';
      let notifMsg = '';
      let type: Notification['type'] = 'info';

      switch (stage) {
        case ApplicationStage.TechnicalScreening:
          notifTitle = 'Screening in Progress';
          notifMsg = `Your application for ${targetApp.jobTitle} is being reviewed by the engineering leadership team.`;
          break;
        case ApplicationStage.CodingAssessment:
          notifTitle = 'Coding Assessment Unlocked!';
          notifMsg = `Great news! You have been advanced to the Coding Assessment stage for ${targetApp.jobTitle}. Access your challenge in the Coding Assessment tab.`;
          type = 'success';
          break;
        case ApplicationStage.Interview:
          notifTitle = 'Technical Interview Round!';
          notifMsg = `Congratulations! You have been invited to schedule your live technical interview for ${targetApp.jobTitle}.`;
          type = 'success';
          break;
        case ApplicationStage.Offered:
          notifTitle = 'Official Job Offer Extended! 🎉';
          notifMsg = `We are delighted to extend an official job offer for the ${targetApp.jobTitle} role! Welcome to the team!`;
          type = 'success';
          break;
        case ApplicationStage.Rejected:
          notifTitle = 'Application Status Update';
          notifMsg = `Thank you for your interest and time in interviewing with 12 Links for ${targetApp.jobTitle}. At this time, we are moving forward with other applicants.`;
          type = 'warning';
          break;
        default:
          notifTitle = 'Stage Updated';
          notifMsg = `Your application stage was updated to ${stage}.`;
      }

      addNotification(appId, notifTitle, notifMsg, type);
    }
  };

  const submitCoding = (appId: string, submission: CodingSubmission) => {
    const score = submission.score ?? 0;
    const passed = score >= 70;

    setApplications(prev =>
      prev.map(app => {
        if (app.id !== appId) return app;

        const newHistory = [...app.stageHistory];
        let nextStage = app.currentStage;
        const notes = `Submitted coding assessment in ${submission.language}. Score: ${score}% (${submission.testCasesPassed ?? 0}/${submission.testCasesTotal ?? 3} test cases passed).`;

        if (passed) {
          nextStage = ApplicationStage.Interview;
          newHistory.push({
            stage: ApplicationStage.Interview,
            updatedAt: new Date().toISOString(),
            notes: `${notes} Auto-advanced to Technical Interview stage.`
          });
        } else {
          newHistory.push({
            stage: ApplicationStage.CodingAssessment,
            updatedAt: new Date().toISOString(),
            notes: `${notes} Score pending review by engineering hiring team.`
          });
        }

        return {
          ...app,
          currentStage: nextStage,
          stageHistory: newHistory,
          codingSubmission: submission
        };
      })
    );

    const app = applications.find(a => a.id === appId);
    if (app) {
      addNotification(
        appId,
        passed ? 'Coding Challenge Passed! 🎉' : 'Assessment Submitted',
        passed
          ? `Outstanding! You scored ${score}% on the Coding Assessment and have been advanced to the Live Technical Interview!`
          : `Assessment submitted with a score of ${score}%. The hiring team has been notified.`,
        passed ? 'success' : 'info'
      );
    }
  };

  const scheduleInterviewSlot = (appId: string, date: string, timeSlot: string, notes?: string) => {
    setApplications(prev =>
      prev.map(app => {
        if (app.id !== appId) return app;

        const newHistory = [...app.stageHistory];
        newHistory.push({
          stage: app.currentStage,
          updatedAt: new Date().toISOString(),
          notes: `Scheduled Live Technical Interview for ${date} at ${timeSlot}.${notes ? ` Details: ${notes}` : ''}`
        });

        return {
          ...app,
          interviewDate: date,
          interviewTimeSlot: timeSlot,
          interviewNotes: notes || 'Live video interview via Google Meet / Microsoft Teams.',
          stageHistory: newHistory
        };
      })
    );

    const app = applications.find(a => a.id === appId);
    if (app) {
      addNotification(
        appId,
        'Interview Confirmed!',
        `Your live technical interview for ${app.jobTitle} is confirmed for ${date} at ${timeSlot}. A calendar invite has been dispatched.`,
        'success'
      );
    }
  };

  const addFeedback = (appId: string, score: number, feedback: string) => {
    setApplications(prev =>
      prev.map(app => {
        if (app.id !== appId) return app;

        const updatedSubmission: CodingSubmission = app.codingSubmission
          ? {
              ...app.codingSubmission,
              score,
              feedback
            }
          : {
              code: '// Code evaluated by hiring manager',
              language: 'typescript',
              submittedAt: new Date().toISOString(),
              score,
              feedback,
              testCasesPassed: Math.round(score / 33.3),
              testCasesTotal: 3
            };

        return {
          ...app,
          adminFeedback: feedback,
          codingSubmission: updatedSubmission
        };
      })
    );

    const app = applications.find(a => a.id === appId);
    if (app) {
      addNotification(
        appId,
        'Recruiter Feedback Added',
        `The hiring team reviewed your assessment: Score ${score}%. Feedback: "${feedback.slice(0, 60)}..."`,
        'info'
      );
    }
  };

  const deleteApplication = (appId: string) => {
    setApplications(prev => prev.filter(a => a.id !== appId));
    if (activeApplicationId === appId) {
      setActiveApplicationId(null);
    }
  };

  const addNotification = (applicationId: string, title: string, message: string, type: Notification['type']) => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      applicationId,
      title,
      message,
      type,
      createdAt: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const restoreDemoData = () => {
    setJobs(INITIAL_JOBS);
    setApplications(INITIAL_APPLICATIONS);
    setQuestions(INITIAL_QUESTIONS);
    setUsers(INITIAL_USERS);
    setActiveApplicationId('APP-801');
    localStorage.setItem('ats_jobs', JSON.stringify(INITIAL_JOBS));
    localStorage.setItem('ats_applications', JSON.stringify(INITIAL_APPLICATIONS));
    localStorage.setItem('ats_questions', JSON.stringify(INITIAL_QUESTIONS));
    localStorage.setItem('ats_users', JSON.stringify(INITIAL_USERS));
    localStorage.setItem('ats_active_app_id', 'APP-801');
  };

  const resetAllData = () => {
    localStorage.removeItem('ats_jobs');
    localStorage.removeItem('ats_applications');
    localStorage.removeItem('ats_notifications');
    localStorage.removeItem('ats_active_app_id');
    localStorage.removeItem('ats_users');
    localStorage.removeItem('ats_current_user');
    localStorage.removeItem('ats_questions');

    setJobs([]);
    setApplications([]);
    setNotifications([]);
    setUsers([]);
    setCurrentUser(null);
    setActiveApplicationId(null);
    setQuestions([]);
  };

  return (
    <StateContext.Provider
      value={{
        jobs,
        applications,
        notifications,
        activeApplicationId,
        setActiveApplicationId,
        currentUser,
        users,
        signUp,
        signIn,
        signOut,
        addJob,
        updateJob,
        deleteJob,
        toggleJobStatus,
        applyToJob,
        updateApplicationStage,
        submitCoding,
        scheduleInterviewSlot,
        addFeedback,
        deleteApplication,
        addNotification,
        markNotificationAsRead,
        clearNotifications,
        restoreDemoData,
        resetAllData,
        questions,
        saveQuestion,
        deleteQuestion
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within a StateProvider');
  }
  return context;
};
