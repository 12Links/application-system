import sys
import os

# Ensure the app package and root directory are always on sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(BASE_DIR)
for p in [BASE_DIR, PARENT_DIR]:
    if p not in sys.path:
        sys.path.insert(0, p)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uuid

# Import the database engine and models to create the tables automatically
from app.core.database import engine, Base, SessionLocal, settings
from app.models import models

# Automatic database sync & initial admin account provisioning
def init_db():
    try:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            from app.routers.auth import get_password_hash
            
            # List of admin credentials to guarantee access
            admin_accounts = [
                {
                    "email": (settings.ADMIN_EMAIL or "admin@12links.co.za").strip().lower(),
                    "password": settings.ADMIN_PASSWORD or "Admin12links2026!",
                    "name": "Recruitment Administrator"
                },
                {
                    "email": "info@12links.co.za",
                    "password": "Admin@12links",
                    "name": "12 Links Administrator"
                }
            ]
            
            for acc in admin_accounts:
                existing_admin = db.query(models.User).filter(models.User.email == acc["email"]).first()
                if not existing_admin:
                    admin = models.User(
                        id=uuid.uuid4(),
                        email=acc["email"],
                        password_hash=get_password_hash(acc["password"]),
                        name=acc["name"],
                        role=models.UserRole.admin
                    )
                    db.add(admin)
                    db.commit()
                    print(f"Successfully provisioned admin account in Supabase: {acc['email']}")
                else:
                    # Ensure role is admin
                    if existing_admin.role != models.UserRole.admin:
                        existing_admin.role = models.UserRole.admin
                        db.commit()
        finally:
            db.close()
    except Exception as e:
        print(f"Database sync notice: {e}")

init_db()

# Import routers
from app.routers import auth, applications, stages, jobs

app = FastAPI(
    title="ATS Backend API",
    description="Internal backend for the Applicant Tracking System",
    version="1.0.0"
)

# Set up CORS for Vercel multi-service routing, preview URLs, and localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect the routers
app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(applications.router)
app.include_router(stages.router)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "ATS API is running cleanly"}
