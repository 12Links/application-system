import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job, Application, ApplicationStage, Notification, CodingSubmission, User, CodingQuestion } from './types';

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
  deleteJob: (id: string) => void;
  applyToJob: (appData: {
    jobId: string;
    jobTitle: string;
    applicantName: string;
    applicantEmail: string;
    applicantPhone: string;
    portfolioUrl?: string;
    githubUrl?: string;
  }) => string; 
  updateApplicationStage: (appId: string, stage: ApplicationStage, notes?: string) => void;
  submitCoding: (appId: string, submission: CodingSubmission) => void;
  scheduleInterviewSlot: (appId: string, date: string, timeSlot: string) => void;
  addFeedback: (appId: string, score: number, feedback: string) => void;
  addNotification: (applicationId: string, title: string, message: string, type: Notification['type']) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  resetAllData: () => void;
  questions: CodingQuestion[];
  saveQuestion: (question: Omit<CodingQuestion, 'id'> & { id?: string }) => void;
  deleteQuestion: (id: string) => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('ats_jobs');
    return saved ? JSON.parse(saved) : [];
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('ats_applications');
    return saved ? JSON.parse(saved) : [];
  });

  const [questions, setQuestions] = useState<CodingQuestion[]>(() => {
    const saved = localStorage.getItem('ats_questions');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('ats_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeApplicationId, setActiveApplicationIdState] = useState<string | null>(() => {
    return localStorage.getItem('ats_active_app_id');
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('ats_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUserState] = useState<User | null>(() => {
    const saved = localStorage.getItem('ats_current_user');
    return saved ? JSON.parse(saved) : null;
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
    } else {
      setActiveApplicationId(null);
    }

    return { success: true, message: 'Sign up successful!' };
  };

  const signIn = (email: string, password?: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, message: 'No account found with this email!' };
    }

    if (password && user.password && user.password !== password) {
      return { success: false, message: 'Incorrect password!' };
    }

    setCurrentUser(user);

    const existingApp = applications.find(app => app.applicantEmail.toLowerCase() === email.toLowerCase());
    if (existingApp) {
      setActiveApplicationId(existingApp.id);
    } else {
      setActiveApplicationId(null);
    }

    return { success: true, message: 'Sign in successful!' };
  };

  const signOut = () => {
    setCurrentUser(null);
    setActiveApplicationId(null);
  };

  const addJob = (jobData: Omit<Job, 'id' | 'createdAt'>) => {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setJobs(prev => [newJob, ...prev]);
  };

  const deleteJob = (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const saveQuestion = (qData: Omit<CodingQuestion, 'id'> & { id?: string }) => {
    if (qData.id) {
      setQuestions(prev => prev.map(q => q.id === qData.id ? { ...q, ...qData } as CodingQuestion : q));
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

  const applyToJob = (appData: {
    jobId: string;
    jobTitle: string;
    applicantName: string;
    applicantEmail: string;
    applicantPhone: string;
    portfolioUrl?: string;
    githubUrl?: string;
    resumeUrl?: string;
  }) => {
    const newId = `app-${Date.now()}`;
    const newApp: Application = {
      id: newId,
      ...appData,
      appliedAt: new Date().toISOString(),
      currentStage: ApplicationStage.Applied,
      stageHistory: [
        {
          stage: ApplicationStage.Applied,
          updatedAt: new Date().toISOString(),
          notes: 'Application submitted through the portal.'
        }
      ]
    };

    setApplications(prev => [newApp, ...prev]);
    setActiveApplicationId(newId);

    addNotification(
      newId,
      'Application Submitted!',
      `Thank you for applying to the ${appData.jobTitle} position. We have received your application.`,
      'success'
    );

    return newId;
  };

  const updateApplicationStage = (appId: string, stage: ApplicationStage, notes?: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;

      const stageChanged = app.currentStage !== stage;
      const updatedHistory = [...app.stageHistory];
      
      if (stageChanged || notes) {
        updatedHistory.push({
          stage,
          updatedAt: new Date().toISOString(),
          notes: notes || `Moved to ${stage} stage.`
        });
      }

      return {
        ...app,
        currentStage: stage,
        stageHistory: updatedHistory
      };
    }));

    const app = applications.find(a => a.id === appId);
    if (app) {
      let notifTitle = '';
      let notifMsg = '';
      let type: Notification['type'] = 'info';

      switch (stage) {
        case ApplicationStage.TechnicalScreening:
          notifTitle = 'Application Under Review';
          notifMsg = `Your application for ${app.jobTitle} is now being actively reviewed by our engineering recruitment team.`;
          break;
        case ApplicationStage.CodingAssessment:
          notifTitle = 'Coding Challenge Unlocked!';
          notifMsg = `Great news! You have been advanced to the Live Coding Assessment round for ${app.jobTitle}. Click on the "Coding Assessment" tab to start your challenge.`;
          type = 'success';
          break;
        case ApplicationStage.Interview:
          notifTitle = 'Interview Round Unlocked!';
          notifMsg = `Excellent! Your coding assessment has been approved. You are advanced to the Live Technical Interview. Please choose your preferred date and time.`;
          type = 'success';
          break;
        case ApplicationStage.Offered:
          notifTitle = 'Congratulations! Job Offer Extended';
          notifMsg = `We are absolutely thrilled to extend an official job offer for the ${app.jobTitle} position! Check your inbox for details.`;
          type = 'success';
          break;
        case ApplicationStage.Rejected:
          notifTitle = 'Application Status Update';
          notifMsg = `Thank you for taking the time to interview with us for ${app.jobTitle}. Unfortunately, we have decided to move forward with other candidates at this time.`;
          type = 'warning';
          break;
        default:
          notifTitle = 'Status Updated';
          notifMsg = `Your application for ${app.jobTitle} was updated to: ${stage}.`;
      }

      addNotification(appId, notifTitle, notifMsg, type);
    }
  };

  const submitCoding = (appId: string, submission: CodingSubmission) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      
      const score = submission.score ?? 0;
      const passed = score >= 70;
      
      const newHistory = [...app.stageHistory];
      let nextStage = app.currentStage;
      let notes = `Submitted coding assessment in ${submission.language}. Score: ${score}% (${submission.testCasesPassed}/${submission.testCasesTotal} test cases passed).`;
      
      if (passed) {
        nextStage = ApplicationStage.Interview;
        newHistory.push({
          stage: ApplicationStage.Interview,
          updatedAt: new Date().toISOString(),
          notes: `${notes} Auto-advanced to Technical Interview due to passing score.`
        });
      } else {
        newHistory.push({
          stage: ApplicationStage.CodingAssessment,
          updatedAt: new Date().toISOString(),
          notes: `${notes} Coding score did not meet 70% auto-advance criteria. Pending review.`
        });
      }

      return {
        ...app,
        currentStage: nextStage,
        stageHistory: newHistory,
        codingSubmission: submission
      };
    }));

    const app = applications.find(a => a.id === appId);
    if (app) {
      const score = submission.score ?? 0;
      const passed = score >= 70;
      addNotification(
        appId,
        'Coding Challenge Completed',
        passed 
          ? `You passed the Coding Assessment with a score of ${score}%! You are advanced to the Live Technical Interview. Please pick a slot.` 
          : `You submitted your Coding Assessment. Score: ${score}%. The recruitment team will review your submission shortly.`,
        passed ? 'success' : 'info'
      );
    }
  };

  const scheduleInterviewSlot = (appId: string, date: string, timeSlot: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      
      const newHistory = [...app.stageHistory];
      newHistory.push({
        stage: app.currentStage,
        updatedAt: new Date().toISOString(),
        notes: `Scheduled Live Technical Interview for ${date} at ${timeSlot}.`
      });

      return {
        ...app,
        interviewDate: date,
        interviewTimeSlot: timeSlot,
        stageHistory: newHistory
      };
    }));

    const app = applications.find(a => a.id === appId);
    if (app) {
      addNotification(
        appId,
        'Interview Scheduled Successfully!',
        `Your developer live technical interview for ${app.jobTitle} is confirmed for ${date} at ${timeSlot}. A calendar invite has been sent.`,
        'success'
      );
    }
  };

  const addFeedback = (appId: string, score: number, feedback: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      
      const updatedSubmission = app.codingSubmission ? {
        ...app.codingSubmission,
        score,
        feedback
      } : {
        code: '// No code submitted',
        language: 'typescript',
        submittedAt: new Date().toISOString(),
        score,
        feedback,
        testCasesPassed: Math.round(score / 33),
        testCasesTotal: 3
      };

      return {
        ...app,
        codingSubmission: updatedSubmission
      };
    }));

    const app = applications.find(a => a.id === appId);
    if (app) {
      addNotification(
        appId,
        'Coding Assessment Evaluated',
        `An interviewer left feedback on your coding assessment. Score: ${score}%. Feedback: "${feedback.slice(0, 50)}..."`,
        'info'
      );
    }
  };

  const addNotification = (applicationId: string, title: string, message: string, type: Notification['type']) => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
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
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
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
    <StateContext.Provider value={{
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
      deleteJob,
      applyToJob,
      updateApplicationStage,
      submitCoding,
      scheduleInterviewSlot,
      addFeedback,
      addNotification,
      markNotificationAsRead,
      clearNotifications,
      resetAllData,
      questions,
      saveQuestion,
      deleteQuestion
    }}>
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