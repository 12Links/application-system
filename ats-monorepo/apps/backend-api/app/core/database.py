import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Supabase PostgreSQL URI (e.g., postgresql://postgres.xxxx:[pwd]@xxxx.pooler.supabase.com:5432/postgres)
    DATABASE_URL: str
    SUPABASE_URL: str
    SUPABASE_KEY: str
    JWT_SECRET: str = "supersecret_key_change_me_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        env_file = ".env"

settings = Settings()

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get db session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()