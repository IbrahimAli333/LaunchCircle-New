from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from models import ApplicationStatus, RoleType
from utils import split_csv


class UserBase(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    profile_photo: Optional[str] = None
    headline: Optional[str] = None
    bio: Optional[str] = None
    experience: Optional[str] = None
    startups: Optional[str] = None
    portfolio: List[str] = Field(default_factory=list)
    resume_url: Optional[str] = None
    looking_for_cofounder: bool = False
    availability: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    location: Optional[str] = None
    time_zone: Optional[str] = None
    role: RoleType
    preferences: Optional[dict] = None

    @field_validator("skills", mode="before")
    @classmethod
    def _split_skills(cls, value):
        return split_csv(value) if isinstance(value, str) else value

    @field_validator("portfolio", mode="before")
    @classmethod
    def _split_portfolio(cls, value):
        return split_csv(value) if isinstance(value, str) else value


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    profile_photo: Optional[str] = None
    headline: Optional[str] = None
    bio: Optional[str] = None
    experience: Optional[str] = None
    startups: Optional[str] = None
    portfolio: Optional[List[str]] = None
    resume_url: Optional[str] = None
    looking_for_cofounder: Optional[bool] = None
    availability: Optional[str] = None
    skills: Optional[List[str]] = None
    location: Optional[str] = None
    time_zone: Optional[str] = None
    role: Optional[RoleType] = None
    preferences: Optional[dict] = None

    @field_validator("skills", mode="before")
    @classmethod
    def _split_skills(cls, value):
        return split_csv(value) if isinstance(value, str) else value

    @field_validator("portfolio", mode="before")
    @classmethod
    def _split_portfolio(cls, value):
        return split_csv(value) if isinstance(value, str) else value


class UserOut(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


class JobPostBase(BaseModel):
    title: str
    headline: Optional[str] = None
    description: Optional[str] = None
    role: RoleType
    skills: List[str] = Field(default_factory=list)
    location: Optional[str] = None
    time_zone: Optional[str] = None
    work_style: Optional[str] = None
    availability: Optional[str] = None
    timeline: Optional[str] = None
    compensation: Optional[str] = None

    @field_validator("skills", mode="before")
    @classmethod
    def _split_skills(cls, value):
        return split_csv(value) if isinstance(value, str) else value


class JobPostCreate(JobPostBase):
    owner_id: int


class JobPostUpdate(BaseModel):
    title: Optional[str] = None
    headline: Optional[str] = None
    description: Optional[str] = None
    role: Optional[RoleType] = None
    skills: Optional[List[str]] = None
    location: Optional[str] = None
    time_zone: Optional[str] = None
    work_style: Optional[str] = None
    availability: Optional[str] = None
    timeline: Optional[str] = None
    compensation: Optional[str] = None

    @field_validator("skills", mode="before")
    @classmethod
    def _split_skills(cls, value):
        return split_csv(value) if isinstance(value, str) else value


class JobPostOut(JobPostBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int
    owner_name: Optional[str] = None
    created_at: datetime


class JobApplicationCreate(BaseModel):
    job_post_id: int
    applicant_id: int
    cover_letter: Optional[str] = None


class JobApplicationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    job_post_id: int
    applicant_id: int
    status: ApplicationStatus
    cover_letter: Optional[str] = None
    created_at: datetime
    applicant_name: Optional[str] = None
    job_title: Optional[str] = None


class AuthSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: RoleType


class AuthLogin(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    user: UserOut
    token: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr
