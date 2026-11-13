# 12 Links - Recruitment & Applicant Tracking System (ATS)

An enterprise-grade, end-to-end Applicant Tracking and Recruitment System designed for **12 Links Future Technologies (Pty) Ltd**. The system features both a public **Applicant Portal (Careers & Application Hub)** and an internal **Admin Portal (Hiring Team Console)**.

---

## 🌟 Architecture & Features

### 1. 👔 Applicant Portal (Careers & "Join Our Team")
- **Public Careers Page**: Browse open vacancies, filter by department, work mode (Remote / Hybrid / Full-time), or location (Pretoria, South Africa).
- **Comprehensive Vacancy Overviews**: Detailed descriptions, key responsibilities, requirements, benefits, and compensation bands.
- **Application Submission**:
  - Full candidate contact details and experience levels.
  - Integration for Portfolio, GitHub, and LinkedIn links.
  - Resume document upload (.pdf, .docx) stored securely in Supabase Storage.
  - Automatic generation of a unique **Application Tracking ID**.
- **Application Progress Tracker**:
  - Secure real-time lookup by Application ID or candidate email.
  - Multi-stage pipeline stepper:
    1. *Applied* (Application received & logged)
    2. *Technical Screening* (Resume & profile evaluation)
    3. *Coding Assessment* (Interactive coding challenge)
    4. *Technical Interview* (1-on-1 architecture discussion)
    5. *Offer & Decision* (Official offer)
- **Interactive Coding Assessment**:
  - In-browser code editor with multi-language support (TypeScript, JavaScript, Python).
  - Automated scoring against real-time unit test cases.
- **Interview Scheduling**:
  - Direct selection of interview date and time slot.
  - Video conference meeting preparation and confirmation.

---

### 2. 🛡️ Admin Portal (Hiring Team Console)
- **Secure Administrator Authentication**:
  - Database-verified sign-in powered by FastAPI JWT tokens.
  - Access strictly enforced: Only accounts with `role = 'admin'` in PostgreSQL have access.
  - Zero hardcoded passwords or front-end bypasses.
- **Recruitment KPIs Dashboard**:
  - Real-time statistics: Active Postings, Total Pipeline, Candidates in Technical Review, Scheduled Interviews, and Offers Extended.
- **Candidate Pipeline (Kanban & Dossier Views)**:
  - **Kanban Board**: Drag/advance applicants across all recruitment stages.
  - **Candidate Dossier**: Complete applicant history, resume link, contact details, coding assessment score audit, and interview logs.
- **Job Postings Manager**:
  - Advertise new job openings.
  - Update, pause, reactivate, or delete vacancies with real-time applicant tracking.
- **Coding Task Bank**:
  - Manage technical questions, test cases, and difficulty levels.

---

## 🔒 Security & Environment Variables

All database connections, authentication secrets, and storage keys are managed through environment variables. **No credentials or API keys are stored in the repository.**

### Backend Environment Variables (`backend-api`)
| Variable | Description |
|---|---|
| `DATABASE_URL` / `POSTGRES_URL` | Supabase PostgreSQL connection string (auto-injected via Vercel integration) |
| `SUPABASE_URL` | Supabase project URL for Storage buckets (`resumes`, `contracts`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service key for authenticated server-side storage access |
| `JWT_SECRET` | Secret key used for signing administrative JWT access tokens |
| `GEMINI_API_KEY` | (Optional) Google Gemini API key for automated AI code evaluation |
| `ADMIN_EMAIL` | Default administrator email address |
| `ADMIN_PASSWORD` | Administrator initialization password (hashed via bcrypt upon creation) |

---

## 🚀 Running Locally

### 1. Frontend (React 19 + Vite)
```bash
cd ats-monorepo
npm install
npm run dev
```
The application will launch on `http://localhost:5173`.

### 2. Backend (FastAPI + SQLAlchemy)
```bash
cd ats-monorepo/apps/backend-api
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API documentation will be accessible at `http://localhost:8000/docs`.

---

## 📦 Supabase Database Initialization

To set up the database tables, enums, storage buckets, and administrator account in your Supabase project:
1. Open your **Supabase Dashboard → SQL Editor**.
2. Run the SQL schema script provided in `supabase_schema.sql`.
3. To provision your administrator user securely, run:
```sql
INSERT INTO users (id, email, password_hash, name, role)
VALUES (
    gen_random_uuid(),
    'your-admin-email@domain.com',
    crypt('YOUR_SECURE_PASSWORD', gen_salt('bf')),
    'Recruitment Administrator',
    'admin'
)
ON CONFLICT (email) DO UPDATE
SET password_hash = crypt('YOUR_SECURE_PASSWORD', gen_salt('bf')),
    role = 'admin';
```
