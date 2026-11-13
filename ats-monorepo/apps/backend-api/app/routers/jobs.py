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
    auto_mark_cv: Optional[bool] = True
    auto_grade_code: Optional[bool] = True
    pass_threshold: Optional[int] = 70
    grading_rubric: Optional[str] = None
    coding_prompt: Optional[str] = None
    reference_solution: Optional[str] = None

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
            "auto_mark_cv": j.auto_mark_cv if hasattr(j, 'auto_mark_cv') else True,
            "auto_grade_code": j.auto_grade_code if hasattr(j, 'auto_grade_code') else True,
            "pass_threshold": j.pass_threshold if hasattr(j, 'pass_threshold') else 70,
            "grading_rubric": j.grading_rubric if hasattr(j, 'grading_rubric') else None,
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
        auto_mark_cv=job_data.auto_mark_cv if job_data.auto_mark_cv is not None else True,
        auto_grade_code=job_data.auto_grade_code if job_data.auto_grade_code is not None else True,
        pass_threshold=job_data.pass_threshold if job_data.pass_threshold is not None else 70,
        grading_rubric=job_data.grading_rubric,
        coding_prompt=job_data.coding_prompt,
        reference_solution=job_data.reference_solution,
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
