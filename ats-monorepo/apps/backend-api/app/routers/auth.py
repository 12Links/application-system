from datetime import datetime, timedelta, timezone
import uuid
import jwt
import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import text
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.database import get_db, settings
from app.models.models import User, UserRole
from app.core.security import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if not plain_password or not hashed_password:
        return False
    if plain_password == hashed_password:
        return True
    try:
        pwd_bytes = plain_password.encode('utf-8')[:72]
        hash_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(pwd_bytes, hash_bytes)
    except Exception:
        return False

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM)

# Schemas
class UserCreate(BaseModel):
    email: str
    password: str
    role: UserRole = UserRole.applicant # Default to applicant

# 1. Register Endpoint (Applicants only)
@router.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    email_clean = user.email.strip().lower()
    try:
        existing_user = db.query(User).filter(User.email == email_clean).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        hashed_password = get_password_hash(user.password)
        new_user = User(
            id=uuid.uuid4(),
            email=email_clean,
            password_hash=hashed_password,
            role=UserRole.applicant
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"message": "User created successfully", "user_id": str(new_user.id)}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

# 2. Login Endpoint (Strict Supabase Database Verification)
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    email_clean = form_data.username.strip().lower()
    
    # 1. Check public.users in Supabase database
    user = None
    try:
        user = db.query(User).filter(User.email == email_clean).first()
    except Exception as db_err:
        print(f"Notice: Database query during login for {email_clean}: {db_err}")

    if user:
        if verify_password(form_data.password, user.password_hash):
            role_val = user.role.value if hasattr(user.role, 'value') else str(user.role)
            access_token = create_access_token(
                data={
                    "sub": str(user.id),
                    "email": user.email,
                    "role": role_val
                }
            )
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "role": role_val,
                "email": user.email,
                "name": user.name or user.email
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

    # 2. Check auth.users table in Supabase PostgreSQL schema
    try:
        auth_row = db.execute(
            text("SELECT id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data FROM auth.users WHERE LOWER(email) = :email"),
            {"email": email_clean}
        ).first()

        if auth_row and auth_row.encrypted_password:
            if verify_password(form_data.password, auth_row.encrypted_password):
                app_meta = auth_row.raw_app_meta_data or {}
                user_meta = auth_row.raw_user_meta_data or {}
                is_admin = (
                    app_meta.get("role") == "admin" or
                    app_meta.get("is_admin") is True or
                    user_meta.get("role") == "admin" or
                    user_meta.get("is_admin") is True
                )
                role_val = "admin" if is_admin else "applicant"
                name_val = user_meta.get("full_name") or user_meta.get("name") or "Administrator"

                # Synchronize into public.users table
                try:
                    sync_user = User(
                        id=auth_row.id if isinstance(auth_row.id, uuid.UUID) else uuid.UUID(str(auth_row.id)),
                        email=email_clean,
                        password_hash=auth_row.encrypted_password,
                        name=name_val,
                        role=UserRole.admin if is_admin else UserRole.applicant
                    )
                    db.add(sync_user)
                    db.commit()
                except Exception:
                    db.rollback()

                access_token = create_access_token(
                    data={
                        "sub": str(auth_row.id),
                        "email": email_clean,
                        "role": role_val
                    }
                )
                return {
                    "access_token": access_token,
                    "token_type": "bearer",
                    "role": role_val,
                    "email": email_clean,
                    "name": name_val
                }
    except Exception as auth_query_err:
        print(f"Notice: auth.users verification check: {auth_query_err}")

    # 3. Environment Variable Admin Override (Configured via Vercel env, never in repo)
    if settings.ADMIN_EMAIL and email_clean == settings.ADMIN_EMAIL.strip().lower():
        if settings.ADMIN_PASSWORD and form_data.password == settings.ADMIN_PASSWORD:
            access_token = create_access_token(
                data={
                    "sub": "admin-env",
                    "email": email_clean,
                    "role": "admin"
                }
            )
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "role": "admin",
                "email": email_clean,
                "name": "System Administrator"
            }

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect email or password",
        headers={"WWW-Authenticate": "Bearer"},
    )

# 3. Verify Admin Access (Strict Role Check)
@router.get("/verify-admin")
def verify_admin(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    role_val = current_user.role.value if hasattr(current_user.role, 'value') else str(current_user.role)
    if role_val != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to authorized administrators only."
        )
    return {
        "authenticated": True,
        "email": current_user.email,
        "name": current_user.name,
        "role": role_val
    }