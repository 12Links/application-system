import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Supabase PostgreSQL URI: checks DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING
    DATABASE_URL: str = (
        os.getenv("DATABASE_URL")
        or os.getenv("POSTGRES_URL")
        or os.getenv("POSTGRES_PRISMA_URL")
        or os.getenv("POSTGRES_URL_NON_POOLING")
        or "sqlite:///./ats_fallback.db"
    )

    # Supabase Storage & Auth Keys: checks standard Vercel Supabase integration variable names
    SUPABASE_URL: str = (
        os.getenv("SUPABASE_URL")
        or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
        or "https://placeholder.supabase.co"
    )
    SUPABASE_KEY: str = (
        os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        or os.getenv("SUPABASE_KEY")
        or os.getenv("SUPABASE_ANON_KEY")
        or "placeholder_key"
    )

    JWT_SECRET: str = os.getenv("JWT_SECRET") or "supersecret_key_change_me_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # 12 Links Admin & AI Variables
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY") or ""
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL") or "info@12links.co.za"
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD") or "Admin@12links"

    class Config:
        extra = "ignore"

settings = Settings()

# SQLAlchemy 2.0 requires 'postgresql://' instead of legacy 'postgres://' format from cloud poolers
raw_db_url = settings.DATABASE_URL
if raw_db_url.startswith("postgres://"):
    raw_db_url = raw_db_url.replace("postgres://", "postgresql://", 1)

connect_args = {"check_same_thread": False} if raw_db_url.startswith("sqlite") else {}
engine = create_engine(raw_db_url, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
