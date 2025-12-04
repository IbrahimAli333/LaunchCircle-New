from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from routers import auth, jobs, users
from db import init_db

app = FastAPI(title="LaunchCircle API", version="0.3.0")

origins = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "").split(",") if origin.strip()]
if origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.on_event("startup")
def _startup() -> None:
    init_db(seed=True)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/info")
def info():
    return {"name": "LaunchCircle API", "version": "0.3.0"}


app.include_router(users.router)
app.include_router(jobs.router)
app.include_router(auth.router)
