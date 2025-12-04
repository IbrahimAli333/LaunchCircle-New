# Lightweight auth endpoints (password hashing only, no sessions/JWT).
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from crud import login, signup
from db import get_db
from schemas import AuthLogin, AuthResponse, AuthSignup, ForgotPasswordRequest

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup_endpoint(payload: AuthSignup, db: Session = Depends(get_db)):
    try:
        return signup(db, payload)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))


@router.post("/login", response_model=AuthResponse)
def login_endpoint(payload: AuthLogin, db: Session = Depends(get_db)):
    result = login(db, payload)
    if not result:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return result


@router.post("/forgot")
def forgot_password(payload: ForgotPasswordRequest):
    # In a real app we'd email a reset link; here we simply acknowledge receipt.
    return {"message": f"Password reset link sent to {payload.email}"}
