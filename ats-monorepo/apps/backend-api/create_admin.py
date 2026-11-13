"""
Script to create or promote an admin account in the Supabase PostgreSQL database.
Usage:
    python create_admin.py <admin_email> <admin_password>
Or with default settings:
    python create_admin.py
"""

import sys
import uuid
from app.core.database import SessionLocal, engine, Base, settings
from app.models.models import User, UserRole
from app.routers.auth import get_password_hash

def create_or_update_admin(email: str, password: str):
    # Ensure tables exist in the connected Supabase database
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        hashed_password = get_password_hash(password)
        
        if user:
            user.password_hash = hashed_password
            user.role = UserRole.admin
            db.commit()
            print(f"Successfully updated existing user '{email}' to ADMIN with the new password.")
        else:
            new_admin = User(
                id=uuid.uuid4(),
                email=email,
                password_hash=hashed_password,
                role=UserRole.admin
            )
            db.add(new_admin)
            db.commit()
            print(f"Successfully created new ADMIN user '{email}' in Supabase database.")
            
        print("Role: admin")
        print(f"Database URL: {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else 'connected'}")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) >= 3:
        target_email = sys.argv[1]
        target_password = sys.argv[2]
    else:
        target_email = settings.ADMIN_EMAIL
        target_password = settings.ADMIN_PASSWORD
        
    print(f"Target Admin Email: {target_email}")
    create_or_update_admin(target_email, target_password)
