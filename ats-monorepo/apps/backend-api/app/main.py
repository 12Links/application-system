from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import the database engine and models to create the tables automatically
from app.core.database import engine, Base
from app.models import models

# Import the routers we just built
from app.routers import auth, applications, stages

# This line creates all the tables in your Supabase database!
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ATS Backend API",
    description="Internal backend for the Applicant Tracking System",
    version="1.0.0"
)

# Set up CORS so your React frontends can talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # In production, you will change this to our Cloudflare Pages URLs
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