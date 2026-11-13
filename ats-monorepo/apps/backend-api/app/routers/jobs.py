from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid
from typing import List, Optional
from pydantic import BaseModel

from app.core.database import get_db
from app.models.models import JobPost, User, UserRole
from app.core.security import get_current_user

router = APIRouter(prefix="/jobs", tags=["Job Openings"])

class JobCreate(BaseModel):
    title: str
    department: str = "Engineering"
    location: str = "Pretoria, South Africa (Hybrid)"
    type: str = "Full-time"
    salary: Optional[str] = None
    experience: str = "1-3 Years"
    description: str
    requirements: List[str]
    responsibilities: Optional[List[str]] = None
    benefits: Optional[List[str]] = None

@router.get("")
def list_jobs(db: Session = Depends(get_db)):
    """Fetch all active job postings created in the system."""
    jobs = db.query(JobPost).filter(JobPost.is_active == True).order_by(JobPost.created_at.desc()).all()
    results = []
    for j in jobs:
        results.append({
            "id": str(j.id),
            "title": j.title,
            "department": j.department,
            "location": j.location,
            "type": j.type,
            "salary": j.salary,
            "experience": j.experience,
            "description": j.description,
            "requirements": j.requirements.split("\n") if j.requirements else [],
            "responsibilities": j.responsibilities.split("\n") if hasattr(j, 'responsibilities') and j.responsibilities else [],
            "benefits": j.benefits.split("\n") if j.benefits else [],
            "status": "Active" if j.is_active else "Closed",
            "createdAt": str(j.created_at).split(" ")[0] if j.created_at else ""
        })
    return results

@router.post("")
def create_job(job_data: JobCreate, db: Session = Depends(get_db)):
    """Admin endpoint to create a new job opening."""
    new_job = JobPost(
        id=uuid.uuid4(),
        title=job_data.title,
        department=job_data.department,
        location=job_data.location,
        type=job_data.type,
        salary=job_data.salary,
        experience=job_data.experience,
        description=job_data.description,
        requirements="\n".join(job_data.requirements),
        benefits="\n".join(job_data.benefits) if job_data.benefits else None,
        is_active=True
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return {
        "id": str(new_job.id),
        "title": new_job.title,
        "message": "Job successfully published"
    }
