from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user, RoleChecker
from app.models.models import Application, User, UserRole, AppStatus
from pydantic import BaseModel
import uuid

router = APIRouter(prefix="/applications", tags=["Applications"])

# Pydantic schema for status updates
class StatusUpdateSchema(BaseModel):
    status: AppStatus

# 1. Applicants can view their application status
@router.get("/my-status/{application_id}")
def get_application_status(
    application_id: uuid.UUID, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Secure endpoint: Applicants can only see their own application; Admins can see any.
    if current_user.role != UserRole.admin and application.applicant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized access to this application")
    
    return {"application_id": application.id, "status": application.status}

# 2. Admins can change application status (UNDER_REVIEW, CODING_ROUND, etc.)
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