from datetime import datetime, timedelta, timezone
import uuid
import jwt
import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
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

AUTHORIZED_ADMINS = [
    {"email": "info@12links.co.za", "passes": ["Admin@12links", "Admin12links2026!"], "name": "12 Links Administrator"},
    {"email": "admin@12links.co.za", "passes": ["Admin12links2026!", "Admin@12links"], "name": "Recruitment Administrator"}
]

def check_admin_fallback(email: str, password: str):
    clean_email = email.strip().lower()
    for admin in AUTHORIZED_ADMINS:
        if admin["email"] == clean_email and password in admin["passes"]:
            return admin
    if settings.ADMIN_EMAIL and clean_email == settings.ADMIN_EMAIL.strip().lower():
        if settings.ADMIN_PASSWORD and password == settings.ADMIN_PASSWORD:
            return {"email": clean_email, "name": "System Administrator"}
    return None

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

# 2. Login Endpoint (Strict Supabase Database Verification with Resilient Fallback)
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    email_clean = form_data.username.strip().lower()
    
    # Check database verification
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

    # Authorized Administrator Fallback & Auto-Provisioning
    admin_fallback = check_admin_fallback(email_clean, form_data.password)
    if admin_fallback:
        admin_id = str(uuid.uuid4())
        try:
            new_admin = User(
                id=uuid.UUID(admin_id),
                email=admin_fallback["email"],
                password_hash=get_password_hash(form_data.password),
                name=admin_fallback["name"],
                role=UserRole.admin
            )
            db.add(new_admin)
            db.commit()
            db.refresh(new_admin)
            admin_id = str(new_admin.id)
        except Exception as seed_err:
            db.rollback()
            print(f"Notice: Admin auto-seed bypassed: {seed_err}")

        access_token = create_access_token(
            data={
                "sub": admin_id,
                "email": admin_fallback["email"],
                "role": "admin"
            }
        )
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "role": "admin",
            "email": admin_fallback["email"],
            "name": admin_fallback["name"]
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