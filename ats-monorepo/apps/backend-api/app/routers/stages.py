import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from supabase import create_client, Client

from app.core.database import get_db, settings
from app.core.security import get_current_user, RoleChecker
from app.models.models import Application, UserRole, AppStatus, Contract

router = APIRouter(prefix="/workflow", tags=["Applicant Workflow"])

# Initialize Supabase Storage Client
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

# 1. Trigger Coding Round
@router.post("/{application_id}/start-coding-round", dependencies=[Depends(RoleChecker([UserRole.admin]))])
def start_coding_round(application_id: uuid.UUID, db: Session = Depends(get_db)):
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Update status
    application.status = AppStatus.coding_round
    db.commit()
    
    # In the future, you could trigger an email to the candidate here with coding instructions.
    return {"message": "Candidate moved to coding round", "status": application.status}

# 2. Upload Contract (Admin only)
@router.post("/{application_id}/upload-contract", dependencies=[Depends(RoleChecker([UserRole.admin]))])
async def upload_contract(
    application_id: uuid.UUID, 
    file: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    try:
        # Read file bytes
        file_bytes = await file.read()
        
        # Create a unique filename to prevent overwriting
        file_ext = file.filename.split(".")[-1]
        unique_filename = f"{application_id}_contract_{uuid.uuid4().hex[:8]}.{file_ext}"
        
        # Upload to Supabase Storage (bucket name: 'contracts')
        supabase.storage.from_("contracts").upload(
            path=unique_filename,
            file=file_bytes,
            file_options={"content-type": file.content_type}
        )
        
        # Get the public URL of the uploaded PDF
        file_url = supabase.storage.from_("contracts").get_public_url(unique_filename)
        
        # Save to Database
        new_contract = Contract(application_id=application_id, contract_url=file_url)
        db.add(new_contract)
        
        # Update application status
        application.status = AppStatus.contract_pending
        db.commit()
        
        return {"message": "Contract uploaded successfully", "contract_url": file_url}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")