from datetime import datetime, timedelta, timezone
import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr

from app.core.database import get_db, settings
from app.models.models import User, UserRole
from app.core.security import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM)

# Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: UserRole = UserRole.applicant # Default to applicant

# 1. Register Endpoint (Applicants only)
@router.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(User).filter(User.email == user.email.strip().lower()).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password and save - Strictly enforce applicant role for public registration
    hashed_password = get_password_hash(user.password)
    new_user = User(
        email=user.email.strip().lower(),
        password_hash=hashed_password,
        role=UserRole.applicant
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully", "user_id": str(new_user.id)}

# 2. Login Endpoint (Strict Supabase Database Verification)
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    email_clean = form_data.username.strip().lower()
    user = db.query(User).filter(User.email == email_clean).first()
    
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create JWT Token with verified user details from the database
    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "email": user.email,
            "role": user.role.value
        }
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role.value,
        "email": user.email,
        "name": user.name or user.email
    }

# 3. Verify Admin Access (Strict Role Check)
@router.get("/verify-admin")
def verify_admin(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to authorized administrators only."
        )
    return {
        "authenticated": True,
        "email": current_user.email,
        "name": current_user.name,
        "role": current_user.role.value
    }