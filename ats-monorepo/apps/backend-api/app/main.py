from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import the database engine and models to create the tables automatically
from app.core.database import engine, Base
from app.models import models

# Import the routers we just built
from app.routers import auth, applications, stages

# Attempt table creation safely without crashing on missing DB connection
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Startup notice: Database table sync postponed ({e})")

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
