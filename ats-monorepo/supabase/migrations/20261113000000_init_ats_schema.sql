-- ==============================================================================
-- 12 LINKS RECRUITMENT & APPLICANT TRACKING SYSTEM (ATS)
-- Supabase PostgreSQL Schema & Initial Seed
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create Enums (Idempotent)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'userrole') THEN
        CREATE TYPE userrole AS ENUM ('admin', 'applicant');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appstatus') THEN
        CREATE TYPE appstatus AS ENUM ('pending', 'under_review', 'coding_round', 'interview', 'contract_pending', 'hired', 'rejected');
    END IF;
END $$;

-- 3. Users Table (Admin & Applicants)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(50),
    role userrole NOT NULL DEFAULT 'applicant',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 4. Job Postings Table
CREATE TABLE IF NOT EXISTS job_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100) DEFAULT 'Engineering',
    location VARCHAR(150) DEFAULT 'Pretoria, South Africa',
    type VARCHAR(50) DEFAULT 'Full-time',
    salary VARCHAR(100),
    experience VARCHAR(50) DEFAULT '3+ Years',
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    benefits TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES job_posts(id) ON DELETE CASCADE,
    applicant_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status appstatus NOT NULL DEFAULT 'pending',
    
    applicant_name VARCHAR(255),
    applicant_email VARCHAR(255),
    applicant_phone VARCHAR(50),
    portfolio_url TEXT,
    github_url TEXT,
    resume_url TEXT,
    cover_letter TEXT,
    experience_years VARCHAR(50),
    
    coding_score INT,
    coding_code TEXT,
    coding_feedback TEXT,
    interview_date VARCHAR(50),
    interview_time_slot VARCHAR(50),
    interview_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(applicant_email);

-- 6. Contracts Table
CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID UNIQUE NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    contract_url TEXT NOT NULL,
    is_signed BOOLEAN DEFAULT false,
    signed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Coding Challenges Table
CREATE TABLE IF NOT EXISTS coding_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'Easy',
    description TEXT NOT NULL,
    starter_templates JSONB,
    test_cases JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Supabase Storage Buckets Setup (Resumes & Contracts)
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('resumes', 'resumes', true),
    ('contracts', 'contracts', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: Allow uploads and reads
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Public Access to Resumes'
    ) THEN
        CREATE POLICY "Public Access to Resumes" ON storage.objects
        FOR ALL USING (bucket_id = 'resumes');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Public Access to Contracts'
    ) THEN
        CREATE POLICY "Public Access to Contracts" ON storage.objects
        FOR ALL USING (bucket_id = 'contracts');
    END IF;
END $$;

-- 9. Seed Initial Real Admin Account
INSERT INTO users (id, email, password_hash, name, role)
VALUES (
    gen_random_uuid(),
    'info@12links.co.za',
    crypt('Admin@12links', gen_salt('bf')),
    'Recruitment Administrator',
    'admin'
)
ON CONFLICT (email) DO UPDATE
SET password_hash = crypt('Admin@12links', gen_salt('bf')),
    role = 'admin';
