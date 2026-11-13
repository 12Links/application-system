export enum ApplicationStage {
  Applied = 'Applied',
  TechnicalScreening = 'Technical Screening',
  CodingAssessment = 'Coding Assessment',
  Interview = 'Interview',
  Offered = 'Offered',
  Rejected = 'Rejected'
}

export type JobStatus = 'Active' | 'Paused' | 'Closed';

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string; // 'Full-time' | 'Contract' | 'Remote' | 'Hybrid'
  salary: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits?: string[];
  responsibilities?: string[];
  status?: JobStatus;
  featured?: boolean;
  createdAt: string;
}

export interface CodingSubmission {
  code: string;
  language: string;
  submittedAt: string;
  score?: number; // percentage
  feedback?: string;
  testCasesPassed?: number;
  testCasesTotal?: number;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  resumeUrl?: string;
  resumeFileName?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  experienceYears?: string;
  coverLetter?: string;
  appliedAt: string;
  currentStage: ApplicationStage;
  stageHistory: { stage: ApplicationStage; updatedAt: string; notes?: string }[];
  interviewDate?: string;
  interviewTimeSlot?: string;
  interviewNotes?: string;
  codingSubmission?: CodingSubmission;
  adminFeedback?: string;
}

export interface Notification {
  id: string;
  applicationId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  read: boolean;
}

export interface CodingQuestion {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  starterTemplates: Record<string, string>;
  testCases: { input: string; expected: string; description: string }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  resumeFileName?: string;
  resumeUrl?: string;
  password?: string;
}
