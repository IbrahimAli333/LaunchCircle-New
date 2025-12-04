# Endpoints for user profiles (create, update, view, search).
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from crud import create_user, get_user, list_users, update_user
from db import get_db
from models import RoleType
from schemas import UserCreate, UserOut, UserUpdate

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("", response_model=list[UserOut])
def list_profiles(
    role: RoleType | None = Query(None),
    skills: list[str] | None = Query(None, description="Filter by skills (comma or multiple)"),
    location: str | None = Query(None),
    availability: str | None = Query(None),
    experience: str | None = Query(None),
    db: Session = Depends(get_db),
):
    return list_users(db, role=role, skills=skills, location=location, availability=availability, experience=experience)


@router.post("", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_profile(payload: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, payload)


@router.get("/{user_id}", response_model=UserOut)
def get_profile(user_id: int, db: Session = Depends(get_db)):
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.put("/{user_id}", response_model=UserOut)
def update_profile(user_id: int, payload: UserUpdate, db: Session = Depends(get_db)):
    updated = update_user(db, user_id, payload)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return updated
