import enum
import uuid
from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, DateTime, Enum as SQLEnum, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.core.database import Base

class UserRole(str, enum.Enum):
    admin = "admin"
    applicant = "applicant"

class AppStatus(str, enum.Enum):
    pending = "pending"
    under_review = "under_review"
    coding_round = "coding_round"
    interview = "interview"
    contract_pending = "contract_pending"
    hired = "hired"
    rejected = "rejected"

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    role = Column(SQLEnum(UserRole), default=UserRole.applicant, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class JobPost(Base):
    __tablename__ = "job_posts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    department = Column(String, default="Engineering")
    location = Column(String, default="Pretoria, South Africa")
    type = Column(String, default="Full-time")
    salary = Column(String, nullable=True)
    experience = Column(String, default="3+ Years")
    description = Column(Text, nullable=False)
    requirements = Column(Text, nullable=False)
    benefits = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Application(Base):
    __tablename__ = "applications"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("job_posts.id", ondelete="CASCADE"), nullable=False)
    applicant_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    status = Column(SQLEnum(AppStatus), default=AppStatus.pending, nullable=False)
    
    # Candidate Application Form Fields
    applicant_name = Column(String, nullable=True)
    applicant_email = Column(String, nullable=True)
    applicant_phone = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    resume_url = Column(String, nullable=True)
    cover_letter = Column(Text, nullable=True)
    experience_years = Column(String, nullable=True)
    
    # Assessment & Interview Progress
    coding_score = Column(Integer, nullable=True)
    coding_code = Column(Text, nullable=True)
    coding_feedback = Column(Text, nullable=True)
    interview_date = Column(String, nullable=True)
    interview_time_slot = Column(String, nullable=True)
    interview_notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Contract(Base):
    __tablename__ = "contracts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id", ondelete="CASCADE"), unique=True, nullable=False)
    contract_url = Column(String, nullable=False)
    is_signed = Column(Boolean, default=False)
    signed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class CodingQuestion(Base):
    __tablename__ = "coding_questions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    difficulty = Column(String, default="Easy")
    description = Column(Text, nullable=False)
    starter_templates = Column(Text, nullable=True)
    test_cases = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
