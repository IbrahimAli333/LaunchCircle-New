import hashlib
from typing import List, Optional
from sqlalchemy import and_, select
from sqlalchemy.orm import Session
from models import ApplicationStatus, JobApplication, JobPost, RoleType, User
from schemas import (
    AuthLogin,
    AuthResponse,
    AuthSignup,
    JobApplicationOut,
    JobPostCreate,
    JobPostOut,
    JobPostUpdate,
    UserCreate,
    UserOut,
    UserUpdate,
)
from utils import join_csv


def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def _join_optional(values: Optional[List[str]]) -> Optional[str]:
    if values is None:
        return None
    return join_csv(values)


def create_user(db: Session, payload: UserCreate) -> UserOut:
    user = User(
        name=payload.name,
        email=payload.email,
        profile_photo=payload.profile_photo,
        headline=payload.headline,
        bio=payload.bio,
        experience=payload.experience,
        startups=payload.startups,
        portfolio=_join_optional(payload.portfolio),
        resume_url=payload.resume_url,
        looking_for_cofounder=payload.looking_for_cofounder,
        availability=payload.availability,
        skills=join_csv(payload.skills),
        location=payload.location,
        time_zone=payload.time_zone,
        role=payload.role,
        preferences=payload.preferences,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return UserOut.model_validate(user)


def update_user(db: Session, user_id: int, payload: UserUpdate) -> Optional[UserOut]:
    user = db.get(User, user_id)
    if not user:
        return None

    for field, value in payload.model_dump(exclude_unset=True).items():
        if field == "skills" and value is not None:
            setattr(user, field, join_csv(value))
        elif field == "portfolio" and value is not None:
            setattr(user, field, join_csv(value))
        else:
            setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return UserOut.model_validate(user)


def get_user(db: Session, user_id: int) -> Optional[UserOut]:
    user = db.get(User, user_id)
    return UserOut.model_validate(user) if user else None


def _normalize_skills(skills: Optional[List[str]]) -> List[str]:
    if not skills:
        return []
    normalized: List[str] = []
    for skill in skills:
        parts = [part.strip() for part in skill.split(",") if part.strip()]
        normalized.extend(parts)
    return normalized


def list_users(
    db: Session,
    role: Optional[RoleType] = None,
    skills: Optional[List[str]] = None,
    location: Optional[str] = None,
    availability: Optional[str] = None,
    experience: Optional[str] = None,
) -> List[UserOut]:
    query = select(User)
    if role:
        query = query.where(User.role == role)
    if location:
        query = query.where(User.location.ilike(f"%{location}%"))
    if availability:
        query = query.where(User.availability.ilike(f"%{availability}%"))
    if experience:
        query = query.where(User.experience.ilike(f"%{experience}%"))
    normalized_skills = _normalize_skills(skills)
    if normalized_skills:
        skill_filters = [User.skills.ilike(f"%{skill}%") for skill in normalized_skills]
        query = query.where(and_(*skill_filters))

    users = db.execute(query).scalars().unique().all()
    return [UserOut.model_validate(u) for u in users]


def create_job_post(db: Session, payload: JobPostCreate) -> JobPostOut:
    owner = db.get(User, payload.owner_id)
    if not owner:
        raise ValueError("Owner not found")
    if owner.role not in {RoleType.job_provider, RoleType.founder}:
        raise ValueError("Only job providers or founders can create job posts")

    post = JobPost(
        title=payload.title,
        headline=payload.headline,
        description=payload.description,
        role=payload.role,
        skills=join_csv(payload.skills),
        location=payload.location,
        time_zone=payload.time_zone,
        work_style=payload.work_style,
        availability=payload.availability,
        timeline=payload.timeline,
        compensation=payload.compensation,
        owner_id=payload.owner_id,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return _job_post_to_schema(post)


def update_job_post(db: Session, job_post_id: int, payload: JobPostUpdate) -> Optional[JobPostOut]:
    post = db.get(JobPost, job_post_id)
    if not post:
        return None

    for field, value in payload.model_dump(exclude_unset=True).items():
        if field == "skills" and value is not None:
            setattr(post, field, join_csv(value))
        else:
            setattr(post, field, value)

    db.commit()
    db.refresh(post)
    return _job_post_to_schema(post)


def list_job_posts(
    db: Session,
    role: Optional[RoleType] = None,
    skills: Optional[List[str]] = None,
    location: Optional[str] = None,
    work_style: Optional[str] = None,
) -> List[JobPostOut]:
    query = select(JobPost).join(JobPost.owner)
    if role:
        query = query.where(JobPost.role == role)
    if location:
        query = query.where(JobPost.location.ilike(f"%{location}%"))
    if work_style:
        query = query.where(JobPost.work_style.ilike(f"%{work_style}%"))
    normalized_skills = _normalize_skills(skills)
    if normalized_skills:
        skill_filters = [JobPost.skills.ilike(f"%{skill}%") for skill in normalized_skills]
        query = query.where(and_(*skill_filters))

    posts = db.execute(query).scalars().unique().all()
    return [_job_post_to_schema(p) for p in posts]


def get_job_post(db: Session, job_post_id: int) -> Optional[JobPostOut]:
    post = db.get(JobPost, job_post_id)
    return _job_post_to_schema(post) if post else None


def apply_to_job(db: Session, job_post_id: int, applicant_id: int, cover_letter: Optional[str]) -> JobApplicationOut:
    post = db.get(JobPost, job_post_id)
    applicant = db.get(User, applicant_id)
    if not post or not applicant:
        raise ValueError("Job post or applicant not found")
    if applicant.role == RoleType.job_provider:
        raise ValueError("Job providers cannot apply to roles")

    application = JobApplication(
        job_post_id=job_post_id,
        applicant_id=applicant_id,
        cover_letter=cover_letter,
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return _application_to_schema(application)


def list_job_applications(db: Session, job_post_id: int) -> List[JobApplicationOut]:
    rows = db.execute(
        select(JobApplication).where(JobApplication.job_post_id == job_post_id).join(JobApplication.applicant)
    ).scalars().unique().all()
    return [_application_to_schema(a) for a in rows]


def _job_post_to_schema(post: JobPost) -> JobPostOut:
    return JobPostOut(
        id=post.id,
        title=post.title,
        headline=post.headline,
        description=post.description,
        role=post.role,
        skills=post.skills,
        location=post.location,
        time_zone=post.time_zone,
        work_style=post.work_style,
        availability=post.availability,
        timeline=post.timeline,
        compensation=post.compensation,
        created_at=post.created_at,
        owner_id=post.owner_id,
        owner_name=post.owner.name if post.owner else None,
    )


def _application_to_schema(application: JobApplication) -> JobApplicationOut:
    return JobApplicationOut(
        id=application.id,
        job_post_id=application.job_post_id,
        applicant_id=application.applicant_id,
        status=application.status,
        cover_letter=application.cover_letter,
        created_at=application.created_at,
    applicant_name=application.applicant.name if application.applicant else None,
    job_title=application.job_post.title if application.job_post else None,
)


def signup(db: Session, payload: AuthSignup) -> AuthResponse:
    existing = db.execute(select(User).where(User.email == payload.email)).scalar_one_or_none()
    if existing:
        raise ValueError("Email already registered")
    user_payload = UserCreate(
        name=payload.name,
        email=payload.email,
        role=payload.role,
        skills=[],
    )
    user = User(
        name=user_payload.name,
        email=user_payload.email,
        role=user_payload.role,
        skills="",
        password_hash=_hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = _hash_password(f"{user.email}:{user.id}")
    return AuthResponse(user=UserOut.model_validate(user), token=token)


def login(db: Session, payload: AuthLogin) -> Optional[AuthResponse]:
    user = db.execute(select(User).where(User.email == payload.email)).scalar_one_or_none()
    if not user or not user.password_hash:
        return None
    if user.password_hash != _hash_password(payload.password):
        return None
    token = _hash_password(f"{user.email}:{user.id}")
    return AuthResponse(user=UserOut.model_validate(user), token=token)
