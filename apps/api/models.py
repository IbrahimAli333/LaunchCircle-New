# ORM models for LaunchCircle: users, projects, needs, and matches.
import enum
from datetime import datetime
from sqlalchemy import JSON, Boolean, Column, DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from db import Base


class RoleType(str, enum.Enum):
    founder = "founder"
    software_developer = "software_developer"
    software_engineer = "software_engineer"
    designer = "designer"
    product_manager = "product_manager"
    marketer = "marketer"
    growth = "growth"
    sales = "sales"
    operations = "operations"
    job_seeker = "job_seeker"
    job_provider = "job_provider"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(255), nullable=True, unique=True)
    password_hash = Column(String(255), nullable=True)
    profile_photo = Column(String(255), nullable=True)
    headline = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    experience = Column(Text, nullable=True)
    startups = Column(Text, nullable=True)
    portfolio = Column(Text, nullable=True)
    resume_url = Column(String(255), nullable=True)
    looking_for_cofounder = Column(Boolean, default=False, nullable=False)
    availability = Column(String(80), nullable=True)
    skills = Column(Text, nullable=True)
    location = Column(String(120), nullable=True)
    time_zone = Column(String(80), nullable=True)
    role = Column(Enum(RoleType), nullable=False)
    preferences = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    job_posts = relationship("JobPost", back_populates="owner", cascade="all, delete")
    applications = relationship("JobApplication", back_populates="applicant", cascade="all, delete")


class JobPost(Base):
    __tablename__ = "job_posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(180), nullable=False)
    headline = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    role = Column(Enum(RoleType), nullable=False)
    skills = Column(Text, nullable=True)
    location = Column(String(120), nullable=True)
    time_zone = Column(String(80), nullable=True)
    work_style = Column(String(60), nullable=True)  # remote, hybrid, onsite
    availability = Column(String(80), nullable=True)  # full-time, part-time, contract
    timeline = Column(String(120), nullable=True)
    compensation = Column(String(120), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="job_posts")
    applications = relationship("JobApplication", back_populates="job_post", cascade="all, delete-orphan")


class ApplicationStatus(str, enum.Enum):
    applied = "applied"
    reviewed = "reviewed"
    interviewing = "interviewing"
    rejected = "rejected"
    accepted = "accepted"


class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    job_post_id = Column(Integer, ForeignKey("job_posts.id"), nullable=False, index=True)
    applicant_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.applied, nullable=False)
    cover_letter = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    job_post = relationship("JobPost", back_populates="applications")
    applicant = relationship("User", back_populates="applications")
