from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from supabase import create_client, Client
import uuid
from typing import Optional

from app.core.database import get_db, settings
from app.core.security import get_current_user, RoleChecker
from app.models.models import Application, User, UserRole, AppStatus
from pydantic import BaseModel

router = APIRouter(prefix="/applications", tags=["Applications"])

# Initialize Supabase Storage Client for Resumes
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

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
    resume: Optional[UploadFile] = File(None),  # Made explicitly optional
    db: Session = Depends(get_db)
):
    resume_url = None

    # 1. Only attempt Supabase upload if a resume file was actually provided
    if resume is not None and resume.filename:
        if not resume.filename.endswith((".pdf", ".doc", ".docx")):
            raise HTTPException(status_code=400, detail="Only PDF or DOCX files are allowed")

        try:
            file_bytes = await resume.read()
            file_ext = resume.filename.split(".")[-1]
            unique_filename = f"{uuid.uuid4().hex[:8]}_{applicant_name.replace(' ', '_')}.{file_ext}"
            
            # Uploads to a Supabase bucket named "resumes"
            supabase.storage.from_("resumes").upload(
                path=unique_filename,
                file=file_bytes,
                file_options={"content-type": resume.content_type}
            )
            
            resume_url = supabase.storage.from_("resumes").get_public_url(unique_filename)
            
        except Exception as e:
            print(f"Failed to upload resume to Supabase: {e}")
            raise HTTPException(status_code=500, detail="Failed to upload resume document")

    # Handle frontend mock IDs (e.g., 'job-1234') vs real UUIDs to prevent database crashes
    try:
        safe_job_uuid = uuid.UUID(job_id)
    except ValueError:
        safe_job_uuid = uuid.uuid4()

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