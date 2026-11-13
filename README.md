# 12 Links - Recruitment & Applicant Tracking System (ATS)

An enterprise-grade, end-to-end Applicant Tracking and Recruitment System featuring both a public **Applicant Portal (Careers Site)** and an internal **Admin Portal (Hiring Team Console)**.

---

## 🌟 Key Features

### 1. 👔 Applicant Portal (Careers & "Join Our Team")
- **Public Careers Page**: Visitors can browse open opportunities, search by keywords/tech stack, and filter by department or work mode (Remote / Hybrid / Full-time).
- **Rich Job Details**: Comprehensive job overviews with key responsibilities, requirements, benefits & perks, and salary ranges.
- **Streamlined Application Form**:
  - Full candidate contact information and experience level.
  - Links for Portfolio, GitHub, and LinkedIn profiles.
  - Cover statement: "Why do you want to join our team?".
  - Resume / CV upload simulator (.pdf / .docx validation).
  - Generates a unique **Application Tracking ID** (e.g. `APP-801`).
- **Progress Tracker & Candidate Hub**:
  - Track live application status by Application ID or Email.
  - Interactive multi-stage pipeline stepper:
    1. *Applied* (Application received & logged)
    2. *Technical Screening* (Resume & portfolio review)
    3. *Coding Assessment* (Technical developer challenge)
    4. *Technical Interview* (1-on-1 architecture discussion)
    5. *Offer & Decision* (Official job offer)
  - Full audit trail of stage updates and recruiter notes.
- **Interactive Coding Assessment**:
  - Multi-language code editor (TypeScript, JavaScript, Python).
  - In-browser code runner executing against unit test cases.
  - Automated scoring and instant feedback with auto-advancement upon passing (≥ 70%).
- **Interview Scheduler**:
  - Interactive calendar date and time slot selector (SAST timezone).
  - Video conference meeting link generation (Google Meet / Teams).
  - Direct calendar invitation and preparation guidance.
- **In-App Notifications**: Real-time notification drawer keeping candidates updated on every status change.

---

### 2. 🛡️ Admin Portal (Hiring Team & Recruiter Console)
- **Recruiter Authentication**:
  - Staff login with 1-click Demo Staff Access for rapid testing.
  - Credentials: `info@12links.co.za` / `Admin@12links`
- **Recruitment KPIs Dashboard**:
  - Active Openings counter
  - Total Candidates in Pipeline
  - Candidates Awaiting Coding Tests
  - Interviews Booked
  - Official Offers Extended
- **Candidate Pipeline (Kanban & Dossier Views)**:
  - **Kanban Board**: Drag/click stages (*Applied*, *Screening*, *Coding*, *Interview*, *Offered*, *Rejected*).
  - **Candidate Dossier**:
    - Complete applicant profile, resume file, contact information, and portfolio links.
    - Quick Stage Advancement with custom audit notes.
    - Coding Challenge Review: Inspect submitted candidate code, view score breakdown, and adjust grades or leave feedback.
    - Scheduled Interview tracker with meeting notes.
- **Job Postings Manager (Advertise Openings)**:
  - Create new vacancies with department, work mode, salary, experience, description, bulleted responsibilities, requirements, and perks.
  - Edit existing job openings.
  - Pause or reactivate listings with 1 click.
  - Delete vacancies.
  - Real-time applicant count per vacancy.
- **Coding Assessment Manager**:
  - Manage technical screening questions and difficulty ratings (Easy, Medium, Hard).
  - Customize code starter templates and unit test assertions.
- **Demo Data Restoration**:
  - 1-click "Restore Demo Data" to instantly populate rich sample jobs, candidates across all stages, and coding tasks.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+ - optional, for backend API)

### 1. Running the Frontend (Vite + React)
\`\`\`bash
cd ats-monorepo
npm install
npm run dev
\`\`\`
The application will start at `http://localhost:5173`.

### 2. Running the Backend API (FastAPI - Optional)
\`\`\`bash
cd ats-monorepo/apps/backend-api
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
\`\`\`
The API docs will be available at `http://localhost:8000/docs`.

> **Note**: The frontend features built-in client-side persistence and simulation fallbacks, meaning the entire system can be run and tested even without the backend running.

---

## 👥 Demo Credentials & Test Profiles

| Role | Email | Password |
|---|---|---|
| **Recruitment Admin** | `info@12links.co.za` | `Admin@12links` (or click 1-Click Demo) |
| **Candidate 1 (Interview Stage)** | `thabo.mokoena@example.com` | `password` (Tracking ID: `APP-801`) |
| **Candidate 2 (Coding Challenge)** | `jessica.v@example.com` | `password` (Tracking ID: `APP-802`) |
| **Candidate 3 (Screening Stage)** | `sipho.n@example.com` | (Tracking ID: `APP-803`) |
| **Candidate 4 (Offer Stage)** | `lerato.k@example.com` | (Tracking ID: `APP-805`) |

---

## 📁 Project Structure

\`\`\`
application-system/
├── ats-monorepo/
│   ├── src/
│   │   ├── admin-portal/              # Recruiter & Admin Site
│   │   │   ├── components/
│   │   │   │   ├── AdminLogin.tsx            # Staff authentication
│   │   │   │   ├── CandidatePipeline.tsx     # Kanban & Dossier views
│   │   │   │   ├── JobPostingsManager.tsx    # Vacancy creation & editing
│   │   │   │   └── CodingQuestionsManager.tsx # Question bank
│   │   │   └── AdminPortal.tsx
│   │   ├── applicant-portal/          # Careers & Applicant Site
│   │   │   ├── components/
│   │   │   │   ├── JobBoard.tsx              # Open positions & apply modal
│   │   │   │   ├── ProgressTracker.tsx       # Stage stepper & tracking
│   │   │   │   ├── CodingAssessment.tsx      # In-browser code runner
│   │   │   │   └── InterviewScheduler.tsx    # Slot picker & confirmation
│   │   │   └── ApplicantPortal.tsx
│   │   ├── shared/                    # Shared state, types, mock data & logo
│   │   │   ├── types.ts                      # Core ATS data models
│   │   │   ├── mockData.ts                   # Realistic seed data
│   │   │   ├── StateContext.tsx              # Reactive state store
│   │   │   ├── CompanyLogo.tsx               # 12 Links visual identity
│   │   │   └── AuthPage.tsx                  # Applicant login/signup
│   │   ├── App.tsx                    # Dual-portal router & switcher
│   │   └── main.tsx
│   └── apps/
│       └── backend-api/               # FastAPI backend with Supabase & Gemini
└── README.md
\`\`\`
