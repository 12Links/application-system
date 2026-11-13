from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from supabase import create_client, Client
import uuid
import json
from typing import Optional

from app.core.database import get_db, settings
from app.core.security import get_current_user, RoleChecker
from app.models.models import Application, User, UserRole, AppStatus, JobPost
from pydantic import BaseModel

router = APIRouter(prefix="/applications", tags=["Applications"])

def map_app_status_to_stage(status_val: str) -> str:
    status_str = str(status_val).lower()
    if "pending" in status_str:
        return "Applied"
    elif "under_review" in status_str:
        return "Technical Screening"
    elif "coding" in status_str:
        return "Coding Assessment"
    elif "interview" in status_str:
        return "Interview"
    elif "hired" in status_str or "contract" in status_str:
        return "Offered"
    elif "rejected" in status_str:
        return "Rejected"
    return "Applied"

@router.get("")
@router.get("/")
def list_applications(db: Session = Depends(get_db)):
    apps = db.query(Application).order_by(Application.created_at.desc()).all()
    results = []
    for app in apps:
        job = db.query(JobPost).filter(JobPost.id == app.job_id).first()
        summary = None
        if app.evaluation_summary:
            try:
                summary = json.loads(app.evaluation_summary) if isinstance(app.evaluation_summary, str) else app.evaluation_summary
            except Exception:
                summary = None

        stage = map_app_status_to_stage(app.status.value if hasattr(app.status, 'value') else str(app.status))

        results.append({
            "id": str(app.id),
            "jobId": str(app.job_id),
            "jobTitle": job.title if job else "Engineering Opening",
            "applicantName": app.applicant_name or "Applicant",
            "applicantEmail": app.applicant_email or "",
            "applicantPhone": app.applicant_phone or "",
            "portfolioUrl": app.portfolio_url,
            "githubUrl": app.github_url,
            "resumeUrl": app.resume_url,
            "resumeFileName": "Resume_Document.pdf",
            "experienceYears": app.experience_years or "1-3 Years",
            "coverLetter": app.cover_letter,
            "appliedAt": app.created_at.isoformat() if app.created_at else None,
            "currentStage": stage,
            "stageHistory": [
                {
                    "stage": stage,
                    "updatedAt": app.created_at.isoformat() if app.created_at else "",
                    "notes": "Application registered in recruitment database."
                }
            ],
            "cv_score": app.cv_score,
            "coding_score": app.coding_score,
            "total_score": app.total_score,
            "evaluation_summary": summary,
            "auto_graded_at": app.auto_graded_at.isoformat() if app.auto_graded_at else None,
            "interviewDate": app.interview_date,
            "interviewTimeSlot": app.interview_time_slot,
            "interviewNotes": app.interview_notes,
            "codingSubmission": {
                "code": app.coding_code or "",
                "language": "typescript",
                "submittedAt": app.auto_graded_at.isoformat() if app.auto_graded_at else "",
                "score": app.coding_score or 0,
                "feedback": app.coding_feedback or ""
            } if app.coding_code else None
        })
    return results

# Initialize Supabase Storage Client for Resumes
supabase: Optional[Client] = None
if settings.SUPABASE_URL and settings.SUPABASE_KEY:
    try:
        supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    except Exception as e:
        print(f"Supabase storage client init notice: {e}")

# Pydantic schema for status updates
class StatusUpdateSchema(BaseModel):
    status: AppStatus

# 1. NEW: Submit Application Endpoint
@router.post("/apply")
async def submit_application(
    job_id: str = Form(...),
    applicant_name: str = Form(...),
    applicant_email: str = Form(...),
    applicant_phone: str = Form(...),
    portfolio_url: Optional[str] = Form(None),
    github_url: Optional[str] = Form(None),
    resume: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    resume_url = None

    # 1. Only attempt Supabase upload if a resume file was actually provided
    if resume is not None and resume.filename:
        if not resume.filename.endswith((".pdf", ".doc", ".docx")):
            raise HTTPException(status_code=400, detail="Only PDF or DOCX files are allowed")

        try:
            if not supabase:
                raise ValueError("Supabase storage client is not configured in environment variables")
            file_bytes = await resume.read()
            file_ext = resume.filename.split(".")[-1]
            unique_filename = f"{uuid.uuid4().hex[:8]}_{applicant_name.replace(' ', '_')}.{file_ext}"
            
            supabase.storage.from_("resumes").upload(
                path=unique_filename,
                file=file_bytes,
                file_options={"content-type": resume.content_type}
            )
            
            resume_url = supabase.storage.from_("resumes").get_public_url(unique_filename)
            
        except Exception as e:
            print(f"Failed to upload resume to Supabase: {e}")
            raise HTTPException(status_code=500, detail="Failed to upload resume document")

    # Handle frontend mock IDs (e.g., 'job-1234') vs real UUIDs
    try:
        safe_job_uuid = uuid.UUID(job_id)
    except ValueError:
        safe_job_uuid = uuid.uuid4()

    # Verify that the job exists in the database
    existing_job = db.query(JobPost).filter(JobPost.id == safe_job_uuid).first()
    if not existing_job:
        raise HTTPException(
            status_code=400,
            detail="The specified job opening does not exist or is no longer accepting applications."
        )

    # 2. Save Application to the Database
    new_application = Application(
        job_id=safe_job_uuid,
        applicant_name=applicant_name,
        applicant_email=applicant_email,
        applicant_phone=applicant_phone,
        portfolio_url=portfolio_url,
        github_url=github_url,
        resume_url=resume_url
    )
    
    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    
    return {"message": "Application submitted successfully", "application_id": new_application.id}

# 2. Applicants can view their application status
@router.get("/my-status/{application_id}")
def get_application_status(
    application_id: uuid.UUID, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if current_user.role != UserRole.admin and application.applicant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized access to this application")
    
    return {"application_id": application.id, "status": application.status}

# 3. Admins can change application status
@router.patch("/{application_id}/status", dependencies=[Depends(RoleChecker([UserRole.admin]))])
def update_application_status(
    application_id: uuid.UUID, 
    payload: StatusUpdateSchema, 
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    application.status = payload.status
    db.commit()
    db.refresh(application)
    
    return {"message": "Status successfully updated", "new_status": application.status}