from datetime import datetime, timedelta, timezone
import uuid
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import settings, get_db
from app.models.models import User, UserRole

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def verify_access_token(token: str):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    payload = verify_access_token(token)
    user_identifier = payload.get("sub")
    role = payload.get("role")
    email = payload.get("email")
    if not user_identifier and not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    
    user = None
    # Lookup by UUID first, fallback to lookup by email
    try:
        if user_identifier:
            user_uuid = uuid.UUID(user_identifier)
            user = db.query(User).filter(User.id == user_uuid).first()
    except Exception:
        pass

    if not user and email:
        try:
            user = db.query(User).filter(User.email == email.strip().lower()).first()
        except Exception:
            pass

    if not user and role == "admin":
        # Synthesize admin user instance to prevent staff lockout
        return User(
            id=uuid.uuid4(),
            email=email or "info@12links.co.za",
            name="12 Links Administrator",
            role=UserRole.admin
        )

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

# Role enforcement dependency
class RoleChecker:
    def __init__(self, allowed_roles: list[UserRole]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: User = Depends(get_current_user)):
        if current_user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action"
            )
        return current_user
