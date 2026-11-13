import os
import secrets
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
        or ""
    )
    SUPABASE_KEY: str = (
        os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        or os.getenv("SUPABASE_KEY")
        or os.getenv("SUPABASE_ANON_KEY")
        or ""
    )

    JWT_SECRET: str = os.getenv("JWT_SECRET") or os.getenv("SUPABASE_JWT_SECRET") or secrets.token_hex(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # 12 Links Admin & AI Variables (Configured securely via environment variables)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY") or ""
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL") or ""
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD") or ""

    class Config:
        extra = "ignore"

settings = Settings()

# SQLAlchemy 2.0 requires modern driver dialect for PostgreSQL (using robust psycopg2-binary)
raw_db_url = settings.DATABASE_URL
if raw_db_url.startswith("postgres://"):
    raw_db_url = raw_db_url.replace("postgres://", "postgresql+psycopg2://", 1)
elif raw_db_url.startswith("postgresql://") and not raw_db_url.startswith("postgresql+"):
    raw_db_url = raw_db_url.replace("postgresql://", "postgresql+psycopg2://", 1)

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
