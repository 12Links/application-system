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
            admin_email = settings.ADMIN_EMAIL
            admin_pass = settings.ADMIN_PASSWORD
            if admin_email and admin_pass:
                existing_admin = db.query(models.User).filter(models.User.email == admin_email).first()
                if not existing_admin:
                    from app.routers.auth import get_password_hash
                    admin = models.User(
                        id=uuid.uuid4(),
                        email=admin_email,
                        password_hash=get_password_hash(admin_pass),
                        name="Recruitment Administrator",
                        role=models.UserRole.admin
                    )
                    db.add(admin)
                    db.commit()
                    print(f"Successfully provisioned admin account in Supabase: {admin_email}")
        finally:
            db.close()
    except Exception as e:
        print(f"Database sync notice: {e}")

init_db()

# Import routers
from app.routers import auth, applications, stages

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
app.include_router(applications.router)
app.include_router(stages.router)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "ATS API is running cleanly"}
