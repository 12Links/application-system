import sys
import os

# Ensure the app package and root directory are always on sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(BASE_DIR)
for p in [BASE_DIR, PARENT_DIR]:
    if p not in sys.path:
        sys.path.insert(0, p)

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session
import uuid

# Import the database engine and models to create the tables automatically
from app.core.database import engine, Base, SessionLocal, settings, get_db
from app.models import models

RAW_INIT_SQL = """
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'userrole') THEN
        CREATE TYPE userrole AS ENUM ('admin', 'applicant');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appstatus') THEN
        CREATE TYPE appstatus AS ENUM ('pending', 'under_review', 'coding_round', 'interview', 'contract_pending', 'hired', 'rejected');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(50),
    role userrole NOT NULL DEFAULT 'applicant',
    created_at TIMESTAMPTZ DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID UNIQUE NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    contract_url TEXT NOT NULL,
    is_signed BOOLEAN DEFAULT false,
    signed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'applicant',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS coding_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'Easy',
    description TEXT NOT NULL,
    starter_templates JSONB,
    test_cases JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);
"""

# Automatic database sync & initial admin account provisioning
def init_db():
    try:
        with engine.begin() as conn:
            conn.execute(text(RAW_INIT_SQL))
        print("Database schema successfully verified and initialized.")
    except Exception as ddl_err:
        print(f"Direct DDL notice: {ddl_err}")
        try:
            Base.metadata.create_all(bind=engine)
        except Exception as meta_err:
            print(f"Metadata create notice: {meta_err}")

    # Provision administrator account only if specified in environment variables
    try:
        db = SessionLocal()
        try:
            from app.routers.auth import get_password_hash
            
            if settings.ADMIN_EMAIL and settings.ADMIN_PASSWORD:
                admin_email_clean = settings.ADMIN_EMAIL.strip().lower()
                existing_admin = db.query(models.User).filter(models.User.email == admin_email_clean).first()
                if not existing_admin:
                    admin = models.User(
                        id=uuid.uuid4(),
                        email=admin_email_clean,
                        password_hash=get_password_hash(settings.ADMIN_PASSWORD),
                        name="Recruitment Administrator",
                        role=models.UserRole.admin
                    )
                    db.add(admin)
                    db.commit()
                    print(f"Provisioned admin account from env: {admin_email_clean}")
                else:
                    if existing_admin.role != models.UserRole.admin:
                        existing_admin.role = models.UserRole.admin
                        db.commit()
        finally:
            db.close()
    except Exception as e:
        print(f"Database sync notice: {e}")

init_db()

# Import routers
from app.routers import auth, applications, stages, jobs

app = FastAPI(
    title="ATS Backend API",
    description="Internal backend for the Applicant Tracking System",
    version="1.0.0"
)

# Set up CORS for Vercel multi-service routing, preview URLs, and localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect the routers
app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(applications.router)
app.include_router(stages.router)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "ATS API is running cleanly"}

@app.get("/db-status")
def db_status(db: Session = Depends(get_db)):
    try:
        user_count = db.query(models.User).count()
        job_count = db.query(models.JobPost).count()
        admin_emails = [u.email for u in db.query(models.User).filter(models.User.role == models.UserRole.admin).all()]
        return {
            "status": "connected",
            "users_count": user_count,
            "jobs_count": job_count,
            "admins_registered": admin_emails
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }
