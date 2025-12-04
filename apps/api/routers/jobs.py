# Endpoints for job posts and applications.
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from crud import apply_to_job, create_job_post, get_job_post, list_job_applications, list_job_posts, update_job_post
from db import get_db
from models import RoleType
from schemas import JobApplicationCreate, JobApplicationOut, JobPostCreate, JobPostOut, JobPostUpdate

router = APIRouter(prefix="/api/jobs", tags=["jobs"])


@router.get("", response_model=list[JobPostOut])
def list_jobs(
    role: RoleType | None = Query(None),
    skills: list[str] | None = Query(None),
    location: str | None = Query(None),
    work_style: str | None = Query(None),
    db: Session = Depends(get_db),
):
    return list_job_posts(db, role=role, skills=skills, location=location, work_style=work_style)


@router.post("", response_model=JobPostOut, status_code=status.HTTP_201_CREATED)
def create_job(payload: JobPostCreate, db: Session = Depends(get_db)):
    try:
        return create_job_post(db, payload)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))


@router.get("/{job_id}", response_model=JobPostOut)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = get_job_post(db, job_id)
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return job


@router.put("/{job_id}", response_model=JobPostOut)
def update_job(job_id: int, payload: JobPostUpdate, db: Session = Depends(get_db)):
    updated = update_job_post(db, job_id, payload)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return updated


@router.post("/{job_id}/apply", response_model=JobApplicationOut, status_code=status.HTTP_201_CREATED)
def apply(job_id: int, payload: JobApplicationCreate, db: Session = Depends(get_db)):
    if payload.job_post_id != job_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="job_post_id mismatch")
    try:
        return apply_to_job(db, job_id, payload.applicant_id, payload.cover_letter)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))


@router.get("/{job_id}/applications", response_model=list[JobApplicationOut])
def list_applications(job_id: int, db: Session = Depends(get_db)):
    return list_job_applications(db, job_id)
