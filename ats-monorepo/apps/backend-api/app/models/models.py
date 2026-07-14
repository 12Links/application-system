import enum
from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.core.database import Base
import uuid

class UserRole(str, enum.Enum):
    admin = "admin"
    applicant = "applicant"

class AppStatus(str, enum.Enum):
    pending = "pending"
    under_review = "under_review"
    coding_round = "coding_round"
    contract_pending = "contract_pending"
    hired = "hired"
    rejected = "rejected"

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.applicant, nullable=False)

class JobPost(Base):
    __tablename__ = "job_posts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    requirements = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

class Application(Base):
    __tablename__ = "applications"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("job_posts.id", ondelete="CASCADE"))
    
    # Made nullable=True so guest users can apply without crashing the DB!
    applicant_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True) 
    
    status = Column(SQLEnum(AppStatus), default=AppStatus.pending, nullable=False)
    
    # 12 Links Application Form Fields
    applicant_name = Column(String, nullable=True)
    applicant_email = Column(String, nullable=True)
    applicant_phone = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    resume_url = Column(String, nullable=True)

class Contract(Base):
    __tablename__ = "contracts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id", ondelete="CASCADE"), unique=True)
    contract_url = Column(String, nullable=False)
    is_signed = Column(Boolean, default=False)
    signed_at = Column(DateTime(timezone=True), nullable=True)